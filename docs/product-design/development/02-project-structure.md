# Project Structure

Version: v1.0

Status: Approved

---

# Purpose

This document defines the official folder structure of the EbroZone project.

A consistent project structure improves maintainability, scalability, and onboarding for future developers.

---

# Architecture Principles

The project structure should:

- Organize code by responsibility.
- Keep frontend and backend independent.
- Promote modular development.
- Support future expansion.
- Minimize coupling between modules.

---

# Repository Structure

```
ebrozone/

├── apps/
│
├── packages/
│
├── docs/
│
├── scripts/
│
├── infrastructure/
│
├── .github/
│
├── .env.example
│
├── package.json
│
└── README.md
```

---

# Applications

```
apps/

├── web/
├── api/
└── admin/
```

Purpose:

- **web** → Public website and student platform.
- **api** → Backend services.
- **admin** → Administrative interface.

---

# Shared Packages

```
packages/

├── ui/
├── types/
├── utils/
├── config/
└── design-tokens/
```

Purpose:

Share reusable code across applications.

---

# Documentation

```
docs/

├── architecture/
├── design-system/
├── development/
├── product-design/
└── specifications/
```

Purpose:

Keep all project documentation centralized.

---

# Infrastructure

```
infrastructure/

├── docker/
├── nginx/
├── database/
└── deployment/
```

Purpose:

Store infrastructure and deployment configuration.

---

# Scripts

```
scripts/

├── setup/
├── build/
└── maintenance/
```

Purpose:

Automate repetitive development tasks.

---

# Principles

The project should:

- Avoid deeply nested folders.
- Keep related files together.
- Use consistent naming conventions.
- Separate configuration from business logic.
- Keep reusable code inside shared packages.

---

# Success Criteria

The project structure is successful when:

- Developers can quickly locate files.
- New modules fit naturally into the structure.
- Shared code is reused effectively.
- The repository remains organized as the project grows.
