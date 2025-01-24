<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class ProductImage
 *
 * Represents an image associated with a product in the system.
 */
class ProductImage extends BaseModel
{
    /**
     * ProductImage constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $url URL of the product image.
     * @param string $productId Product ID associated with the image.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the product image to the database.
     *
     * @param array $data Associative array containing the image data:
     *
     * @return int The ID of the saved product image record.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(mixed $data): int
    {
        // Prepare the SQL statement to insert image data into the database
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO product_images (product_id, url) VALUES (:product_id, :url)'
            );

            // Bind the image data parameters to the prepared statement
            $stmt->bindParam(':product_id', $data['productId'], PDO::PARAM_STR);
            $stmt->bindParam(':url', $data['url'], PDO::PARAM_STR);
            
            // Execute the statement
            $stmt->execute();
            
            // Return the ID of the last inserted record
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Throw a descriptive exception if the operation fails
            throw new PDOException("Error saving product image: " . $e->getMessage());
        }
    }
}
