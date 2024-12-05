<?php
class Classroom {
    private $conn;
    private $table_name = "Classrooms";

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
        $query = "INSERT INTO " . $this->table_name . " (building_id, room_number, floor, latitude, longitude) VALUES (:building_id, :room_number, :floor, :latitude, :longitude)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            'building_id' => $data['building_id'],
            'room_number' => $data['room_number'],
            'floor' => $data['floor'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude']
        ]);
    }

    public function update($data) {
        $query = "UPDATE " . $this->table_name . " SET building_id = :building_id, room_number = :room_number, floor = :floor, latitude = :latitude, longitude = :longitude WHERE classroom_id = :classroom_id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            'building_id' => $data['building_id'],
            'room_number' => $data['room_number'],
            'floor' => $data['floor'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'classroom_id' => $data['classroom_id']
        ]);
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE classroom_id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute(['id' => $id]);
    }
}
?>
