<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class Price
 *
 * Represents a price associated with a product in the system.
 */
class Price extends BaseModel
{
    /** @var string Currency symbol of the price. */
    private string $currency;

    /** @var float Amount of the price. */
    private float $amount;

    /** @var string Product ID associated with the price. */
    private string $productId;

    /**
     * Price constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $currency Currency symbol of the price.
     * @param float $amount Amount of the price.
     * @param string $productId Product ID associated with the price.
     */
    public function __construct(PDO $db, string $currency, float $amount, string $productId)
    {
        parent::__construct($db);
        $this->currency = $currency;
        $this->amount = $amount;
        $this->productId = $productId;
    }

    /**
     * Save the price to the database.
     *
     * @return int The ID of the saved price.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(): int
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO prices (product_id, currency, amount) VALUES (:product_id, :currency, :amount)'
            );
            $stmt->bindParam(':product_id', $this->productId);
            $stmt->bindParam(':currency', $this->currency);
            $stmt->bindParam(':amount', $this->amount);
            $stmt->execute();

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new PDOException("Error saving price: " . $e->getMessage());
        }
    }
}
