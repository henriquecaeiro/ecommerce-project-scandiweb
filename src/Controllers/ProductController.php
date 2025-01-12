<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Price;
use App\Models\ProductImage;
use Exception;

class ProductController extends BaseController
{
    /**
     * Save products data to the database.
     *
     * @param array $data Data containing products and category mappings.
     * @return mixed
     */
    public function save(array $data): mixed
    {
        $productsData = $data['productsData'] ?? [];
        $categoryIds = $data['categoryIds'] ?? [];

        foreach ($productsData as $productData) {
            try {
                $categoryId = $categoryIds[$productData['category']] ?? null;

                if (!$categoryId) {
                    throw new Exception("Category not found for product '{$productData['name']}'");
                }

                $inStock = $productData['inStock'] ? 1 : 0;
                $product = new Product(
                    $this->db,
                    $productData['id'],
                    $productData['name'],
                    $productData['description'],
                    $inStock,
                    $productData['brand'],
                    $categoryId
                );
                $productId = $product->save();

                $this->handleAttributes($productId, $productData['attributes'] ?? []);
                $this->handlePrices($productId, $productData['prices'] ?? []);
                $this->handleImages($productId, $productData['gallery'] ?? []);
            } catch (Exception $e) {
                echo "Error saving product '{$productData['name']}': " . $e->getMessage();
            }
        }

        return null;
    }

    /**
     * Handle product attributes.
     *
     * @param string $productId ID of the product.
     * @param array $attributesData Attributes data to process.
     * @return void
     */
    private function handleAttributes(string $productId, array $attributesData): void
    {
        foreach ($attributesData as $attributeData) {
            $attributeModel = new Attribute($this->db, $attributeData['name'], $attributeData['type'], $productId);
            $attributeId = $attributeModel->save();

            foreach ($attributeData['items'] as $attributeValueData) {
                $attributeValueModel = new AttributeValue($this->db, $attributeValueData['value'], $attributeValueData['displayValue'], $attributeId);
                $attributeValueModel->save();
            }
        }
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
            $priceModel = new Price($this->db, $priceData['currency']['symbol'], $priceData['amount'], $productId);
            if (isset($priceData['currency']['symbol'], $priceData['amount'])) {
                $priceModel->save();
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
            $imageModel = new ProductImage($this->db, $imageUrl, $productId);
            $imageModel->save();
        }
    }
}
