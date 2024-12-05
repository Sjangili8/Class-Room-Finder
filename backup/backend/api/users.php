<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$action = $_GET['action'] ?? 'read';

switch ($action) {
    case 'read':
        echo json_encode($user->readAll());
        break;
    case 'create':
        $data = json_decode(file_get_contents("php://input"), true);
        if ($user->create($data)) {
            echo json_encode(['success' => true, 'message' => 'User created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create user']);
        }
        break;
    case 'update':
        $data = json_decode(file_get_contents("php://input"), true);
        if ($user->update($data)) {
            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update user']);
        }
        break;
    case 'delete':
        $id = $_GET['id'] ?? null;
        if ($user->delete($id)) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
        }
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
