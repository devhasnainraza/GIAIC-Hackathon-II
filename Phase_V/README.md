# Pure Tasks - AI-Powered Task Management Platform

A production-ready, full-stack task management application with integrated AI assistant, built with Next.js 16 and FastAPI. Features enterprise-grade security, real-time notifications, multiple view modes, and intelligent task automation.

## 🌟 Overview

Pure Tasks is a modern productivity platform that combines powerful task management with AI-driven assistance. Built with a focus on user experience, security, and scalability, it offers everything from simple todo lists to advanced project management with AI-powered insights.

**Live Demo:** [Backend API](https://hasnain-raza3-pure-tasks-backend.hf.space/docs)

---

## ✨ Key Features

### 🤖 AI Chat Assistant
- **Intelligent Task Management**: Create, update, and manage tasks through natural conversation
- **Powered by Gemini 2.5 Flash**: Fast, accurate responses with tool calling capabilities
- **Conversation History**: Persistent chat history across sessions
- **Smart Context**: AI understands task priorities, due dates, and project context
- **Multi-Conversation Support**: Organize different topics in separate conversations
- **Mobile & Desktop**: Floating chat widget on mobile, dedicated page on desktop

### 📋 Advanced Task Management
- **Multiple View Modes**:
  - List view with sorting and filtering
  - Kanban board with drag-and-drop
  - Timeline/Gantt view for project planning
- **Smart Filtering**: Filter by status, priority, date range, projects, and tags
- **Full-Text Search**: Search across titles, descriptions, projects, and tags
- **Bulk Operations**: Complete or delete multiple tasks at once
- **Priority System**: Low, medium, high, and urgent priority levels
- **Status Tracking**: Todo → In Progress → Review → Done workflow
- **Due Date Management**: Set deadlines and track overdue tasks
- **Export Options**: Export tasks to CSV, JSON, or PDF

### 🎯 Organization & Productivity
- **Projects**: Group related tasks with color-coded projects
- **Tags**: Categorize tasks with customizable colored tags (many-to-many)
- **Smart Sorting**: Sort by creation date, due date, priority, or title
- **Task Statistics**: Real-time metrics on completion rates and productivity
- **Weekly Activity Charts**: Visualize productivity patterns over time
- **Productivity Score**: AI-calculated score based on completion rates and consistency

### 🔔 Smart Notifications
- **Automatic Notifications**: Task created, completed, updated, deleted
- **Smart Alerts**: Due today, due tomorrow, overdue, high priority
- **Notification Preferences**: Customize which notifications you receive
- **Unread Count Badge**: Never miss important updates
- **Mark as Read/Unread**: Manage notification status
- **Clear All**: Bulk notification management

### 👤 User Profile & Settings
- **Rich Profiles**: Bio, location, website, social links (GitHub, Twitter, LinkedIn)
- **Avatar Upload**: Cloudinary-hosted with automatic optimization (300x300, face detection)
- **User Settings**:
  - Email notifications (on/off)
  - Push notifications (on/off)
  - Weekly summary emails
  - Theme preference (light/dark/system)
  - Language and timezone
- **Activity History**: Track all actions and changes
- **User Statistics**: Total tasks, completion rate, streaks, and more

### 🔐 Enterprise Security
- **JWT Authentication**: Secure token-based auth with 7-day expiration
- **Bcrypt Password Hashing**: Industry-standard encryption
- **Password Reset Flow**: Email-based recovery with secure tokens (24-hour expiration)
- **Rate Limiting**: 60 requests/minute in production, 3/hour for password reset
- **Security Headers**: X-Frame-Options, CSP, HSTS, X-Content-Type-Options
- **User Isolation**: Complete data separation between users
- **SQL Injection Protection**: Parameterized queries via SQLModel ORM
- **CORS Configuration**: Controlled cross-origin access

### 🎨 Premium UI/UX
- **Lark/Slack-Inspired Design**: Modern, professional interface
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Dark Mode Support**: System preference detection with manual toggle
- **Smooth Animations**: Fade, slide, scale, and gradient effects
- **Keyboard Shortcuts**:
  - `N` - Create new task
  - `F` - Open filters
  - `Escape` - Close modals
  - `1/2/3` - Switch between List/Board/Timeline views
  - `Ctrl+K` - Quick actions
- **Loading States**: Skeleton screens and spinners
- **Empty States**: Helpful placeholders with CTAs
- **Touch-Friendly**: Minimum 44x44px touch targets

### 📧 Newsletter System
- **Email Subscription**: Subscribe to product updates
- **Email Verification**: Token-based verification flow
- **Unsubscribe Support**: Easy opt-out with resubscribe capability
- **Admin Panel**: Send newsletters to all subscribers
- **Multi-Provider Email**: Resend, Gmail SMTP, or Console (dev)

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.4.19 | Utility-first styling |
| **Lucide React** | 0.562.0 | Icon library |
| **Framer Motion** | 12.29.2 | Animation library |
| **date-fns** | 4.1.0 | Date manipulation |
| **Vercel AI SDK** | 3.4.33 | AI integration |
| **Better Auth** | 1.4.10 | Authentication (configured) |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.109.0 | Modern async web framework |
| **Python** | 3.11+ | Runtime environment |
| **SQLModel** | 0.0.14 | SQL ORM (SQLAlchemy + Pydantic) |
| **PostgreSQL** | Latest | Neon Serverless database |
| **python-jose** | 3.3.0 | JWT token handling |
| **passlib[bcrypt]** | 1.7.4 | Password hashing |
| **Cloudinary** | 1.44.1 | Image storage and optimization |
| **Resend** | 0.8.0 | Email service (recommended) |
| **OpenAI Agents SDK** | 0.7.0+ | AI agent framework |
| **Gemini 2.5 Flash** | Latest | AI model via OpenAI-compatible API |
| **pytest** | 7.4.3 | Testing framework |

### Infrastructure
- **Database**: Neon Serverless PostgreSQL with connection pooling
- **File Storage**: Cloudinary CDN with automatic optimization
- **Email**: Resend (recommended) or Gmail SMTP
- **AI Model**: Gemini 2.5 Flash via OpenAI-compatible endpoint
- **Deployment**: Docker-ready with Kubernetes health checks

---

## 🏗️ Architecture

### Backend Architecture (FastAPI)
```
src/
├── api/              # REST API endpoints
│   ├── auth.py       # Authentication routes
│   ├── tasks.py      # Task CRUD operations
│   ├── users.py      # User profile & settings
│   ├── projects.py   # Project management
│   ├── tags.py       # Tag management
│   ├── notifications.py  # Notification system
│   ├── chat.py       # AI chat interface
│   └── newsletter.py # Newsletter subscription
├── models/           # SQLModel database models
├── schemas/          # Pydantic request/response schemas
├── services/         # Business logic layer
│   ├── task_service.py
│   ├── user_service.py
│   ├── chat_service.py
│   ├── agent_service.py  # AI agent integration
│   ├── notification_service.py
│   └── cloudinary_storage.py
├── mcp/              # Model Context Protocol server
│   ├── server.py     # MCP server implementation
│   └── tool_executor.py  # AI tool handlers
├── config.py         # Configuration management
├── database.py       # Database connection & session
└── main.py           # FastAPI application entry
```

### Frontend Architecture (Next.js)
```
app/
├── (auth)/           # Authentication pages
│   ├── signin/
│   ├── signup/
│   ├── forgot-password/
│   └── reset-password/
├── (dashboard)/      # Protected dashboard pages
│   ├── dashboard/    # Overview & statistics
│   ├── tasks/        # Task management
│   ├── calendar/     # Calendar view
│   ├── analytics/    # Analytics & insights
│   ├── profile/      # User profile
│   └── settings/     # User settings
├── chat/             # AI chat interface
│   ├── page.tsx      # Main chat page
│   └── [id]/         # Specific conversation
├── page.tsx          # Landing page
└── layout.tsx        # Root layout

components/
├── auth/             # Authentication components
├── tasks/            # Task management components
├── lark/             # Premium UI components (Lark-inspired)
├── chat/             # AI chat components
├── landing/          # Landing page sections
└── ui/               # Reusable UI components

lib/
├── api-client.ts     # Type-safe API client
├── types.ts          # TypeScript interfaces
├── auth.ts           # Authentication utilities
├── chat-api.ts       # Chat API integration
└── theme-context.tsx # Theme management
```

---

## ☁️ Cloud Deployment

Pure Tasks is production-ready and can be deployed to any Kubernetes-compliant cloud provider.

### Prerequisites

- **Cloud Provider**: Google Cloud Platform (GCP) with $300 free credit
- **Container Registry**: Docker Hub, GitHub Container Registry, or cloud provider registry
- **Tools**: Docker, kubectl, Helm 3.x, Git, gcloud CLI
- **Database**: Neon Serverless PostgreSQL (already provisioned)

### Quick Start

1. **Provision Cloud Cluster**: Follow [GCP Setup Guide](docs/deployment/gcp-setup.md)
2. **Build & Push Images**: Use [Registry Setup Guide](docs/deployment/registry-setup.md)
3. **Deploy Application**: Follow [Cloud Setup Guide](docs/deployment/cloud-setup.md)
4. **Configure CI/CD**: Set up [GitHub Actions](docs/deployment/cicd-setup.md)

### Deployment Features

- ✅ **Free Trial**: $300 credit for 90 days (sufficient for 3 months)
- ✅ **Horizontal Scaling**: Scale to multiple replicas for high availability
- ✅ **Public Access**: LoadBalancer with external IP
- ✅ **CI/CD Automation**: GitHub Actions for automated deployments
- ✅ **Health Monitoring**: Kubernetes probes and health check endpoints
- ✅ **Secrets Management**: Kubernetes Secrets for secure credential storage

### Documentation

- 📖 [Complete Deployment Guide](docs/deployment/cloud-setup.md) - Step-by-step instructions
- 🌐 [GCP Cluster Setup](docs/deployment/gcp-setup.md) - Google Kubernetes Engine setup
- 📋 [Deployment Checklist](docs/deployment/checklist.md) - Pre-deployment validation
- 🔧 [Troubleshooting Guide](docs/deployment/troubleshooting.md) - Common issues and solutions
- 📊 [Scaling Guide](docs/deployment/scaling.md) - Horizontal scaling and performance
- 💰 [Cost Monitoring](docs/deployment/cost-monitoring.md) - Track and optimize costs

### Architecture

```
┌─────────────────────────────────────────────┐
│    Google Kubernetes Engine (GKE)          │
│  ┌────────────────────────────────────────┐ │
│  │  Frontend (Next.js)                    │ │
│  │  - 1-3 replicas                        │ │
│  │  - LoadBalancer (Public IP)            │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │  Backend (FastAPI)                     │ │
│  │  - 2-3 replicas                        │ │
│  │  - ClusterIP (Internal)                │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
              │
              ↓
    ┌──────────────────┐
    │  Neon PostgreSQL │
    │  (External)      │
    └──────────────────┘
```
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
              │
              ↓
    ┌──────────────────┐
    │  Neon PostgreSQL │
    │  (External)      │
    └──────────────────┘
```

---

## 📚 Complete API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/auth/register` | Register new user | None |
| POST | `/auth/login` | Login with email/password | None |
| POST | `/auth/logout` | Logout (client-side) | None |
| POST | `/auth/forgot-password` | Request password reset | 3/hour |
| POST | `/auth/reset-password` | Reset password with token | 5/hour |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | List all user tasks | ✓ |
| POST | `/tasks` | Create new task | ✓ |
| GET | `/tasks/{id}` | Get specific task | ✓ |
| PATCH | `/tasks/{id}` | Update task | ✓ |
| DELETE | `/tasks/{id}` | Delete task | ✓ |

**Task Fields:**
- `title` (required, 1-200 chars)
- `description` (optional, max 2000 chars)
- `status` (todo, in_progress, review, done)
- `priority` (low, medium, high, urgent)
- `due_date` (ISO datetime)
- `project_id` (foreign key)
- `tags` (many-to-many relationship)

### Users (`/api/users`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Get current user profile | ✓ |
| PATCH | `/users/me` | Update profile | ✓ |
| POST | `/users/me/avatar` | Upload avatar (5MB max) | ✓ |
| DELETE | `/users/me/avatar` | Delete avatar | ✓ |
| PATCH | `/users/me/settings` | Update settings | ✓ |
| POST | `/users/me/password` | Change password | ✓ |
| GET | `/users/me/stats` | Get statistics | ✓ |
| GET | `/users/me/activity` | Get activity history | ✓ |
| GET | `/users/me/weekly-activity` | Get weekly chart data | ✓ |
| DELETE | `/users/me` | Delete account | ✓ |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/projects` | List all projects | ✓ |
| POST | `/projects` | Create project | ✓ |
| GET | `/projects/{id}` | Get specific project | ✓ |
| PATCH | `/projects/{id}` | Update project | ✓ |
| DELETE | `/projects/{id}` | Delete project | ✓ |

### Tags (`/api/tags`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tags` | List all tags | ✓ |
| POST | `/tags` | Create tag | ✓ |
| GET | `/tags/{id}` | Get specific tag | ✓ |
| PATCH | `/tags/{id}` | Update tag | ✓ |
| DELETE | `/tags/{id}` | Delete tag | ✓ |

### Chat (`/api/chat`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/chat` | Send message to AI | ✓ |
| GET | `/chat/conversations` | List conversations | ✓ |
| GET | `/chat/conversations/{id}` | Get conversation | ✓ |
| DELETE | `/chat/conversations/{id}` | Delete conversation | ✓ |

**AI Agent Tools:**
- `add_task` - Create task from natural language
- `list_tasks` - Get all user tasks
- `complete_task` - Mark task as done
- `update_task` - Modify task details
- `delete_task` - Remove task
- `get_stats` - Get productivity statistics

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications` | List all notifications | ✓ |
| GET | `/notifications/unread` | Get unread count | ✓ |
| PATCH | `/notifications/{id}/read` | Mark as read | ✓ |
| POST | `/notifications/mark-all-read` | Mark all as read | ✓ |
| DELETE | `/notifications` | Clear all | ✓ |

### Newsletter (`/api/newsletter`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/newsletter/subscribe` | Subscribe to newsletter | No |
| GET | `/newsletter/verify/{token}` | Verify email | No |
| POST | `/newsletter/unsubscribe` | Unsubscribe | No |
| GET | `/newsletter/subscribers` | Get all subscribers (Admin) | No |
| POST | `/newsletter/send` | Send newsletter (Admin) | No |

### Health & Monitoring (`/`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Comprehensive health check | No |
| GET | `/health/ready` | Readiness probe (K8s) | No |
| GET | `/health/live` | Liveness probe (K8s) | No |
| GET | `/metrics` | Application metrics | No |

**Interactive API Docs:** Visit `/docs` for Swagger UI or `/redoc` for ReDoc

---

## 💾 Database Schema

### Core Tables

**users**
```sql
- id: SERIAL PRIMARY KEY
- email: VARCHAR UNIQUE NOT NULL
- hashed_password: VARCHAR NOT NULL
- name: VARCHAR
- bio: VARCHAR(500)
- location: VARCHAR
- website: VARCHAR
- github, twitter, linkedin: VARCHAR
- avatar_url: VARCHAR
- reset_token: VARCHAR
- reset_token_expires: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**tasks**
```sql
- id: SERIAL PRIMARY KEY
- user_id: INTEGER REFERENCES users(id)
- title: VARCHAR(200) NOT NULL
- description: VARCHAR(2000)
- status: VARCHAR (todo/in_progress/review/done)
- priority: VARCHAR (low/medium/high/urgent)
- due_date: TIMESTAMP
- project_id: INTEGER REFERENCES projects(id)
- is_complete: BOOLEAN DEFAULT FALSE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- completed_at: TIMESTAMP
```

**conversations**
```sql
- id: SERIAL PRIMARY KEY
- user_id: INTEGER REFERENCES users(id)
- title: VARCHAR(200)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**messages**
```sql
- id: SERIAL PRIMARY KEY
- conversation_id: INTEGER REFERENCES conversations(id) ON DELETE CASCADE
- role: VARCHAR (user/assistant)
- content: VARCHAR(10000) NOT NULL
- created_at: TIMESTAMP
```

**Other Tables:**
- `projects` - Task organization with colors
- `tags` - Categorization labels
- `task_tags` - Many-to-many junction table
- `notifications` - User notification system
- `user_settings` - User preferences
- `user_activities` - Activity tracking
- `newsletter_subscribers` - Newsletter management

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.11 or higher
- **PostgreSQL** (Neon Serverless recommended)
- **Cloudinary Account** (optional, for avatar uploads)
- **Email Provider** (Resend or Gmail for password reset)
- **Gemini API Key** (for AI chat features)

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv/Scripts/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create `.env` file:
   ```env
   # Database (Required)
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   DATABASE_POOL_SIZE=5
   DATABASE_MAX_OVERFLOW=10

   # JWT Authentication (Required)
   JWT_SECRET=your-secret-key-minimum-32-characters-long
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION_HOURS=168

   # CORS (Required)
   CORS_ORIGINS=http://localhost:3000,https://your-domain.com

   # Environment (Required)
   ENVIRONMENT=development  # or production
   LOG_LEVEL=INFO
   FRONTEND_URL=http://localhost:3000

   # Email Provider (Required for password reset)
   EMAIL_PROVIDER=resend  # Options: resend, gmail, console
   FROM_EMAIL=noreply@puretasks.com

   # Resend (Recommended)
   RESEND_API_KEY=re_xxxxxxxxxxxxx

   # OR Gmail SMTP
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password

   # Cloudinary (Optional - for avatar uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # AI Agent (Required for chat features)
   GEMINI_API_KEY=your-gemini-api-key
   AGENT_MODEL=gemini-2.5-flash
   AGENT_TEMPERATURE=0.7
   AGENT_MAX_TOKENS=1000

   # Rate Limiting (Production)
   RATE_LIMIT_PER_MINUTE=60

   # MCP Server (Optional)
   MCP_SERVER_NAME=puretasks-mcp-server
   MCP_SERVER_PORT=8001
   ```

5. **Run database migrations**
   ```bash
   # Migrations auto-apply on startup
   # Or manually: python -m src.migrations.run_migrations
   ```

6. **Start the backend server**
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

   API available at: `http://localhost:8000`
   - Swagger Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Application available at: `http://localhost:3000`

### Production Deployment

**Backend (FastAPI):**
```bash
# Using Uvicorn with workers
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4

# Using Gunicorn with Uvicorn workers
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Frontend (Next.js):**
```bash
npm run build
npm start
```

**Docker:**
```bash
# Backend
docker build -t puretasks-backend ./backend
docker run -p 8000:8000 --env-file .env puretasks-backend

# Frontend
docker build -t puretasks-frontend ./frontend
docker run -p 3000:3000 puretasks-frontend
```

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong, random 32+ character string
- [ ] Set `ENVIRONMENT=production`
- [ ] Use `EMAIL_PROVIDER=resend` or `gmail` (not `console`)
- [ ] Enable HTTPS for `FRONTEND_URL`
- [ ] Add `sslmode=require` to `DATABASE_URL`
- [ ] Configure proper `CORS_ORIGINS` (no wildcards)
- [ ] Set up rate limiting (`RATE_LIMIT_PER_MINUTE=60`)
- [ ] Enable security headers (automatic in production)
- [ ] Use strong passwords (min 8 characters)
- [ ] Regularly rotate JWT secrets
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated

### Security Features

- **JWT Tokens**: HS256 algorithm, 7-day expiration
- **Password Hashing**: Bcrypt with automatic salt
- **Rate Limiting**: 60 req/min (production), 3/hour (password reset)
- **Security Headers**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- **User Isolation**: All queries filtered by authenticated user
- **SQL Injection Protection**: Parameterized queries via ORM
- **XSS Protection**: Input sanitization, output encoding
- **CORS**: Configurable origins, credentials allowed

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest                          # Run all tests
pytest --cov                    # With coverage
pytest tests/test_auth.py       # Specific test file
pytest -v                       # Verbose output
```

### Frontend Tests
```bash
cd frontend
npm test                        # Run tests
npm run test:watch              # Watch mode
npm run test:coverage           # With coverage
```

---

## 📁 Project Structure

```
Phase_III/
├── backend/
│   ├── src/
│   │   ├── api/              # REST API endpoints
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   ├── mcp/              # MCP server for AI agents
│   │   ├── migrations/       # Database migrations
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # Database setup
│   │   └── main.py           # FastAPI app
│   ├── tests/                # Backend tests
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Auth pages
│   │   ├── (dashboard)/      # Dashboard pages
│   │   ├── chat/             # Chat interface
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── auth/             # Auth components
│   │   ├── tasks/            # Task components
│   │   ├── lark/             # Premium UI
│   │   ├── chat/             # Chat components
│   │   ├── landing/          # Landing sections
│   │   └── ui/               # Shared UI
│   ├── lib/                  # Utilities
│   ├── hooks/                # Custom hooks
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   └── .env.local            # Environment variables
│
├── specs/                    # Feature specifications
├── .claude/                  # Claude Code configuration
└── README.md                 # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with clear, descriptive commits
4. **Add tests** for new features
5. **Update documentation** as needed
6. **Ensure all tests pass** (`pytest` and `npm test`)
7. **Submit a Pull Request** with a clear description

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add type hints (Python) and TypeScript types
- Include docstrings for functions and classes
- Test edge cases and error handling
- Update API documentation for endpoint changes
- Keep PRs focused on a single feature/fix

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Design Inspiration**: Lark, Slack, Linear, Notion
- **AI Model**: Google Gemini 2.5 Flash
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: Neon Serverless PostgreSQL
- **Email**: Resend
- **Storage**: Cloudinary
- **Framework**: Next.js & FastAPI

---

## 📧 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/pure-tasks/issues)
- **Documentation**: Check `/docs` endpoint for API docs
- **Email**: support@puretasks.com

---

## 🗺️ Roadmap

### Current Features ✅
- [x] Task management with multiple views
- [x] AI chat assistant with tool calling
- [x] User authentication and profiles
- [x] Projects and tags
- [x] Notifications system
- [x] Avatar uploads
- [x] Email notifications
- [x] Newsletter system
- [x] Export functionality

### Upcoming Features 🚀
- [ ] Real-time collaboration with WebSockets
- [ ] Team workspaces and sharing
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Task templates and automation
- [ ] File attachments for tasks
- [ ] Comments and discussions
- [ ] Time tracking
- [ ] Recurring tasks
- [ ] Subtasks and dependencies
- [ ] Integrations (Slack, Discord, Zapier)
- [ ] API webhooks
- [ ] Custom fields
- [ ] Advanced permissions

---

**Built with ❤️ using Next.js 16, FastAPI, and OpenAI Agents SDK**

**Version**: 1.0.0 | **Last Updated**: January 2026
