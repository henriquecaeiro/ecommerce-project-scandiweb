<?php

namespace App\Models;

/**
 * Class SwatchAttributeValue
 *
 * Returns all attributes with category swatch
 */
class SwatchAttributeValue extends AbstractAttributeValue
{
    public function getAttributeValue(): string
    {
        return 'swatch';
    }
}