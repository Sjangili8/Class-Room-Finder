<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../models/Building.php';

$database = new Database();
$db = $database->getConnection();
$building = new Building($db);

$action = $_GET['action'] ?? 'read';

switch ($action) {
    case 'read':
        echo json_encode($building->readAll());
        break;
    case 'create':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($building->create($data));
        break;
    case 'update':
        $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['building_id'])) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Building ID is required.'
                ]);
                break;
            }
            echo json_encode($building->update($data));
            break;
        
    case 'delete':
        $id = $_GET['id'] ?? null;
        echo json_encode($building->delete($id));
        break;
}
?>
