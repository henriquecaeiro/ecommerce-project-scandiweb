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
            if ($id !== null) {
                // Query to fetch a single product with all associated images
                $query = "
                SELECT 
                    products.id, 
                    products.name, 
                    products.in_stock, 
                    products.description, 
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
                WHERE products.id = :id
                ";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':id', $id, PDO::PARAM_STR);
                $stmt->execute();

                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($result === false) {
                    throw new RuntimeException("Failed to fetch product with ID: $id.");
                }

                //Group all images into a single array
                $product = [
                    'id' => $result[0]['id'],
                    'name' => $result[0]['name'],
                    'in_stock' => $result[0]['in_stock'],
                    'description' => $result[0]['description'],
                    'brand' => $result[0]['brand'],
                    'category_name' => $result[0]['category_name'],
                    'price_amount' => $result[0]['price_amount'],
                    'currency_label' => $result[0]['currency_label'],
                    'currency_symbol' => $result[0]['currency_symbol'],
                    'image_url' => array_column($result, 'image_url'),
                ];

                return [$product];
            } else {
                //Query to fetch all products with a single image per product
                $query = "
                    SELECT 
                        products.id, 
                        products.name, 
                        products.in_stock, 
                        products.brand, 
                        categories.name AS category_name, 
                        prices.amount AS price_amount, 
                        prices.currency_label, 
                        prices.currency_symbol,
                        (SELECT url FROM product_images WHERE product_images.product_id = products.id LIMIT 1) AS image_url
                    FROM 
                        products
                    INNER JOIN 
                        categories ON products.category_id = categories.id
                    INNER JOIN 
                        prices ON products.id = prices.product_id
                ";
                $stmt = $this->db->query($query);

                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($result === false) {
                    throw new RuntimeException("Failed to fetch all products.");
                }

                return $result;
            }
        } catch (Exception $e) {
            // Throw a more descriptive exception if the operation fails
            throw new RuntimeException("Error in AllProduct::get: " . $e->getMessage());
        }
    }
}
