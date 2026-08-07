# Authentication & Accounts Specification

> This document defines how user authentication and account management work inside EbroZone Version 1.

The authentication system should be secure, simple, and frictionless while supporting the different user roles within the platform.

---

# Goals

The authentication system should:

- Make account activation fast.
- Keep student accounts secure.
- Support multiple user roles.
- Protect personal information.
- Provide a smooth login experience.

---

# User Roles

Version 1 supports:

- Student
- Teacher
- Administrator

In Version 1, Ebro has both the Teacher and Administrator roles.

---

# Account Creation

Students do not create their own accounts.

Ebro creates a student's account after a consultation, once the student decides to enroll.

Account creation requires:

- Full Name
- Email Address
- Role

---

# Account Activation

After Ebro creates the account, the platform sends an activation email to the student.

Students activate their account by:

- Opening the activation link
- Setting their own password

Activation links expire automatically after a limited time.

---

# Login

Students sign in using:

- Email
- Password

Successful login redirects users to their dashboard.

---

# Password Requirements

Passwords should:

- Be at least 8 characters long.
- Include uppercase and lowercase letters.
- Include at least one number.

Special characters are recommended but not required.

---

# Email Verification

Email verification happens automatically during account activation.

Opening the activation email and setting a password confirms the student's email address — no separate verification step is required.

---

# Forgot Password

Users can request a password reset.

The system sends a secure password reset link to the registered email address.

Reset links expire automatically after a limited time.

---

# Session Management

Users remain logged in unless they choose to log out.

Sessions expire automatically after a period of inactivity.

---

# Access Control

Students can access:

- Student Dashboard
- Courses
- Bookings
- Messages
- Homework
- Profile

Teachers can access:

- Teacher Dashboard
- Student Management
- Homework Management
- Schedule
- Messages

Administrators can access:

- Admin Dashboard
- User Management
- Course Management
- Website Management
- Platform Settings

Access is restricted based on user role.

---

# Account Settings

Users can update:

- Name
- Profile Picture
- Password
- Preferred Language
- Time Zone

Email changes require verification.

---

# Security

The system should:

- Encrypt passwords.
- Use secure authentication.
- Protect user sessions.
- Prevent unauthorized access.

Version 1 follows standard web security practices.

---

# User Experience Rules

Authentication should always feel:

- Fast
- Secure
- Simple
- Reliable

Students should never struggle to access their accounts.

---

# Success Criteria

A successful authentication system ensures that:

- Account activation takes less than one minute.
- Accounts remain secure.
- Users access only the features permitted by their role.
- Password recovery is simple.
- Students can quickly return to learning.
