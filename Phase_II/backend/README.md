---
title: Pure Tasks Backend API
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# Pure Tasks Backend API

FastAPI backend for Pure Tasks - A modern task management application.

## Features

- 🔐 JWT Authentication
- 📝 Task Management
- 👥 User Management
- 🏷️ Tags & Projects
- 🔔 Notifications
- 📧 Email Integration
- 🗄️ PostgreSQL Database

## Environment Variables

Set these in your Hugging Face Space settings:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-secret-key-minimum-32-characters
CORS_ORIGINS=https://your-frontend.com
ENVIRONMENT=production
FRONTEND_URL=https://your-frontend.com
EMAIL_PROVIDER=gmail
FROM_EMAIL=your-email@gmail.com
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

## API Documentation

Once deployed, visit:
- API Docs: `https://your-space.hf.space/api/docs`
- Health Check: `https://your-space.hf.space/api/health`

## Tech Stack

- FastAPI
- SQLModel
- PostgreSQL (Neon)
- JWT Authentication
- Python 3.11
