<?php

require_once __DIR__ . '/../bootstrap.php';

use App\Services\ImportService;

// Load data from the JSON file
$dataFile = __DIR__ . '/../data/data.json';

try {
    // Create an instance of ImportService with the database connection
    $importService = new ImportService($dbConnection);

    // Start the import process using the JSON file
    $importService->importFromJson($dataFile);
} catch (Exception $e) {
    // Handle and display errors during the import process
    echo "Error: " . $e->getMessage();
}
