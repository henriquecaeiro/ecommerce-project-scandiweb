<?php

namespace App\Factories;

use PDO;
use App\Models\Order;
use App\Models\OrderItems;
use App\Models\OrderItemAttributeValues;

/**
 * Class OrderFactory
 *
 * Factory responsible for creating instances related to orders based on the presence of attributes.
 */
class OrderFactory
{
    /**
     * Creates instances related to orders based on input data.
     *
     * @param PDO $db Database connection instance.
     * @param array $data Data for deciding which models to create.
     *
     * @return array An array of created instances.
     */
    public static function create(PDO $db, array $data): array
    {
        $instances = [];

        // Always create instances for Order and OrderItems
        $instances[] = new Order($db);
        $instances[] = new OrderItems($db);

        // Check and create instances for attributes if present
        if (!empty($data['attribute_value_id'])) {
            foreach ($data['attribute_value_id'] as $attribute) {
                $instances[] = new OrderItemAttributeValues($db);
            }
        }

        return $instances;
    }
}

