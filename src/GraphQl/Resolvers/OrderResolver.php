<?php

namespace App\GraphQL\Resolvers;

use App\Controllers\OrderController;

/**
 * Class OrderResolver
 *
 * Handles GraphQL mutation related to orders.
 * Delegates logic to the OrderController to keep the resolver thin and focused.
 */
class OrderResolver
{
    /**
     * @var OrderController The controller responsible for managing order-related operations.
     */
    private OrderController $controller;

    /**
     * OrderResolver constructor.
     *
     * @param OrderController $controller The controller instance to delegate operations.
     */
    public function __construct(OrderController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * Resolves the GraphQL mutation for finding attributes by type.
     *
     * @param mixed $root The root value passed by GraphQL (unused here).
     * @param array $args The arguments provided in the GraphQL mutation.
     * @return array The resolved attributes as an associative array.
     */
    public function createOrder(mixed $root, array $args): string
    {
        try {
            // Call the controller to save the order
            return $this->controller->save($args['orderData']);
        } catch (\Exception $e) {
            // Log the error and return a failure message
            error_log("Error creating order: " . $e->getMessage());
            return 'Failed to create order: ' . $e->getMessage();
        }
    }
    
}
