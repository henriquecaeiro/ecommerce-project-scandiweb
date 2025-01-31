<?php

namespace App\Controllers;

/**
 * Class QueryableController
 *
 * Provides a base structure for controllers that need to fetch records from the database.
 * Subclasses must implement the `get` method, defining the specific logic for fetching data.
 */
abstract class QueryableController extends BaseController
{
    /**
     * Retrieve one or multiple records from the database.
     *
     * Subclasses must implement this method to define the retrieval logic.
     *
     * @param mixed $param The parameter(s) used for querying records. 
     * @return array The fetched records as an associative array.
     */
    abstract public function get(mixed $data): array;
}
