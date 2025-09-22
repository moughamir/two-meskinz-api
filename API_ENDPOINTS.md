# Product API Endpoints

This document outlines the available API endpoints for the Product API.

## 1. GET /api/products

*   **Method:** `GET`
*   **Description:** Retrieves a paginated list of all products.
*   **Query Parameters:**
    *   `page` (optional): The page number to retrieve. Default is `1`.
    *   `limit` (optional): The number of products per page. Default is `12`.
*   **Example Request:**
    ```
    GET /api/products?page=1&limit=10
    ```
*   **Example Response (200 OK):**
    ```json
    {
      "products": [
        {
          "id": 12345,
          "title": "Sample Product 1",
          "handle": "sample-product-1",
          "vendor": "Sample Vendor",
          "product_type": "Sample Type",
          "featured_image_url": "https://example.com/image1.jpg"
        },
        // ... more products
      ],
      "total": 34075,
      "page": 1,
      "limit": 10
    }
    ```

## 2. GET /api/products/[handle]

*   **Method:** `GET`
*   **Description:** Retrieves a single product by its unique handle.
*   **Path Parameters:**
    *   `handle` (required): The unique handle of the product (e.g., `sample-product-1`).
*   **Content Negotiation:**
    *   **`Accept: application/json` (Default):** Returns the product data as a standard JSON object.
    *   **`Accept: application/msgpack`:** Returns the product data as a gzipped MessagePack binary blob.
*   **Example Request (JSON):**
    ```
    GET /api/products/sample-product-1
    ```
*   **Example Response (200 OK - JSON):**
    ```json
    {
      "id": 12345,
      "title": "Sample Product 1",
      "handle": "sample-product-1",
      "body_html": "<p>This is a detailed description of sample product 1.</p>",
      "published_at": "2023-01-01T12:00:00Z",
      "vendor": "Sample Vendor",
      "product_type": "Sample Type",
      "tags": ["sample", "new", "featured"],
      "variants": [
        {
          "id": 1,
          "title": "Default Title",
          "price": "19.99"
        }
      ],
      "images": [
        {
          "id": 101,
          "src": "https://example.com/image1.jpg"
        }
      ],
      "options": [],
      "featured_image_url": "https://example.com/image1.jpg",
      "images_count": 1,
      "variants_count": 1,
      "price": 19.99,
      "availability": "in stock",
      "condition": "new"
    }
    ```
*   **Example Request (MessagePack):**
    ```
    GET /api/products/sample-product-1
    Accept: application/msgpack
    ```
*   **Example Response (200 OK - MessagePack):**
    (Binary gzipped MessagePack data)

## 3. GET /api/search

*   **Method:** `GET`
*   **Description:** Performs a full-text search across product titles, descriptions, vendors, product types, and tags. Uses Lunr.js for intelligent search.
*   **Query Parameters:**
    *   `q` (required): The search query string (e.g., `red shirt`).
*   **Example Request:**
    ```
    GET /api/search?q=blue+shoes
    ```
*   **Example Response (200 OK):**
    ```json
    [
      {
        "id": 67890,
        "title": "Blue Running Shoes",
        "handle": "blue-running-shoes",
        "vendor": "Sporty Brand",
        "product_type": "Footwear",
        "featured_image_url": "https://example.com/shoes.jpg"
      },
      // ... other matching products
    ]
    ```