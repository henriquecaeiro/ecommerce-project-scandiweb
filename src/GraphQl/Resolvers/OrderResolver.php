<?php

namespace App\GraphQL\Resolvers;

class OrderResolver
{
    public static function createOrder(array $args)
    {
        return "Order created with items: " . implode(', ', $args['items']);
    }
}
