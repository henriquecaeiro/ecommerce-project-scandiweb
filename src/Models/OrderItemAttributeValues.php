<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class OrderItemAttributeValues
 *
 * Represents an Order Item Attribute Value in the system.
 */
class OrderItemAttributeValues extends BaseModel
{
    /**
     * OrderItemAttributeValues constructor.
     *
     * Initializes the Order Item Attribute Values model with a database connection.
     *
     * @param PDO $db Database connection instance.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the Order Item Attribute Values to the database.
     *
     * @param array $data Array containing the necessary data for the order item attribute value.
     *
     * @return string Success message.
     *
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(array $data): string
    {
        try {
            // Prepare the SQL statement for inserting order item attribute values
            $stmt = $this->db->prepare(
                'INSERT INTO order_item_attribute_values (order_item_id, attribute_value_id) 
                 VALUES (:order_item_id, :attribute_value_id)'
            );

            // Bind parameters to the prepared statement
            $stmt->bindParam(':order_item_id', $data['orderItemAttributeValue'], PDO::PARAM_INT);
            $stmt->bindParam(':attribute_value_id', $data['attributeValueId'], PDO::PARAM_INT);

            // Execute the statement
            $stmt->execute();

            // Return success message
            return 'Order item attribute values saved successfully.';
        } catch (PDOException $e) {
            // Throw the exception to be handled by upper layers
            throw new PDOException("Error saving order item attribute values: " . $e->getMessage());
        }
    }
}
