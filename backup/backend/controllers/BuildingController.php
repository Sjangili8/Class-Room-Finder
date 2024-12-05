<?php
require_once '../config/database.php';
require_once '../models/Building.php';

class BuildingController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllBuildings() {
        $building = new Building($this->conn);
        $result = $building->getAllBuildings();
        $buildings = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $buildings[] = $row;
        }

        return $buildings;
    }
}

// Example usage:
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $db = (new Database())->getConnection();
    $buildingController = new BuildingController($db);
    $buildings = $buildingController->getAllBuildings();
    echo json_encode($buildings);
}
?>
