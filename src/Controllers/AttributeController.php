<?php

namespace App\Controllers;

use App\Models\Attribute;
use App\Factories\AttributeValueFactory;
use Exception;

class AttributeController extends BaseController
{
    /**
     * Save attributes and their respective values to the database.
     *
     * @param array $data An array containing the products' data and their IDs.
     * @return mixed|null Returns null upon completion or an error response if any exception occurs.
     */
    public function save(array $data): mixed
    {
        // Map of product IDs to attribute IDs
        $productIds = $data['productsIds'] ?? [];
        $attributeMap = [];

        // Process attributes for each product
        foreach ($data['productsData'] as $productData) {
            $prodId = $productIds[$productData['id']] ?? null;

            foreach ($productData['attributes'] as $attributeData) {
                try {
                    // Create attribute instance
                    $attributeModel = new Attribute($this->db);

                    //Data array with the name and type of the attribute
                    $attributeModelData = [
                        'name' => $attributeData['name'],
                        'type' =>  $attributeData['type']
                    ];

                    //Save attribute
                    $attributeId = $attributeModel->save($attributeModelData);

                    // Map the product ID and attribute name to the attribute ID
                    $attributeMap[$productData['id']][$attributeData['name']] = $attributeId;
                } catch (Exception $e) {
                    echo "Error saving attribute '{$attributeData['name']}': " . $e->getMessage() . "<br>";
                }
            }
        }

        // Save attribute values for each product
        foreach ($data['productsData'] as $productData) {
            $prodId = $productIds[$productData['id']] ?? null;

            foreach ($productData['attributes'] as $attributeData) {
                $attributeId = $attributeMap[$productData['id']][$attributeData['name']] ?? null;
                if (!$attributeId) {
                    continue;
                }

                foreach ($attributeData['items'] as $attributeValueData) {
                    try {
                        // Create and save the attribute value
                        $attributeValue = AttributeValueFactory::create(
                            $this->db,
                            $attributeData['type'],
                        );

                        //Data array containing all atrribute values
                        $data = [
                            'value' =>  $attributeValueData['value'],
                            'displayValue' =>  $attributeValueData['displayValue'],
                            'attributeId' => $attributeId,
                            'productId' => $prodId
                        ];

                        $attributeValue->save($data);
                    } catch (Exception $e) {
                        echo "Error saving attribute value '{$attributeValueData['value']}': " . $e->getMessage() . "<br>";
                    }
                }
            }
        }

        return null;
    }

    /**
     * Retrieve attribute values for a specific product and type.
     *
     * @param string $productId The ID of the product for which attributes should be retrieved.
     * @param string $type The type of the attribute.
     * @return array An array of attribute values for the specified product and type.
     */
    public function getAttributeValue(string $productId, string $type): array
    {
        // Create the appropriate attribute value object based on type
        $attributeValue = AttributeValueFactory::create(
            $this->db,
            $type,
        );

        // Retrieve and return the attribute values
        return $attributeValue->get($productId);
    }
}
