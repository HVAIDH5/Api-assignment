# Testing API Endpoints with Postman

## 1. Register a new user
- Method: POST
- URL: http://localhost:3000/api/users/register
- Body (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "address": "123 Test St"
 }
```


## 1.1 Register a new admin user
- Method: POST
- URL: http://localhost:3000/api/users/admin/register
- Body (raw JSON):
```json
{
  "username": "adminuser",
  "email": "admin@example.com",
  "password": "securepassword123",
  "address": "123 Admin Street"
}
```

## 2. Login
- Method: POST
- URL: http://localhost:3000/api/users/login
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Save the returned token for subsequent requests

## 3. Get user details
- Method: GET
- URL: http://localhost:3000/api/users/:id (replace :id with the user ID from registration)
- Headers: 
  - Key: Authorization
  - Value: Bearer YOUR_TOKEN_HERE

## 4. Create a product (admin only)
- Method: POST
- URL: http://localhost:3000/api/products
- Headers: 
  - Key: Authorization
  - Value: Bearer YOUR_ADMIN_TOKEN_HERE
- Body (raw JSON):
```json
{
  "name": "Test Product",
  "description": "A test product",
  "price": 19.99,
  "stock": 100
}
```

## 5. Get all products
- Method: GET
- URL: http://localhost:3000/api/products

## 6. Create an order
- Method: POST
- URL: http://localhost:3000/api/orders
- Headers: 
  - Key: Authorization
  - Value: Bearer YOUR_TOKEN_HERE
- Body (raw JSON):
```json
{
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "quantity": 2,
      "price": 19.99
    }
  ],
  "totalAmount": 39.98
}
```

## 7. Get user's orders
- Method: GET
- URL: http://localhost:3000/api/orders
- Headers: 
  - Key: Authorization
  - Value: Bearer YOUR_TOKEN_HERE

## 8. Cancel an order
- Method: DELETE
- URL: http://localhost:3000/api/orders/:id (replace :id with an order ID)
- Headers: 
  - Key: Authorization
  - Value: Bearer YOUR_TOKEN_HERE
