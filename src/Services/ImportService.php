<?php

namespace App\Services;

use PDO;
use App\Controllers\CategoryController;
use App\Controllers\ProductController;
use App\Controllers\AttributeController;
use Exception;

/**
 * Class ImportService
 *
 * Handles the import of data from external sources into the system.
 */
class ImportService
{
    /** @var PDO Database connection instance. */
    public PDO $dbConnection;

    /** @var CategoryController Handles operations related to categories. */
    private CategoryController $categoryController;

    /** @var ProductController Handles operations related to products. */
    private ProductController $productController;

    /** @var AttributeController Handles operations related to attributes. */
    private AttributeController $attributeController;

    /**
     * ImportService constructor.
     *
     * Initializes the service with the database connection and controllers.
     *
     * @param PDO $dbConnection The database connection.
     */
    public function __construct(PDO $dbConnection)
    {
        $this->dbConnection = $dbConnection;
        $this->categoryController = new CategoryController($dbConnection);
        $this->productController = new ProductController($dbConnection);
        $this->attributeController = new AttributeController($dbConnection);
    }

    /**
     * Imports data into the system from a JSON file.
     *
     * The method handles importing categories, products, and their respective attributes and values.
     *
     * @param string $filePath Path to the JSON file containing import data.
     * @return void
     * @throws Exception If the file is not found or JSON decoding fails.
     */
    public function importFromJson(string $filePath): void
    {
        // Check if the file exists
        if (!file_exists($filePath)) {
            throw new Exception("File not found: {$filePath}");
        }

        // Decode the JSON data
        $jsonData = file_get_contents($filePath);
        $dataArray = json_decode($jsonData, true);

        if ($dataArray === null) {
            throw new Exception("Error decoding JSON.");
        }

        try {
            //Import categories and retrieve their IDs
            $categoryIds = $this->categoryController->importCategories($dataArray['data']['categories']);

            //Prepare and import products
            $productData = [
                'productsData' => $dataArray['data']['products'],
                'categoryIds'  => $categoryIds,
            ];
            $productIds = $this->productController->save($productData);

            //Prepare and import attributes and their values
            $attributeData = [
                'productsData' => $dataArray['data']['products'],
                'productsIds'  => $productIds,
            ];
            $this->attributeController->save($attributeData);

            // Import completed successfully
            echo "Import completed successfully!";
        } catch (\Exception $e) {
            // Handle duplicate entry errors (1062) or specific exceptions
            if ($e->getCode() === 1062 || $e->getMessage() === "The database was already imported") {
                echo $e->getMessage();
                exit;
            }

            // Handle generic errors
            echo "Error during import: " . $e->getMessage();
        }
    }
}
