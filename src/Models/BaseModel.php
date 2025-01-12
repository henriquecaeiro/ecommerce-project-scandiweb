<?php

namespace App\Models;

use App\Contracts\ModelInterface;
use PDO;

/**
 * Class BaseModel
 *
 * Provides common functionality for all models in the system.
 */
abstract class BaseModel implements ModelInterface
{
    /** @var PDO Database connection instance. */
    protected PDO $db;

    /**
     * BaseModel constructor.
     *
     * @param PDO $dbConnection Database connection instance.
     */
    public function __construct(PDO $dbConnection)
    {
        $this->db = $dbConnection;
    }
}
