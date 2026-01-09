import { betterAuth } from "better-auth";

/**
 * Better Auth Configuration
 *
 * This configuration sets up JWT-based authentication with:
 * - 7-day token expiration
 * - HS256 algorithm (must match backend)
 * - PostgreSQL database for session management
 * - Email/password authentication
 *
 * CRITICAL: BETTER_AUTH_SECRET must match backend JWT_SECRET exactly
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    type: "postgres",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled for hackathon simplicity
  },
  jwt: {
    expiresIn: "7d", // 7-day token expiration
    algorithm: "HS256", // Must match backend algorithm
  },
});

/**
 * Type exports for Better Auth
 */
export type Session = typeof auth.$Infer.Session;
