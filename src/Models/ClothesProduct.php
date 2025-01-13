<?php

namespace App\Models;

/**
 * Class ClothesProduct
 *
 * Returns all products with category clothes
 */
class ClothesProduct extends AbstractProduct
{
    public function getProductType(): string
    {
        return 'clothes';
    }
}
