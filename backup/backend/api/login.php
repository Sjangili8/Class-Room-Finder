<?php
header('Content-Type: application/json');
require_once '../models/User.php';
require_once '../config/database.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Default JSON response
$response = [
    "success" => false,
    "message" => "Invalid username or password."
];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Log received data for debugging
        error_log("Received POST data: " . print_r($_POST, true));
        
        $username = isset($_POST['username']) ? $_POST['username'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        if (!empty($username) && !empty($password)) {
            $database = new Database();
            $db = $database->getConnection();
            $user = new User($db);

            $user->username = $username;
            $user->password = $password;

            // Attempt to log in
            if ($userData = $user->login()) {
                $response["success"] = true;
                $response["message"] = "Login successful.";
                $response["user"] = $userData;
            }
        } else {
            $response["message"] = "Username and password are required.";
        }
    } else {
        $response["message"] = "Invalid request method.";
    }
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    $response["message"] = "An unexpected error occurred. Please try again later.";
}

// Output JSON response
echo json_encode($response);