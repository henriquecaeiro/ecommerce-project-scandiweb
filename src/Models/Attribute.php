<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class Attribute
 *
 * Represents an attribute of a product in the system.
 */
class Attribute extends BaseModel
{
    /** @var string Name of the attribute. */
    private string $name;

    /** @var string Type of the attribute. */
    private string $type;

    /**
     * Attribute constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $name Name of the attribute.
     * @param string $type Type of the attribute.
     */
    public function __construct(PDO $db, string $name, string $type)
    {
        parent::__construct($db);
        $this->name = $name;
        $this->type = $type;
    }

    /**
     * Save the attribute to the database.
     *
     * @return int The ID of the saved attribute.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(): int
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT IGNORE INTO attributes ( name, type) VALUES (:name, :type)'
            );
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':type', $this->type);
            $stmt->execute();

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new PDOException("Error saving attribute: " . $e->getMessage());
        }
    }
}
