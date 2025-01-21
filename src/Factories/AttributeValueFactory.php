<?php

namespace App\Factories;

use PDO;
use App\Models\AbstractAttributeValue;
use App\Models\TextAttributeValue;
use App\Models\SwatchAttributeValue;

/**
 * Class AttributeValueFactory
 *
 * This factory is responsible for creating instances of AbstractAttributeValue
 * (specifically TextAttributeValue or SwatchAttributeValue) based on the given type.
 */
class AttributeValueFactory
{
    /**
     * Creates the appropriate AbstractAttributeValue instance according to the provided $type.
     *
     * @param PDO    $db           Database connection instance.
     * @param string $type         The attribute type .
     *
     * @return AbstractAttributeValue Returns an instance of a subclass of AbstractAttributeValue.
     */
    public static function create(
        PDO $db,
        string $type
    ): AbstractAttributeValue {
        // Map each recognized type to its corresponding class name
        $map = [
            'text'   => TextAttributeValue::class,
            'swatch' => SwatchAttributeValue::class
        ];

        // Use TextAttributeValue as a fallback if the given type is not in the map
        $class = $map[$type] ?? TextAttributeValue::class;

        // Instantiate and return the correct subclass
        return new $class($db);
    }
}
