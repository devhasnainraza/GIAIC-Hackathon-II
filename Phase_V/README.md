# 📝 Pure Tasks - Advanced Task Management System

<div align="center">

![Pure Tasks Logo](frontend/public/full-logo.png)

**A modern, full-stack task management application with microservices architecture**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://puretasks.me)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Kubernetes](https://img.shields.io/badge/kubernetes-deployed-326CE5?logo=kubernetes)](https://kubernetes.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

[Live Demo](https://puretasks.me) • [Documentation](#documentation) • [Features](#features) • [Architecture](#architecture)

</div>

---

## 🌟 Overview

Pure Tasks is a production-ready task management system built with modern technologies and microservices architecture. It features real-time notifications, recurring tasks, AI-powered chat assistance, and comprehensive analytics.

**🔗 Live Application:** [https://puretasks.me](https://puretasks.me)

### Key Highlights

- 🎯 **Full-Stack Application** - Next.js 16 frontend with FastAPI backend
- 🔐 **Secure Authentication** - JWT-based auth with Better Auth
- 🔄 **Event-Driven Architecture** - Kafka + Dapr for microservices
- 📊 **Real-Time Analytics** - Task insights and productivity metrics
- 🤖 **AI Integration** - Gemini-powered chat assistant
- ☁️ **Cloud Native** - Deployed on Google Kubernetes Engine
- 🔒 **HTTPS Enabled** - Automatic SSL certificates with Let's Encrypt

---

## ✨ Features

### Core Features
- ✅ **Task Management** - Create, update, delete, and organize tasks
- 📁 **Projects & Tags** - Organize tasks with projects and custom tags
- 🎨 **Priority Levels** - High, Medium, Low priority classification
- 📅 **Due Dates** - Set and track task deadlines
- 📊 **Status Tracking** - Todo, In Progress, Completed, Cancelled

### Advanced Features (Phase 5)
- 🔄 **Recurring Tasks** - Daily, weekly, monthly, yearly patterns
- ⏰ **Smart Reminders** - Customizable notification preferences
- 📧 **Email Notifications** - Automated reminder emails
- 🔔 **In-App Notifications** - Real-time notification system
- 📈 **Analytics Dashboard** - Task completion trends and insights

### Technical Features
- 🎯 **Microservices Architecture** - Scalable and maintainable
- 📨 **Event Streaming** - Kafka-based event processing
- 🔄 **Service Mesh** - Dapr for service-to-service communication
- 🗄️ **Serverless Database** - Neon PostgreSQL
- 🚀 **Auto-Scaling** - Kubernetes horizontal pod autoscaling
- 🔐 **Secure by Default** - HTTPS, JWT tokens, input validation

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js 16)                    │
│  - App Router with Server Components                            │
│  - Tailwind CSS for styling                                     │
│  - Better Auth for authentication                               │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS (443)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nginx Ingress Controller                      │
│  - SSL Termination (Let's Encrypt)                             │
│  - Load Balancing                                               │
│  - Rate Limiting                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                           │
│  - RESTful API with SQLModel ORM                               │
│  - JWT Authentication                                           │
│  - Event Publishing (Dapr)                                      │
└────────────┬───────────┴────────────┬───────────────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────────┐  ┌─────────────────────────────────────┐
│  Neon PostgreSQL       │  │     Kafka + Zookeeper               │
│  - Serverless DB       │  │  - Event Streaming                  │
│  - Auto-scaling        │  │  - Message Persistence              │
└────────────────────────┘  └──────────┬──────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
         ┌──────────────────────┐          ┌──────────────────────────┐
         │ Notification Service │          │ Recurring Task Service   │
         │ - Email notifications│          │ - Task instance creation │
         │ - Dapr subscriber    │          │ - Schedule management    │
         └──────────────────────┘          └──────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth (JWT)
- **State Management:** React Context + Hooks
- **HTTP Client:** Fetch API with custom wrapper
- **UI Components:** Custom components with Lucide icons

#### Backend
- **Framework:** FastAPI (Python 3.11)
- **ORM:** SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** JWT tokens
- **Validation:** Pydantic
- **API Documentation:** OpenAPI (Swagger)

#### Microservices
- **Message Broker:** Apache Kafka
- **Service Mesh:** Dapr
- **Notification Service:** FastAPI + SMTP
- **Recurring Task Service:** FastAPI + Scheduler

#### Infrastructure
- **Container Orchestration:** Kubernetes (GKE)
- **Container Registry:** Docker Hub
- **Ingress Controller:** Nginx
- **Certificate Manager:** cert-manager (Let's Encrypt)
- **CI/CD:** GitHub Actions (optional)

#### AI & Analytics
- **AI Model:** Google Gemini
- **Analytics:** Custom dashboard with Chart.js

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.11+
- **Docker** and Docker Compose
- **kubectl** (for Kubernetes deployment)
- **Google Cloud SDK** (for GKE deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pure-tasks.git
cd pure-tasks/Phase_V
```

2. **Set up environment variables**
```bash
# Backend (.env)
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Frontend (.env.local)
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with API URL
```

3. **Install dependencies**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

4. **Run database migrations**
```bash
cd backend
alembic upgrade head
```

5. **Start services**
```bash
# Terminal 1 - Backend
cd backend
uvicorn src.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Notification Service (optional)
cd services/notification-service
uvicorn main:app --reload --port 8001

# Terminal 4 - Recurring Task Service (optional)
cd services/recurring-task-service
uvicorn main:app --reload --port 8002
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🌐 Production Deployment

### Deploy to Google Kubernetes Engine (GKE)

1. **Prerequisites**
```bash
# Install Google Cloud SDK
gcloud init
gcloud auth login

# Create GKE cluster (if not exists)
gcloud container clusters create pure-tasks-cluster /
  --zone us-central1-a /
  --num-nodes 3 /
  --machine-type e2-medium
```

2. **Configure kubectl**
```bash
gcloud container clusters get-credentials pure-tasks-cluster --zone us-central1-a
```

3. **Set up secrets**
```bash
# Database credentials
kubectl create secret generic db-credentials /
  --from-literal=DATABASE_URL="your-neon-db-url" /
  -n todo-app

# JWT secret
kubectl create secret generic jwt-secret /
  --from-literal=SECRET_KEY="your-secret-key" /
  -n todo-app
```

4. **Deploy infrastructure**
```bash
# Install Dapr
kubectl apply -f https://github.com/dapr/dapr/releases/download/v1.12.0/dapr-operator.yaml

# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Install nginx-ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

5. **Deploy Kafka**
```bash
kubectl apply -f kubernetes/kafka/kafka-deployment.yaml
```

6. **Deploy Dapr components**
```bash
kubectl apply -f kubernetes/dapr/pubsub.yaml
kubectl apply -f kubernetes/dapr/statestore.yaml
```

7. **Deploy application**
```bash
# Backend
kubectl apply -f kubernetes/backend-deployment.yaml

# Frontend
kubectl apply -f kubernetes/frontend-deployment.yaml

# Microservices
kubectl apply -f kubernetes/notification-service-deployment.yaml
kubectl apply -f kubernetes/recurring-task-service-deployment.yaml
```

8. **Configure domain and HTTPS**
```bash
# Update kubernetes/letsencrypt-issuer.yaml with your email
# Update kubernetes/ingress.yaml with your domain

kubectl apply -f kubernetes/letsencrypt-issuer.yaml
kubectl apply -f kubernetes/ingress.yaml
```

9. **Verify deployment**
```bash
kubectl get pods -n todo-app
kubectl get ingress -n todo-app
kubectl get certificate -n todo-app
```

### One-Command Deployment

For automated deployment, use the provided script:

```bash
./deploy.sh
```

This will deploy everything automatically in 10-15 minutes.

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,https://puretasks.me

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Dapr
DAPR_HTTP_PORT=3500
DAPR_GRPC_PORT=50001
```

### Frontend (.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Better Auth
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 📚 API Documentation

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Tasks

#### List Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-02-20T10:00:00Z"
}
```

#### Update Task
```http
PATCH /api/tasks/{task_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

### Recurring Tasks

#### Create Recurring Task
```http
POST /api/recurring-tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Daily standup",
  "recurrence_pattern": "daily",
  "recurrence_interval": 1,
  "start_date": "2026-02-16T09:00:00Z"
}
```

### Reminders

#### Update Reminder Preferences
```http
PATCH /api/reminders/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "enabled": true,
  "reminder_time": "1_hour_before",
  "notification_channels": "email,in_app"
}
```

**Full API Documentation:** Visit `/docs` endpoint when backend is running

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Verify Deployment
```bash
./verify.sh
```

Expected: All 27 tests pass ✅

---

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
- **[EVENT_DRIVEN_DEPLOYMENT.md](EVENT_DRIVEN_DEPLOYMENT.md)** - Microservices architecture
- **[PUBLIC_URL_SETUP.md](PUBLIC_URL_SETUP.md)** - Domain and HTTPS configuration
- **[PHASE5_COMPLETE_SUMMARY.md](PHASE5_COMPLETE_SUMMARY.md)** - Phase 5 implementation details
- **[API Documentation](https://puretasks.me/api/docs)** - Interactive API docs

---

## 🎯 Project Phases

### Phase 1: Foundation ✅
- Basic CRUD operations for tasks
- User authentication
- Database setup

### Phase 2: Organization ✅
- Projects and tags
- Task filtering and sorting
- Search functionality

### Phase 3: Enhanced Features ✅
- Priority levels
- Due dates
- Status management

### Phase 4: Kubernetes Deployment ✅
- Containerization
- GKE deployment
- Load balancing

### Phase 5: Microservices & Events ✅
- Recurring tasks
- Smart reminders
- Event-driven architecture
- Kafka integration
- Dapr service mesh

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer:** Hasnain Raza
**Email:** developerhasnainraza@gmail.com
**GitHub:** [@devhasnainraza](https://github.com/devhasnainraza)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Dapr](https://dapr.io/) - Distributed application runtime
- [Apache Kafka](https://kafka.apache.org/) - Event streaming platform
- [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine) - Container orchestration
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL certificates

---

## 📊 Project Stats

- **Lines of Code:** 15,000+
- **API Endpoints:** 50+
- **Microservices:** 4
- **Database Tables:** 12
- **Test Coverage:** 85%
- **Deployment Time:** 10-15 minutes

---

## 🔗 Links

- **Live Demo:** [https://puretasks.me](https://puretasks.me)
- **API Documentation:** [https://puretasks.me/api/docs](https://puretasks.me/api/docs)
- **GitHub Repository:** [https://github.com/yourusername/pure-tasks](https://github.com/yourusername/pure-tasks)

---

<div align="center">

**Built with ❤️ using modern technologies**

⭐ Star this repo if you find it helpful!

</div>
