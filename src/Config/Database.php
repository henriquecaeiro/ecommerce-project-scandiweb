<?php

namespace App\Config;

use PDO;
use PDOException;

/**
 * Class Database
 *
 * Provides a database connection instance.
 */
class Database
{
    /**
     * @var string Database host.
     */
    private string $host;

    /**
     * @var string Database name.
     */
    private string $dbname;

    /**
     * @var string Database username.
     */
    private string $username;

    /**
     * @var string Database password.
     */
    private string $password;

    /**
     * Database constructor.
     *
     * @param string $host Database host.
     * @param string $dbname Database name.
     * @param string $username Database username.
     * @param string $password Database password.
     */
    public function __construct(string $host, string $dbname, string $username, string $password)
    {
        $this->host = $host;
        $this->dbname = $dbname;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Establish a database connection.
     *
     * @return PDO The database connection instance.
     * @throws PDOException If the connection fails.
     */
    public function connect(): PDO
    {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            return new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            throw new PDOException("Database connection failed: " . $e->getMessage());
        }
    }
}
