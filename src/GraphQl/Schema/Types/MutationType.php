<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Resolvers\OrderResolver;

class MutationType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => Type::string(), 
                    // Exemplo simplificado
                    'args' => [
                        'items' => [
                            'type' => Type::listOf(Type::string())
                        ]
                    ],
                    'resolve' => function ($root, $args) {
                        return OrderResolver::createOrder($args);
                    }
                ]
            ],
        ];

        parent::__construct($config);
    }
}
