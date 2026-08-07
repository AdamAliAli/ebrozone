# EbroZone Technology Stack

> This document defines the official technology stack for EbroZone Version 1.

The selected technologies prioritize developer experience, scalability, maintainability, performance, and AI-assisted development.

---

# Frontend

## Framework

**Next.js 15**

Reasons:

- App Router
- Server Components
- Excellent performance
- SEO-friendly
- Production-ready
- Strong AI support

---

## Language

**TypeScript**

Reasons:

- Type safety
- Better maintainability
- Fewer runtime errors
- Excellent AI-generated code quality

---

## Styling

**Tailwind CSS v4**

Reasons:

- Utility-first workflow
- Fast development
- Highly customizable
- Excellent performance

---

## UI Components

**shadcn/ui**

Reasons:

- Accessible components
- Fully customizable
- Modern design
- Built on Radix UI
- Perfect fit for Tailwind

---

## Animations

### Framer Motion

Used for:

- Page transitions
- Component animations
- Micro interactions

### GSAP

Used only when necessary for:

- Hero animations
- Storytelling sections
- Premium landing page experiences

GSAP should not be used throughout the application.

---

# Backend

## Framework

**Next.js Route Handlers**

Reasons:

- Unified frontend and backend
- Simpler architecture
- Easier deployment
- Ideal for Version 1

A separate backend service is not required.

---

# Database

## PostgreSQL

Reasons:

- Reliable
- Scalable
- Industry standard
- Excellent relational support

---

# Caching

## Redis

Used for:

- Session caching
- Rate limiting
- Temporary caching
- Future background jobs

Redis complements PostgreSQL and is not used as the primary database.

## ORM

**Prisma**

Reasons:

- Type-safe database access
- Excellent developer experience
- Strong AI support
- Easy schema management

---

# Authentication

## Better Auth

Reasons:

- Modern architecture
- TypeScript-first
- Flexible authentication flows
- Role-based access support
- Excellent integration with Prisma

---

# Forms

## React Hook Form

Used for:

- Account Activation
- Login
- Assessment
- Booking
- Profile updates

---

## Validation

**Zod**

Reasons:

- Shared frontend/backend validation
- Type safety
- Excellent integration with React Hook Form

---

# File Storage

## Cloudinary

Used for:

- Profile pictures
- Lesson resources
- Homework uploads
- Course images

---

# Email Service

## Resend

Used for:

- Welcome emails
- Booking confirmations
- Password reset emails
- Notifications

---

# Calendar Integration

## Google Calendar API

Used to:

- Manage Ebro's availability
- Prevent double bookings
- Synchronize scheduled sessions

Google Calendar is the single source of truth for scheduling.

---

# Meeting Platform

## Google Meet

Version 1 supports:

- Live Classes
- Free Consultations

Meeting links are automatically attached to bookings.

---

# Analytics

## Plausible Analytics

Reasons:

- Lightweight
- Privacy-friendly
- Easy integration
- Simple dashboard

---

# Deployment

## Vercel

Reasons:

- Native Next.js support
- Fast deployments
- Automatic previews
- Excellent developer experience

---

# Version Control

## Git

## GitHub

Used for:

- Source control
- Collaboration
- Version history

---

# Architecture Principles

The technology stack should always prioritize:

- Simplicity
- Scalability
- Performance
- Maintainability
- Security
- Developer Experience
- AI-assisted development

Technology choices should support long-term growth without introducing unnecessary complexity.

---

# Official Stack Summary

| Layer | Technology |
|---------|------------|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Animations | Framer Motion + GSAP |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Better Auth |
| Forms | React Hook Form |
| Validation | Zod |
| File Storage | Cloudinary |
| Email | Resend |
| Calendar | Google Calendar API |
| Meetings | Google Meet |
| Analytics | Plausible Analytics |
| Deployment | Vercel |
| Version Control | Git + GitHub |
