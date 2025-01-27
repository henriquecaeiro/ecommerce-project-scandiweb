import { gql } from "@apollo/client";

// Query to get categories
export const GET_CATEGORIES = gql`
    query GetCategories{
        categories{
            id
            name
        }
    }
`;