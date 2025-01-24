<?php

namespace App\Models;

use InvalidArgumentException;
use PDO;
use PDOException;

/**
 * Abstract class AbstractAttributeValue
 *
 * Represents a base model for attribute values. Provides shared functionality for saving and retrieving attribute values.
 */
abstract class AbstractAttributeValue extends BaseModel
{
    /**
     * AbstractAttributeValue constructor.
     *
     * Initializes the database connection for the attribute value model.
     *
     * @param PDO $db Database connection instance.
     */
    public function __construct(PDO $db)
    {
        parent::__construct($db);
    }

    /**
     * Save the attribute value to the database.
     *
     * Saves the attribute value along with its associated product and attribute IDs.
     *
     * @param array $data Data containing attribute details.
     * @return int The ID of the saved attribute value.
     * @throws PDOException If an error occurs during the database operation.
     * @throws InvalidArgumentException If required data is missing.
     */
    public function save(array $data): int
    {
        // Validate the input data
        if (empty($data['attributeId']) || empty($data['productId']) || empty($data['value']) || empty($data['displayValue'])) {
            throw new InvalidArgumentException("Missing required data for saving attribute value.");
        }

        try {
            // Prepare the SQL statement for inserting attribute values
            $stmt = $this->db->prepare(
                'INSERT INTO attribute_values (attribute_id, product_id, value, display_value) VALUES (:attribute_id, :product_id, :value, :display_value)'
            );

            // Bind parameters to the prepared statement with specific types
            $stmt->bindParam(':attribute_id', $data['attributeId'], PDO::PARAM_INT); 
            $stmt->bindParam(':product_id', $data['productId'], PDO::PARAM_STR);  
            $stmt->bindParam(':value', $data['value'], PDO::PARAM_STR);            
            $stmt->bindParam(':display_value', $data['displayValue'], PDO::PARAM_STR); 

            // Execute the statement
            $stmt->execute();

            // Return the ID of the newly inserted row
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // Throw a more descriptive exception if the operation fails
            throw new PDOException("Error saving attribute value: " . $e->getMessage());
        }
    }

    /**
     * Abstract method to retrieve attribute values for a product.
     *
     * Must be implemented by concrete subclasses to fetch specific attribute values.
     *
     * @param int|string $productId The ID of the product for which attributes are being retrieved.
     * @return array An associative array containing the attribute values for the specified product ID.
     */
    abstract public function get(string $productId): array;
}
