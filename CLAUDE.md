# CLAUDE.md

# EbroZone AI Development Guide

Version: 1.0

---

# Project

Project Name

EbroZone

Type

Modern English Learning Platform

Purpose

EbroZone helps students improve their English through structured learning, assessments, consultations, lessons, homework, and progress tracking.

---

# Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- TanStack Query
- Zustand

Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Refresh Tokens
- bcrypt

Infrastructure

- Cloudflare
- Cloudflare R2
- Vercel
- Railway
- Neon PostgreSQL
- Resend

---

# Documentation

Before implementing any feature, always consult the documentation inside:

docs/

Important folders include:

- architecture
- development
- design-system
- product-design
- specifications

Documentation is the source of truth.

Never ignore documented decisions.

---

# Development Principles

Always:

- Reuse existing components.
- Keep code modular.
- Keep functions small.
- Keep business logic separate from UI.
- Prefer readability over cleverness.
- Prefer composition over duplication.
- Write maintainable code.
- Follow the project architecture.

---

# UI Rules

Always:

- Follow the Design System.
- Use existing UI components before creating new ones.
- Keep layouts responsive.
- Support accessibility.
- Use semantic HTML.

Do not invent new design patterns.

---

# Backend Rules

Always:

- Follow NestJS module architecture.
- Use dependency injection.
- Keep controllers thin.
- Keep business logic inside services.
- Keep database logic inside repositories.
- Use Prisma for database access.

Never place business logic inside controllers.

---

# API Rules

Every endpoint should:

- Validate input.
- Return consistent responses.
- Follow REST conventions.
- Respect authentication and authorization.

---

# Database Rules

Always:

- Use Prisma migrations.
- Keep relationships explicit.
- Use UUID identifiers where appropriate.
- Never duplicate data unnecessarily.

---

# Code Style

Use:

- TypeScript everywhere.
- Clear naming.
- Small files.
- Small functions.
- Self-explanatory code.

Avoid unnecessary comments.

---

# Before Creating Anything

Before creating:

- Component
- Hook
- Utility
- Service
- Type
- API
- Module

Always check whether one already exists.

Reuse first.

Create second.

---

# Before Editing Anything

Understand:

- Purpose
- Dependencies
- Side effects

Avoid unnecessary changes.

---

# AI Responsibilities

Claude should:

- Implement features.
- Refactor code.
- Improve readability.
- Reduce duplication.
- Generate tests.
- Explain implementation when requested.

Claude should NOT:

- Invent architecture.
- Ignore documentation.
- Change the technology stack.
- Rename large parts of the project without approval.
- Introduce unnecessary dependencies.

---

# Workflow

For every feature:

1. Read documentation.
2. Understand the requirement.
3. Create an implementation plan.
4. Implement.
5. Verify TypeScript.
6. Verify linting.
7. Verify responsiveness.
8. Verify accessibility.
9. Explain the changes.

---

# Definition of Done

A feature is complete only if:

- Requirements are satisfied.
- Code builds successfully.
- No TypeScript errors exist.
- No lint errors exist.
- Responsive behavior works.
- Accessibility is preserved.
- Existing functionality is not broken.

---

# Primary Goal

Produce production-quality code that is scalable, maintainable, and consistent with the EbroZone architecture.
