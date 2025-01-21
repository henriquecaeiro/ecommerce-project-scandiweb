<?php

/**
 * Autoload dependencies and bootstrap the application.
 */

require_once __DIR__ . "/vendor/autoload.php";

use Dotenv\Dotenv;
use App\Config\Database;
// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Load the database connection
try {
    $dbConnection = (new Database(
        $_ENV['DB_HOST'],
        $_ENV['DB_NAME'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASS']
    ))->connect();
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}