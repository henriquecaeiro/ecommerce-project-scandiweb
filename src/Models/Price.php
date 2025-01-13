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
    private string $currencyLabel;

    /** @var string Currency l of the price. */
        private string $currencySymbol;

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
    public function __construct(PDO $db, string $currencyLabel, string $currencySymbol, float $amount, string $productId)
    {
        parent::__construct($db);
        $this->currencyLabel = $currencyLabel;
        $this->currencySymbol = $currencySymbol;
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
                'INSERT INTO prices (product_id, amount, currency_label, currency_symbol) VALUES (:product_id, :amount, :currency_label, :currency_symbol)'
            );
            $stmt->bindParam(':product_id', $this->productId);
            $stmt->bindParam(':currency_label', $this->currencyLabel);
            $stmt->bindParam(':currency_symbol', $this->currencySymbol);
            $stmt->bindParam(':amount', $this->amount);
            $stmt->execute();

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new PDOException("Error saving price: " . $e->getMessage());
        }
    }
}
