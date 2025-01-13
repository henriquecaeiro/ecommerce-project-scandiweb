<?php

namespace App\Controllers;

use App\Models\Attribute;
use App\Factories\AttributeValueFactory;
use Exception;

class AttributeController extends BaseController
{
    /**
     * Import the attributes and their respective values
     *
     * @param array $data is an array tha contains the data of the products and the products id´s
     * @return mixed
     */
    public function save(array $data): mixed
    {
        $productIds = $data['productsIds'] ?? [];

        $attributeMap = [];

        foreach ($data['productsData'] as $productData) {
            $prodId = $productIds[$productData['id']] ?? null;

            foreach ($productData['attributes'] as $attributeData) {
                try {
                    $attributeModel = new Attribute(
                        $this->db,
                        $attributeData['name'],
                        $attributeData['type'] 
                    );

                    $attributeId = $attributeModel->save();

                    $attributeMap[$productData['id']][$attributeData['name']] = $attributeId;
                } catch (Exception $e) {
                    echo "Error saving attribute '{$attributeData['name']}': " . $e->getMessage() . "<br>";
                }
            }
        }

        foreach ($data['productsData'] as $productData) {
            $prodId = $productIds[$productData['id']] ?? null;

            foreach ($productData['attributes'] as $attributeData) {
                $attributeId = $attributeMap[$productData['id']][$attributeData['name']] ?? null;
                if (!$attributeId) {
                    continue;
                }

                foreach ($attributeData['items'] as $attributeValueData) {
                    try {
                        $attributeValue = AttributeValueFactory::create(
                            $this->db,
                            $attributeData['type'],
                            $attributeValueData['value'],
                            $attributeValueData['displayValue'],
                            $attributeId,
                            $prodId 
                        );
                        $attributeValue->save();
                    } catch (Exception $e) {
                        echo "Error saving attribute value '{$attributeValueData['value']}': " . $e->getMessage() . "<br>";
                    }
                }
            }
        }

        return null;
    }
}
