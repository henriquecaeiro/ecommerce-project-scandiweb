import { gql } from "@apollo/client";

// Query to get products
export const GET_PRODUCTS = gql`
  query GetProducts($category: String!) {
    products(category: $category) {
      id
      name
      in_stock
      image_url
      brand
      category_name
      price_amount
      currency_label
      currency_symbol
    }
  }
`;

export const GET_SINGLE_PRODUCT = gql`
    query GetProducts($category: String!, $id: String) {
    products(category: $category, id: $id) {
      id
      name
      in_stock
      description
      image_url
      brand
      category_name
      price_amount
      currency_label
      currency_symbol
    }
  }
`;