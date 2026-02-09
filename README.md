# Jobs API — TypeScript Express Example

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18.x-brightgreen)

A TypeScript + Express REST API for managing job postings, built using a layered architecture with validation, role-based access control, and clean separation of concerns.

Originally created as a time-boxed take-home exercise, this project is now being expanded as a reference-quality backend example.

---

# Features

- Full CRUD for job postings
- Layered architecture (Routes → Controllers → Services → Repositories)
- Request validation with explicit rules
- Role-based access control (admin vs user)
- Mass-assignment protection
- In-memory repository seeded from JSON
- Clean HTTP semantics (status codes & error handling)
- Test-friendly app/server separation

---

# Architecture

Routes > Controllers > Services > Repositories


## Responsibilities

**Routes**
- Define endpoints
- Attach middleware
- Delegate to controllers

**Controllers**
- Handle HTTP concerns only
- Validate inputs
- Map responses & status codes

**Services**
- Contain business logic
- Enforce application rules

**Repositories**
- Handle data access & storage
- Isolated behind an interface-friendly layer

This structure allows the storage layer to be swapped without changing controllers or services.

---

# Setup

Install dependencies:

```bash
npm install
```

Run in dev mode:
```bash
npm run dev
```

Server runs at:
```bash
http://localhost:3000
```

---

# Configuration

Environment variables:

| Variable  | Description  | Default  |
|-----------|--------------|----------|
| PORT      | Server port  | 3000     |

Example:

```bash
PORT=8080 npm run dev
```

---

# Data Storage

- Jobs are stored in memory
- Seeded from data.json on startup
- IDs generated as maxId + 1
- No persistence between restarts

This is intentional for simplicity. The repository layer can be replaced with a database-backed implementation without 
changing higher layers.

---

# Job Model Notes

`posted` **Field**

- Treated as display-only text
- Existing seed values preserved
- New jobs receive posted = "just now"
- Clients cannot override this field 

In a production system this would be derived from a timestamp.

## ID Behaviour

- System-generated only
- Client IDs ignored
- Prevents mass-assignment issues

---

# Authentication & Authorisation

Write operations require authentication and admin role.

Bearer token examples:

```
Bearer admin-token
Bearer user-token
```

Behaviour:

| Case           | Result  |
|----------------|---------|
| Missing token  | 401     |
| Invalid format | 401     |
| Non-admin user | 403     |
| Admin          | Allowed |

Implementation is intentionally minimal and designed to be replaced with JWT/OIDC in a real system.

---

# Validation Rules

Validation uses explicit helper functions rather than schema libraries.

**Create**
- All required fields must be present
- Strings must be non-empty after trimming

**Patch**
- Partial updates allowed
- Must include at least one valid updatable field
- No-op updates rejected

**Route Params**
- IDs validated at controller boundary
- Invalid IDs return 400

---

# Mass Assignment Protection

Create & update operations explicitly whitelist fields.

System-managed properties cannot be overridden:

- id
- posted

---

# Endpoint Behaviour

**Public**

```
GET /jobs
GET /jobs/:id
```

**Admin Only**

``` 
POST /jobs
PATCH /jobs/:id
DELETE /jobs/:id
```

---

# Health Endpoint

```
GET /healthCheck
```

Returns:

```
{ "status": "ok" }
```

---

# Example Usage (curl)

**Create job — admin**

```bash
curl -X POST http://localhost:3000/jobs \
-H "Authorization: Bearer admin-token" \
-H "Content-Type: application/json" \
-d '{
"title": "Senior Backend Engineer",
"department": "Engineering",
"location": "Remote",
"type": "Full-time",
"description": "Build and maintain scalable backend services."
}'
```

**Create job — user (should fail)**

```bash
curl -X POST http://localhost:3000/jobs \
-H "Authorization: Bearer user-token" \
-H "Content-Type: application/json" \
-d '{
"title": "Unauthorized Job",
"department": "Engineering",
"location": "Remote",
"type": "Full-time",
"description": "This should not work."
}'
```

