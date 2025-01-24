<?php

namespace App\Models;

use InvalidArgumentException;
use PDO;
use PDOException;

/**
 * Class Order
 *
 * Represents an Order in the system.
 */
class Order extends BaseModel
{
    /**
     * Order constructor.
     *
     * Initializes the Order model with a database connection.
     *
     * @param PDO $db Database connection instance.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the order to the database.
     *
     * @param array $data Array containing the necessary data of the order.
     * @return int The ID of the saved order.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(array $data): int
    {
        try {
            // Prepare the SQL statement for inserting the order
            $stmt = $this->db->prepare(
                'INSERT INTO orders (total_amount) VALUES (:total_amount)'
            );

            // Bind parameters to the prepared statement
            $stmt->bindParam(':total_amount', $data['totalAmount'], PDO::PARAM_STR);

            // Execute the statement
            $stmt->execute();

            // Return the order ID
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Handle database-specific errors
            throw new PDOException("Error saving order: " . $e->getMessage(), (int)$e->getCode(), $e);
        } catch (InvalidArgumentException $e) {
            // Handle validation errors
            throw $e;
        }
    }
}
