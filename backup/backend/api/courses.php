<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../models/Course.php';

$database = new Database();
$db = $database->getConnection();
$course = new Course($db);

$action = $_GET['action'] ?? 'read';

switch ($action) {
    case 'read':
        echo json_encode($course->readAll());
        break;
    case 'create':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode(['success' => $course->create($data), 'message' => 'Course created successfully']);
        break;
    case 'update':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode(['success' => $course->update($data), 'message' => 'Course updated successfully']);
        break;
    case 'delete':
        $id = $_GET['id'] ?? null;
        echo json_encode(['success' => $course->delete($id), 'message' => 'Course deleted successfully']);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
