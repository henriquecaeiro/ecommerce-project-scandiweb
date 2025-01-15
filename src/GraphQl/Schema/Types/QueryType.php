<?php 

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Resolvers\CategoryResolver;
use App\GraphQL\Resolvers\ProductResolver;

class QueryType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'Query',
            'fields' => [
                // Exemplo de campo "categories"
                'categories' => [
                    'type' => Type::listOf(Type::string()), 
                    // Em um caso real, você faria Type::listOf(Registry::categoryType()) 
                    'resolve' => function ($root, $args) {
                        return CategoryResolver::findAll();
                    }
                ],
                // Exemplo de campo "products"
                'products' => [
                    'type' => Type::listOf(Type::string()),
                    'resolve' => function ($root, $args) {
                        return ProductResolver::findAll();
                    }
                ],
                // ... e assim por diante
            ],
        ];

        parent::__construct($config);
    }
}