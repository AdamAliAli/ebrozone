# EbroZone API Design

> This document defines the API architecture for EbroZone Version 1.

The API should be consistent, secure, scalable, and easy to maintain.

Version 1 follows a RESTful API architecture built with Next.js Route Handlers.

---

# API Principles

Every endpoint should be:

- RESTful
- Predictable
- Stateless
- Secure
- Versionable
- Easy to understand

---

# API Structure

```
/api

/auth
/users
/courses
/assessments
/bookings
/lessons
/homework
/messages
/notifications
/files
/dashboard
/admin
```

Each module owns its own endpoints.

---

# HTTP Methods

Use standard HTTP methods.

GET

Retrieve data.

POST

Create resources.

PUT

Replace resources.

PATCH

Update resources.

DELETE

Soft delete resources when applicable.

---

# Authentication

Protected endpoints require authentication.

Authentication is handled by Better Auth.

Every request includes the authenticated user.

Authorization is performed before business logic executes.

---

# Authorization

Every endpoint validates:

- Authentication
- User Role
- Resource Ownership

Students cannot access another student's data.

Teachers can only access resources they manage.

Administrators have full platform access.

---

# Request Validation

All incoming data must be validated using Zod.

Validation occurs before business logic.

Invalid requests return clear validation errors.

---

# Response Format

Every successful response follows a consistent structure.

```json
{
  "success": true,
  "data": {},
  "message": "Request completed successfully."
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input."
  }
}
```

---

# Status Codes

Use standard HTTP status codes.

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

---

# Pagination

Large collections should support pagination.

Parameters:

- page
- limit

Future versions may support cursor-based pagination.

---

# Filtering

Support filtering where appropriate.

Examples:

Bookings

- Status
- Date
- Student

Lessons

- Course
- Date

Messages

- Unread
- Conversation

---

# Sorting

Allow sorting using query parameters.

Examples:

createdAt

updatedAt

lessonDate

bookingDate

---

# API Versioning

Version 1 uses:

```
/api/v1/
```

Future versions may introduce:

```
/api/v2/
```

without breaking existing clients.

---

# Rate Limiting

Protect public endpoints.

Examples:

- Login
- Account Activation
- Password Reset
- Assessment

Redis is used for rate limiting.

---

# Logging

Log:

- Failed Requests
- Server Errors
- Authentication Failures
- Critical Operations

Sensitive information must never be logged.

---

# External APIs

The application integrates with:

- Google Calendar API
- Google Meet
- Cloudinary API
- Resend API

External services should only be accessed through dedicated service classes.

---

# Performance

The API should prioritize:

- Fast response times
- Minimal database queries
- Efficient caching
- Consistent responses

Frequently accessed data may be cached using Redis.

---

# Security

The API should:

- Validate every request
- Sanitize input
- Enforce authorization
- Prevent unauthorized access
- Protect sensitive data

Security must never rely on the frontend.

---

# Success Criteria

A successful API ensures that:

- Endpoints are consistent.
- Requests are secure.
- Responses are predictable.
- New endpoints follow the same standards.
- Frontend and backend remain loosely coupled.
