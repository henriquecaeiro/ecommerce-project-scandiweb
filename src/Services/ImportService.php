<?php

namespace App\Services;

use PDO;
use App\Controllers\CategoryController;
use App\Controllers\ProductController;
use Exception;

/**
 * Class ImportService
 *
 * Handles the import of data from external sources into the system.
 */
class ImportService
{
    /** @var PDO Controller for handling category operations. */
    private PDO $dbConnection;

    /** @var CategoryController Controller for handling category operations. */
    private CategoryController $categoryController;

    /** @var ProductController Controller for handling category operations. */
    private ProductController $productController;

    /**
     * ImportService constructor.
     *
     * @param CategoryController $categoryController Controller for category operations.
     * @param ProductController $productController Controller for product operations.
     */
    public function __construct($dbConnection)
    {
        $this->dbConnection = $dbConnection;
        $this->categoryController = new CategoryController($dbConnection);
        $this->productController = new ProductController($dbConnection);
    }

    /**
     * Imports data into the system.
     *
     * @param string $filePath Path of the file that will be used
     * @return void
     * @throws Exception If an error occurs during import.
     */
    public function importFromJson(string $filePath): void
    {
        if (!file_exists($filePath)) {
            throw new Exception("File not found: {$filePath}");
        }

        $jsonData = file_get_contents($filePath);
        $dataArray = json_decode($jsonData, true);

        if ($dataArray === null) {
            throw new Exception("Error decoding JSON.");
        }

        try {
            // Import categories
            $categoryIds = $this->categoryController->importCategories($dataArray['data']['categories']);

            $data = [
                'productsData' => $dataArray['data']['products'],
                'categoryIds' => $categoryIds,
            ];

            // Import products
            $this->productController->save($data);

            echo "Importação concluída com sucesso!";
        } catch (Exception $e) {
            echo "Error during import: " . $e->getMessage();
        }
    }
}
