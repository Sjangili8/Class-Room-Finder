<?php
class Building {
    private $conn;
    private $table_name = "Buildings";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (name, code, latitude, longitude, floors, description) VALUES (:name, :code, :latitude, :longitude, :floors, :description)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute($data);
    }

    public function update($data) {
        $query = "UPDATE " . $this->table_name . " SET name=:name, code=:code, latitude=:latitude, longitude=:longitude, floors=:floors, description=:description WHERE building_id=:building_id";
        $stmt = $this->conn->prepare($query);
    
        try {
            $stmt->execute($data);
            return [
                'success' => true,
                'message' => 'Building updated successfully.'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to update building: ' . $e->getMessage()
            ];
        }
    }    

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE building_id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute(['id' => $id]);
    }
}
?>
