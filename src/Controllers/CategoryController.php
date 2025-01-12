<?php

namespace App\Controllers;

use App\Models\Category;
use Exception;


class CategoryController extends BaseController
{
    /**
     * Save categories data to the database.
     *
     * @param array $data Data containing categories and their details.
     * @return void
     */
    public function save(array $data): int
    {
        try {
            $category = new Category($this->db, $data['name']);
            return $category->save();
        } catch (Exception $e) {
            echo "Error saving category '{$data['name']}': " . $e->getMessage();
        }
    }

    /**
     * Save categories data to the database.
     *
     * @param array $categoryIds Data containing the categories ids.
     * @return array
     */
    public function importCategories(array $catgoriesData): array
    {
        $categoryIds = [];

        foreach ($catgoriesData as $categoryData) {
            try {
                $categoryIds[$categoryData['name']] = $this->save($categoryData);
            } catch (Exception $e) {
                echo "Error sending category ID'{$categoryIds[$categoryData['name']]}': " . $e->getMessage();
            }
        }

        return $categoryIds;
    }
}
