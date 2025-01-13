<?php

namespace App\Models;

/**
 * Class AllProduct
 *
 * Returns all products with category all
 */
class AllProduct extends AbstractProduct
{
    public function getProductType(): string
    {
        return 'all';
    }
}
