# File Storage Architecture

> This document defines how files are stored, managed, and secured throughout EbroZone Version 1.

Version 1 uses **Cloudinary** as the primary cloud storage provider, while PostgreSQL stores only file metadata.

---

# Goals

The file storage architecture should:

- Keep files secure.
- Provide fast file delivery.
- Separate files from the database.
- Support future scalability.
- Simplify backup and maintenance.

---

# Storage Strategy

Version 1 separates:

- File Content
- File Metadata

File content is stored in Cloudinary.

File metadata is stored in PostgreSQL.

This keeps the database lightweight and improves performance.

---

# Supported Files

Students may upload:

- Homework
- Profile Pictures

Teachers may upload:

- Lesson Resources
- PDFs
- Worksheets
- Images
- Practice Materials

Administrators have full file management permissions.

---

# File Metadata

Each uploaded file stores:

- UUID
- Original Filename
- Stored Filename
- File Type
- File Size
- MIME Type
- Cloudinary Public ID
- Secure URL
- Uploaded By
- Related Resource
- Created At
- Updated At

---

# File Organization

Cloudinary folders should follow a predictable structure.

Example:

```
profile-pictures/

homework/

lesson-resources/

course-images/

system/
```

Every file category should remain isolated.

---

# File Naming

Files should never keep their original filename.

Instead, generate unique filenames using UUIDs.

Example:

```
550e8400-e29b-41d4-a716-446655440000.pdf
```

This prevents collisions and improves security.

---

# Access Control

Students can access:

- Their own homework
- Lesson resources assigned to them
- Their profile picture

Teachers can access:

- Student homework
- Lesson resources
- Uploaded teaching materials

Administrators have full access.

Authorization is always validated by the backend.

---

# Upload Validation

Before upload:

Validate:

- File Type
- File Size
- MIME Type

Reject:

- Executable files
- Unsupported formats
- Corrupted uploads

---

# File Deletion

Deleting a file should:

- Remove it from Cloudinary.
- Remove its metadata from PostgreSQL.
- Log the deletion event.

Version 1 performs permanent deletion.

Future versions may introduce file recovery.

---

# Performance

Optimize every uploaded image.

Cloudinary should automatically:

- Compress images
- Generate responsive sizes
- Deliver through CDN
- Optimize formats

PDFs should be delivered without modification.

---

# Security

Files should:

- Use HTTPS only.
- Never expose private storage credentials.
- Validate authorization before download.
- Prevent unauthorized access.

Sensitive files should never be publicly accessible without permission.

---

# Future Expansion

The architecture should support:

- Video Storage
- Audio Files
- Course Downloads
- Student Portfolios
- AI Generated Resources

without requiring structural changes.

---

# Success Criteria

A successful file storage architecture ensures that:

- Files remain secure.
- Uploads are reliable.
- Downloads are fast.
- Metadata remains synchronized.
- Storage scales as EbroZone grows.
