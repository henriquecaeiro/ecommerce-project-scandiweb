<?php

namespace App\Controllers;

use PDO;
use App\Factories\ProductFactory;
use Exception;

/**
 * Class ProductController
 *
 * Handles operations related to managing products, including saving, retrieving,
 * and associating additional data like prices and images.
 */
class ProductController extends QueryableController
{
    /**
     * @var PDO The database connection instance.
     */
    protected PDO $db;

    /**
     * Constructor to initialize the database connection.
     *
     * @param PDO $db The database connection instance.
     */
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Save products and their associated data to the database.
     *
     * @param array $data Associative array containing:
     * @return array Array mapping product client IDs to database IDs.
     */
    public function save(array $data): array
    {
        $productsData = $data['productsData'] ?? [];
        $categoryIds = $data['categoryIds'] ?? [];
        $productIds = [];

        foreach ($productsData as $productData) {
            try {
                $categoryId = $categoryIds[$productData['category']] ?? null;

                // Validate the presence of the category ID
                if (!$categoryId) {
                    throw new Exception("Category not found for product '{$productData['name']}'");
                }

                // Create a product instance using the factory
                $product = ProductFactory::create(
                    $this->db,
                    $productData['category']
                );

                // Prepare data for saving
                $data = [
                    'productId' => $productData['id'],
                    'name' => $productData['name'],
                    'description' => $productData['description'],
                    'inStock' => $productData['inStock'] ? 1 : 0,
                    'brand' => $productData['brand'],
                    'categoryId' => $categoryId
                ];

                // Save product and map client ID to database ID
                $productId = $product->save($data);
                $productIds[$productData['id']] = $productId;

                // Handle associated data: prices and images
                $this->handlePrices($productId, $productData['prices'] ?? []);
                $this->handleImages($productId, $productData['gallery'] ?? []);
            } catch (\Exception $e) {
                // Log the detailed error message for debugging
                error_log("Error saving product '{$productData['id']}': " . $e->getMessage());

                // Display a user-friendly message
                echo "Error saving product.Please contact the admin.";
            }
        }

        return $productIds;
    }

    /**
     * Process and save product prices.
     *
     * @param string $productId The ID of the product in the database.
     * @param array $pricesData Array of price details.
     * @return void
     * @throws Exception If required price data is missing.
     */
    private function handlePrices(string $productId, array $pricesData): void
    {
        foreach ($pricesData as $priceData) {
            $priceModel = new PriceController($this->db);

            // Validate price data
            if (isset($priceData['currency']['symbol'], $priceData['amount'])) {
                $data = [
                    'currencyLabel' =>  $priceData['currency']['label'],
                    'currencySymbol' => $priceData['currency']['symbol'],
                    'amount' => $priceData['amount'],
                    'productId' => $productId
                ];

                // Save the price data
                $priceModel->save($data);
            } else {
                // Throw a more descriptive exception if the operation fails
                throw new Exception("Missing currency symbol or amount for product ID $productId");
            }
        }
    }

    /**
     * Process and save product images.
     *
     * @param string $productId The ID of the product in the database.
     * @param array $imagesData Array of image URLs.
     * @return void
     */
    private function handleImages(string $productId, array $imagesData): void
    {
        foreach ($imagesData as $imageUrl) {
            $data = [
                'url' => $imageUrl,
                'productId' => $productId
            ];

            // Save the image data
            $imageModel = new ProductImageController($this->db);
            $imageModel->save($data);
        }
    }

    /**
     * Retrieve product data based on the type.
     *
     * @param mixed $type The type of product data to fetch.
     * @return array Array of product data.
     */
    public function get($type): array
    {
        $product = ProductFactory::create($this->db, $type);

        return $product->get(null);
    }
}
