let map, infoWindow, directionsService, directionsRenderer, userLocation;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.369694, lng: -86.171824 }, // Default to Auburn University
        zoom: 16,
    });

    infoWindow = new google.maps.InfoWindow();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        panel: document.getElementById("directionsPanel"), // Add a panel for turn-by-turn instructions
    });

    // Get user's live location
    getLiveLocation();
}

// Get the user's current location
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
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom marker for user's location
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

// Fetch location data from backend and display on map
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

            const location = data[0]; // Take the first matching result
            const { latitude, longitude, name, floor, wing, description, blueprint_path, building_name, type } = location;

            // Set map center to the location
            map.setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });

            // Add marker
            const marker = new google.maps.Marker({
                position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
                map: map,
                title: name,
            });

            // Add info window with a Start Navigation button
            const content = `
                <div>
                    <h3>${type === "classroom" ? `Room ${name} (${building_name})` : name}</h3>
                    ${type === "classroom" ? `<p>Floor: ${floor}, Wing: ${wing || "N/A"}</p>` : ""}
                    <p>Description: ${description || "No description available"}</p>
                    ${blueprint_path ? `<p><a href="${blueprint_path}" target="_blank">View Blueprint</a></p>` : ""}
                    <p>Type: ${type}</p>
                    <button id="startNavigationBtn">Start Navigation</button>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            // Wait for DOM updates to complete before adding the event listener
            setTimeout(() => {
                const startNavBtn = document.getElementById("startNavigationBtn");
                if (startNavBtn) {
                    startNavBtn.addEventListener("click", () => {
                        startNavigation(latitude, longitude, floor);
                    });
                } else {
                    console.error("Start Navigation button not found.");
                }
            }, 100); // Add a slight delay to ensure the DOM updates
        })
        .catch((error) => {
            console.error("Error fetching location:", error);
            alert("An error occurred while searching for the location.");
        });
}

// Start navigation to a location
function startNavigation(lat, lng, floor) {
    if (!userLocation) {
        alert("Your live location is not available. Please enable location services.");
        return;
    }
    console.log("destination...........",parseFloat(lat),parseFloat(lng))
    directionsService.route(
        {
            origin: userLocation,
            destination: { lat: parseFloat(lat), lng: parseFloat(lng) },
            travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);

                // Add a step for indoor navigation
                if (floor) {
                    setTimeout(() => {
                        alert(`Once inside the building, proceed to floor ${floor} and locate the specified room.`);
                    }, 2000);
                }
            } else {
                console.error("Directions request failed due to ", status);
            }
        }
    );
}

// Initialize the map
window.onload = initMap;
