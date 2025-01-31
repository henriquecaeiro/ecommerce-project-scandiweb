<?php

namespace App\GraphQL\Schema\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

/**
 * Class ProductType
 *
 * Defines the GraphQL type for products.
 * Represents the structure of the data returned for a product in the GraphQL schema.
 */
class ProductType extends ObjectType
{
    /**
     * ProductType constructor.
     *
     * Configures the fields available in the Product GraphQL type.
     */
    public function __construct()
    {
        $config = [
            // The name of the GraphQL type
            'name' => 'Products',

            // The fields available in this type
            'fields' => [
                // The unique identifier of the product
                'id' => Type::string(),

                // The name of the product
                'name' => Type::string(),

                // Indicates whether the product is in stock (1) or out of stock (0)
                'in_stock' => Type::int(),

                // The description of the product
                'description' => Type::string(),

                // The URL for the product's image
                'image_url' => [
                    'type' => Type::listOf(Type::string()),
                    'resolve' => function ($product, $args, $context, $info) {
                        // Check if images are already in array form
                        if (is_array($product['image_url'])) {
                            return $product['image_url'];
                        }

                        // If not, wrap the single image string in an array
                        return [$product['image_url']];
                    }
                ],

                // The brand associated with the product
                'brand' => Type::string(),

                // The name of the category to which the product belongs
                'category_name' => Type::string(),

                // The price of the product as a floating-point number
                'price_amount' => Type::float(),

                // The label of the currency used for the price (e.g., "USD")
                'currency_label' => Type::string(),

                // The symbol of the currency used for the price (e.g., "$")
                'currency_symbol' => Type::string(),
            ],
        ];

        // Passes the configuration to the parent ObjectType constructor
        parent::__construct($config);
    }
}
