---
name: database-skill
description: Design and manage databases with clean schemas, migrations, and optimized table structures.
---

# Database Skill

## Instructions

1. **Schema design**
   - Identify entities and relationships
   - Normalize data (avoid duplication)
   - Define primary and foreign keys

2. **Table creation**
   - Use meaningful table and column names
   - Choose correct data types
   - Apply constraints (NOT NULL, UNIQUE, DEFAULT)

3. **Migrations**
   - Version-control schema changes
   - Write reversible migrations (up & down)
   - Test migrations before deploying

4. **Indexes & performance**
   - Add indexes on frequently queried fields
   - Avoid over-indexing
   - Monitor query performance

## Best Practices
- Follow naming conventions consistently
- Keep schemas simple and readable
- Always use migrations instead of manual DB edits
- Document schema changes
- Back up data before running migrations in production

## Example Structure
```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example migration (up)
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Example migration (down)
ALTER TABLE users DROP COLUMN is_active;
