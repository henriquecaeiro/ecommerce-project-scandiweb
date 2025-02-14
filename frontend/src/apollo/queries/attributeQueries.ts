import { gql } from "@apollo/client";

/**
 * GET_ATTRIBUTES GraphQL Query
 *
 * Retrieves attributes for a product based on the provided product ID and attribute type.
 *
 * Variables:
 * - productId (String!): The ID of the product.
 * - type (String!): The type of attribute to retrieve.
 *
 * Returns an array of attributes with the following fields:
 * - name: The attribute name.
 * - display_value: The attribute value intended for display.
 * - value: The actual attribute value.
 */
export const GET_ATTRIBUTES = gql`
  query GetAttributes($productId: String!, $type: String!) {
    attributes(product_id: $productId, type: $type) {
      attribute_value_id
      name
      display_value
      value
    }
  }
`;
