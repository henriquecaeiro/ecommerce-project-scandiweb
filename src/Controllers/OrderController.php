<?php

namespace App\Controllers;

use App\Factories\OrderFactory;
use App\Models\Order;
use App\Models\OrderItems;
use App\Models\OrderItemAttributeValues;
use RuntimeException;
use InvalidArgumentException;
use Exception;

/**
 * Class OrderController
 *
 * Handles operations related to orders and their associated models.
 */
class OrderController extends BaseController
{
    /**
     * Save orders and their respective values to the database.
     *
     * @param array $data An array containing the orders data and their IDs.
     * @return string Returns a success or error message.
     * @throws RuntimeException If an error occurs during saving.
     */
    public function save(array $data): string
    {
        try {
            // Create model instances using the factory
            $instances = OrderFactory::create($this->db, $data);
    
            // Variables to store the IDs
            $orderId = null;
            $orderItemsId = null;
    
            // First loop: Process Order and OrderItems
            foreach ($instances as $instance) {
                if ($instance instanceof Order) {
                    // Save the order and get its ID
                    $orderId = $this->saveInstance($instance, $data);
    
                    if ($orderId === 'error') {
                        throw new RuntimeException("Failed to save Order.");
                    }
    
                    $data['order_id'] = $orderId;
                }
    
                if ($instance instanceof OrderItems) {
                    if (!isset($data['order_id'])) {
                        throw new RuntimeException("Order ID is missing. Order must be saved first.");
                    }
    
                    // Save the order item and get its ID
                    $orderItemsId = $this->saveInstance($instance, $data);
    
                    if ($orderItemsId === 'error') {
                        throw new RuntimeException("Failed to save OrderItems.");
                    }
    
                    $data['order_item_id'] = $orderItemsId;
                }
            }
    
            // Process only the instances of OrderItemAttributeValues
            $attributeInstance = null;
            foreach ($instances as $instance) {
                if ($instance instanceof OrderItemAttributeValues) {
                    $attributeInstance = $instance;
                    break; // Find the first instance and exit the loop
                }
            }
    
            // Save attributes only once per value
            if ($attributeInstance) {
                foreach ($data['attribute_value_id'] as $attribute) {
                    $attributeData = [
                        'order_item_id' => $data['order_item_id'],
                        'attribute_value_id' => $attribute,
                    ];
    
                    $attributeValueId = $this->saveInstance($attributeInstance, $attributeData);
    
                    if ($attributeValueId === 'error') {
                        throw new RuntimeException("Failed to save OrderItemAttributeValues.");
                    }
                }
            }
    
            return "Order and related data saved successfully.";
        } catch (Exception $e) {
            // Log the error and return a user-friendly message
            error_log("Error saving order: " . $e->getMessage());
            return "An error occurred while saving the order: " . $e->getMessage();
        }
    }
    

    /**
     * Saves an instance of a model with the provided data.
     *
     * @param object $model The model instance.
     * @param array $data The raw data.
     * @return string The saved ID or 'error' on failure.
     * @throws InvalidArgumentException If required fields are missing.
     */
    private function saveInstance(object $model, array $data): string
    {
        if ($model instanceof Order) {
            if (!isset($data['total_amount'])) {
                throw new InvalidArgumentException("The 'total_amount' field is required for saving the Order.");
            }

            $orderData = ['totalAmount' => $data['total_amount']];
            return $model->save($orderData) ?: 'error';
        }

        if ($model instanceof OrderItems) {
            if (!isset($data['order_id'], $data['product_id'], $data['quantity'], $data['amount'])) {
                throw new InvalidArgumentException("The fields 'order_id', 'product_id', 'quantity', and 'amount' are required for saving Order Items.");
            }

            $orderItemsData = [
                'orderId' => $data['order_id'],
                'productId' => $data['product_id'],
                'quantity' => $data['quantity'],
                'amount' => $data['amount'],
            ];

            return $model->save($orderItemsData) ?: 'error';
        }

        if ($model instanceof OrderItemAttributeValues) {
            if (!isset($data['order_item_id'], $data['attribute_value_id'])) {
                throw new InvalidArgumentException("The fields 'order_item_id' and 'attribute_value_id' are required for saving Order Item Attributes.");
            }

            $orderAttributeData = [
                'orderItemAttributeValue' => $data['order_item_id'],
                'attributeValueId' => $data['attribute_value_id'],
            ];

            return $model->save($orderAttributeData) ?: 'error';
        }

        throw new InvalidArgumentException("Unsupported model type provided.");
    }
}
