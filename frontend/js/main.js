
console.log("start")
console.log("end")
// document.addEventListener("DOMContentLoaded", () => {
    // Expose Buildings Functions
    window.editBuilding = editBuilding;
    window.deleteBuilding = deleteBuilding;
    window.showAddBuildingModal = showAddBuildingModal;

    // Expose Classrooms Functions
    window.editClassroom = editClassroom;
    window.deleteClassroom = deleteClassroom;
    window.showAddClassroomModal = showAddClassroomModal;

    // Expose Courses Functions
    window.editCourse = editCourse;
    window.deleteCourse = deleteCourse;
    window.showAddCourseModal = showAddCourseModal;

    // Expose Users Functions
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.showAddUserModal = showAddUserModal;

    // Fetch Data
    fetchBuildings();
    fetchClassrooms();
    fetchCourses();
    fetchUsers();

    
    function showModal(title, fields, onSave) {
        const modalForm = document.getElementById("modalForm");
        const modalSaveButton = document.getElementById("modalSaveButton");
        const actionModalLabel = document.getElementById("actionModalLabel");
    
        actionModalLabel.textContent = title;
        modalForm.innerHTML = fields
            .map(
                field =>
                    `<div class="mb-3">
                        <label for="${field.id}" class="form-label">${field.label}</label>
                        ${
                            field.type === "textarea"
                                ? `<textarea id="${field.id}" class="form-control" required>${field.value || ""}</textarea>`
                                : `<input type="${field.type}" id="${field.id}" class="form-control" value="${field.value || ""}" required>`
                        }
                    </div>`
            )
            .join("");
    
        modalSaveButton.onclick = onSave;
    
        const modal = new bootstrap.Modal(document.getElementById("actionModal"));
        modal.show();
    }
    // ---------------------------
    // Buildings Functions
    // ---------------------------

    function fetchBuildings() {
        fetch("../../backend/api/buildings.php?action=read")
            .then(response => response.json())
            .then(data => renderBuildings(data))
            .catch(error => console.error("Error fetching buildings:", error));
    }

    function renderBuildings(buildings) {
        const buildingTableBody = document.querySelector("#building_tbody");
        buildingTableBody.innerHTML = "";
        buildings.forEach(building => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${building.building_id}</td>
                <td>${building.name}</td>
                <td>${building.code}</td>
                <td>${building.latitude}</td>
                <td>${building.longitude}</td>
                <td>${building.floors}</td>
                <td>${building.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editBuilding(${building.building_id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBuilding(${building.building_id})">Delete</button>
                </td>
            `;
            buildingTableBody.appendChild(row);
        });
    }
 
    function editBuilding(id) {
        showModal(
            "Edit Building",
            [
                { id: "buildingName", label: "Building Name", type: "text" },
                { id: "buildingCode", label: "Building Code", type: "text" },
                { id: "buildingLatitude", label: "Latitude", type: "text" },
                { id: "buildingLongitude", label: "Longitude", type: "text" },
                { id: "buildingFloors", label: "Floors", type: "text" },
                { id: "buildingDescription", label: "Description", type: "textarea" },
            ],
            () => {
                const name = document.getElementById("buildingName").value;
                const code = document.getElementById("buildingCode").value;
                const latitude = document.getElementById("buildingLatitude").value;
                const longitude = document.getElementById("buildingLongitude").value;
                const floors = document.getElementById("buildingFloors").value;
                const description = document.getElementById("buildingDescription").value;

                fetch(`../../backend/api/buildings.php?action=update&id=${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, code, latitude, longitude, floors, description })
                })
                    .then(fetchBuildings)
                    .catch(error => console.error("Error:", error));
            }
        );
    }

    function deleteBuilding(id) {
        if (confirm("Are you sure you want to delete this building?")) {
            fetch(`../../backend/api/buildings.php?action=delete&id=${id}`, { method: "DELETE" })
                .then(fetchBuildings)
                .catch(error => console.error("Error:", error));
        }
    }
    function showAddBuildingModal () {
        showModal(
            "Add New Building",
            [
                { id: "buildingName", label: "Building Name", type: "text" },
                { id: "buildingCode", label: "Building Code", type: "text" },
                { id: "buildingLatitude", label: "Latitude", type: "text" },
                { id: "buildingLongitude", label: "Longitude", type: "text" },
                { id: "buildingFloors", label: "Floors", type: "text" },
                { id: "buildingDescription", label: "Description", type: "textarea" },
            ],
            () => {
                const name = document.getElementById("buildingName").value;
                const code = document.getElementById("buildingCode").value;
                const latitude = document.getElementById("buildingLatitude").value;
                const longitude = document.getElementById("buildingLongitude").value;
                const floors = document.getElementById("buildingFloors").value;
                const description = document.getElementById("buildingDescription").value;

                fetch("../../backend/api/buildings.php?action=create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, code, latitude, longitude, floors, description })
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Failed to add building");
                        return response.json();
                    })
                    .then(() => {
                        fetchBuildings();
                        bootstrap.Modal.getInstance(document.getElementById("actionModal")).hide();
                    })
                    .catch(error => console.error("Error:", error));
            }
        );
    };

    

    // ---------------------------
    // Classrooms Functions
    // ---------------------------
    function fetchClassrooms() {
        fetch("../../backend/api/classrooms.php?action=read")
            .then(response => response.json())
            .then(data => renderClassrooms(data))
            .catch(error => console.error("Error fetching classrooms:", error));
    }

    function renderClassrooms(classrooms) {
        const classroomTableBody = document.querySelector("#classroomsTable tbody");
        classroomTableBody.innerHTML = "";
        classrooms.forEach(classroom => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${classroom.classroom_id}</td>
                <td>${classroom.building_name}</td>
                <td>${classroom.room_number}</td>
                <td>${classroom.floor}</td>
                <td>${classroom.latitude}</td>
                <td>${classroom.longitude}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editClassroom(${classroom.classroom_id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClassroom(${classroom.classroom_id})">Delete</button>
                </td>
            `;
            classroomTableBody.appendChild(row);
        });
    }

    function editClassroom(id) {
        // Fetch existing classroom data (optional if data is already available)
        fetch(`../../backend/api/classrooms.php?action=read&id=${id}`)
            .then(response => response.json())
            .then(classroom => {
                showModal(
                    "Edit Classroom",
                    [
                        { id: "buildingId", label: "Building ID", type: "text", value: classroom.building_id },
                        { id: "roomNumber", label: "Room Number", type: "text", value: classroom.room_number },
                        { id: "floor", label: "Floor", type: "text", value: classroom.floor },
                        { id: "latitude", label: "Latitude", type: "text", value: classroom.latitude },
                        { id: "longitude", label: "Longitude", type: "text", value: classroom.longitude },
                    ],
                    () => {
                        const buildingId = document.getElementById("buildingId").value;
                        const roomNumber = document.getElementById("roomNumber").value;
                        const floor = document.getElementById("floor").value;
                        const latitude = document.getElementById("latitude").value;
                        const longitude = document.getElementById("longitude").value;
    
                        fetch(`../../backend/api/classrooms.php?action=update&id=${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ building_id: buildingId, room_number: roomNumber, floor, latitude, longitude })
                        })
                            .then(response => {
                                if (!response.ok) throw new Error("Failed to update classroom");
                                return response.json();
                            })
                            .then(() => {
                                fetchClassrooms(); // Refresh the classrooms table
                                bootstrap.Modal.getInstance(document.getElementById("actionModal")).hide();
                            })
                            .catch(error => console.error("Error:", error));
                    }
                );
            })
            .catch(error => console.error("Error fetching classroom details:", error));
    }
    

    function deleteClassroom(id) {
        if (confirm("Are you sure you want to delete this classroom?")) {
            fetch(`../../backend/api/classrooms.php?action=delete&id=${id}`, { method: "DELETE" })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to delete classroom");
                    return response.json();
                })
                .then(() => {
                    fetchClassrooms(); // Refresh the classrooms table
                })
                .catch(error => console.error("Error:", error));
        }
    }
    

    function showAddClassroomModal  () {
        showModal(
            "Add New Classroom",
            [
                { id: "buildingId", label: "Building ID", type: "text" },
                { id: "roomNumber", label: "Room Number", type: "text" },
                { id: "floor", label: "Floor", type: "text" },
                { id: "latitude", label: "Latitude", type: "text" },
                { id: "longitude", label: "Longitude", type: "text" },
            ],
            () => {
                const buildingId = document.getElementById("buildingId").value;
                const roomNumber = document.getElementById("roomNumber").value;
                const floor = document.getElementById("floor").value;
                const latitude = document.getElementById("latitude").value;
                const longitude = document.getElementById("longitude").value;

                fetch("../../backend/api/classrooms.php?action=create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ buildingId, roomNumber, floor, latitude, longitude })
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Failed to add classroom");
                        return response.json();
                    })
                    .then(() => {
                        fetchClassrooms();
                        bootstrap.Modal.getInstance(document.getElementById("actionModal")).hide();
                    })
                    .catch(error => console.error("Error:", error));
            }
        );
    };

    // ---------------------------
    // Courses and Users
    // ---------------------------
    function fetchCourses() {
        fetch("../../backend/api/courses.php?action=read")
            .then(response => response.json())
            .then(data => renderCourses(data))
            .catch(error => console.error("Error fetching courses:", error));
    }
    
    function renderCourses(courses) {
        const coursesTableBody = document.querySelector("#coursesTable tbody");
        coursesTableBody.innerHTML = "";
        courses.forEach(course => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${course.course_id}</td>
                <td>${course.course_code}</td>
                <td>${course.title}</td>
                <td>${course.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editCourse(${course.course_id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.course_id})">Delete</button>
                </td>
            `;
            coursesTableBody.appendChild(row);
        });
    }
    function editCourse(id) {
        fetch(`../../backend/api/courses.php?action=read&id=${id}`)
            .then(response => response.json())
            .then(course => {
                showModal(
                    "Edit Course",
                    [
                        { id: "courseCode", label: "Course Code", type: "text", value: course.course_code },
                        { id: "courseTitle", label: "Title", type: "text", value: course.title },
                        { id: "courseDescription", label: "Description", type: "textarea", value: course.description },
                    ],
                    () => {
                        const courseCode = document.getElementById("courseCode").value;
                        const title = document.getElementById("courseTitle").value;
                        const description = document.getElementById("courseDescription").value;
    
                        fetch(`../../backend/api/courses.php?action=update&id=${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ course_code: courseCode, title, description })
                        })
                            .then(fetchCourses)
                            .catch(error => console.error("Error:", error));
                    }
                );
            })
            .catch(error => console.error("Error fetching course details:", error));
    }
    function deleteCourse(id) {
        if (confirm("Are you sure you want to delete this course?")) {
            fetch(`../../backend/api/courses.php?action=delete&id=${id}`, { method: "DELETE" })
                .then(fetchCourses)
                .catch(error => console.error("Error:", error));
        }
    }
    function showAddCourseModal() {
        showModal(
            "Add New Course",
            [
                { id: "courseCode", label: "Course Code", type: "text" },
                { id: "courseTitle", label: "Course Title", type: "text" },
                { id: "courseDescription", label: "Description", type: "textarea" },
            ],
            () => {
                const courseCode = document.getElementById("courseCode").value;
                const courseTitle = document.getElementById("courseTitle").value;
                const courseDescription = document.getElementById("courseDescription").value;
    
                fetch("../../backend/api/courses.php?action=create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        course_code: courseCode,
                        title: courseTitle,
                        description: courseDescription,
                    }),
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Failed to add course");
                        return response.json();
                    })
                    .then(() => {
                        fetchCourses(); // Refresh the courses table
                        bootstrap.Modal.getInstance(document.getElementById("actionModal")).hide(); // Close the modal
                    })
                    .catch(error => console.error("Error:", error));
            }
        );
    }
    
    
    
    function fetchUsers() {
        fetch("../../backend/api/users.php?action=read")
            .then(response => response.json())
            .then(data => renderUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    }
    
    function renderUsers(users) {
        const usersTableBody = document.querySelector("#usersTable tbody");
        usersTableBody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser(${user.user_id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.user_id})">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    }
    function editUser(id) {
        fetch(`../../backend/api/users.php?action=read&id=${id}`)
            .then(response => response.json())
            .then(user => {
                showModal(
                    "Edit User",
                    [
                        { id: "username", label: "Username", type: "text", value: user.username },
                        { id: "role", label: "Role", type: "text", value: user.role },
                        { id: "email", label: "Email", type: "email", value: user.email },
                    ],
                    () => {
                        const username = document.getElementById("username").value;
                        const role = document.getElementById("role").value;
                        const email = document.getElementById("email").value;
    
                        fetch(`../../backend/api/users.php?action=update&id=${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ username, role, email })
                        })
                            .then(fetchUsers)
                            .catch(error => console.error("Error:", error));
                    }
                );
            })
            .catch(error => console.error("Error fetching user details:", error));
    }
    function deleteUser(id) {
        if (confirm("Are you sure you want to delete this user?")) {
            fetch(`../../backend/api/users.php?action=delete&id=${id}`, { method: "DELETE" })
                .then(fetchUsers)
                .catch(error => console.error("Error:", error));
        }
    }
    function showAddUserModal() {
        showModal(
            "Add New User",
            [
                { id: "username", label: "Username", type: "text" },
                { id: "role", label: "Role", type: "text" },
                { id: "email", label: "Email", type: "email" },
            ],
            () => {
                const username = document.getElementById("username").value;
                const role = document.getElementById("role").value;
                const email = document.getElementById("email").value;
    
                fetch("../../backend/api/users.php?action=create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: username,
                        role: role,
                        email: email,
                    }),
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Failed to add user");
                        return response.json();
                    })
                    .then(() => {
                        fetchUsers(); // Refresh the users table
                        bootstrap.Modal.getInstance(document.getElementById("actionModal")).hide(); // Close the modal
                    })
                    .catch(error => console.error("Error:", error));
            }
        );
    }
    

    
// });

