<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

/**
 * Class OrderInputType
 *
 * Defines the GraphQL input type for order creation.
 * Represents the structure of the input data for creating an order.
 */
class OrderInputType extends InputObjectType
{
    /**
     * OrderInputType constructor.
     *
     * Configures the fields available in the Order input type.
     */
    public function __construct()
    {
        $config = [
            // The name of the GraphQL type
            'name' => 'OrderInput',

            // The fields available in this type
            'fields' => [
                //The total amount of the order.
                'total_amount' => Type::float(),

                //The ID of the product.
                'product_id' => Type::string(),

                //The quantity of the product.
                'quantity' => Type::int(),

                //The unit price of the product.
                'amount' => Type::float(),

                //IDs of the attribute values associated with the product.
                'attribute_value_id' => Type::listOf(Type::int()),
            ],
        ];

        // Passes the configuration to the parent InputObjectType constructor
        parent::__construct($config);
    }
}
