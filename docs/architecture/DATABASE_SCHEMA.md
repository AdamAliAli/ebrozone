# EbroZone Database Schema

> This document defines the database architecture for EbroZone Version 1.

The database is designed to be relational, scalable, secure, and maintainable while supporting future platform growth.

PostgreSQL is the primary database, with Prisma as the ORM.

---

# Design Principles

The database should prioritize:

- Data integrity
- Performance
- Scalability
- Maintainability
- Security
- Clear relationships
- Minimal duplication

Every table should have a single responsibility.

---

# Primary Key Strategy

All primary business entities use **UUID v7**.

Examples:

- Users
- Courses
- Bookings
- Lessons
- Homework
- Messages
- Notifications
- Files

UUIDs improve security, scalability, and future integrations.

---

# Audit Fields

Every table should include:

- id
- createdAt
- updatedAt

Where appropriate, also include:

- deletedAt (Soft Delete)

Soft deletes preserve historical records while hiding inactive data.

---

# Core Tables

## Users

Stores all platform users.

Roles:

- Student
- Teacher
- Administrator

Version 1:

Ebro has both Teacher and Administrator roles.

---

## User Profiles

Stores additional user information.

Examples:

- Profile Picture
- Preferred Language
- Time Zone
- Biography

Separating profile data keeps authentication lightweight.

---

## Courses

Stores all available courses.

Examples:

- General English
- IELTS Preparation
- Business English
- Conversation Practice

---

## Bookings

Stores:

- Student
- Teacher
- Booking Type
- Date
- Time
- Status
- Google Meet Link

---

## Lessons

Represents completed or scheduled learning sessions.

Each lesson belongs to:

- One Student
- One Teacher
- One Booking

---

## Homework

Stores:

- Instructions
- Due Date
- Submission Status
- Teacher Feedback

Homework belongs to a lesson.

---

## Homework Submissions

Stores student uploads.

Includes:

- Uploaded File
- Submission Date
- Review Status

---

## Assessments

Stores:

- Estimated CEFR Level
- Answers
- Recommendation
- Completion Date

Students may complete multiple assessments over time.

---

## Messages

Stores conversations between:

- Student
- Teacher

Messages are private.

---

## Notifications

Stores:

- Booking Updates
- Homework Notifications
- Announcements
- Reminder Notifications

---

## Files

Stores metadata only.

Examples:

- File Name
- File Type
- File Size
- Cloudinary URL

Actual files remain in Cloudinary.

---

# Relationships

Core relationships:

User

↓

Bookings

↓

Lessons

↓

Homework

↓

Homework Submission

Users also connect to:

- Assessments
- Messages
- Notifications

Courses connect to:

- Lessons

Files connect to:

- Homework
- Lesson Resources
- Profile Pictures

---

# Lookup Data

Lookup values should use readable codes rather than UUIDs.

Examples:

Languages

- en
- ar
- ja
- zh
- ko
- fr
- fa

CEFR Levels

- A1
- A2
- B1
- B2
- C1
- C2

Statuses

- Pending
- Confirmed
- Completed
- Cancelled
- Archived

---

# Naming Conventions

Tables:

Plural

Examples:

- users
- bookings
- lessons

Columns:

camelCase

Examples:

- createdAt
- updatedAt
- profilePicture

Foreign Keys:

Singular + Id

Examples:

- userId
- bookingId
- lessonId

---

# Indexing Strategy

Create indexes for frequently queried fields.

Examples:

- email
- role
- bookingDate
- lessonDate
- status
- createdAt

Optimize search and filtering without over-indexing.

---

# Data Integrity

Use:

- Foreign Keys
- Unique Constraints
- Database Transactions
- Cascading Rules where appropriate

Never allow orphaned records.

---

# Scalability

The schema should support future additions including:

- Multiple Teachers
- Group Classes
- Payments
- AI Features
- Mobile Applications
- Enterprise Features

New tables should integrate without requiring major schema changes.

---

# Success Criteria

A successful database schema ensures that:

- Relationships remain clear.
- Data stays consistent.
- Queries remain performant.
- New features are easy to introduce.
- The database scales with the growth of EbroZone.
