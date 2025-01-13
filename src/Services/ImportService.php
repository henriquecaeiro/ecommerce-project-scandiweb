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
    /** @var PDO */
    private PDO $dbConnection;

    /** @var CategoryController */
    private CategoryController $categoryController;

    /** @var ProductController */
    private ProductController $productController;

    /** @var AttributeController */
    private AttributeController $attributeController;

    /**
     * ImportService constructor.
     *
     * @param PDO $dbConnection Conexão com o banco de dados.
     */
    public function __construct(PDO $dbConnection)
    {
        $this->dbConnection          = $dbConnection;
        $this->categoryController    = new CategoryController($dbConnection);
        $this->productController     = new ProductController($dbConnection);
        $this->attributeController   = new AttributeController($dbConnection);
    }

    /**
     * Imports data into the system from a JSON file.
     *
     * @param string $filePath Path of the file that will be used.
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
            // 1) Importar categorias
            $categoryIds = $this->categoryController->importCategories($dataArray['data']['categories']);

            // 2) Preparar e importar produtos
            $data = [
                'productsData' => $dataArray['data']['products'],
                'categoryIds'  => $categoryIds,
            ];
            $productIds = $this->productController->save($data);

            // 3) Preparar e importar atributos (e valores de atributo, caso sua lógica inclua)
            $data = [
                'productsData' => $dataArray['data']['products'],
                'productsIds'  => $productIds,
            ];
            // Chama o método que cria os atributos (e seus values) em duas etapas.
            $this->attributeController->save($data);

            echo "Importação concluída com sucesso!";
        } catch (\Exception $e) {
            // Se for duplicidade (1062), paramos a execução
            if ($e->getCode() === 1062 || $e->getMessage() === "The database was already imported") {
                echo $e->getMessage();
                exit; // interrompe completamente
            }
        
            // Outros erros genéricos
            echo "Error during import: " . $e->getMessage();
        }
    }
}
