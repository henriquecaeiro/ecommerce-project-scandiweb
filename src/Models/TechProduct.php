<?php

namespace App\Models;

use Exception;
use RuntimeException;
use PDO;

/**
 * Class TechProduct
 *
 * Handles the retrieval of products categorized as "tech".
 * Fetches product data along with associated images, categories, and prices.
 */
class TechProduct extends AbstractProduct
{
    /**
     * Retrieves all products belonging to the "tech" category.
     *
     * @param mixed|null $id Optional parameter for filtering by product ID. Currently not used in the query.
     * @return array An associative array of products in the "tech" category, including related metadata.
     * @throws RuntimeException If an error occurs during data retrieval or the query fails.
     */
    public function get(mixed $id = null): array
    {
        try {
            // Prepare and execute the SQL query to fetch products in the "tech" category
            $stmt = $this->db->query(
                "SELECT 
                products.id, 
                products.name, 
                products.in_stock, 
                product_images.url AS image_url, 
                products.brand, 
                categories.name AS category_name, 
                prices.amount AS price_amount, 
                prices.currency_label, 
                prices.currency_symbol
                FROM 
                    products
                INNER JOIN 
                    categories ON products.category_id = categories.id
                INNER JOIN 
                    product_images ON products.id = product_images.product_id
                INNER JOIN 
                    prices ON products.id = prices.product_id
                WHERE 
                    product_images.id = (
                        SELECT MIN(id) 
                        FROM product_images 
                        WHERE product_images.product_id = products.id) AND categories.name = 'tech'"
            );

            // Fetch the results as an associative array
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Handle cases where no results are returned
            if ($result === false) {
                throw new RuntimeException("Failed to fetch data from table products");
            }

            // return the results
            return $result;
        } catch (Exception $e) {
            // Catch any exceptions or errors and rethrow as a RuntimeException with context
            throw new RuntimeException("Error in QueryableModel::get: " . $e->getMessage());
        }
    }
}
