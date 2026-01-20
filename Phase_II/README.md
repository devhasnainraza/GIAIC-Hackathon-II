# Pure Tasks - Premium Task Management Application

A modern, full-stack task management application built with Next.js and FastAPI, featuring a premium UI/UX inspired by industry-leading productivity tools like Lark and Slack.

## 🌟 Overview

Pure Tasks is a production-ready task management platform that combines powerful features with an intuitive, beautiful interface. Built with enterprise-grade architecture and security practices, it offers everything from basic todo lists to advanced project management capabilities.

## ✨ Key Features

### Task Management
- **Multiple View Modes**: Switch between List, Board (Kanban), and Timeline (Gantt) views
- **Advanced Filtering**: Filter by status, priority, date range, projects, and tags
- **Smart Search**: Full-text search across tasks, projects, and tags
- **Bulk Operations**: Complete or delete multiple tasks at once
- **Priority Levels**: Organize tasks with low, medium, high, and urgent priorities
- **Status Tracking**: Track progress through todo, in-progress, review, and done states
- **Due Dates**: Set deadlines and track overdue tasks

### Organization
- **Projects**: Group related tasks into color-coded projects
- **Tags**: Categorize tasks with customizable colored tags
- **Smart Sorting**: Sort by creation date, due date, priority, or title

### User Experience
- **Premium UI**: Lark/Slack-inspired design with smooth animations and transitions
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Dark/Light Theme**: Automatic theme switching with user preferences
- **Keyboard Shortcuts**:
  - `N` - Create new task
  - `F` - Open filters
  - `Escape` - Close modals
  - `1/2/3` - Switch between List/Board/Timeline views
- **Real-time Notifications**: Stay updated with in-app notification system

### Analytics & Insights
- **User Dashboard**: Comprehensive overview with statistics and insights
- **Completion Tracking**: Monitor your productivity with completion rates and streaks
- **Activity Timeline**: View your recent actions and task history
- **Weekly Activity Charts**: Visualize your productivity patterns
- **Performance Metrics**: Track total tasks, completion rate, and productivity score

### User Profile
- **Profile Customization**: Add bio, location, website, and social links (GitHub, Twitter, LinkedIn)
- **Avatar Upload**: Cloud-based avatar storage with automatic optimization
- **User Settings**: Customize notifications, theme, language, and timezone preferences
- **Activity History**: Track all your actions and changes

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication with 7-day expiration
- **Password Reset**: Email-based password recovery with secure tokens
- **Bcrypt Hashing**: Industry-standard password encryption
- **Rate Limiting**: Protection against brute force attacks
- **User Isolation**: Complete data separation between users
- **Security Headers**: CORS, CSP, and other security best practices

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Authentication**: Better Auth 1.4.10
- **Date Handling**: date-fns 4.1.0
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI 0.109.0 (Python)
- **ORM**: SQLModel
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: JWT (HS256)
- **Password Hashing**: Bcrypt
- **Email**: Multi-provider (Resend, Gmail SMTP, Console)
- **File Storage**: Cloudinary
- **Validation**: Pydantic

### Infrastructure
- **Database**: Neon Serverless PostgreSQL
- **File Storage**: Cloudinary CDN
- **Email Service**: Resend / Gmail SMTP
- **Deployment Ready**: Docker, Kubernetes health checks

## 📋 Database Schema

The application uses a relational database with the following core tables:

- **users**: User accounts with profile information and settings
- **tasks**: Todo items with rich metadata (status, priority, due dates)
- **projects**: Task organization containers with colors
- **tags**: Categorization labels with many-to-many relationships
- **notifications**: User notification system
- **user_settings**: User preferences and configuration
- **user_activities**: Activity tracking and audit log

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **Python**: 3.11 or higher
- **PostgreSQL**: Database instance (Neon recommended)
- **Cloudinary Account**: For avatar uploads (optional)
- **Email Provider**: Resend or Gmail (for password reset)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv/Scripts/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Copy `.env.example` to `.env` and configure:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION_HOURS=168
   CORS_ORIGINS=http://localhost:3000
   ENVIRONMENT=development

   # Cloudinary (optional)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email Provider (choose one)
   EMAIL_PROVIDER=console  # Options: resend, gmail, console
   RESEND_API_KEY=your-resend-key
   # OR
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password

   FRONTEND_URL=http://localhost:3000
   FROM_EMAIL=noreply@puretasks.com
   ```

5. **Run database migrations**
   ```bash
   # Migrations are auto-applied on startup
   # Or manually run migration scripts in src/migrations/
   ```

6. **Start the backend server**
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative Docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**
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

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Production Deployment

For production deployment, refer to:
- `PRODUCTION_SETUP.md` - Complete production setup guide
- `PRODUCTION_QUICK_REFERENCE.md` - Quick reference for production configuration

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Task Endpoints

- `GET /api/tasks` - List all user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Project Endpoints

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get specific project
- `PATCH /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tag Endpoints

