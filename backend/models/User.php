<?php
class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE username = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            // Verify the password
            if (password_verify($this->password, $user['password'])) {
                return $user;
            }
        }
        return false;
    }

    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (username, password, role, email) VALUES (:username, :password, :role, :email)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role' => $data['role'],
            'email' => $data['email']
        ]);
    }

    public function update($data) {
        $query = "UPDATE " . $this->table_name . " SET username = :username, role = :role, email = :email WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        if (!empty($data['password'])) {
            $query = "UPDATE " . $this->table_name . " SET username = :username, password = :password, role = :role, email = :email WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        return $stmt->execute($data);
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute(['id' => $id]);
    }
}
?>
