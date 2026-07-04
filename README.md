<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Hackathon Nest API

A progressive, production-ready backend service built with [NestJS](https://github.com/nestjs/nest) for managing hackathons. This API provides secure user registration, authentication, role-based route protection, and comprehensive CRUD management for hackathons.

Designed with modular architecture, strict data validations, and clean RESTful patterns.

---

## 🚀 Key Features

*   **Modular Architecture**: Built following NestJS design standards with dedicated, self-contained feature modules.
*   **Secure Authentication**: JWT-based stateless authentication with password hashing using `bcrypt` and token verification via `Passport.js`.
*   **Role-Based Access Control (RBAC)**: Custom routing decorators (`@Roles`) and guards (`RolesGuard`) to enforce role-level security (e.g., restricting hackathon creation/modification to `ADMIN` users).
*   **Data Validation & Filtering**: Global validation pipe leveraging `class-validator` and `class-transformer` to sanitize payloads and strip unregistered properties automatically.
*   **Robust Date Validation**: Automated business logic constraints verifying that hackathon start dates are in the future and end dates occur after start dates.

---

## 🛠️ Tech Stack

*   **Framework**: [NestJS](https://nestjs.com/) (Node.js framework)
*   **Language**: TypeScript
*   **Authentication**: Passport-JWT & Bcrypt
*   **ORM**: Prisma (Setup ready)
*   **Validation**: Class-Validator & Class-Transformer

---

## 📁 Directory Structure

```text
src/
├── app.module.ts            # Root application module
├── main.ts                  # Application entry point & configuration
├── auth/                    # Authentication & Security Module
│   ├── dto/                 # Authentication Request DTOs
│   ├── guards/              # JWT & Role Access Control Guards
│   ├── decorators/          # Custom decorators (RBAC & User extraction)
│   ├── interfaces/          # User & Role models
│   ├── jwt.strategy.ts      # Passport JWT validation strategy
│   ├── auth.service.ts      # Authentication business logic & in-memory state
│   └── auth.controller.ts   # Registration & Login endpoints
└── hackathons/              # Hackathons Management Module
    ├── dto/                 # CRUD Validation schemas
    ├── interfaces/          # Hackathon model
    ├── hackathons.service.ts # Hackathon business logic & in-memory state
    └── hackathons.controller.ts # Rest handlers secured with custom guards
```

---

## 📝 API Endpoints

### 🔑 Authentication

| Endpoint | Method | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Public | `RegisterDto` (email, password, name, role) | Registers a new user |
| `/auth/login` | `POST` | Public | `LoginDto` (email, password) | Authenticates a user and returns a JWT |

### 🏆 Hackathons CRUD

| Endpoint | Method | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/hackathons` | `POST` | `ADMIN` | `CreateHackathonDto` | Creates a new hackathon |
| `/hackathons` | `GET` | Authenticated | None | Retrieves all hackathons |
| `/hackathons/:id` | `GET` | Authenticated | None | Retrieves details of a specific hackathon |
| `/hackathons/:id` | `PATCH` | `ADMIN` | `UpdateHackathonDto` | Modifies hackathon details |
| `/hackathons/:id` | `DELETE` | `ADMIN` | None | Deletes a hackathon |

---

## 💻 Local Setup & Installation

### 1. Clone the repository and install dependencies

```bash
$ git clone <repository-url>
$ cd hackathon-nest-api
$ npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add the configuration parameters (template provided below):

```env
# Application Settings
PORT=3000

# Database Configuration (For production Prisma integration)
DATABASE_URL="postgresql://user:password@localhost:5432/hackathondb?schema=public"

# JWT Secret configuration
JWT_SECRET="your-development-jwt-secret-key"
```

### 3. Compile and run the project

```bash
# development mode
$ npm run start

# watch mode (recommended for local development)
$ npm run start:dev

# production mode
$ npm run start:prod
```

### 4. Build for Production

```bash
$ npm run build
```