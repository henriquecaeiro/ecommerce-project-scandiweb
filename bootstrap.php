<?php 

/**
 * Autoload dependencies and bootstrap the application.
 */

require_once __DIR__ . "/vendor/autoload.php";

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();