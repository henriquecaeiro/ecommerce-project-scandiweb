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

    /** @var string Product ID associated with the attribute. */
    private string $productId;

    /**
     * Attribute constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $name Name of the attribute.
     * @param string $type Type of the attribute.
     * @param string $productId Product ID associated with the attribute.
     */
    public function __construct(PDO $db, string $name, string $type, string $productId)
    {
        parent::__construct($db);
        $this->name = $name;
        $this->type = $type;
        $this->productId = $productId;
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
                'INSERT INTO attributes (product_id, name, type) VALUES (:product_id, :name, :type)'
            );
            $stmt->bindParam(':product_id', $this->productId);
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':type', $this->type);
            $stmt->execute();

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new PDOException("Error saving attribute: " . $e->getMessage());
        }
    }
}
