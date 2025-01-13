<?php

namespace App\Controllers;

use App\Factories\ProductFactory;
use Exception;

class ProductController extends BaseController
{
    /**
     * Save products data to the database.
     *
     * @param array $data Data containing products and category mappings.
     * @return mixed
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
                    throw new Exception("Category not found for product '{$productData['name']}'");
                }

                $product = ProductFactory::createProduct(
                    $this->db,
                    $productData,
                    $categoryId,
                    $productData['category']
                );

                $productId = $product->save();
                $productIds[$productData['id']] = $productId;

                //$this->handleAttributes($productId, $productData['attributes'] ?? []);
                $this->handlePrices($productId, $productData['prices'] ?? []);
                $this->handleImages($productId, $productData['gallery'] ?? []);
            } catch (Exception $e) {
                echo "Error saving product '{$productData['name']}': " . $e->getMessage() . "<br>";
            }
        }

        return $productIds;
    }

    /**
     * Handle product prices.
     *
     * @param string $productId ID of the product.
     * @param array $pricesData Prices data to process.
     * @return void
     */
    private function handlePrices(string $productId, array $pricesData): void
    {
        foreach ($pricesData as $priceData) {
            $priceModel = new PriceController($this->db);
            if (isset($priceData['currency']['symbol'], $priceData['amount'])) {
                $data = [
                    'currencyLabel' =>  $priceData['currency']['label'],
                    'currencySymbol' => $priceData['currency']['symbol'],
                    'amount' => $priceData['amount'],
                    'productId' => $productId
                ];
                $priceModel->save($data);
            } else {
                throw new Exception("Missing currency symbol or amount for product ID $productId");
            }
        }
    }

    /**
     * Handle product images.
     *
     * @param string $productId ID of the product.
     * @param array $imagesData Images data to process.
     * @return void
     */
    private function handleImages(string $productId, array $imagesData): void
    {
        foreach ($imagesData as $imageUrl) {
            $data = [
                'url' => $imageUrl,
                'productId' => $productId
            ];
            $imageModel = new ProductImageController($this->db);
            $imageModel->save($data);
        }
    }
}
