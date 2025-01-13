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
        $category = new Category($this->db, $data['name']);
        return $category->save();
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
            $categoryIds[$categoryData['name']] = $this->save($categoryData);
        }

        return $categoryIds;
    }
}
