<?php
require_once '../config/database.php';
require_once '../models/Course.php';

class CourseController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllCourses() {
        $course = new Course($this->conn);
        $result = $course->getAllCourses();
        $courses = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $courses[] = $row;
        }

        return $courses;
    }
}

// Example usage:
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $db = (new Database())->getConnection();
    $courseController = new CourseController($db);
    $courses = $courseController->getAllCourses();
    echo json_encode($courses);
}
?>
