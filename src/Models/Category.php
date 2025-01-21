<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class Category
 *
 * Represents a category in the system.
 */
class Category extends QueryableModel
{
    /**
     * Category constructor.
     *
     * Initializes the Category model with a database connection.
     *
     * @param PDO $db Database connection instance.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the category to the database.
     *
     * @param string $name Name of the category.
     * @return int The ID of the saved category.
     * @throws PDOException If an error occurs during the save operation.
     * @throws \Exception If a duplicate entry is detected.
     */
    public function save(...$params): mixed
    {
        $name = $params[0];

        try {
            // Prepare the SQL statement for inserting category 
            $stmt = $this->db->prepare(
                'INSERT INTO categories (name) VALUES (:name)'
            );

            // Bind parameters to the prepared statement
            $stmt->bindParam(':name', $name);

            // Execute the statement
            $stmt->execute();

            // Return the ID
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Handle duplicate entry error
            if ($e->errorInfo[1] == 1062) {
                throw new \Exception("The database was already imported");
            } else {
                throw new PDOException("Error saving category: " . $e->getMessage());
            }
        }
    }

    /**
     * Retrieve all categories or a specific category by ID.
     *
     * @param mixed $id The ID of the category to retrieve, or null to fetch all categories.
     * @return array The retrieved categories.
     * @throws \RuntimeException If the query fails.
     */
    public function get(mixed $id): array
    {
        try {
            // Fetch all categories
            $stmt = $this->db->query("SELECT * FROM categories");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($result === false) {
                throw new \RuntimeException("Failed to fetch data from table categories");
            }

            return $result;
        } catch (\Throwable $e) {
            throw new \RuntimeException("Error in QueryableModel::get: " . $e->getMessage());
        }
    }
}
