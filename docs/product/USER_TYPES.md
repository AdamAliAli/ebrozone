# EbroZone User Types

> This document defines every user role within EbroZone Version 1 and the permissions associated with each role.

---

# User Type 1 — Guest

A guest is anyone visiting the EbroZone website without logging in.

## Goals

- Learn about EbroZone
- Build trust in Ebro and the teaching methodology
- Discover their English level
- Explore available courses
- Book a free consultation
- Contact Ebro

## Can Access

### Public Website

- Home
- About Ebro
- Courses
- Discover Your English Level
- Student Success Stories
- FAQ
- Contact
- Privacy Policy
- Terms & Conditions

### Onboarding

- Welcome Experience
- English Level Assessment
- Personalized Learning Recommendation
- Consultation Booking

## Cannot Access

- Student Dashboard
- Teacher Dashboard
- Admin Dashboard
- Homework
- Lesson Materials
- Messages
- Student Information

---

# User Type 2 — Student

A student is someone enrolled in one or more EbroZone courses.

## Goals

- Attend live classes
- View upcoming lessons
- Receive homework
- Access lesson materials
- Track learning progress
- Communicate with Ebro
- Manage bookings

## Can Access

### Dashboard

- Dashboard Overview
- Upcoming Classes
- My Course
- Homework
- Lesson Materials (PDFs, Worksheets, Resources)
- Progress
- Messages
- Bookings
- Profile
- Settings

## Cannot Access

- Other students' information
- Teacher tools
- Website administration
- Platform settings
- Admin dashboard

---

# User Type 3 — Teacher

The teacher is responsible for delivering the learning experience and supporting students throughout their journey.

## Goals

- Teach live classes
- Manage students
- Upload lesson materials
- Create and assign homework
- Schedule classes
- Review student progress
- Communicate with students

## Can Access

### Teacher Dashboard

- Dashboard Overview
- Student List
- Schedule
- Live Classes
- Homework Management
- Lesson Materials
- Bookings
- Messages
- Student Progress
- Analytics
- Profile
- Settings

## Cannot Access

- Platform configuration
- Website settings
- User role management
- System administration (unless assigned the Administrator role)

---

# User Type 4 — Administrator

The administrator manages the entire EbroZone platform.

## Goals

- Manage users
- Manage teachers
- Manage students
- Manage courses
- Manage bookings
- Manage website content
- Manage platform settings
- Monitor platform performance

## Can Access

### Admin Dashboard

- Dashboard Overview
- Users
- Teachers
- Students
- Courses
- Bookings
- English Assessments
- Testimonials
- Website Content
- Languages
- Notifications
- Roles & Permissions
- Platform Settings
- Analytics

---

# Multi-Role Accounts

EbroZone supports assigning multiple roles to a single user account.

### Version 1

Ebro's account has the following roles:

- Teacher
- Administrator

This allows Ebro to teach classes, manage students, and administer the platform without maintaining multiple accounts.

The system should display tools and pages based on the permissions assigned to the logged-in user.

Future teachers will receive only the Teacher role unless additional administrative permissions are explicitly granted.

---

# Permission Principles

The platform follows Role-Based Access Control (RBAC).

## Core Principles

- Users can only access features related to their assigned role.
- Students can only access their own information.
- Teachers can only manage the students assigned to them.
- Administrators have full platform access.
- Every request must be validated on the server.
- Permissions should never rely only on the frontend.
- Security always takes priority over convenience.

---

# Version 1 Scope

Version 1 focuses on live teaching rather than pre-recorded courses.

Students join EbroZone to learn directly from Ebro through live sessions, supported by homework, lesson materials, progress tracking, and personalized guidance.

The platform is intentionally kept focused to deliver an exceptional learning experience while remaining simple, scalable, and aligned with the EbroZone philosophy.
