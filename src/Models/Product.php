<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class Product
 *
 * Represents a product in the system.
 */
class Product extends BaseModel
{
    /** @var string Product ID. */
    private string $id;

    /** @var string Product name. */
    private string $name;

    /** @var string Product description. */
    private string $description;

    /** @var int Whether the product is in stock. */
    private int $inStock;

    /** @var string Product brand. */
    private string $brand;

    /** @var int Category ID associated with the product. */
    private int $categoryId;

    /**
     * Product constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $id Product id.
     * @param string $name Product name.
     * @param string $description Product description.
     * @param int $inStock Whether the product is in stock.
     * @param string $brand Product brand.
     * @param int $categoryId Category ID associated with the product.
     */
    public function __construct(PDO $dbConnection, string $id, string $name, string $description, int $inStock, string $brand, int $categoryId)
    {
        parent::__construct($dbConnection);
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->inStock = $inStock;
        $this->brand = $brand;
        $this->categoryId = $categoryId;
    }

    /**
     * Save the product to the database.
     *
     * @return string The ID of the saved product.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(): string
    {
        $stmt = $this->db->prepare('
        INSERT INTO products (id, name, description, in_stock, category_id, brand) VALUES (:id, :name, :description, :in_stock, :category_id, :brand)
        ');
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':in_stock', $this->inStock);
        $stmt->bindParam(':category_id', $this->categoryId);
        $stmt->bindParam(':brand', $this->brand);
        $stmt->execute();
        return (string) $this->id;
    }
}