**Create job — no auth (should fail)**

```bash
curl -X POST http://localhost:3000/jobs \
-H "Content-Type: application/json" \
-d '{"title":"x","department":"x","location":"x","type":"x","description":"x"}'
```

**Create job — invalid auth format**

```bash
curl -X POST http://localhost:3000/jobs \
-H "Authorization: admin-token" \
-H "Content-Type: application/json" \
-d '{"title":"x","department":"x","location":"x","type":"x","description":"x"}'
```

**Create job — missing required field**

```bash
curl -X POST http://localhost:3000/jobs \
-H "Authorization: Bearer admin-token" \
-H "Content-Type: application/json" \
-d '{"department":"Engineering","location":"Remote","type":"Full-time","description":"Missing title"}'
```

**Create job — attempt to override system fields**

```bash
curl -X POST http://localhost:3000/jobs \
-H "Authorization: Bearer admin-token" \
-H "Content-Type: application/json" \
-d '{
"id": 999,
"posted": "10 years ago",
"title": "Attempted override",
"department": "Engineering",
"location": "Remote",
"type": "Full-time",
"description": "Should ignore id/posted"
}'
```

---

**Get all jobs**

```bash
curl http://localhost:3000/jobs
```

**Get job by id**

```bash
curl http://localhost:3000/jobs/1
```

**Get job — invalid id**

```bash
curl http://localhost:3000/jobs/abc
```

**Get job — not found**

```bash
curl http://localhost:3000/jobs/999
```

---

**Update job — admin**

```bash
curl -X PATCH http://localhost:3000/jobs/1 \
-H "Authorization: Bearer admin-token" \
-H "Content-Type: application/json" \
-d '{
"title": "Principal Backend Engineer"
}'
```

**Update job — invalid empty body**

```bash
curl -X PATCH http://localhost:3000/jobs/1 \
-H "Authorization: Bearer admin-token" \
-H "Content-Type: application/json" \
-d '{}'
```

**Update job — user (should fail)**

```bash
curl -X PATCH http://localhost:3000/jobs/1 \
-H "Authorization: Bearer user-token" \
-H "Content-Type: application/json" \
-d '{
"title": "Should Not Work"
}'
```

**Update job — not found**

```bash
curl -X PATCH http://localhost:3000/jobs/999 \
-H "Authorization: Bearer admin-token" \
-H "Content-Type: application/json" \
-d '{"title":"Does not exist"}'
```

**Update job — invalid id**

```bash
curl -X PATCH http://localhost:3000/jobs/abc \
-H "Authorization: Bearer admin-token" \
-H "Content-Type: application/json" \
-d '{"title":"Bad id"}'
```

**Update job — no auth**

```bash
curl -X PATCH http://localhost:3000/jobs/1 \
-H "Content-Type: application/json" \
-d '{"title":"No auth"}'
```

**Update job — invalid auth format**

```bash
curl -X PATCH http://localhost:3000/jobs/1 \
-H "Authorization: admin-token" \
-H "Content-Type: application/json" \
-d '{"title":"Bad header"}'
```

---

**Delete job — admin**

```bash
curl -X DELETE http://localhost:3000/jobs/1 \
-H "Authorization: Bearer admin-token"
```

**Delete job — not found**

```bash
curl -X DELETE http://localhost:3000/jobs/999 \
-H "Authorization: Bearer admin-token"
```

**Delete job — user (should fail)**

```bash
curl -X DELETE http://localhost:3000/jobs/1 \
-H "Authorization: Bearer user-token"
```

**Delete job — no auth**

```bash
curl -X DELETE http://localhost:3000/jobs/1
```

**Delete job — invalid auth format**

```bash
curl -X DELETE http://localhost:3000/jobs/1 \
-H "Authorization: admin-token"
```

**Delete job — invalid id**

```bash
curl -X DELETE http://localhost:3000/jobs/abc \
-H "Authorization: Bearer admin-token"
```

