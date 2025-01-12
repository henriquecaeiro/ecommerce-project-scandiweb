<?php

namespace App\Models;

use PDO;
use PDOException;

/**
 * Class AttributeValue
 *
 * Represents a value for a specific attribute in the system.
 */
class AttributeValue extends BaseModel
{
    /** @var string Value of the attribute. */
    private string $value;

    /** @var string Display value of the attribute. */
    private string $displayValue;

    /** @var int Attribute ID associated with the value. */
    private int $attributeId;

    /**
     * AttributeValue constructor.
     *
     * @param PDO $db Database connection instance.
     * @param string $value Value of the attribute.
     * @param string $displayValue Display value of the attribute.
     * @param int $attributeId Attribute ID associated with the value.
     */
    public function __construct(PDO $db, string $value, string $displayValue, int $attributeId)
    {
        parent::__construct($db);
        $this->value = $value;
        $this->displayValue = $displayValue;
        $this->attributeId = $attributeId;
    }

    /**
     * Save the attribute value to the database.
     *
     * @return int The ID of the saved attribute value.
     * @throws PDOException If an error occurs during the save operation.
     */
    public function save(): int
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO attribute_values (attribute_id, value, display_value) VALUES (:attribute_id, :value, :display_value)'
            );
            $stmt->bindParam(':attribute_id', $this->attributeId);
            $stmt->bindParam(':value', $this->value);
            $stmt->bindParam(':display_value', $this->displayValue);
            $stmt->execute();

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            throw new PDOException("Error saving attribute value: " . $e->getMessage());
        }
    }
}
