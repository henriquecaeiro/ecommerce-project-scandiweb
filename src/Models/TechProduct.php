<?php

namespace App\Models;

/**
 * Class TechProduct
 *
 * Returns all products with category tech
 */
class TechProduct extends AbstractProduct
{
    public function getProductType(): string
    {
        return 'tech';
    }
}
