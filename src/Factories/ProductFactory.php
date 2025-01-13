<?php

namespace App\Factories;

use PDO;
use App\Models\AbstractProduct;
use App\Models\ClothesProduct;
use App\Models\TechProduct;
use App\Models\AllProduct;

/**
 * Class ProductFactory
 *
 * This factory is responsible for creating instances of ProductFactory
 * (specifically ClothesProduct, TechProduct or AllProduct ) based on the given type.
 * It avoids using conditionals like if/switch, relying instead on a mapping array.
 */
class ProductFactory
{
    /**
     * Creates the appropriate AbstractAttributeValue instance according to the provided $type.
     *
     * @param PDO    $dbConnection Database connection instance.
     * @param array  $productData The product data.
     * @param int    $categoryId the category id of the respective product.
     * @param string $categoryName The name of category.
     *
     * @return AbstractProduct Returns an instance of a subclass of AbstractProduct.
     */
    public static function createProduct(
        PDO $dbConnection,
        array $productData,
        int $categoryId,
        string $categoryName
    ): AbstractProduct {
        // Map each recognized type to its corresponding class name
        $map = [
            'clothes' => ClothesProduct::class,
            'tech'    => TechProduct::class,
            'all'     => AllProduct::class
        ];

        // Use AllProduct as a fallback if the given type is not in the map
        $productClass = $map[$categoryName] ?? AllProduct::class;
        
        // Instantiate and return the correct subclass
        return new $productClass(
            $dbConnection,
            $productData['id'],
            $productData['name'],
            $productData['description'],
            $productData['inStock'] ? 1 : 0,
            $productData['brand'],
            $categoryId
        );
    }
}
