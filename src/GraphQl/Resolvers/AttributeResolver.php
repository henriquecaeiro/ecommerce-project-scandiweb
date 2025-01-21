<?php

namespace App\GraphQL\Resolvers;

use App\Controllers\AttributeController;

/**
 * Class AttributeResolver
 *
 * Handles GraphQL queries related to attributes.
 * Delegates logic to the AttributeController to keep the resolver thin and focused.
 */
class AttributeResolver
{
    /**
     * @var AttributeController The controller responsible for managing attribute-related operations.
     */
    private AttributeController $controller;

    /**
     * AttributeResolver constructor.
     *
     * @param AttributeController $controller The controller instance to delegate operations.
     */
    public function __construct(AttributeController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * Resolves the GraphQL query for finding attributes by type.
     *
     * @param mixed $root The root value passed by GraphQL (unused here).
     * @param array $args The arguments provided in the GraphQL query.
     * @return array The resolved attributes as an associative array.
     */
    public function findByType($root, $args): array
    {
        // Extract arguments
        $productId = $args['product_id'];
        $type = $args['type'];

        // Delegate to the AttributeController for logic
        return $this->controller->getAttributeValue($productId, $type);
    }
}
