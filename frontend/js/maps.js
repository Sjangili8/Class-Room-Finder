let map, infoWindow, directionsService, directionsRenderer, userLocation, floorOverlay;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.369694, lng: -86.171824 }, // Default to Auburn University
        zoom: 16,
    });

    infoWindow = new google.maps.InfoWindow();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        panel: document.getElementById("directionsPanel"),
    });

    // Initialize notifications and get user's live location
    fetchNotifications();
    getLiveLocation();
}

// Fetch and display notifications
function fetchNotifications() {
    fetch('../../backend/api/notifications.php') // Replace with your notifications API
        .then((response) => response.json())
        .then((data) => {
            const notificationBar = document.getElementById('notificationBar');
            if (data.length > 0) {
                const notificationsHTML = data
                    .map(
                        (notification) => `
                    <div class="notification">
                        <span>${notification.message}</span>
                        <span class="close-btn" onclick="dismissNotification(this)">&times;</span>
                    </div>
                `
                    )
                    .join('');
                notificationBar.innerHTML = notificationsHTML;
            }
        })
        .catch((error) => console.error('Error fetching notifications:', error));
}

// Dismiss notification
function dismissNotification(closeBtn) {
    const notification = closeBtn.parentElement;
    notification.remove();
}

// Get the user's live location
function getLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center map on user's location
                map.setCenter(userLocation);

                // Add marker for user's location
                const userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Your Location",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                });

                infoWindow.setContent("You are here");
                infoWindow.open(map, userMarker);
            },
            () => {
                alert("Geolocation failed. Please enable location services.");
            }
        );
    } else {
        alert("Your browser does not support geolocation.");
    }
}

// Show indoor map overlay
function showFloorOverlay(blueprintPath, bounds) {
    if (floorOverlay) {
        floorOverlay.setMap(null);
    }

    floorOverlay = new google.maps.GroundOverlay(blueprintPath, bounds);
    floorOverlay.setMap(map);
}

// Search location and display relevant data
function searchLocation() {
    const query = document.getElementById("searchInput").value;

    if (!query) {
        alert("Please enter a classroom or building name.");
        return;
    }

    fetch(`../../backend/api/search.php?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
                return;
            }

            const location = data[0];
            const { latitude, longitude, name, floor, description, blueprint_path, building_name, type } = location;

            map.setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });

            const marker = new google.maps.Marker({
                position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
                map: map,
                title: name,
            });

            const content = `
                <div>
                    <h3>${type === "classroom" ? `Room ${name} (${building_name})` : name}</h3>
                    ${type === "classroom" ? `<p>Floor: ${floor}</p>` : ""}
                    <p>Description: ${description || "No description available"}</p>
                    ${blueprint_path ? `<p><a href="../assets/images/${blueprint_path}" target="_blank">View Blueprint</a></p>` : ""}
                    <p>Type: ${type}</p>
                    <button id="startNavigationBtn">Start Navigation</button>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            setTimeout(() => {
                const startNavBtn = document.getElementById("startNavigationBtn");
                if (startNavBtn) {
                    startNavBtn.addEventListener("click", () => {
                        startNavigation(latitude, longitude, floor, blueprint_path, type);
                    });
                } else {
                    console.error("Start Navigation button not found.");
                }
            }, 100);
        })
        .catch((error) => {
            console.error("Error fetching location:", error);
            alert("An error occurred while searching for the location.");
        });
}

// Start navigation to a location
function startNavigation(lat, lng, floor, blueprint_path, type) {
    if (!userLocation) {
        alert("Your live location is not available. Please enable location services.");
        return;
    }

    directionsService.route(
        {
            origin: userLocation,
            destination: { lat: parseFloat(lat), lng: parseFloat(lng) },
            travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);

                if (type === "classroom" && floor) {
                    // Display indoor map for the specific floor
                    displayIndoorMap(floor, blueprint_path);
                } else if (type === "building") {
                    // Display indoor maps for all floors in the building
                    displayBuildingMaps(blueprint_path);
                }
            } else {
                console.error("Directions request failed due to ", status);
            }
        }
    );
}

function displayIndoorMap(floor, blueprint_path) {
    const overlayBounds = getOverlayBounds(blueprint_path);
    const blueprintPath = `../assets/images/${blueprint_path}`;
    showFloorOverlay(blueprintPath, overlayBounds);
}

function displayBuildingMaps(blueprint_path) {
    const floors = [1, 2, 3, 4]; // Example: Modify based on building
    floors.forEach((floor) => {
        const overlayBounds = getOverlayBounds(`${blueprint_path}_${floor}.jpg`);
        const blueprintPath = `../assets/images/${blueprint_path}_${floor}.jpg`;
        showFloorOverlay(blueprintPath, overlayBounds);
    });
}

function getOverlayBounds(blueprintPath) {
    const boundsMap = {
        library_tower: {
            north: 32.36789626104069,
            south: 32.3675982668499,
            east: -86.17745289636309,
            west: -86.17778836980285,
        },
        goodwyn_hall: {
            north: 32.3688038740728,
            south: 32.36819022938096,
            east: -86.17732266415366,
            west: -86.17812232187086,
        },
    };

    for (const key in boundsMap) {
        if (blueprintPath.includes(key)) {
            return boundsMap[key];
        }
    }
    return null;
}

window.onload = initMap;
