<?php

namespace App\Contracts;

/**
 * Interface ControllerInterface
 *
 * Defines the contract for all controllers in the application.
 */
interface ControllerInterface
{
    /**
     * Save data to the database.
     *
     * @param array $data The data to be saved.
     * @return mixed The result of the save operation.
     */
    public function save(array $data): mixed;
}
