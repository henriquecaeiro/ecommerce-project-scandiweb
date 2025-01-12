<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;

try {
    $connection = (new Database($_ENV['DB_HOST'], $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASS']))->connect();
    echo "Conexão bem-sucedida ao banco de dados!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}