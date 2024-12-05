<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../models/Classroom.php'; // Assuming you have a Classroom model similar to Building

$database = new Database();
$db = $database->getConnection();
$classroom = new Classroom($db);

$action = $_GET['action'] ?? 'read';

switch ($action) {
    case 'read':
        // Fetch all classrooms
        echo json_encode($classroom->readAll());
        break;

    case 'create':
        // Create a new classroom
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($classroom->create($data));
        break;

    case 'update':
        // Update an existing classroom
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($classroom->update($data));
        break;

    case 'delete':
        // Delete a classroom by ID
        $id = $_GET['id'] ?? null;
        echo json_encode($classroom->delete($id));
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
