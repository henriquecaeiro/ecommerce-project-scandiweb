<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class Product
 *
 * Represents a product in the system.
 */
abstract class AbstractProduct extends BaseModel
{
    /** @var string Product ID. */
    protected string $id;

    /** @var string Product name. */
    protected string $name;

    /** @var string Product description. */
    protected string $description;

    /** @var int Whether the product is in stock. */
    protected int $inStock;

    /** @var string Product brand. */
    protected string $brand;

    /** @var int Category ID associated with the product. */
    protected int $categoryId;

    /**
     * AbstractProduct  constructor.
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

    public function save(): string
    {
        try {
            $stmt = $this->db->prepare('
                INSERT INTO products 
                    (id, name, description, in_stock, category_id, brand) 
                VALUES 
                    (:id, :name, :description, :in_stock, :category_id, :brand)
            ');
            $stmt->bindParam(':id', $this->id);
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':in_stock', $this->inStock);
            $stmt->bindParam(':brand', $this->brand);
            $stmt->bindParam(':category_id', $this->categoryId);
            $stmt->execute();

            return $this->id;
        } catch (PDOException $e) {
            throw new PDOException("Error saving Product: " . $e->getMessage());
        }
    }

    abstract public function getProductType(): string;

    public function getId(): string
    {
        return $this->id;
    }
}
