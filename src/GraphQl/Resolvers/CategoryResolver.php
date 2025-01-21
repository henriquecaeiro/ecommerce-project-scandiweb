<?php

namespace App\GraphQL\Resolvers;

use App\Controllers\CategoryController;

/**
 * Class CategoryResolver
 *
 * Handles GraphQL queries related to categories.
 * Delegates logic to the CategoryController to keep the resolver thin and focused.
 */
class CategoryResolver
{
    /**
     * @var CategoryController The controller responsible for managing category-related operations.
     */
    private CategoryController $controller;

    /**
     * CategoryController constructor.
     *
     * @param CategoryController $controller The controller instance to delegate operations.
     */
    public function __construct(CategoryController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * Resolves the GraphQL query for finding category.
     * @return array The resolved category as an associative array.
     */
    public function findAll(): array
    {
        // Delegate to the CategoryController for logic
        return $this->controller->get(null);
    }
}
