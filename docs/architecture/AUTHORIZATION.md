# Authorization Architecture

> This document defines how authorization and permissions work inside EbroZone Version 1.

EbroZone uses **Role-Based Access Control (RBAC)** to ensure users can only access the resources and features they are permitted to use.

Authorization is enforced on the server for every protected request.

---

# Authorization Principles

The authorization system should:

- Protect user data.
- Restrict access based on user roles.
- Prevent unauthorized actions.
- Keep permissions simple and maintainable.
- Never rely on frontend validation.

---

# User Roles

Version 1 supports three roles.

## Student

Students can:

- Access their own dashboard.
- View their own profile.
- Book consultations.
- View their own bookings.
- Join live lessons.
- Submit homework.
- View lesson resources.
- Send messages to Ebro.
- View their own notifications.
- Complete assessments.

Students cannot:

- View another student's information.
- Access teacher tools.
- Access the admin dashboard.
- Modify platform settings.

---

## Teacher

Teachers can:

- Access the Teacher Dashboard.
- View assigned students.
- Manage bookings.
- Manage lessons.
- Upload homework.
- Upload lesson resources.
- Review homework.
- Send messages.
- View student progress.

Teachers cannot:

- Modify platform settings.
- Manage administrator accounts.

---

## Administrator

Administrators have full platform access.

They can:

- Manage users.
- Manage teachers.
- Manage students.
- Manage courses.
- Manage bookings.
- Manage lessons.
- Manage files.
- Manage platform settings.
- View reports.

---

# Multiple Roles

A single account may have multiple roles.

Version 1:

Ebro has both:

- Teacher
- Administrator

The system should evaluate every assigned role before authorizing access.

---

# Ownership Rules

Ownership is enforced for all student resources.

Students can only access:

- Their own bookings.
- Their own homework.
- Their own assessments.
- Their own messages.
- Their own dashboard.

Ownership validation occurs on the server.

---

# Route Protection

Protected pages require authentication.

Examples:

/dashboard

/student

/teacher

/admin

Unauthenticated users are redirected to the login page.

---

# API Protection

Every protected API request follows this sequence:

Authentication

↓

Role Validation

↓

Ownership Validation

↓

Business Logic

↓

Response

Authorization must always occur before executing business logic.

---

# Permission Matrix

| Feature | Student | Teacher | Admin |
|----------|:-------:|:-------:|:-----:|
| Dashboard | ✅ | ✅ | ✅ |
| Assessment | ✅ | ❌ | ✅ |
| Booking | ✅ | ✅ | ✅ |
| Lessons | ✅ | ✅ | ✅ |
| Homework | ✅ | ✅ | ✅ |
| Messages | ✅ | ✅ | ✅ |
| Student Management | ❌ | ✅ | ✅ |
| Teacher Management | ❌ | ❌ | ✅ |
| Course Management | ❌ | ❌ | ✅ |
| Platform Settings | ❌ | ❌ | ✅ |

---

# Security Rules

The authorization system should:

- Never trust frontend permissions.
- Validate every request.
- Prevent privilege escalation.
- Return appropriate HTTP status codes.
- Log unauthorized access attempts.

---

# Future Expansion

The authorization system should support:

- Additional user roles.
- Permission-based access.
- Team management.
- Multi-teacher organizations.

The architecture should allow new roles without major changes.

---

# Success Criteria

A successful authorization system ensures that:

- Users only access permitted resources.
- Sensitive data remains protected.
- Permissions remain easy to understand.
- The system scales as EbroZone grows.
