<?php
class Database {
    private $host = "127.0.0.2";
    private $port = 3340; // Update to your MySQL port
    private $db_name = "classroom_finder";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch (PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage()); // Log error instead of echoing
            exit(json_encode(["success" => false, "message" => "Database connection failed."]));
        }
        return $this->conn;
    }
    
}
?>
