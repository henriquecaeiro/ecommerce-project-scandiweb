<?php

namespace App\Models;

/**
 * Class TextAttributeValue
 *
 * Returns all attributes with category text
 */
class TextAttributeValue extends AbstractAttributeValue
{
    public function getAttributeValue(): string
    {
        return 'text';
    }
}