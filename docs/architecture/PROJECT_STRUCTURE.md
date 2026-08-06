# EbroZone Project Structure

> This document defines the official folder and file organization for EbroZone Version 1.

The project structure prioritizes scalability, maintainability, readability, and AI-assisted development.

Every file should have a clear responsibility.

---

# Project Structure

```
ebrozone/

│
├── app/
│   ├── (public)/
│   ├── (student)/
│   ├── (teacher)/
│   ├── (admin)/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── dashboard/
│   ├── booking/
│   ├── assessment/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── assessment/
│   ├── booking/
│   ├── courses/
│   ├── dashboard/
│   ├── files/
│   ├── homework/
│   ├── lessons/
│   ├── messages/
│   ├── notifications/
│   └── users/
│
├── services/
│   ├── google-calendar/
│   ├── google-meet/
│   ├── cloudinary/
│   ├── resend/
│   └── redis/
│
├── lib/
│
├── hooks/
│
├── prisma/
│
├── types/
│
├── utils/
│
├── middleware/
│
├── public/
│
├── docs/
│
└── tests/
```

---

# Folder Responsibilities

## app/

Contains:

- Pages
- Layouts
- Route Groups
- API Routes

No business logic should live here.

---

## components/

Reusable UI components.

Examples:

- Buttons
- Cards
- Forms
- Navigation
- Modals

Components should remain presentation-focused.

---

## features/

Contains business modules.

Each feature owns:

- Components
- Hooks
- Services
- Validation
- Business Logic

Features should remain independent whenever possible.

---

## services/

Contains integrations with external providers.

Examples:

- Google Calendar
- Google Meet
- Cloudinary
- Resend
- Redis

External APIs should never be called directly from components.

---

## lib/

Shared application configuration.

Examples:

- Prisma Client
- Better Auth
- Utility configuration
- Shared constants

---

## hooks/

Reusable React hooks.

Examples:

- useAuth()
- useBooking()
- useNotifications()

---

## prisma/

Database schema and migrations.

Contains:

- schema.prisma
- migrations

---

## types/

Shared TypeScript types.

---

## utils/

Pure utility functions.

Utilities should not depend on React.

---

## middleware/

Application middleware.

Examples:

- Authentication
- Authorization
- Localization

---

## public/

Static assets.

Examples:

- Images
- Icons
- Fonts

---

## docs/

Project documentation.

This folder contains all planning, architecture, and development documentation.

---

## tests/

Application tests.

Future versions should include:

- Unit Tests
- Integration Tests
- End-to-End Tests

---

# Architecture Rules

- Keep modules independent.
- Avoid circular dependencies.
- Keep business logic inside features.
- Keep components focused on presentation.
- Keep services responsible for external integrations.
- Prefer composition over duplication.

---

# Naming Conventions

Folders:

kebab-case

Examples:

- google-calendar
- student-dashboard

Files:

PascalCase for React components.

Examples:

- BookingCard.tsx
- StudentSidebar.tsx

camelCase for utilities.

Examples:

- formatDate.ts
- calculateProgress.ts

---

# Success Criteria

A successful project structure ensures that:

- Developers always know where new code belongs.
- Features remain organized.
- The codebase scales without becoming difficult to maintain.
- AI tools can navigate and extend the project consistently.
