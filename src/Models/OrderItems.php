<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class OrderItems
 *
 * Represents an Order Item in the system.
 */
class OrderItems extends BaseModel
{
    /**
     * OrderItems constructor.
     *
     * Initializes the Order Items model with a database connection.
     *
     * @param PDO $db Database connection instance.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the order item to the database.
     *
     * @param array $data Array containing the necessary data for the order item.
     *
     * @return int The ID of the saved order item.
     *
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(array $data): int
    {
        try {
            // Prepare the SQL statement for inserting an order item
            $stmt = $this->db->prepare(
                'INSERT INTO order_items (order_id, product_id, quantity, amount) 
                 VALUES (:order_id, :product_id, :quantity, :amount)'
            );

            // Bind parameters to the prepared statement
            $stmt->bindParam(':order_id', $data['orderId'], PDO::PARAM_INT);
            $stmt->bindParam(':product_id', $data['productId'], PDO::PARAM_STR);
            $stmt->bindParam(':quantity', $data['quantity'], PDO::PARAM_INT);
            $stmt->bindParam(':amount', $data['amount'], PDO::PARAM_STR);

            // Execute the statement
            $stmt->execute();

            // Return the ID of the saved order item
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Log and rethrow the error for further handling
            error_log("Error saving order item: " . $e->getMessage());
            throw new PDOException("Error saving order item: " . $e->getMessage());
        }
    }
}
