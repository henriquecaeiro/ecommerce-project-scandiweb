/**
 * Order interface
 *
 * Represents an order placed by a customer.
 *
 * Properties:
 * - total_amount: The total cost of the order.
 * - product_id: The unique identifier of the product in the order.
 * - quantity: The number of units of the product ordered.
 * - amount: The price per unit or the subtotal for the product.
 * - attribute_value_id: An array of IDs representing the selected attribute values for the product.
 */
export interface Order {
    total_amount: number;
    product_id: string;
    quantity: number;
    amount: number;
    attribute_value_id: number[];
  }
  