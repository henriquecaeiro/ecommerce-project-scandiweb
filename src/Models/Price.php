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
    /**
     * Price constructor.
     *
     * @param PDO $db Database connection instance.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the price to the database.
     *
     * @param array $data Associative array containing price details:
     *
     * @return int The ID of the saved price record.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(mixed $data): int
    {
        // Prepare the SQL statement for inserting price data into the database
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO prices (product_id, amount, currency_label, currency_symbol) 
                VALUES (:product_id, :amount, :currency_label, :currency_symbol)'
            );

            // Bind the data parameters to the prepared statement
            $stmt->bindParam(':product_id', $data['productId'], PDO::PARAM_STR);
            $stmt->bindParam(':currency_label',  $data['currencyLabel'], PDO::PARAM_STR);
            $stmt->bindParam(':currency_symbol', $data['currencySymbol'], PDO::PARAM_STR);
            $stmt->bindParam(':amount', $data['amount'], PDO::PARAM_STR);

            // Execute the statement
            $stmt->execute();

            // Return the ID of the last inserted record
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Throw a descriptive exception if the operation fails
            throw new PDOException("Error saving price: " . $e->getMessage());
        }
    }
}
