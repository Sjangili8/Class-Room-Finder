-- Create Database
CREATE DATABASE IF NOT EXISTS classroom_finder;
USE classroom_finder;

-- Create Tables
CREATE TABLE buildings (
    building_id INT PRIMARY KEY,
    name VARCHAR(100),
    code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    floors INT,
    description TEXT,
    blueprint_path VARCHAR(255)
);

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP
);

CREATE TABLE classrooms (
    classroom_id INT PRIMARY KEY,
    building_id INT,
    room_number VARCHAR(20),
    floor INT,
    wing VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    x_coordinate VARCHAR(50),
    y_coordinate VARCHAR(50),
    blueprint_path VARCHAR(255),
    FOREIGN KEY (building_id) REFERENCES buildings(building_id)
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    subject_code VARCHAR(10),
    course_number VARCHAR(20),
    title VARCHAR(100),
    building_id INT,
    classroom_id INT,
    description TEXT,
    FOREIGN KEY (building_id) REFERENCES buildings(building_id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id)
);

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY,
    message TEXT,
    created_at TIMESTAMP,
    is_read BOOLEAN
);

-- Insert Buildings Data
INSERT INTO buildings (building_id, name, code, latitude, longitude, floors, description, blueprint_path) VALUES
(1, 'Library Tower', 'Lib', 32.368009, -86.177590, 10, 'Main library of the university with 10 floors', NULL),
(2, 'Taylor Center', 'Tay', 32.379334, -86.308045, 3, 'Student center with classrooms and meeting spaces', NULL),
(3, 'Goodwyn Hall', 'Gwyn', 32.368486, -86.177661, 4, 'goodwyn hall classrooms', NULL),
(5, 'temp', '999', 32.000000, 86.000000, 10, 'none', NULL);

-- Insert Users Data
INSERT INTO users (user_id, username, password, role, email, created_at) VALUES
(5, 'savya', 'Savya@123', 'Admin', 'savya@aum.edu', '2024-11-14 14:31:18'),
(4, 'shalini', 'Shalini@123', 'Admin', 'shalini@aum.edu', '2024-11-14 14:31:18'),
(3, 'student1', 'name', 'Student', 'student1@aum.edu', '2024-11-14 14:31:18'),
(2, 'jdoe', 'name', 'Faculty', 'jdoe@aum.edu', '2024-11-14 14:31:18'),
(1, 'admin', 'name', 'Admin', 'admin@aum.edu', '2024-11-14 14:31:18');

-- Insert Classrooms Data
INSERT INTO classrooms (classroom_id, building_id, room_number, floor, wing, latitude, longitude, description, x_coordinate, y_coordinate, blueprint_path) VALUES
(1, 1, '101', 1, 'North', 32.368009, -86.177590, 'Library Tower first floor, North Wing', NULL, NULL, 'library_tower_1st_floor.jpg'),
(2, 1, '102', 1, NULL, 32.367937, -86.177611, 'first floor class 2', '120', '150', 'library_tower_1st_floor.jpg'),
(3, 2, '201', 2, 'N/A', 32.379334, -86.308045, 'Taylor Center second floor', NULL, NULL, 'library_tower_2nd_floor.jpg'),
(4, 1, '103', 1, NULL, 32.377937, -86.197611, 'first floor class 3', '130', '140', 'library_tower_1st_floor.jpg'),
(5, 1, '133', 1, 'N/A', 32.367730, -86.177692, 'first floor 133 class number', NULL, NULL, 'library_tower_1st_floor.jpg');

-- Insert Courses Data
INSERT INTO courses (course_id, subject_code, course_number, title, building_id, classroom_id, description) VALUES
(1, 'CS', '101', 'Introduction to Computer Science', 1, 1, 'Basic principles of computer science'),
(2, 'MATH', '201', 'Calculus I', 2, 3, 'Introduction to calculus concepts');

-- Insert Notifications Data
INSERT INTO notifications (notification_id, message, created_at, is_read) VALUES
(1, 'Building Library Tower has been updated.', '2024-11-14 14:31:18', 0),
(2, 'New classroom 201 added to Taylor Center.', '2024-11-14 14:31:18', 0);