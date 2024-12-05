<?php
require_once '../config/database.php';
require_once '../models/Classroom.php';

class ClassroomController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllClassrooms() {
        $classroom = new Classroom($this->conn);
        $result = $classroom->getAllClassrooms();
        $classrooms = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $classrooms[] = $row;
        }

        return $classrooms;
    }
}

// Example usage:
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $db = (new Database())->getConnection();
    $classroomController = new ClassroomController($db);
    $classrooms = $classroomController->getAllClassrooms();
    echo json_encode($classrooms);
}
?>
