<?php

namespace App\Contracts;

/**
 * Interface ModelInterface
 *
 * Defines the contract for all models in the application.
 */
interface ModelInterface
{
    /**
     * Save the entity to the database.
     *
     * @return mixed The result of the save operation (e.g., ID of the saved record).
     */
    public function save(): mixed;
}
