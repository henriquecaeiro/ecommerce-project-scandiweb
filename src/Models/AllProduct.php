<?php

namespace App\Models;

use RuntimeException;
use Exception;
use PDO;


/**
 * Class AllProduct
 *
 * Provides functionality to retrieve all products, along with their associated images, categories, and prices.
 */
class AllProduct extends AbstractProduct
{
    /**
     * Retrieves product data, optionally filtered by ID.
     *
     * This method fetches product details, including associated category, image, and price information.
     *
     * @param mixed $id Optional product ID for filtering the query. If null, all products are retrieved.
     * @return array An array of product data.
     * @throws RuntimeException If the query fails or an exception occurs.
     */
    public function get(mixed $id = null): array
    {
        try {
            // query to fetch product data with associated category, image, and price details
            $query = "
                SELECT 
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
                        WHERE product_images.product_id = products.id
                    )
            ";

            // Filter by product ID if provided
            if ($id !== null) {
                $query .= " AND products.id = :id";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':id', $id, PDO::PARAM_STR);
                $stmt->execute();
            } else {
                $stmt = $this->db->query($query);
            }

            // Fetch results as an associative array
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($result === false) {
                throw new RuntimeException("Failed to fetch data from the products table.");
            }

            // Return the results
            return $result;
        } catch (Exception $e) {
            // Throw a more descriptive exception if the operation fails
            throw new RuntimeException("Error in AllProduct::get: " . $e->getMessage());
        }
    }
}
