// ========== Buildings ==========
function showBuildingForm() { /* Display the form for adding a building */ }
function fetchBuildings() {
    fetch('../api/buildings.php?action=list')
        .then(response => response.json())
        .then(data => {
            const buildingsList = document.getElementById('buildings-list');
            buildingsList.innerHTML = data.map(b => `<div>${b.building_name}</div>`).join('');
        });
}

// ========== Classrooms ==========
function showClassroomForm() { /* Display the form for adding a classroom */ }
function fetchClassrooms() {
    fetch('../api/classrooms.php?action=list')
        .then(response => response.json())
        .then(data => {
            const classroomsList = document.getElementById('classrooms-list');
            classroomsList.innerHTML = data.map(c => `<div>${c.room_number} - Floor: ${c.floor}</div>`).join('');
        });
}

// ========== Courses ==========
function showCourseForm() { /* Display the form for adding a course */ }
function fetchCourses() {
    fetch('../api/courses.php?action=list')
        .then(response => response.json())
        .then(data => {
            const coursesList = document.getElementById('courses-list');
            coursesList.innerHTML = data.map(c => `<div>${c.course_name} (${c.course_code})</div>`).join('');
        });
}

// ========== Users ==========
function showUserForm() { /* Display the form for adding a user */ }
function fetchUsers() {
    fetch('../api/users.php?action=list')
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = data.map(u => `<div>${u.username} - Role: ${u.role}</div>`).join('');
        });
}
