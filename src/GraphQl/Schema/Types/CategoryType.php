<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * Class CategoryType
 *
 * Represents the GraphQL type for categories, defining their structure and fields.
 */
class CategoryType extends ObjectType
{
    /**
     * CategoryType constructor.
     *
     * Initializes the GraphQL type for categories with its respective fields.
     */
    public function __construct()
    {
        $config = [
            // The name of this GraphQL type
            'name' => 'Categories',

            // Fields available in this type
            'fields' => [
                // The category id
                'id' => Type::int(),

                // The category name 
                'name' => Type::string(),
            ],
        ];

        // Call the parent constructor with the provided configuration
        parent::__construct($config);
    }
}
