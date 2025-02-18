<?php

namespace App\Controllers;

use App\Models\Category;
use Exception;
use PDO;

/**
 * Class CategoryController
 *
 * Handles operations related to categories, such as saving, importing, and retrieving them from the database.
 */
class CategoryController extends QueryableController
{
    /**
     * @var PDO The database connection instance.
     */
    protected PDO $db;

    /**
     * CategoryController constructor.
     *
     * Initializes the controller with a database connection.
     *
     * @param PDO $db The database connection instance.
     */
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Save categories data to the database.
     *
     * @param array $data An associative array containing the category data.
     * @return mixed The result of the save operation.
     */
    public function save(array $data): mixed
    {
        try {
            $category = new Category($this->db);
            return $category->save($data['name']);
        } catch (Exception $e) {
            // Log the detailed error message for debugging
            error_log("Error saving category '{$data['name']}': " . $e->getMessage());

            // Display a user-friendly message
            throw new Exception($e->getMessage());
        }
    }

    /**
     * Import multiple categories into the database.
     *
     * @param array $categoriesData An array of category data to be imported.
     * @return array An associative array mapping category names to their respective IDs in the database.
     */
    public function importCategories(array $catgoriesData): array
    {
        $categoryIds = [];

        foreach ($catgoriesData as $categoryData) {
            $categoryIds[$categoryData['name']] = $this->save($categoryData);
        }

        return $categoryIds;
    }

    /**
     * Retrieve categories from the database.
     *
     * If an ID is provided, retrieves the specific category associated with that ID.
     * If no ID is provided, retrieves all categories.
     *
     * @param mixed $id The ID of the category to retrieve (optional).
     *                  If null, retrieves all categories.
     * @return array An array of category data.
     */
    public function get(mixed $id): array
    {
        try {
            // Retrieving all categories
            $categories = new Category($this->db);
            return $categories->get($id);
        } catch (Exception $e) {
            // Log the detailed error message for debugging
            error_log("Error while getting the categories " . $e->getMessage());
        }
    }
}
