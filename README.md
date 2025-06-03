# 🛒 E-commerce Backend

A lightweight and scalable e-commerce backend built with **Node.js**, **Express.js**, **Prisma ORM**, and **JWT authentication**. It supports complete user and admin workflows including **authentication**, **product management**, **cart operations**, **orders**, and **wishlist** functionality. The API is documented using **Swagger UI** for interactive testing and also supports Postman.

---

## 📑 Table of Contents

* [🧠 Architecture](#architecture)
* [⚙️ Setup Instructions](#setup-instructions)
* [📘 API Documentation](#api-documentation)
* [📦 Features](#features)
* [🗄️ Database Schema](#database-schema)
* [🧱 Technologies Used](#technologies-used)
* [🔐 Authentication & Security](#authentication--security)
* [🧩 Folder Structure](#folder-structure)

---

## 🧠 Architecture

The backend follows a clean, layered, and modular architecture designed for maintainability and scalability.

### 🔧 Components

* **Framework**: `Express.js` handles routing, middleware, and HTTP request/response cycle.
* **ORM**: `Prisma ORM` with SQLite (can be switched to PostgreSQL) for type-safe database operations and migrations.
* **Authentication**: `JWT`-based login system with `USER` and `ADMIN` roles.
* **Role-based Access Control**: Middleware ensures restricted access to either `USER` or `ADMIN` routes.

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js 20
* npm 
* SQLite but also applicable to PostgreSQL (SQLite is used for easy testing for other developer giving access to a unquie database) 

### Installation Steps

```bash
git clone https://github.com/Olajaye/ecommerceAPI.git
cd ecommerce-backend
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
DATABASE_URL="file:./dev.db"   # Use PostgreSQL URL if preferred
JWT_SECRET="Ecommerce-API-token-secret"
PORT=5000
```

### Run Migrations & Start

```bash
npx prisma migrate dev
npm run dev
```

App runs at: `http://localhost:5000`

Swagger docs: `http://localhost:5000/api-docs`

---

## 📘 API Documentation

* Interactive Swagger UI available at [`/api-docs`](http://localhost:5000/api-docs)
* Supports JWT-authenticated testing
* Organized by modules: Auth, Products, Cart, Orders, Wishlist

---

## 📦 Features

### 🔐 Authentication

* User registration and login
* Role-based access (`USER`, `ADMIN`)
* Protected routes with JWT

### 🛍️ Products

* Public listing of products
* Admin-only create, update, delete

### 🛒 Cart

* Add, update, and remove products
* View cart tied to user

### 📦 Orders

* Convert cart to order
* View order history
* Order items, totals

### ❤️ Wishlist

* Add/remove products to wishlist
* Prevents duplicates per user

---

## 🗄️ Database Schema

### Prisma Models

* `User`
* `Product`
* `Cart`
* `CartItem`
* `Order`
* `OrderItem`
* `Wishlist`

### Relationships

* **Many-to-One**: `Order → User`, `OrderItem → Order/Product`
* **One-to-Many**: `Cart → CartItem`, `Order → OrderItem`
* **Many-to-Many**: `Wishlist ↔ Product`

### ID Format

* All IDs use `uuid()` for globally unique string-based IDs.

---

## 🧱 Technologies Used

* **Node.js** & **Express.js** — server and routing
* **Prisma ORM** — type-safe database access
* **SQLite/PostgreSQL** — storage layer
* **JWT** — authentication
* **Swagger UI** — documentation
---

## 🔐 Authentication & Security

* **JWT Middleware**: Protects routes by verifying tokens
* **Admin Middleware**: Restricts access to product/admin actions


---

## 🧩 Folder Structure

```
src/
├── controllers/       # Business logic for each route
├── routes/            # API route definitions
├── middleware/        # Auth and role-checking logic
├── prisma/            # Prisma schema and migrations
```
