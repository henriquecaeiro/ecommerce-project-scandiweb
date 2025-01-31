<?php

namespace App\Controllers;

use PDO;
use App\Factories\ProductFactory;
use RuntimeException;
use Exception;

/**
 * Class ProductController
 *
 * Handles operations related to managing products, including saving, retrieving,
 * and associating additional data like prices and images.
 */
class ProductController extends QueryableController
{
    /** @var PDO The database connection instance. */
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
     * @param array $data Associative array containing products and category mappings.
     * @return array Array mapping product client IDs to database IDs.
     * @throws RuntimeException If a critical error occurs during saving.
     */
    public function save(array $data): array
    {
        $productsData = $data['productsData'] ?? [];
        $categoryIds = $data['categoryIds'] ?? [];
        $productIds = [];

        foreach ($productsData as $productData) {
            try {
                $categoryId = $categoryIds[$productData['category']] ?? null;

                if (!$categoryId) {
                    throw new RuntimeException("Category not found for product '{$productData['name']}'");
                }

                $product = ProductFactory::create($this->db, $productData['category']);

                $productDataFormatted = [
                    'productId' => $productData['id'],
                    'name' => $productData['name'],
                    'description' => $productData['description'],
                    'inStock' => $productData['inStock'] ? 1 : 0,
                    'brand' => $productData['brand'],
                    'categoryId' => $categoryId,
                ];

                $productId = $product->save($productDataFormatted);
                $productIds[$productData['id']] = $productId;

                $this->handlePrices($productId, $productData['prices'] ?? []);
                $this->handleImages($productId, $productData['gallery'] ?? []);
            } catch (RuntimeException $e) {
                error_log("Runtime error saving product '{$productData['id']}': " . $e->getMessage());
                throw $e;
            } catch (Exception $e) {
                error_log("Unexpected error saving product '{$productData['id']}': " . $e->getMessage());
                throw new RuntimeException("An unexpected error occurred while saving product '{$productData['id']}'.");
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
     * @throws RuntimeException If required price data is missing.
     */
    private function handlePrices(string $productId, array $pricesData): void
    {
        foreach ($pricesData as $priceData) {
            if (empty($priceData['currency']['symbol']) || empty($priceData['amount'])) {
                throw new RuntimeException("Missing currency symbol or amount for product ID $productId");
            }

            $priceModel = new PriceController($this->db);

            $priceDataFormatted = [
                'currencyLabel' => $priceData['currency']['label'],
                'currencySymbol' => $priceData['currency']['symbol'],
                'amount' => $priceData['amount'],
                'productId' => $productId,
            ];

            $priceModel->save($priceDataFormatted);
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
            $imageModel = new ProductImageController($this->db);

            $imageData = [
                'url' => $imageUrl,
                'productId' => $productId,
            ];

            $imageModel->save($imageData);
        }
    }

    /**
     * Retrieve product data based on the type.
     *
     * @param mixed $type The type of product data to fetch.
     * @return array Array of product data.
     */
    public function get(mixed $data): array
    {
        $product = ProductFactory::create($this->db, $data["type"]);

        return $product->get($data["id"]);
    }
}
