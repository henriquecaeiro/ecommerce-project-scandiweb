<?php

require_once __DIR__ . '/../bootstrap.php';

use App\Config\Database;
use App\Services\ImportService;

// Load the database connection
$dbConnection = (new Database($_ENV['DB_HOST'], $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASS']))->connect();

// Load data from the JSON file
$dataFile = __DIR__ . '/../data/data.json';

// Import Data
try {
    $importService = new ImportService($dbConnection);
    $importService->importFromJson($dataFile);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
