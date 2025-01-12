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
    /** @var string URL of the product image. */
    private string $url;

    /** @var string Product ID associated with the image. */
    private string $productId;

    /**
     * ProductImage constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $url URL of the product image.
     * @param string $productId Product ID associated with the image.
     */
    public function __construct(PDO $db, string $url, string $productId)
    {
        parent::__construct($db);
        $this->url = $url;
        $this->productId = $productId;
    }

    /**
     * Save the product image to the database.
     *
     * @return int The ID of the saved product image.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(): int
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO product_images (product_id, url) VALUES (:product_id, :url)'
            );
            $stmt->bindParam(':product_id', $this->productId);
            $stmt->bindParam(':url', $this->url);
            $stmt->execute();

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new PDOException("Error saving product image: " . $e->getMessage());
        }
    }
}
