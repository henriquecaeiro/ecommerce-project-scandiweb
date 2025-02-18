<?php

namespace App\Models;

use InvalidArgumentException;
use RuntimeException;
use Exception;
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
     * @throws Exception If a duplicate entry is detected.
     */
    public function save(mixed $data): mixed
    {
        try {
            // Handle cases where $data is a string
            if (is_string($data)) {
                $name = $data;
            } elseif (is_array($data) && isset($data['name'])) {
                $name = $data['name'];
            } else {
                throw new InvalidArgumentException("Invalid data format. Expected string or array with 'name'.");
            }
    
            // Prepare the SQL statement for inserting category 
            $stmt = $this->db->prepare(
                'INSERT INTO categories (name) VALUES (:name)'
            );
    
            // Bind parameters to the prepared statement
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    
            // Execute the statement
            $stmt->execute();
    
            // Return the ID
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Handle duplicate entry error
            if ($e->errorInfo[1] == 1062) {
                throw new Exception("The database was already imported");
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

            // If the data was not fetched throw an exception
            if ($result === false) {
                throw new RuntimeException("Failed to fetch data from table categories");
            }

            // Return the categories
            return $result;
        } catch (Exception $e) {
             // if any eror occur throw a new exception with additional context
            throw new RuntimeException("Error in QueryableModel::get: " . $e->getMessage());
        }
    }
}
