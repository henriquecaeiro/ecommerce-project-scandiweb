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
 * It avoids using conditionals like if/switch, relying instead on a mapping array.
 */
class AttributeValueFactory
{
    /**
     * Creates the appropriate AbstractAttributeValue instance according to the provided $type.
     *
     * @param PDO    $db           Database connection instance.
     * @param string $type         The attribute type (e.g., 'text', 'swatch').
     * @param string $value        The actual value of the attribute.
     * @param string $displayValue A human-readable or display-friendly version of the value.
     * @param int    $attributeId  The ID of the attribute to which this value belongs.
     * @param string $productId    The ID of the product associated with this attribute value.
     *
     * @return AbstractAttributeValue Returns an instance of a subclass of AbstractAttributeValue.
     */
    public static function create(
        PDO $db,
        string $type,
        string $value,
        string $displayValue,
        int $attributeId,
        string $productId
    ): AbstractAttributeValue {
        // Map each recognized type to its corresponding class name
        $map = [
            'text'   => TextAttributeValue::class,
            'swatch' => SwatchAttributeValue::class
        ];

        // Use TextAttributeValue as a fallback if the given type is not in the map
        $class = $map[$type] ?? TextAttributeValue::class;

        // Instantiate and return the correct subclass
        return new $class($db, $value, $displayValue, $attributeId, $productId);
    }
}
