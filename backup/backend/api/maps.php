<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Input query
$searchQuery = $_GET['query'] ?? '';

if (!$searchQuery) {
    echo json_encode(["error" => "Query is required"]);
    exit;
}

// Search query: classrooms and buildings
$query = "
    SELECT 
        c.latitude, 
        c.longitude, 
        c.room_number AS name, 
        c.floor, 
        c.wing, 
        c.description, 
        c.blueprint_path, 
        b.name AS building_name,
        'classroom' AS type 
    FROM classrooms c 
    JOIN buildings b ON c.building_id = b.building_id
    WHERE c.room_number LIKE :query OR b.name LIKE :query
    UNION
    SELECT 
        b.latitude, 
        b.longitude, 
        b.name, 
        NULL AS floor, 
        NULL AS wing, 
        b.description, 
        b.blueprint_path, 
        NULL AS building_name,
        'building' AS type 
    FROM buildings b
    WHERE b.name LIKE :query
    order by name Desc
";

$stmt = $db->prepare($query);
$stmt->execute(['query' => "%$searchQuery%"]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($results) {
    echo json_encode($results);
} else {
    echo json_encode(["error" => "No matching results found"]);
}
?>
