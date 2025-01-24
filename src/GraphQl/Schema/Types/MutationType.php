<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Resolvers\OrderResolver;
use App\Controllers\OrderController;
use PDO;

/**
 * Class MutationType
 *
 * Defines the GraphQL mutation type for handling mutations, such as creating orders.
 */
class MutationType extends ObjectType
{
    /**
     * @var PDO Database connection instance.
     */
    protected PDO $db;

    /**
     * MutationType constructor.
     *
     * Configures the available mutation fields and their resolvers.
     *
     * @param PDO $db The database connection instance.
     */
    public function __construct(PDO $db)
    {
        $orderResolver = new OrderResolver(new OrderController($db));

        // Configuration for the mutation type
        $config = [
            'name' => 'Mutation',
            'fields' => [
                'order' => [
                    'type' => Type::string(),
                    'args' => [
                        'orderData' => [
                            'type' => Type::nonNull(new OrderInputType()), 
                        ],
                    ],
                    'resolve' => [$orderResolver, 'createOrder'],
                ],
            ],
        ];

        // Call the parent constructor with the provided configuration
        parent::__construct($config);
    }
}
