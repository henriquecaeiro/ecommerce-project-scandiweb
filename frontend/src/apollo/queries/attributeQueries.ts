import { gql } from "@apollo/client";

// Query to get products
export const GET_ATTRIBUTES = gql`
    query GetAttributes($productId: String!, $type: String!) {
    attributes(product_id: $productId, type: $type) {
        name
        display_value
        value
    }
    }
`;