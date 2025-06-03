Below is a README.md file for your e-commerce backend project, incorporating the details from our previous discussions. It includes setup instructions, a reference to a Postman collection for API testing, and a concise description of the architecture. The README assumes the project uses Node.js, Express.js, Prisma ORM with SQLite (configurable for PostgreSQL), JWT authentication, and includes features like user authentication, product management, cart, orders, and a wishlist, with Swagger documentation. I'll also provide a Postman collection JSON that you can import for testing, tailored to the project's endpoints.
E-commerce Backend
A simplified e-commerce backend built with Node.js, Express.js, Prisma ORM, and JWT authentication. It supports user authentication, product management, cart operations, order placement, and a wishlist feature, with role-based access control for USER and ADMIN roles. The API is documented with Swagger for interactive testing.
Table of Contents
Architecture (#architecture)
Setup Instructions (#setup-instructions)
API Documentation (#api-documentation)
Postman Collection (#postman-collection)
Architecture
The backend follows a modular, layered architecture designed for maintainability and scalability:
Framework: Express.js handles HTTP routing and middleware for request processing.
ORM: Prisma ORM with SQLite (configurable for PostgreSQL) provides type-safe database queries and schema migrations.
Authentication: JWT-based authentication with role-based access control (USER and ADMIN) enforced via middleware.
Modules:
User Authentication: Register, login, and JWT-protected routes.
Products: CRUD operations (create, read, update, delete; admin-only for create/update/delete).
Cart: Add, view, update, and remove products.
Orders: Place orders from cart and view user orders.
Wishlist: Save and manage products for later purchase.
Database Schema:
Models: User, Product, Cart, CartItem, Order, OrderItem, Wishlist.
Relationships:
Many-to-one: Order → User, OrderItem → Order, OrderItem → Product.
One-to-many: Order → OrderItem, Cart → CartItem.
Many-to-many: Wishlist ↔ Product (via a join table).
IDs: String with cuid() for unique, collision-resistant identifiers.
Documentation: Swagger UI at /api-docs provides interactive API documentation with request/response schemas and JWT testing.
Middleware: Custom middleware ensures secure access with authentication and admin role checks.
The code is organized into controllers, routes, and middleware, promoting separation of concerns and extensibility.
Setup Instructions
Prerequisites
Node.js (v16 or higher)
npm (v8 or higher)
SQLite (default; or PostgreSQL for production)
Git (optional, for cloning)
Installation
Clone the Repository (or create a new project directory):
bash
git clone <repository-url>
cd ecommerce-backend
If starting fresh:
bash
mkdir ecommerce-backend
cd ecommerce-backend
npm init -y
Install Dependencies:
bash
npm install express prisma @prisma/client jsonwebtoken bcryptjs dotenv swagger-ui-express yamljs
Set Up Environment Variables:
Create a .env file in the root directory:
env
JWT_SECRET=your_jwt_secret_key
PORT=3000
Configure Prisma:
Initialize Prisma:
bash
npx prisma init
Update prisma/schema.prisma with the following schema (or use the project’s schema file):
prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
generator client {
  provider = "prisma-client-js"
}
model User {
  id        String      @id @default(cuid())
  email     String      @unique
  password  String
  name      String
  role      String      @default("USER")
  cart      Cart?
  orders    Order[]
  wishlist  Wishlist?
  createdAt DateTime    @default(now())
}
model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Float
  stock       Int
  imageUrl    String
  cartItems   CartItem[]
  orderItems  OrderItem[]
  wishlists   Wishlist[]
  createdAt   DateTime    @default(now())
}
model Cart {
  id        String      @id @default(cuid())
  userId    String      @unique
  user      User        @relation(fields: [userId], references: [id])
  items     CartItem[]
  updatedAt DateTime    @updatedAt
}
model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
}
model Order {
  id        String      @id @default(cuid())
  user      User        @relation(fields: [userId], references: [id])
  userId    String
  items     OrderItem[]
  total     Float
  status    String
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  deletedAt DateTime?
}
model OrderItem {
  id        String    @id @default(cuid())
  order     Order     @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product   @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Float
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}
model Wishlist {
  id        String      @id @default(cuid())
  userId    String      @unique
  user      User        @relation(fields: [userId], references: [id])
  products  Product[]   @relation("WishlistProducts")
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}
Apply migrations:
bash
npx prisma migrate dev --name init
Run the Application:
Start the server:
bash
node src/index.js
The server runs on http://localhost:3000. Access Swagger UI at http://localhost:3000/api-docs.
Database Setup
SQLite: Default setup uses SQLite (dev.db). No additional configuration needed.
PostgreSQL (optional):
Update prisma/schema.prisma with your PostgreSQL connection string:
prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://user:password@localhost:5432/ecommerce?schema=public"
}
Run migrations:
bash
npx prisma migrate dev --name init
Testing
Use Postman or Swagger UI to test endpoints.
To test admin-only routes (e.g., POST /api/products), manually set a user’s role to ADMIN in the database using Prisma Studio:
bash
npx prisma studio
API Documentation
The API is documented using Swagger. Access the interactive documentation at:
http://localhost:3000/api-docs
Swagger provides detailed endpoint descriptions, request/response schemas, and a UI to test requests with JWT authentication.
Key Endpoints
Auth:
POST /api/auth/register: Register a user (email, password, name).
POST /api/auth/login: Login and receive a JWT.
Products:
GET /api/products: List all products (public).
POST /api/products: Create product (admin-only).
GET /api/products/:id: View single product (public).
PUT /api/products/:id: Update product (admin-only).
DELETE /api/products/:id: Delete product (admin-only).
Cart:
POST /api/cart: Add product to cart (productId, quantity).
GET /api/cart: View cart.
PUT /api/cart/:productId: Update product quantity.
DELETE /api/cart/:productId: Remove product from cart.
Orders:
POST /api/orders: Place order from cart.
GET /api/orders: View user’s orders.
Wishlist:
POST /api/wishlist/:productId: Add product to wishlist.
GET /api/wishlist: View wishlist.
DELETE /api/wishlist/:productId: Remove product from wishlist.
Authentication: All endpoints except GET /api/products, GET /api/products/:id, POST /api/auth/register, and POST /api/auth/login require a JWT in the Authorization: Bearer <token> header.
Postman Collection
Import the following Postman collection to test the API. Save it as ecommerce-backend.postman_collection.json and import it into Postman.
json
{
  "info": {
    "name": "E-commerce Backend",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"user@example.com\", \"password\": \"password\", \"name\": \"John Doe\"}",
              "options": { "raw": { "language": "json" } }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"user@example.com\", \"password\": \"password\"}",
              "options": { "raw": { "language": "json" } }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "List Products",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/products",
              "host": ["{{baseUrl}}"],
              "path": ["products"]
            }
          }
        },
        {
          "name": "Get Product",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/products/:id",
              "host": ["{{baseUrl}}"],
              "path": ["products", ":id"],
              "variable": [{ "key": "id", "value": "<productId>" }]
            }
          }
        },
        {
          "name": "Create Product (Admin)",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"Product\", \"description\": \"Description\", \"price\": 10.99, \"stock\": 100, \"imageUrl\": \"http://example.com/image.jpg\"}",
              "options": { "raw": { "language": "json" } }
            },
            "url": {
              "raw": "{{baseUrl}}/products",
              "host": ["{{baseUrl}}"],
              "path": ["products"]
            }
          }
        },
        {
          "name": "Update Product (Admin)",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "PUT",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"Updated Product\", \"description\": \"Updated Description\", \"price\": 12.99, \"stock\": 50, \"imageUrl\": \"http://example.com/updated.jpg\"}",
              "options": { "raw": { "language": "json" } }
            },
            "url": {
              "raw": "{{baseUrl}}/products/:id",
              "host": ["{{baseUrl}}"],
              "path": ["products", ":id"],
              "variable": [{ "key": "id", "value": "<productId>" }]
            }
          }
        },
        {
          "name": "Delete Product (Admin)",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/products/:id",
              "host": ["{{baseUrl}}"],
              "path": ["products", ":id"],
              "variable": [{ "key": "id", "value": "<productId>" }]
            }
          }
        }
      ]
    },
    {
      "name": "Cart",
      "item": [
        {
          "name": "Add to Cart",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\"productId\": \"<productId>\", \"quantity\": 2}",
              "options": { "raw": { "language": "json" } }
            },
            "url": {
              "raw": "{{baseUrl}}/cart",
              "host": ["{{baseUrl}}"],
              "path": ["cart"]
            }
          }
        },
        {
          "name": "View Cart",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/cart",
              "host": ["{{baseUrl}}"],
              "path": ["cart"]
            }
          }
        },
        {
          "name": "Update Cart Quantity",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "PUT",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\"quantity\": 3}",
              "options": { "raw": { "language": "json" } }
            },
            "url": {
              "raw": "{{baseUrl}}/cart/:productId",
              "host": ["{{baseUrl}}"],
              "path": ["cart", ":productId"],
              "variable": [{ "key": "productId", "value": "<productId>" }]
            }
          }
        },
        {
          "name": "Remove from Cart",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/cart/:productId",
              "host": ["{{baseUrl}}"],
              "path": ["cart", ":productId"],
              "variable": [{ "key": "productId", "value": "<productId>" }]
            }
          }
        }
      ]
    },
    {
      "name": "Orders",
      "item": [
        {
          "name": "Place Order",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "POST",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/orders",
              "host": ["{{baseUrl}}"],
              "path": ["orders"]
            }
          }
        },
        {
          "name": "View Orders",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/orders",
              "host": ["{{baseUrl}}"],
              "path": ["orders"]
            }
          }
        }
      ]
    },
    {
      "name": "Wishlist",
      "item": [
        {
          "name": "Add to Wishlist",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "POST",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/wishlist/:productId",
              "host": ["{{baseUrl}}"],
              "path": ["wishlist", ":productId"],
              "variable": [{ "key": "productId", "value": "<productId>" }]
            }
          }
        },
        {
          "name": "View Wishlist",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/wishlist",
              "host": ["{{baseUrl}}"],
              "path": ["wishlist"]
            }
          }
        },
        {
          "name": "Remove from Wishlist",
          "request": {
            "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }] },
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/wishlist/:productId",
              "host": ["{{baseUrl}}"],
              "path": ["wishlist", ":productId"],
              "variable": [{ "key": "productId", "value": "<productId>" }]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000/api" },
    { "key": "token", "value": "<your-jwt-token>" }
  ]
}
Using the Postman Collection
Import:
In Postman, click "Import" and upload the ecommerce-backend.postman_collection.json file.
Set Variables:
baseUrl: Defaults to http://localhost:3000/api.
token: After logging in (POST /api/auth/login), copy the JWT and set it as the token variable in Postman.
Test Endpoints:
Run Register and Login to create a user and get a JWT.
For admin-only endpoints (e.g., Create Product, Update Product, Delete Product), set a user’s role to ADMIN in the database.
Replace <productId> with actual product IDs obtained from GET /api/products.
Notes
Postman Collection: The collection covers all major endpoints. For detailed schemas and additional testing, use the Swagger UI at http://localhost:3000/api-docs.
Production Considerations:
Add input validation (e.g., Joi or Zod) for robust request handling.
Implement error logging (e.g., Winston) for debugging.
Use PostgreSQL for production and configure environment-specific settings.
Secure the JWT secret and use HTTPS.
Admin Testing: To test admin routes, update a user’s role to ADMIN in the database using Prisma Studio (npx prisma studio) or a direct query.
Extensibility: The modular architecture supports adding features like product reviews, discounts, or payment integration by extending the schema and adding new routes/controllers.
This README provides clear setup instructions, API testing options via Swagger and Postman, and a concise overview of the architecture, tailored to your e-commerce backend project. Let me know if you need assistance with specific sections, such as generating additional Postman requests, providing the full Swagger YAML, or adding more setup details!