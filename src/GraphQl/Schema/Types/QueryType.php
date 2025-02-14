<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Resolvers\CategoryResolver;
use App\Controllers\CategoryController;
use App\Controllers\ProductController;
use App\Controllers\AttributeController;
use App\GraphQL\Resolvers\ProductResolver;
use App\GraphQL\Resolvers\AttributeResolver;
use PDO;

/**
 * Class QueryType
 *
 * Defines the root-level GraphQL queries available in the schema.
 */
class QueryType extends ObjectType
{
    /**
     * @var PDO Database connection instance.
     */
    protected PDO $db;

    /**
     * QueryType constructor.
     *
     * Configures the available query fields and their resolvers.
     *
     * @param mixed $db The database connection instance.
     */
    public function __construct(PDO $db)
    {
        // Instantiate resolvers with their respective controllers
        $categoryResolver = new CategoryResolver(new CategoryController($db));
        $productResolver = new ProductResolver(new ProductController($db));
        $attributeResolver = new AttributeResolver(new AttributeController($db));

        $config = [
            // The name of the query type
            'name' => 'Query',

            // Fields available for querying
            'fields' => [
                // Query to fetch all categories
                'categories' => [
                    // Returns a list of categories
                    'type' => Type::listOf(new CategoryType()),
                    // Resolver to handle the quer
                    'resolve' => [$categoryResolver, 'findAll'],
                ],

                // Query to fetch products by category
                'products' => [
                    // Returns a list of products
                    'type' => Type::listOf(new ProductType()),
                    // Arguments required for this quer
                    'args' => [
                        // The category to filter by (required)
                        'category' => Type::nonNull(Type::string()),

                        // The product ID (optional)
                        'id' => Type::string(),
                    ],
                    // Resolver to handle the query
                    'resolve' => [$productResolver, 'findAll'],
                ],

                // Query to fetch attributes by product ID and type
                'attributes' => [
                    // Returns a list of attributes
                    'type' => Type::listOf(new AttributeType()),
                    // Arguments required for this quer
                    'args' => [
                        // The product ID (required)
                        'product_id' => Type::nonNull(Type::string()),
                        // The attribute type (required)
                        'type' => Type::nonNull(Type::string())
                    ],
                    // Resolver to handle the query
                    'resolve' => [$attributeResolver, 'findByType'],
                ],
            ],
        ];

        // Passes the configuration to the parent constructor
        parent::__construct($config);
    }
}
