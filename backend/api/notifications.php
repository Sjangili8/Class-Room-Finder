<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT message FROM notifications ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($results) {
    echo json_encode($results);
} else {
    echo json_encode([]);
}
?>
