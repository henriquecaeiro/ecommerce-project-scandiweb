/**
 * Represents a product attribute (e.g. Color, Capacity).
 */
export interface Attribute {
  /** The attribute name (e.g. "Color"). */
  name: string;
  /** The display value for the attribute (e.g. "Red"). */
  display_value: string;
  /** The actual value of the attribute (e.g. "#FF0000"). */
  value: string;
  /**
   * The unique identifier(s) for the attribute value.
   * Stored as an array to allow for multiple IDs if needed.
   */
  attribute_value_id: number[];
}

/**
 * Represents the result returned from a query fetching attributes.
 */
export interface AttributeResult {
  /** An array of attributes. */
  attributes: Attribute[];
}

/**
 * Represents the selected attribute values.
 * This interface is used to store both the selected value and its identifier.
 */
export interface SelectedAttributeValues {
  /** Optional unique identifier for the selected attribute value. */
  attributeId?: number | undefined;
  /**
   * Additional key-value pairs representing the selected attribute.
   * The key is the attribute name and the value can be a string, number, or an array of numbers.
   */
  [key: string]: string | number | number[] | undefined;
}

/**
 * Represents the collection of selected attributes for a product.
 */
export interface SelectedAttributes {
  /** Selected text-based attributes. */
  text_selected: SelectedAttributeValues;
  /** Selected swatch-based attributes (e.g., colors). */
  swatch_selected: SelectedAttributeValues;
}

/**
 * Props for the component that displays attributes.
 */
export interface AttributeProps {
  /** Optional title for the attribute section. */
  title?: string;
  /** Optional array of attributes to be displayed. */
  attributes?: Attribute[];
  /** Indicates whether multiple attributes can be selected. */
  multiple: boolean;
}
