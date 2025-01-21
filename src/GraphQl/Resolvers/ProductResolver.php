<?php

namespace App\GraphQL\Resolvers;

use App\Controllers\ProductController;

/**
 * Class ProductResolver
 *
 * Handles GraphQL queries related to products.
 * Delegates logic to the ProductController to keep the resolver thin and focused.
 */
class ProductResolver
{
    /**
     * @var ProductController The controller responsible for managing product-related operations.
     */
    private ProductController $controller;

    /**
     * ProductController constructor.
     *
     * @param ProductController $controller The controller instance to delegate operations.
     */
    public function __construct(ProductController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * Resolves the GraphQL query for finding products by categoryu.
     *
     * @param mixed $root The root value passed by GraphQL (unused here).
     * @param array $args The arguments provided in the GraphQL query.
     * @return array The resolved attributes as an associative array.
     */
    public function findAll($root, $args): array
    {
        // Extract arguments
        $category = $args['category'];

        // Delegate to the ProductController for logic
        return  $this->controller->get($category);
    }
}
