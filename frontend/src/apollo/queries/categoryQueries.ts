import { gql } from "@apollo/client";

/**
 * GET_CATEGORIES GraphQL Query
 *
 * Fetches all categories from the GraphQL API.
 *
 * Query:
 * - categories: Returns an array of category objects.
 *
 * Each category object includes:
 * - id: The unique identifier of the category.
 * - name: The name of the category.
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;
