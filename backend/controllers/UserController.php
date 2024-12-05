<?php
require_once '../config/database.php';
require_once '../models/User.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

class UserController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($username, $password) {
        $user = new User($this->conn);
        $user->username = $username;
        $user->password = $password;
        return $user->login();
    }
}

// Example usage:
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = (new Database())->getConnection();
    $userController = new UserController($db);

    $username = $_POST['username'];
    $password = $_POST['password'];

    // Call login via the UserController
    $result = $userController->login($username, $password);

    // Output the result
    if ($result) {
        echo json_encode(["message" => "Login successful", "user" => $result]);
    } else {
        echo json_encode(["message" => "Invalid username or password", "input" => ["username" => $username, "password" => $password]]);
    }
}
?>
