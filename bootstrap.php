<?php

/**
 * Autoload dependencies and bootstrap the application.
 */

require_once __DIR__ . "/vendor/autoload.php";

use Dotenv\Dotenv as EnvLoader;
use App\Config\Database;

// Load environment variables
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $dotenv = EnvLoader::createImmutable(__DIR__);
    $dotenv->load();
}

// Load the database connection
try {
    $dbConnection = (new Database(
        $_ENV['DB_HOST'] ?? '', 
        $_ENV['DB_NAME'] ?? '', 
        $_ENV['DB_USER'] ?? '', 
        $_ENV['DB_PASS'] ?? '',
        $_ENV['DB_PORT'] ?? '3306'
    ))->connect();
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}
