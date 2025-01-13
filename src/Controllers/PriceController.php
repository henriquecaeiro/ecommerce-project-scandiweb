<?php

namespace App\Controllers;

use App\Models\Price;
use Exception;

class PriceController extends BaseController
{
    /**
     * Save prices data to the database.
     *
     * @param array $data Data containing prices and their details.
     * @return int
     */
    public function save(array $data): int
    {
        try {
            $price = new Price($this->db, $data['currencyLabel'], $data['currencySymbol'], $data['amount'], $data['productId']);
            return $price->save();
        } catch (Exception $e) {
            echo "Error saving price for product ID {$data['product_id']}: " . $e->getMessage();
        }
    }
}
