<?php

namespace App\Models;

use Exception;
use RuntimeException;
use PDO;

/**
 * Class TextAttributeValue
 *
 * Handles the retrieval of text-based attributes associated with a product.
 * Fetches attribute data along with its display value and name.
 */
class TextAttributeValue extends AbstractAttributeValue
{
    /**
     * Retrieves all text attributes for a given product ID.
     *
     * @param string $productId The ID of the product for which attributes are retrieved.
     * @return array An array of attributes, including their display value, value, and name.
     * @throws \RuntimeException If an error occurs during data retrieval.
     */
    public function get($productId): array
    {
        try {
            // Prepare the SQL query to fetch text attributes for the given product ID
            $stmt = $this->db->prepare("
            SELECT 
                attribute_values.id AS attribute_value_id, 
                attribute_values.display_value, 
                attribute_values.value, 
                attributes.name 
            FROM attribute_values
            JOIN attributes ON attribute_values.attribute_id = attributes.id
            WHERE attribute_values.product_id = :product_id
            AND attributes.type = 'text';
            ");

            // Bind the product ID to the query
            $stmt->bindParam(':product_id', $productId);

            // Execute the query
            $stmt->execute();

            // Fetch and return the results as an associative array
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            // Handle any exceptions or errors during query execution
            throw new RuntimeException("Error fetching text attributes: " . $e->getMessage());
        }
    }
}
