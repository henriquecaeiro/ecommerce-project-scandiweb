<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class Category
 *
 * Represents a category in the system.
 */
class Category extends BaseModel
{
    /** @var string Name of the category. */
    private string $name;

    /**
     * Category constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $name Name of the category.
     */
    public function __construct(PDO $db, string $name)
    {
        parent::__construct($db);
        $this->name = $name;
    }

    /**
     * Save the category to the database.
     *
     * @return int The ID of the saved category.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(): int
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO categories (name) VALUES (:name)'
            );
            $stmt->bindParam(':name', $this->name);
            $stmt->execute();

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            if($e->errorInfo[1] == 1062){
                throw new \Exception("The database was already imported");
            }else{
                throw new PDOException("Error saving category: " . $e->getMessage());
            }
        }
    }
}
