<?php

namespace App\Controllers;

use App\Contracts\ControllerInterface;
use PDO;

/**
 * BaseController is an abstract class that provides common functionality for all controllers.
 */
abstract class BaseController implements ControllerInterface
{
    /**
     * @var PDO Database connection instance.
     */
    protected PDO $db;

    /**
     * BaseController constructor.
     *
     * @param PDO $dbConnection Database connection instance.
     */
    public function __construct(PDO $dbConnection)
    {
        $this->db = $dbConnection;
    }
}
