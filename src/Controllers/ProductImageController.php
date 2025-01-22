<?php

namespace App\Controllers;

use App\Models\ProductImage;

/**
 * Class ProductImageController
 *
 * Handles operations related to product images, such as saving image data to the database.
 */
class ProductImageController extends BaseController
{
    /**
     * Save product image data to the database.
     *
     * @param array $data Associative array containing:
     * @return int The ID of the saved image record in the database.
     */
    public function save(array $data): int
    {
        try {
            // Create a new ProductImage instance with the provided data
            $image = new ProductImage($this->db);

            // Save the image data and return the ID of the saved record
            return $image->save($data);
        } catch (\Exception $e) {
            // Log the detailed error message for debugging
            error_log("Error saving product image for product id: '{$data['productId']}': " . $e->getMessage());

            // Display a user-friendly message
            echo "Error saving image for product";
            return 0; // Return 0 to indicate failure
        }
    }
}
