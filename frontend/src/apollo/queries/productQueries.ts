import { gql } from "@apollo/client";

/**
 * GET_PRODUCTS GraphQL Query
 *
 * Retrieves a list of products based on the provided category.
 *
 * Variables:
 * - category (String!): The category to filter products by.
 *
 * Returns an array of products, each with the following fields:
 * - id: Unique identifier of the product.
 * - name: Name of the product.
 * - in_stock: Stock availability status.
 * - image_url: URL of the product image.
 * - brand: Brand of the product.
 * - category_name: Name of the category.
 * - price_amount: Price of the product.
 * - currency_label: Label for the currency.
 * - currency_symbol: Symbol for the currency.
 */
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

/**
 * GET_SINGLE_PRODUCT GraphQL Query
 *
 * Retrieves a single product's details based on category and product ID.
 *
 * Variables:
 * - category (String!): The category of the product.
 * - id (String): The unique identifier of the product.
 *
 * Returns a product object with the following fields:
 * - id: Unique identifier of the product.
 * - name: Name of the product.
 * - in_stock: Stock availability status.
 * - description: Detailed description of the product.
 * - image_url: URL of the product image.
 * - brand: Brand of the product.
 * - category_name: Name of the category.
 * - price_amount: Price of the product.
 * - currency_label: Label for the currency.
 * - currency_symbol: Symbol for the currency.
 */
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
