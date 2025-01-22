<?php

namespace App\Controllers;

use App\Models\Price;

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
        } catch (\Exception $e) {
            // Log the detailed error message for debugging
            error_log("Error saving price with product id: '{$data['productId']}': " . $e->getMessage());
        
            // Display a user-friendly message
            echo "An error occurred while saving the price. Please contact the admin.";
        }
    }
}
