<?php

namespace App\GraphQL\Resolvers;

class ProductResolver
{
    public static function findAll(): array
    {
        // Exemplo de retorno estático para teste
        return ['Electronics', 'Clothing', 'Books'];
    }
}
