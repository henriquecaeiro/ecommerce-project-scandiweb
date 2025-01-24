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
     * @param array $data The data to be saved.
     * @return mixed The result of the save operation.
     */
    public function save(array $data): mixed;
}
