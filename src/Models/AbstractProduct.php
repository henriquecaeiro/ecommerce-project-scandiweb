<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Abstract class AbstractProduct
 *
 * Serves as a base class for product models in the system.
 * Provides common functionality for saving product data.
 */
abstract class AbstractProduct extends QueryableModel
{
    /** @var PDO Database connection instance. */
    public PDO $db;

    /**
     * AbstractProduct constructor.
     *
     * Initializes the database connection for the product model.
     *
     * @param PDO $dbConnection Database connection instance.
     */
    public function __construct(PDO $dbConnection)
    {
        parent::__construct($dbConnection);
    }

        /**
     * Saves product data to the database.
     *
     * Inserts product details into the `products` table.
     *
     * @param array $data Product data array.
     * @return string The product ID of the saved product.
     * @throws PDOException If an error occurs while saving the product.
     */
    public function save($data): string
    {
        try {
            // Prepare the SQL statement for inserting product data
            $stmt = $this->db->prepare('
                INSERT INTO products 
                    (id, name, description, in_stock, category_id, brand) 
                VALUES 
                    (:id, :name, :description, :in_stock, :category_id, :brand)
            ');

            // Bind the parameters to the statement
            $stmt->bindParam(':id', $data['productId']);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':in_stock', $data['inStock']);
            $stmt->bindParam(':brand', $data['brand']);
            $stmt->bindParam(':category_id', $data['categoryId']);

            // Execute the statement
            $stmt->execute();

            // Return the ID of the saved product
            return $data['productId'];
        } catch (PDOException $e) {
             // Throw a detailed exception if the save operation fails
            throw new PDOException("Error saving Product: " . $e->getMessage());
        }
    }
}
