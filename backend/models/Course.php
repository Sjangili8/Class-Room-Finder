<?php
class Course {
    private $conn;
    private $table_name = "Courses";

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
        $query = "INSERT INTO " . $this->table_name . " (course_name, course_code, professor_name, building_id, room_number, class_time) VALUES (:course_name, :course_code, :professor_name, :building_id, :room_number, :class_time)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            'course_name' => $data['course_name'],
            'course_code' => $data['course_code'],
            'professor_name' => $data['professor_name'],
            'building_id' => $data['building_id'],
            'room_number' => $data['room_number'],
            'class_time' => $data['class_time']
        ]);
    }

    public function update($data) {
        $query = "UPDATE " . $this->table_name . " SET course_name = :course_name, course_code = :course_code, professor_name = :professor_name, building_id = :building_id, room_number = :room_number, class_time = :class_time WHERE course_id = :course_id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            'course_name' => $data['course_name'],
            'course_code' => $data['course_code'],
            'professor_name' => $data['professor_name'],
            'building_id' => $data['building_id'],
            'room_number' => $data['room_number'],
            'class_time' => $data['class_time'],
            'course_id' => $data['course_id']
        ]);
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE course_id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute(['id' => $id]);
    }
}
?>
