<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * Class AttributeType
 *
 * Represents the GraphQL type for attributes, defining their structure and fields.
 */
class AttributeType extends ObjectType
{
    /**
     * AttributeType constructor.
     *
     * Initializes the GraphQL type for attributes with its respective fields.
     */
    public function __construct()
    {
        $config = [
            // The name of this GraphQL type
            'name' => 'Attributes',

            // Fields available in this type
            'fields' => [
                // The attribute name
                'name' => Type::string(),

                // The display value of the attribute (human-readable)
                'display_value' => Type::string(),

                // The actual value of the attribute
                'value' => Type::string(),
            ],
        ];
        
        // Call the parent constructor with the provided configuration
        parent::__construct($config);
    }
}
