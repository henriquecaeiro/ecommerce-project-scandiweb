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
    /**
     * Attribute constructor.
     *
     * Initializes the attribute with a database connection.
     *
     * @param PDO $db Database connection instance.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the attribute to the database.
     *
     * This method saves an attribute with its name and type. If the attribute already exists,
     * the `INSERT IGNORE` ensures no duplicate entries are created.
     *
     * @param array $data Data containing 'name' and 'type' of the attribute.
     * @return int The ID of the saved or existing attribute.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(array $data): int
    {
        try {
            // Prepare the SQL query to insert a new attribute or ignore if it already exists
            $stmt = $this->db->prepare(
                'INSERT IGNORE INTO attributes (name, type) VALUES (:name, :type)'
            );

            // Bind the parameters to the query
            $stmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
            $stmt->bindParam(':type', $data['type'], PDO::PARAM_STR);

            // Execute the query
            $stmt->execute();

            // Return the last inserted ID
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Throw a new exception with additional context
            throw new PDOException("Error saving attribute: " . $e->getMessage());
        }
    }
}
