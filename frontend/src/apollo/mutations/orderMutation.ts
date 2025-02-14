import { gql } from "@apollo/client";

/**
 * CREATE_ORDER Mutation
 *
 * This mutation creates a new order using the provided order data and returns a confirmation string.
 *
 * Variables:
 * - $total_amount: The total amount for the order (Float).
 * - $product_id: The identifier of the product (String).
 * - $quantity: The number of units ordered (Int).
 * - $amount: The individual amount for the product (Float).
 * - $attribute_value_id: An array of attribute value identifiers (as integers).
 */
export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $total_amount: Float!
    $product_id: String!
    $quantity: Int!
    $amount: Float!
    $attribute_value_id: [Int!]!
  ) {
    order(orderData: {
      total_amount: $total_amount,
      product_id: $product_id,
      quantity: $quantity,
      amount: $amount,
      attribute_value_id: $attribute_value_id
    })
  }
`;
