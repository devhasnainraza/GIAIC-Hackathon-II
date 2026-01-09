# TaskFlow - Modern Task Management Application

Welcome to TaskFlow, a cutting-edge task management application built with Next.js, FastAPI, and PostgreSQL.

## 🚀 Features

- **Premium UI/UX**: Beautiful light/dark theme with no gradients, featuring a maximum of 3 brand colors (navy, gold, teal) for a sober, premium visual experience
- **Long-form Homepage**: Multi-section, visually rich homepage with smooth animations and professional design
- **Complete Profile System**: User profile management with avatar upload and information editing
- **Real-time Updates**: Live task synchronization
- **Secure Authentication**: JWT-based authentication system
- **RESTful API**: Well-documented API endpoints
- **Database Integration**: PostgreSQL with SQLModel ORM
- **Type Safety**: Full TypeScript support
- **Responsive Design**: Perfectly optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 AA compliant interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1.1, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python 3.11+
- **Database**: PostgreSQL with SQLModel
- **Authentication**: JWT tokens
- **ORM**: SQLModel for database operations
- **Styling**: Tailwind CSS for utility-first CSS
- **Animations**: Framer Motion for smooth, high-end animations

## Project Structure

```
Phase_II/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   │   ├── auth.py     # Authentication endpoints
│   │   │   └── tasks.py    # Task management endpoints
│   │   ├── models/         # SQLModel database models
│   │   │   ├── user.py     # User model
│   │   │   └── task.py     # Task model
│   │   ├── schemas/        # Pydantic schemas
│   │   │   ├── user.py     # User request/response schemas
│   │   │   └── task.py     # Task request/response schemas
│   │   ├── services/       # Business logic layer
│   │   │   ├── auth.py     # JWT utilities
│   │   │   ├── user_service.py  # User operations
│   │   │   └── task_service.py  # Task operations
│   │   ├── database.py     # Database configuration
│   │   ├── config.py       # Application settings
│   │   ├── deps.py         # FastAPI dependencies
│   │   └── main.py         # Application entry point
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js App Router pages
│   │   ├── (dashboard)/   # Protected dashboard pages
│   │   │   ├── layout.tsx # Dashboard layout with premium header/footer
│   │   │   └── tasks/     # Task management pages
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Premium homepage with multi-section design
│   │   └── globals.css    # Global styles and theme
│   ├── components/        # React components
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.tsx # Premium header with navigation
│   │   │   └── Footer.tsx # Comprehensive footer
│   │   ├── tasks/         # Task management components
│   │   │   ├── TaskItem.tsx    # Enhanced task item with animations
│   │   │   ├── TaskList.tsx    # Task list with statistics
│   │   │   ├── TaskForm.tsx    # Premium task form
│   │   │   └── CreateTaskButton.tsx # Elegant create button
│   │   └── auth/          # Authentication components
│   │       └── LogoutButton.tsx # Enhanced logout button
│   ├── lib/               # Utilities and API client
│   │   ├── api-client.ts  # API client with error handling
│   │   └── types.ts       # TypeScript type definitions
│   ├── styles/            # Style sheets
│   │   └── globals.css    # Global styles and theme
│   └── package.json       # Node dependencies
│
└── specs/                 # Project specifications and documentation
    └── 4-ui-ux-branding/  # UI/UX, Branding & Visual Experience specs
        ├── spec.md        # Feature specification
        ├── plan.md        # Implementation plan
        ├── tasks.md       # Task breakdown
        └── checklists/    # Quality assurance checklists
```

## Getting Started

For detailed setup instructions, see [quickstart.md](./specs/001-todo-web-app/quickstart.md)

### Quick Setup

1. **Clone the repository**
   ```bash
   cd E:\Hackathon_II\Phase_II
   ```

2. **Set up environment variables**
   - Copy `.env.example` files in both `backend/` and `frontend/` directories
   - Rename to `.env` and fill in your values

3. **Backend setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   alembic upgrade head
   uvicorn src.main:app --reload
   ```

4. **Frontend setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## User Stories

### Priority 1: User Registration and Authentication
- Users can register with email and password
- Users can login with credentials
- Users can logout
- JWT tokens for secure authentication

### Priority 2: Create and View Tasks
- Users can create tasks with title and description
- Users can view their task list
- Tasks are sorted by creation date (newest first)

### Priority 3: Mark Tasks Complete/Incomplete
- Users can toggle task completion status
- Visual indication of completed tasks (strikethrough)
- Status persists across sessions

### Priority 4: Edit Task Details
- Users can edit task title and description
- Changes are saved immediately
- Modal interface for editing

### Priority 5: Delete Tasks
- Users can delete tasks
- Confirmation dialog before deletion
- Permanent removal from database

## Security Features

- **Password Hashing**: Bcrypt with cost factor 12
- **JWT Authentication**: HS256 algorithm with 7-day expiration
- **User Isolation**: All database queries filtered by user_id
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Pydantic schemas on backend, client-side validation on frontend
- **Route Protection**: Middleware prevents unauthorized access

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks (Protected)
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Database Migrations
```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

### Code Quality
- Backend: Follow PEP 8 style guide
- Frontend: ESLint and Prettier configured
- Type checking: mypy (backend), TypeScript (frontend)

## Contributing

This project follows the Spec-Driven Development (SDD) workflow:
1. Specification (`spec.md`)
2. Planning (`plan.md`)
3. Task breakdown (`tasks.md`)
4. Implementation
5. Testing and validation

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please refer to the project documentation in the `specs/` directory.
