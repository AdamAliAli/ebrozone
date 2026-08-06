# Backend Architecture

Version: v1.0

Status: Approved

---

# Purpose

This document defines the backend architecture for the EbroZone platform.

The backend should provide a secure, scalable, and maintainable foundation for all platform features while supporting future growth.

---

# Architectural Principles

The backend should be:

- Modular
- Scalable
- Secure
- Testable
- Maintainable

Each module should own its business logic and communicate through well-defined interfaces.

---

# Technology

Backend Framework

- NestJS

Language

- TypeScript

Database

- PostgreSQL

ORM

- Prisma

Authentication

- JWT
- Refresh Tokens

---

# Project Structure

```
apps/api/

src/

├── modules/
├── common/
├── config/
├── database/
├── auth/
├── prisma/
├── shared/
└── main.ts
```

---

# Module Organization

Every feature should live inside its own module.

Example:

```
students/

├── controllers/
├── services/
├── repositories/
├── dto/
├── entities/
├── guards/
├── interfaces/
├── validators/
└── students.module.ts
```

Each module should remain independent whenever possible.

---

# Layer Responsibilities

Controller

- Receives HTTP requests.
- Validates incoming data.
- Calls application services.

Service

- Contains business logic.
- Coordinates operations.
- Does not know HTTP details.

Repository

- Handles database communication.
- Uses Prisma.
- Does not contain business rules.

DTO

- Defines request and response structures.

Entity

- Represents business objects used by the application.

---

# Module Communication

Modules should communicate through services.

Avoid direct access to another module's database layer.

---

# Dependency Injection

Use NestJS Dependency Injection throughout the project.

Avoid creating objects manually whenever possible.

---

# Error Handling

The backend should:

- Return consistent API responses.
- Log unexpected errors.
- Never expose internal implementation details.
- Return meaningful HTTP status codes.

---

# Security

Every module should support:

- Authentication
- Authorization
- Input validation
- Rate limiting (future)
- Secure password handling

Security should be enforced at every layer.

---

# Database Access

All database operations should use Prisma.

Avoid writing raw SQL unless absolutely necessary.

---

# Testing

Every module should support:

- Unit tests
- Integration tests

Business logic should remain easy to test independently.

---

# Success Criteria

The backend architecture is successful when:

- Modules remain independent.
- Business logic is isolated from infrastructure.
- The project scales without architectural changes.
- New modules can be added consistently.
