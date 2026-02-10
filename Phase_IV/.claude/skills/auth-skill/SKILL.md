---
name: auth-system
description: Build secure authentication systems with signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Auth System Skill

## Instructions

1. **User Registration (Signup)**
   - Collect email, username, and password
   - Validate input on frontend and backend
   - Hash passwords before storing in database

2. **User Login (Signin)**
   - Verify email/username exists
   - Compare hashed password securely
   - Return authentication token on success

3. **Password Security**
   - Use strong hashing algorithm (bcrypt / argon2)
   - Apply salting and proper cost factor
   - Never store plain-text passwords

4. **JWT Authentication**
   - Generate access and refresh tokens
   - Sign tokens with secret or private key
   - Set token expiration and rotation strategy

5. **Better Auth Integration**
   - Configure Better Auth provider
   - Connect user model and database
   - Handle session and token lifecycle via Better Auth

6. **Protected Routes**
   - Middleware to verify JWT tokens
   - Restrict access based on authentication state
   - Support role-based authorization (optional)

## Best Practices
- Enforce strong password rules
- Use HTTPS for all auth requests
- Store JWT in httpOnly cookies (preferred)
- Implement refresh token rotation
- Log and monitor authentication attempts
- Protect against brute-force and replay attacks

## Example Structure

```ts
// signup.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { email, password: hashedPassword }
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });

  res.json({ token });
}
