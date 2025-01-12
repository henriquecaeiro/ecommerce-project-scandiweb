<?php

namespace App\Controllers;

use App\Models\ProductImage;
use Exception;

class ProductImageController extends BaseController
{
    /**
     * Save product images data to the database.
     *
     * @param array $data Data containing images and their associated product IDs.
     * @return void
     */
    public function save(array $data): int
    {
        try {
            $image = new ProductImage($this->db, $data['url'], $data['product_id']);
            return $image->save();
        } catch (Exception $e) {
            echo "Error saving image for product ID {$data['product_id']}: " . $e->getMessage();
        }
    }
}
