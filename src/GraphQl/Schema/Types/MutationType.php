<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Resolvers\OrderResolver;

/**
 * Class MutationType
 *
 * Defines the GraphQL mutation type for handling mutations, such as creating orders.
 */
class MutationType extends ObjectType
{
    /**
     * MutationType constructor.
     *
     * Sets up the GraphQL mutation type with available fields and resolvers.
     */
    public function __construct()
    {
        $config = [
            // The name of this GraphQL type
            'name' => 'Mutation',

            // Fields available for mutations
            'fields' => [
                'createOrder' => [
                    // The return type of the mutation (string for simplicity)
                    'type' => Type::string(),

                    // Arguments required for the mutation
                    'args' => [
                        'items' => [
                            // A list of strings representing the order items
                            'type' => Type::listOf(Type::string()),
                            // Optionally, you could add descriptions to the arguments for clarity
                            'description' => 'List of items to include in the order',
                        ],
                    ],

                    // Resolver function to handle the mutation logic
                    'resolve' => function ($root, $args) {
                        // Delegates the creation of an order to the OrderResolver
                        return OrderResolver::createOrder($args);
                    },
                ],
            ],
        ];

        // Call the parent constructor with the provided configuration
        parent::__construct($config);
    }
}
