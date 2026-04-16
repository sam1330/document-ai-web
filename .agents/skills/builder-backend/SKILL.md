---
name: ResumeBuilderBackend
description: Specifications for building the backend endpoints to support the Resume Builder. Includes Create, Update, and Delete operations for structured metadata.
---

# Resume Builder Backend Implementation Skill

This skill defines the API contract and backend requirements for integrating the Resume Builder.

## 1. Resume Schema Update

The `resumes` table (or equivalent) MUST support storing structured JSON metadata.

- **Field Name**: `metadata` (JSON or JSONB)
- **Field Name**: `source` (String/Enum: `upload` or `builder`)

## 2. API Endpoints

### `POST /api/resumes`
Create a new resume from builder data.

- **Request Body**:
```json
{
  "original_filename": "john-doe-resume",
  "source": "builder",
  "metadata": {
    "template": "classic",
    "cv_body": {
       "cv": { ... },
       "design": { ... }
    }
  }
}
```
- **Response (201)**:
```json
{
  "message": "Resume created successfully",
  "resume": {
    "id": "uuid-here",
    "original_filename": "john-doe-resume",
    "source": "builder",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### `PUT /api/resumes/:id`
Update an existing resume's metadata.

- **Request Body**: Same as POST, but usually only `metadata` and `original_filename` are updated.
- **Response (200)**:
```json
{
  "message": "Resume updated successfully",
  "resume": { ... }
}
```

### `DELETE /api/resumes/:id`
Delete a resume (Standard implementation).

- **Response (200)**:
```json
{
  "message": "Resume deleted successfully"
}
```

### `GET /api/resumes/:id`
Fetch resume data.

- **Response (200)** MUST include the `metadata` field if it exists.
```json
{
  "resume": {
    "id": "...",
    "source": "builder",
    "metadata": { ... },
    ...
  }
}
```

## 3. Storage Considerations
- For `source: 'builder'`, the `file_path` might be NULL initially.
- The backend should handle background generation of the PDF version if needed for download, or the frontend can continue using the microservice at `http://localhost:8000/generate`.

## 4. Security
- Ensure all endpoints are protected by `auth` middleware.
- Only allow users to modify or delete their own resumes.
