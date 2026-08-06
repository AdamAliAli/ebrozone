# EbroZone System Architecture

> This document defines the overall software architecture for EbroZone Version 1.

The architecture is designed to be modular, scalable, secure, and maintainable while remaining simple enough for rapid development.

Version 1 follows a **Modular Monolithic Architecture** with clear boundaries between modules, making future scaling straightforward without introducing unnecessary complexity.

---

# Architecture Style

Version 1 uses a **Modular Monolith**.

Characteristics:

- Single application
- Single codebase
- Single PostgreSQL database
- Single deployment
- Clearly separated business modules
- Shared authentication and infrastructure

This approach minimizes operational complexity while providing an excellent foundation for future growth.

Future versions may extract individual modules into independent services if business requirements justify doing so.

---

# High-Level Architecture

```
                 Users
                    │
                    ▼
          Next.js Frontend (App Router)
                    │
                    ▼
      Next.js Route Handlers (REST API)
                    │
                    ▼
        Authentication & Authorization
                    │
                    ▼
          Business Logic (Services)
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   Redis Cache             Prisma ORM
        │                       │
        └───────────┬───────────┘
                    ▼
             PostgreSQL Database
                    │
                    ▼
            External Integrations

      • Google Calendar
      • Google Meet
      • Cloudinary
      • Resend
```

---

# Application Layers

## Presentation Layer

Responsible for:

- User Interface
- Pages
- Components
- Forms
- Client-side interactions

Technology:

- Next.js
- React
- Tailwind CSS
- shadcn/ui

---

## API Layer

Responsible for:

- Receiving requests
- Validating input
- Authentication
- Authorization
- Returning responses

Technology:

- Next.js Route Handlers

---

## Business Logic Layer

Contains all business rules.

Examples:

- Booking validation
- Assessment evaluation
- Homework workflow
- Notification logic
- Confidence Journey
- Dashboard logic

Business logic must never exist inside UI components.

---

## Data Layer

Responsible for:

- Database access
- Queries
- Data persistence

Technology:

- Prisma
- PostgreSQL

---

## Cache Layer

Redis is used as a performance layer.

Version 1 uses Redis for:

- Session caching
- Rate limiting
- Frequently accessed data
- Temporary application cache

Future versions may use Redis for:

- Background jobs
- Queue processing
- Real-time events

Redis is **not** the primary database.

---

# Core Modules

Version 1 contains the following modules:

- Authentication
- Users
- Courses
- Assessment
- Booking
- Lessons
- Homework
- Messages
- Notifications
- Dashboard
- Files
- Administration

Each module owns its own business logic and should remain independent from unrelated modules.

---

# External Services

Version 1 integrates with:

## Google Calendar

- Availability Management
- Booking Synchronization

---

## Google Meet

- Consultation Links
- Live Class Links

---

## Cloudinary

- Profile Pictures
- Homework Files
- Lesson Resources
- Course Images

---

## Resend

- Welcome Emails
- Booking Confirmations
- Password Reset Emails
- Platform Notifications

External services should always be accessed through dedicated service classes.

No external service should be called directly from UI components.

---

# Request Flow

Every request follows the same architecture.

```
User

↓

Frontend

↓

API Route

↓

Authentication

↓

Authorization

↓

Business Service

↓

Redis (if cached)

↓

Prisma ORM

↓

PostgreSQL

↓

Response

↓

Frontend
```

This flow should remain consistent throughout the application.

---

# Error Handling

Errors should be handled consistently.

The system should:

- Log internal errors
- Return user-friendly messages
- Never expose sensitive information
- Validate all incoming data

---

# Logging

Version 1 logs:

- Authentication Events
- Booking Events
- System Errors
- Critical Failures

Logging should help developers diagnose issues while protecting user privacy.

---

# Scalability

The architecture is designed to scale without requiring a complete rewrite.

Future infrastructure should support:

- Horizontal Scaling
- Load Balancing
- Redis Caching
- Background Workers
- Independent Service Extraction
- Multiple Application Instances

These capabilities should be added only when business growth requires them.

---

# Architecture Principles

Every architectural decision should prioritize:

- Simplicity
- Separation of Concerns
- Scalability
- Maintainability
- Security
- Performance
- Developer Experience

Version 1 intentionally avoids unnecessary complexity while remaining ready for future expansion.

---

# Architecture Decisions

The following decisions are locked for Version 1:

- Modular Monolith Architecture
- Next.js Full-Stack Application
- PostgreSQL as the Primary Database
- Prisma ORM
- Redis as the Cache Layer
- Google Calendar Integration
- Google Meet Integration
- Cloudinary File Storage
- Resend Email Service
- UUID v7 for Primary Entities
- Future-ready Horizontal Scaling
- Future-ready Load Balancing

These decisions should remain consistent throughout the project unless a significant architectural reason requires a change.

---

# Success Criteria

A successful architecture ensures that:

- Features remain modular.
- The codebase stays organized.
- New functionality is easy to implement.
- Performance remains high.
- Scaling is straightforward.
- Developers always know where business logic belongs.
- The application can grow without major architectural changes.
