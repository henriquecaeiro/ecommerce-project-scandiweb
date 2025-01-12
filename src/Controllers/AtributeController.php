<?php

namespace App\Controllers;

use App\Models\Attribute;
use Exception;

class AttributeController extends BaseController
{
    /**
     * Save attributes data to the database.
     *
     * @param array $data Data containing attributes and their details.
     * @return int
     */
    public function save(array $data): int
    {
        foreach ($data as $attributeData) {
            try {
                $attribute = new Attribute(
                    $this->db,
                    $attributeData['name'],
                    $attributeData['type'],
                    $attributeData['productId']
                );
                return $attribute->save();
            } catch (Exception $e) {
                echo "Error saving attribute '{$attributeData['name']}': " . $e->getMessage();
            }
        }
    }
}
