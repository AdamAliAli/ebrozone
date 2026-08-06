# Booking & Scheduling Specification

> This document defines the complete booking and scheduling system for EbroZone Version 1.

The booking system should be simple, fast, and stress-free.

Students should be able to book a consultation or a live class in less than two minutes.

---

# Goals

The booking system should:

- Make scheduling effortless.
- Prevent scheduling conflicts.
- Support students in different time zones.
- Keep both students and Ebro informed.
- Minimize manual administration.

---

# Booking Types

Version 1 supports:

- Free Consultation
- Live Classes

Future versions may support:

- Group Classes
- Trial Lessons
- Workshops

---

# Student Booking Flow

Step 1

Choose a booking type.

↓

Step 2

Select an available date.

↓

Step 3

Select an available time.

↓

Step 4

Review the booking.

↓

Step 5

Confirm.

↓

Step 6

Receive confirmation.

---

# Availability

Students should only see available time slots.

Unavailable slots must not be selectable.

Available times are managed by Ebro from the Teacher Dashboard.

---

# Time Zones

The system should:

- Detect the student's local time zone automatically.
- Display all available times in the student's local time.
- Allow manual time zone selection if needed.

Ebro's calendar remains in his own local time zone.

---

# Booking Information

Every booking stores:

- Student
- Booking Type
- Date
- Time
- Time Zone
- Status
- Meeting Platform
- Notes (Optional)

---

# Booking Status

A booking can have one of the following statuses:

- Pending
- Confirmed
- Completed
- Cancelled
- Rescheduled

---

# Meeting Platform

Version 1 supports:

- Google Meet

Future versions may support:

- Zoom
- Microsoft Teams

The meeting link is automatically attached to the booking.

---

# Confirmation

After a successful booking, students receive:

- Booking Confirmation
- Date
- Time
- Time Zone
- Meeting Link
- Calendar Invitation

The same information is available in the Student Dashboard.

---

# Rescheduling

Students may request to reschedule.

Rescheduling requests require Ebro's approval.

Once approved:

- The old booking is updated.
- Both parties receive a confirmation email.

---

# Cancellation

Students may cancel bookings.

Cancelled bookings remain in booking history.

Future versions may include cancellation policies.

---

# Teacher Schedule

Ebro manages:

- Weekly Availability
- Working Days
- Available Time Slots
- Holidays
- Manual Time Blocking

Students only see available time slots.

---

# Notifications

Notify both student and teacher when:

- A booking is created.
- A booking is confirmed.
- A booking is rescheduled.
- A booking is cancelled.

Automatic reminders are sent:

- 24 hours before
- 1 hour before

---

# Booking History

Students can view:

- Upcoming Bookings
- Completed Bookings
- Cancelled Bookings

Teachers can view the complete booking history for every student.

---

# User Experience Rules

The booking experience should always feel:

- Fast
- Simple
- Professional
- Mobile-friendly

Students should always know:

- When the booking is.
- How to join.
- What happens next.

---

# Success Criteria

A successful booking system ensures that:

- Students can complete a booking in less than two minutes.
- No double bookings occur.
- Time zones are handled automatically.
- Students receive all required information immediately.
- Ebro spends minimal time managing appointments.
