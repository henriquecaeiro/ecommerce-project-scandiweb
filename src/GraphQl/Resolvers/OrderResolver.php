<?php

namespace App\GraphQL\Resolvers;

class OrderResolver
{
    public static function createOrder(array $args)
    {
        // Lógica para criar um pedido (order)
        // Aqui você chamaria suas Models, Factories etc.
        // Exemplo retornando uma string:
        return "Order created with items: " . implode(', ', $args['items']);
    }
}
