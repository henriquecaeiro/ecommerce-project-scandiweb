<?php

namespace App\Models;

use App\Contracts\ModelInterface;
use PDO;

/**
 * Class BaseModel
 *
 * Serves as the base class for all models in the system, providing shared functionality
 * such as access to the database connection.
 */
abstract class BaseModel implements ModelInterface
{
    /** 
     * @var PDO Database connection instance.
     * Shared database connection for all models extending this class.
     */
    protected PDO $db;

    /**
     * BaseModel constructor.
     *
     * Initializes the model with a database connection instance.
     * This allows all child models to perform database operations.
     *
     * @param PDO $dbConnection Database connection instance.
     */
    public function __construct(PDO $dbConnection)
    {
        $this->db = $dbConnection;
    }
}
