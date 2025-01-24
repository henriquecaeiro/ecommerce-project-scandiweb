
# E-commerce Project - Scandiweb

## Project Overview

This project is a base implementation for an e-commerce platform, created as part of a coding challenge. It is designed to manage products, categories, orders, and attributes. The system supports operations such as saving and retrieving data, handling GraphQL queries and mutations, and managing the association of additional data such as images, prices, and attributes. The back-end is implemented in PHP using PDO for database interactions and follows PSR standards and Object-Oriented Programming (OOP) principles.

---

## Features

### Key Functionalities:
- **Product Management**:
  - Create, read, and manage products with details such as name, description, stock status, brand, and categories.
- **Category Management**:
  - Manage product categories, ensuring proper relationships between products and their classifications.
- **Order Management**:
  - Create and manage orders, order items, and their associated attributes.
- **Attribute Handling**:
  - Add, retrieve, and associate attributes and attribute values with products.
- **Image and Price Management**:
  - Associate product images and prices, supporting multiple currencies.
- **GraphQL Integration**:
  - GraphQL API support for queries and mutations for efficient data retrieval and management.

---

## Technologies Used

### Language and Frameworks:
- **PHP**: Core language for back-end development.
- **GraphQL**: Provides a flexible and efficient API for querying and mutating data.
- **PDO**: Database abstraction layer for secure and efficient SQL execution.

### Database:
- **MySQL**: Used to store products, categories, orders, attributes, and related data.

### Tools:
- **Postman**: Used for testing GraphQL queries and mutations.
- **Composer**: Dependency management for PHP libraries.

---

## Project Structure

### Directory Overview:
```
project-root/
├── src/
│   ├── Controllers/
│   ├── Models/
│   ├── GraphQL/
│   │   ├── Resolvers/
│   │   ├── Schema/
│   │   │   ├── Types/
│   ├── Factories/
│   ├── Services/
│   ├── Utils/
├── public/
│   ├── index.php
│   ├── import_data.php
├── data/
│   ├── data.json
├── vendor/
├── composer.json
└── README.md
```

### Key Directories:
- **Controllers/**: Contains logic for handling business processes and delegating operations to models.
- **Models/**: Represents database entities and contains data access logic.
- **GraphQL/**: Manages the GraphQL schema, resolvers, and types for API operations.
- **Factories/**: Contains factory classes for dynamically creating instances of models based on input.
- **Services/**: Handles background tasks such as data imports.
- **Public/**: Contains public-facing files such as the entry point (`index.php`).

---

## Database Structure

### Tables:

#### `products`
| Column        | Type        | Description                   |
|---------------|-------------|-------------------------------|
| `id`          | VARCHAR(255)| Unique product identifier     |
| `name`        | VARCHAR(255)| Name of the product           |
| `description` | TEXT        | Description of the product    |
| `in_stock`    | BOOLEAN     | Stock status                  |
| `category_id` | INT         | Foreign key to categories     |
| `brand`       | VARCHAR(255)| Brand name of the product     |

#### `categories`
| Column | Type         | Description               |
|--------|--------------|---------------------------|
| `id`   | INT          | Unique category identifier|
| `name` | VARCHAR(255) | Name of the category      |

#### `orders`
| Column        | Type        | Description                   |
|---------------|-------------|-------------------------------|
| `id`          | INT         | Unique order identifier       |
| `total_amount`| DECIMAL(10,2)| Total amount for the order    |

#### `order_items`
| Column        | Type         | Description                  |
|---------------|--------------|------------------------------|
| `id`          | INT          | Unique order item identifier |
| `order_id`    | INT          | Foreign key to orders        |
| `product_id`  | VARCHAR(255) | Foreign key to products      |
| `quantity`    | INT          | Quantity of product          |
| `amount`      | DECIMAL(10,2)| Price of the product         |

#### `attribute_values`
| Column          | Type        | Description                   |
|-----------------|-------------|-------------------------------|
| `id`            | INT         | Unique attribute value ID     |
| `attribute_id`  | INT         | Foreign key to attributes     |
| `product_id`    | VARCHAR(255)| Foreign key to products       |
| `value`         | VARCHAR(255)| Actual value of the attribute |
| `display_value` | VARCHAR(255)| Human-readable value          |

---

## Setup Instructions

### Prerequisites:
- **PHP 8.0+**: Ensure PHP is installed on your system.
- **MySQL**: Set up a MySQL database for the project.
- **Composer**: Install Composer for dependency management.

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ecommerce-project-scandiweb.git
   cd ecommerce-project-scandiweb
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Set up the database:
   - Create a MySQL database.
   - Import the schema using a provided SQL file (if available).

4. Configure the database connection:
   - Update the `config.php` file with your database credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'your_database_name');
     define('DB_USER', 'your_username');
     define('DB_PASS', 'your_password');
     ```

5. Start the PHP development server:
   ```bash
   php -S localhost:8000 -t public
   ```

6. Access the application:
   - Open your browser and navigate to `http://localhost:8000`.
   - To populate the database with initial data, access `http://localhost:8000/import_data.php`. This script imports data from the `data/data.json` file into your database.


---

## Testing the API

### Using Postman:
1. Open Postman and create a new request.
2. Set the request method to **POST** and the URL to `http://localhost:8000/graphql`.
3. Use the **GraphQL** option in Postman to test queries and mutations.

### Queries and Mutation:
#### Fetch Catetogies:
```graphql
query GetCategories{
  categories{
    id
    name
  }
}
```
#### Fetch Attributes:
```graphql
query GetAttributes($productId: String!, $type: String!) {
  attributes(product_id: $productId, type: $type) {
    name
    display_value
    value
  }
}
```
Variables:
```json
{
  "productId": "product_id",
  "type": "product_type"
}
```
#### Fetch Products:
```graphql
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
```
Variables:
```json
{
  "category": "product_category",
}
```

#### Create Order:
```graphql
mutation CreateOrder {
  order(orderData: {
    total_amount: 333.99,
    product_id: "xbox-series-s",
    quantity: 1,
    amount: 333.99,
    attribute_value_id: [16, 21]
  })
}
```

---

## Error Handling
- **Logging**: Errors are logged using `error_log()` for debugging.
- **Exceptions**: Custom exceptions are thrown with descriptive messages for better traceability.
- **User-Friendly Messages**: Messages are designed to provide feedback without exposing sensitive details.

---
## License
This project is licensed under the MIT License. See the LICENSE file for details.

---