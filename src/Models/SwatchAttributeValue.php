<?php

namespace App\Models;

use Exception;
use RuntimeException;
use PDO;

/**
 * Class SwatchAttributeValue
 *
 * Handles the retrieval of attributes with the "swatch" type.
 * This class is responsible for fetching swatch attributes associated with a specific product ID.
 */
class SwatchAttributeValue extends AbstractAttributeValue
{
    /**
     * Retrieves swatch attribute values for a specific product.
     *
     * @param mixed $productId The ID of the product whose swatch attributes are to be fetched.
     * @return array An associative array of swatch attributes, including their display values and names.
     */
    public function get(string $productId): array
    {
        try {
            // Prepare the SQL query to fetch swatch attribute values
            $stmt = $this->db->prepare(
                "SELECT attribute_values.display_value, attribute_values.value, attributes.name 
        FROM attribute_values
        JOIN attributes ON attribute_values.attribute_id = attributes.id
        WHERE attribute_values.product_id = :product_id
        AND attributes.type = 'swatch';"
            );

            // Bind the product ID to the query
            $stmt->bindParam(':product_id', $productId);

            // Execute the query
            $stmt->execute();

            // Fetch and return the results as an associative array
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new RuntimeException("Error in SSwatchAttributeValue::get: " . $e->getMessage());
        }
    }
}