- `GET /api/tags` - List all tags
- `POST /api/tags` - Create new tag
- `GET /api/tags/{id}` - Get specific tag
- `PATCH /api/tags/{id}` - Update tag
- `DELETE /api/tags/{id}` - Delete tag

### User Endpoints

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `POST /api/users/me/avatar` - Upload avatar
- `DELETE /api/users/me/avatar` - Delete avatar
- `PATCH /api/users/me/settings` - Update user settings
- `POST /api/users/me/password` - Change password
- `GET /api/users/me/stats` - Get user statistics
- `GET /api/users/me/activity` - Get recent activity
- `DELETE /api/users/me` - Delete account

### Notification Endpoints

- `GET /api/notifications` - List all notifications
- `GET /api/notifications/unread` - Get unread count
- `PATCH /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications` - Clear all notifications

### Health & Monitoring

- `GET /health` - Comprehensive health check
- `GET /health/ready` - Readiness probe (Kubernetes)
- `GET /health/live` - Liveness probe (Kubernetes)
- `GET /metrics` - Application metrics

For detailed API documentation, visit `http://localhost:8000/docs` when running the backend.

## 🎨 UI Components

The application features a comprehensive component library:

### Authentication Components
- Sign in/Sign up forms with validation
- Password reset flow
- Auth guards and layouts

### Task Components
- Task list with multiple view modes
- Task detail panel with inline editing
- Create/edit task modal
- Bulk action toolbar

### Layout Components
- Responsive sidebar navigation
- Top header with search and notifications
- Mobile bottom navigation
- User menu with profile dropdown

### UI Elements
- Avatar upload with preview
- Notification dropdown with real-time updates
- Theme toggle (dark/light)
- Search modal with keyboard navigation
- Filter panel with advanced options

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with cost factor 12
- **Rate Limiting**: Protection on sensitive endpoints (3/hour for password reset requests)
- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: X-Frame-Options, CSP, X-Content-Type-Options
- **User Isolation**: All queries filtered by authenticated user
- **Token Expiration**: 7-day JWT expiration with secure refresh flow
- **SQL Injection Protection**: Parameterized queries via SQLModel ORM
- **XSS Protection**: Input sanitization and output encoding

## 📊 Performance Features

- **Connection Pooling**: Optimized database connections (5 pool, 10 overflow)
- **Request Logging**: Performance monitoring with slow request detection (>1s)
- **Lazy Loading**: Code splitting and dynamic imports
- **Image Optimization**: Cloudinary CDN with automatic resizing
- **Caching**: Strategic caching for static assets
- **Rate Limiting**: 60 requests/minute in production

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

Test files are located in:
- Backend: `backend/tests/`
- Frontend: `frontend/__tests__/`

## 📁 Project Structure

```
Phase_II/
├── backend/
│   ├── src/
│   │   ├── api/          # API route handlers
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── migrations/   # Database migrations
│   │   ├── config.py     # Configuration
│   │   ├── database.py   # Database setup
│   │   └── main.py       # FastAPI application
│   ├── tests/            # Backend tests
│   └── requirements.txt  # Python dependencies
│
├── frontend/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (dashboard)/  # Dashboard pages
│   │   └── page.tsx      # Landing page
│   ├── components/       # React components
│   │   ├── auth/         # Auth components
│   │   ├── tasks/        # Task components
│   │   ├── lark/         # Premium UI components
│   │   ├── landing/      # Landing page components
│   │   └── ui/           # Shared UI components
│   ├── lib/              # Utilities and helpers
│   ├── hooks/            # Custom React hooks
│   └── package.json      # Node dependencies
│
└── specs/                # Feature specifications
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from Lark, Slack, and Linear
- Built with modern web technologies and best practices
- Special thanks to the open-source community

## 📧 Contact & Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation in the `docs/` folder
- Review the API documentation at `/docs` endpoint

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time collaboration with WebSockets
- [ ] Mobile applications (iOS/Android)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Team workspaces and sharing
- [ ] Advanced analytics and reporting
- [ ] Task templates and automation
- [ ] File attachments for tasks
- [ ] Comments and discussions
- [ ] Time tracking
- [ ] Integrations (Slack, Discord, etc.)

## 📸 Screenshots

> Add screenshots of your application here to showcase the UI

---

**Built with ❤️ using Next.js and FastAPI**
