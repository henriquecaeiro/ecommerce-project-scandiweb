<?php

namespace App\Models;

use InvalidArgumentException;
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
     * @throws InvalidArgumentException If required data is missing.
     */
    public function save(mixed $data): string
    {
        try {
            // Prepare the SQL statement for inserting product data
            $stmt = $this->db->prepare('
                INSERT INTO products 
                    (id, name, description, in_stock, category_id, brand) 
                VALUES 
                    (:id, :name, :description, :in_stock, :category_id, :brand)
            ');

            // Bind the parameters to the statement with specific types
            $stmt->bindParam(':id', $data['productId'], PDO::PARAM_STR);       
            $stmt->bindParam(':name', $data['name'], PDO::PARAM_STR);              
            $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR); 
            $stmt->bindParam(':in_stock', $data['inStock'], PDO::PARAM_INT);       
            $stmt->bindParam(':brand', $data['brand'], PDO::PARAM_STR);           
            $stmt->bindParam(':category_id', $data['categoryId'], PDO::PARAM_INT); 

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
