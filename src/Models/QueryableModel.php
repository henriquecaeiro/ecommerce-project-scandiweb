<?php

namespace App\Models;

/**
 * Class QueryableModel
 *
 * Provides a base structure for models that can perform queries.
 * This abstract class enforces implementation of a `get` method in derived classes
 * and provides a default implementation for `save`, which can be overridden as needed.
 */
abstract class QueryableModel extends BaseModel
{
    /**
     * Abstract method for fetching data.
     * 
     * This method must be implemented by derived classes to handle specific query logic.
     *
     * @param mixed $data The parameter(s) used for the query, such as an ID or filters.
     * @return array The result of the query as an associative array.
     */
    abstract public function get(mixed $data): array;

    /**
     * Default implementation of the save method.
     *
     * Throws a `BadMethodCallException` to indicate that this method has not been implemented.
     * Derived classes can override this method to provide custom save functionality.
     *
     * @param mixed $data The data to be saved.
     * @return mixed Throws an exception unless overridden in a derived class.
     * @throws \BadMethodCallException If the method is not implemented in the derived class.
     */
    public function save($data): mixed
    {
        throw new \BadMethodCallException("Method 'save' not implemented in " . static::class);
    }
}
