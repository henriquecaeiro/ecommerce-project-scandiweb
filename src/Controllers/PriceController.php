<?php

namespace App\Controllers;

use App\Models\Price;
use Exception;

/**
 * Class PriceController
 *
 * Handles operations related to managing price data, such as saving price details into the database.
 */
class PriceController extends BaseController
{
    /**
     * Save price data to the database.
     *
     * This method instantiates a `Price` model and saves the provided price details.
     * If an error occurs during the save operation, it is caught and logged.
     *
     * @param array $data An associative array containing the price details:
     * @return int The ID of the saved price record.
     * @throws Exception If the save operation fails and is not handled internally.
     */
    public function save(array $data): int
    {
        try {
            // Create a new Price model instance with the provided data
            $price = new Price($this->db);

            // Save the price data to the database and return the ID
            return $price->save($data);
        } catch (Exception $e) {
            // Log the error and include product ID in the message for better traceability
            echo "Error saving price for product ID {$data['product_id']}: " . $e->getMessage();
        }
    }
}
