-- Create newsletter_subscribers table
-- This script can be run directly on your Neon PostgreSQL database

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verification_token VARCHAR(255),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    subscribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_verified ON newsletter_subscribers(is_verified);
CREATE INDEX IF NOT EXISTS idx_newsletter_token ON newsletter_subscribers(verification_token);

-- Add comment to table
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription information with email verification';

-- Success message
SELECT 'Newsletter subscribers table created successfully!' AS status;
