---
name: backend-core
description: Generate backend routes, handle HTTP requests and responses, and connect applications to a database. Use for API and server-side development.
---

# Backend Core Development

## Instructions

1. **Route generation**
   - Create RESTful endpoints (GET, POST, PUT, DELETE)
   - Use clear and consistent URL naming
   - Group related routes by resource

2. **Request & response handling**
   - Parse request body, params, and query strings
   - Validate incoming data
   - Return structured JSON responses
   - Use proper HTTP status codes

3. **Database integration**
   - Connect to a database (SQL or NoSQL)
   - Define data models / schemas
   - Perform CRUD operations safely
   - Handle connection errors gracefully

## Best Practices
- Follow REST conventions
- Use async/await for non-blocking operations
- Centralize error handling
- Never expose sensitive data in responses
- Use environment variables for credentials

## Example Structure
```js
// routes/user.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create user
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
