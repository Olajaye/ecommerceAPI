E-commerce Backend

A lightweight e-commerce backend built with Node.js, Express.js, Prisma ORM, and JWT authentication. It supports user authentication, product management, cart operations, order placement, and a wishlist feature, with role-based access control (USER and ADMIN). The API is documented with Swagger for interactive testing.

Table of Contents
> Architecture (#architecture)

> Setup Instructions (#setup-instructions)

> API Documentation (#api-documentation)

> Postman Collection (#postman-collection)

Architecture
The backend follows a modular, layered architecture for maintainability and scalability:
> Framework: Express.js handles HTTP routing and middleware.
> ORM: Prisma ORM with SQLite (configurable for PostgreSQL) provides type-safe database queries and migrations.
> Authentication: JWT-based authentication with USER and ADMIN roles, enforced via middleware.

Modules:
> User Authentication: Register, login, and protected routes.

> Products: CRUD operations (admin-only for create/update/delete).

> Cart: Add, view, update, and remove products.

> Orders: Place orders from cart and view user orders.

> Wishlist: Save and manage products for later purchase.

Database Schema:

Models: User, Product, Cart, CartItem, Order, OrderItem, Wishlist.

Relationships: Many-to-one (Order → User, OrderItem → Order/Product), one-to-many (Order → OrderItem, Cart → CartItem), many-to-many (Wishlist  Product).

IDs: String with uuid() for unique identifiers.

Documentation: Swagger UI at /api-docs offers interactive API testing with JWT support.

Middleware: Ensures secure access with authentication and role-based checks.

Code is organized into controllers, routes, and middleware for separation of concerns.

Project Summary

The e-commerce backend is a RESTful API for managing online shopping functionality:
Tech Stack: Node.js, Express.js, Prisma ORM (SQLite/PostgreSQL), JWT, Swagger.

Features:
Authentication: User registration/login with JWT; USER and ADMIN roles.

Products: Public listing; admin-only CRUD (name, description, price, stock, imageUrl).

Cart: Add/update/remove products; tied to user.

Orders: Place orders from cart; view order history with items and totals.

Wishlist: Save/remove products; prevents duplicates.

Security: JWT middleware protects routes; admin middleware restricts sensitive actions.

Database: Prisma models with cuid() IDs, supporting many-to-one, one-to-many, and many-to-many relationships.

Documentation: Swagger UI (/api-docs) and Postman collection for testing.

Architecture: Modular (controllers, routes, middleware) for easy extension.

Setup: Simple installation with SQLite; PostgreSQL supported; includes migrations and environment config.









