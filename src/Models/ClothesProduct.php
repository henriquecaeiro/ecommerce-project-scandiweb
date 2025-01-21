<?php

namespace App\Models;

use PDO;

/**
 * Class ClothesProduct
 *
 * Retrieves all products belonging to the 'clothes' category.
 */
class ClothesProduct extends AbstractProduct
{
    /**
     * Fetches products from the database with the category 'clothes'.
     *
     * @param mixed $id Optional ID for fetching specific product data (currently unused).
     * @return array An array of products within the 'clothes' category.
     * @throws \RuntimeException If there is an error during data retrieval.
     */
    public function get(mixed $id): array
    {
        try {
            // Execute the query to fetch products belonging to the 'clothes' category
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
                        WHERE product_images.product_id = products.id) AND categories.name = 'clothes'"
            );

            // Fetch results as an associative array
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Throw exception if the operation fails
            if ($result === false) {
                throw new \RuntimeException("Failed to fetch data from table products");
            }

            // Return the results
            return $result;
        } catch (\Throwable $e) {
            // Throw a more descriptive exception if the operation fails
            throw new \RuntimeException("Error in QueryableModel::get: " . $e->getMessage());
        }
    }
}
