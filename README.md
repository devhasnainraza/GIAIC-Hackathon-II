# Hackathon II: The Evolution of Todo

**Mastering Spec-Driven Development & Cloud Native AI**

A comprehensive journey from a simple Python console application to a fully-featured, cloud-native AI chatbot deployed on Kubernetes with event-driven architecture.

## 🎯 Project Overview

This hackathon demonstrates the complete evolution of a Todo application through five progressive phases, showcasing modern software development practices including:

- **Spec-Driven Development (SDD)** using Claude Code and Spec-Kit Plus
- **Full-Stack Development** with Next.js and FastAPI
- **AI Agent Development** using OpenAI Agents SDK and MCP
- **Cloud-Native Deployment** with Docker and Kubernetes
- **Event-Driven Architecture** using Kafka and Dapr
- **AIOps** with kubectl-ai and kagent

## 📊 Hackathon Phases

| Phase | Description | Technology Stack | Status |
|-------|-------------|------------------|--------|
| **Phase I** | In-Memory Python Console App | Python, Claude Code, Spec-Kit Plus | ✅ Complete |
| **Phase II** | Full-Stack Web Application | Next.js, FastAPI, SQLModel, Neon DB | ✅ Complete |
| **Phase III** | AI-Powered Todo Chatbot | OpenAI ChatKit, Agents SDK, MCP | ✅ Complete |
| **Phase IV** | Local Kubernetes Deployment | Docker, Minikube, Helm, kubectl-ai | ✅ Complete |
| **Phase V** | Advanced Cloud Deployment | Kafka, Dapr, GKE, Event-Driven | ✅ Complete |

## 🚀 Live Demo

**Production Application:** [https://puretasks.me](https://puretasks.me)

## 📁 Project Structure

```
Hackathon_II/
├── Phase_I/          # Python Console App
├── Phase_II/         # Full-Stack Web App (Basic)
├── Phase_III/        # AI Chatbot Integration
├── Phase_IV/         # Local Kubernetes Deployment
├── Phase_V/          # Production Cloud Deployment
│   ├── frontend/     # Next.js 16 App Router
│   ├── backend/      # FastAPI with SQLModel
│   ├── services/     # Microservices (Notification, Recurring Tasks)
│   ├── kubernetes/   # K8s manifests, Dapr, Ingress
│   └── specs/        # Spec-Driven Development artifacts
└── README.md         # This file
```

## 🎓 What You'll Learn

### Core Concepts
- ✅ Spec-Driven Development using Claude Code and Spec-Kit Plus
- ✅ Reusable Intelligence: Agents, Skills, and Subagent Development
- ✅ Full-Stack Development with Next.js, FastAPI, SQLModel
- ✅ AI Agent Development using OpenAI Agents SDK and MCP
- ✅ Cloud-Native Deployment with Docker, Kubernetes, Helm
- ✅ Event-Driven Architecture using Kafka and Dapr
- ✅ AIOps with kubectl-ai, kagent, and Claude Code

### Advanced Features Implemented
- ✅ User Authentication with Better Auth (JWT-based)
- ✅ Recurring Tasks with automatic instance creation
- ✅ Smart Reminders with email notifications
- ✅ Event-Driven Microservices Architecture
- ✅ Real-time notifications via Kafka
- ✅ HTTPS with automatic SSL certificates (Let's Encrypt)
- ✅ Production-grade Kubernetes deployment on GKE

## 📋 Phase Breakdown

### Phase I: Python Console App
**Objective:** Build a command-line todo application with in-memory storage

**Features:**
- Add, delete, update, view tasks
- Mark tasks as complete/incomplete
- Clean code principles and proper Python structure

**Technology:**
- Python 3.13+
- UV package manager
- Claude Code + Spec-Kit Plus

**Location:** `Phase_I/`

---

### Phase II: Full-Stack Web Application
**Objective:** Transform console app into a modern multi-user web application

**Features:**
- RESTful API endpoints
- Responsive frontend interface
- Persistent storage with PostgreSQL
- User authentication (signup/signin)
- JWT-based authorization

**Technology Stack:**

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth |

**API Endpoints:**
```
GET    /api/{user_id}/tasks          # List all tasks
POST   /api/{user_id}/tasks          # Create task
GET    /api/{user_id}/tasks/{id}     # Get task details
PUT    /api/{user_id}/tasks/{id}     # Update task
DELETE /api/{user_id}/tasks/{id}     # Delete task
PATCH  /api/{user_id}/tasks/{id}/complete  # Toggle completion
```

**Location:** `Phase_II/`

---

### Phase III: AI-Powered Chatbot
**Objective:** Create an AI-powered chatbot interface for managing todos through natural language

**Features:**
- Conversational interface for all task operations
- Natural language understanding
- Stateless chat endpoint with database persistence
- MCP server with task operation tools

**Technology Stack:**

| Component | Technology |
|-----------|-----------|
| Frontend | OpenAI ChatKit |
| Backend | Python FastAPI |
| AI Framework | OpenAI Agents SDK |
| MCP Server | Official MCP SDK |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |

**MCP Tools:**
- `add_task` - Create new tasks
- `list_tasks` - Retrieve tasks with filters
- `complete_task` - Mark tasks as complete
- `delete_task` - Remove tasks
- `update_task` - Modify task details

**Natural Language Examples:**
- "Add a task to buy groceries"
- "Show me all my pending tasks"
- "Mark task 3 as complete"
- "Change task 1 to 'Call mom tonight'"

**Location:** `Phase_III/`

---

### Phase IV: Local Kubernetes Deployment
**Objective:** Deploy the Todo Chatbot on a local Kubernetes cluster

**Features:**
- Containerized frontend and backend
- Helm charts for deployment
- Local deployment on Minikube
- AI-assisted DevOps with kubectl-ai and kagent

**Technology Stack:**

| Component | Technology |
|-----------|-----------|
| Containerization | Docker (Docker Desktop) |
| Docker AI | Docker AI Agent (Gordon) |
| Orchestration | Kubernetes (Minikube) |
| Package Manager | Helm Charts |
| AI DevOps | kubectl-ai, kagent |

**AIOps Commands:**
```bash
# Docker AI
docker ai "What can you do?"

# kubectl-ai
kubectl-ai "deploy the todo frontend with 2 replicas"
kubectl-ai "check why the pods are failing"

# kagent
kagent "analyze the cluster health"
kagent "optimize resource allocation"
```

**Location:** `Phase_IV/`

---

### Phase V: Advanced Cloud Deployment
**Objective:** Implement advanced features and deploy to production-grade Kubernetes

**Features:**

#### Part A: Advanced Features
- ✅ Recurring Tasks with automatic scheduling
- ✅ Due Dates & Smart Reminders
- ✅ Priorities & Tags/Categories
- ✅ Search & Filter capabilities
- ✅ Event-Driven Architecture with Kafka
- ✅ Dapr for distributed application runtime

#### Part B: Local Deployment
- ✅ Deployed to Minikube
- ✅ Full Dapr integration (Pub/Sub, State, Bindings, Secrets)

#### Part C: Cloud Deployment
- ✅ Deployed to Google Kubernetes Engine (GKE)
- ✅ Kafka cluster with Zookeeper
- ✅ Dapr microservices architecture
- ✅ Custom domain with HTTPS (puretasks.me)
- ✅ Automatic SSL certificates with cert-manager
- ✅ nginx-ingress-controller for routing

**Technology Stack:**

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16 (App Router) |
| Backend | FastAPI with SQLModel |
| Database | Neon Serverless PostgreSQL |
| Message Broker | Apache Kafka + Zookeeper |
| Service Mesh | Dapr |
| Microservices | Notification Service, Recurring Task Service |
| Infrastructure | Google Kubernetes Engine (GKE) |
| SSL/TLS | cert-manager + Let's Encrypt |
| Ingress | nginx-ingress-controller |
| Domain | puretasks.me |

**Event-Driven Architecture:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Backend API    │────▶│  Kafka Topics   │────▶│  Microservices  │
│  (Producer)     │     │  - reminders    │     │  - Notification │
│                 │     │  - task-events  │     │  - Recurring    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Kafka Topics:**

| Topic | Producer | Consumer | Purpose |
|-------|----------|----------|---------|
| **task-events** | Backend API | Recurring Task Service | Task CRUD operations |
| **reminders** | Backend API | Notification Service | Scheduled reminders |

**Microservices:**

1. **Notification Service**
   - Consumes reminder events from Kafka
   - Sends email notifications
   - Handles due date alerts

2. **Recurring Task Service**
   - Consumes task completion events
   - Automatically creates next occurrence
   - Manages recurring schedules

**Location:** `Phase_V/` (Current Production)

## 🛠️ Technology Stack Summary

### Frontend
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Authentication:** Better Auth (JWT)
- **State Management:** React Context

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.13+
- **ORM:** SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** JWT verification
- **API Documentation:** OpenAPI/Swagger

### AI & Chatbot
- **AI Framework:** OpenAI Agents SDK
- **Chat UI:** OpenAI ChatKit
- **MCP Server:** Official MCP SDK
- **Natural Language:** GPT-4 integration

### Infrastructure
- **Container Runtime:** Docker
- **Orchestration:** Kubernetes (GKE)
- **Package Manager:** Helm Charts
- **Message Broker:** Apache Kafka + Zookeeper
- **Service Mesh:** Dapr
- **Ingress:** nginx-ingress-controller
- **SSL/TLS:** cert-manager + Let's Encrypt

### DevOps & Tools
- **Spec-Driven Development:** Claude Code + Spec-Kit Plus
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions (optional)
- **AIOps:** kubectl-ai, kagent, Docker AI (Gordon)
- **Monitoring:** Kubernetes native tools

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- Docker Desktop
- kubectl
- Helm
- Minikube (for local development)
- Google Cloud SDK (for GKE deployment)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/hackathon-ii.git
cd hackathon-ii
```

#### 2. Phase V Setup (Latest)
```bash
cd Phase_V

# Frontend setup
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev

# Backend setup (in new terminal)
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn main:app --reload

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Production Deployment (GKE)

See `Phase_V/DEPLOYMENT.md` for detailed production deployment instructions.

**Quick Deploy:**
```bash
cd Phase_V

# Build and push Docker images
docker build -t YOUR_DOCKERHUB/frontend:latest ./frontend
docker build -t YOUR_DOCKERHUB/backend:latest ./backend
docker push YOUR_DOCKERHUB/frontend:latest
docker push YOUR_DOCKERHUB/backend:latest

# Deploy to GKE
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/
kubectl apply -f kubernetes/dapr/
kubectl apply -f kubernetes/kafka/

# Check deployment status
kubectl get pods -n todo-app
kubectl get ingress -n todo-app
```

## 📚 Documentation

### Phase-Specific Documentation
- **Phase I:** `Phase_I/README.md`
- **Phase II:** `Phase_II/README.md`
- **Phase III:** `Phase_III/README.md`
- **Phase IV:** `Phase_IV/README.md`
- **Phase V:** `Phase_V/README.md`

### Additional Guides
- **Event-Driven Architecture:** `Phase_V/EVENT_DRIVEN_DEPLOYMENT.md`
- **Public URL Setup:** `Phase_V/PUBLIC_URL_SETUP.md`
- **Deployment Guide:** `Phase_V/DEPLOYMENT.md`
- **Testing Instructions:** `Phase_V/TESTING_INSTRUCTIONS.md`

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.puretasks.me
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-domain-key
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://puretasks.me
DATABASE_URL=your-neon-database-url
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
cd Phase_V/frontend
npm test

# Backend tests
cd Phase_V/backend
pytest

# Integration tests
cd Phase_V
./run-integration-tests.sh
```

### Manual Testing
1. Visit https://puretasks.me
2. Sign up for a new account
3. Create tasks via UI or chatbot
4. Test recurring tasks and reminders
5. Verify notifications

## 📈 Project Phases Timeline

| Milestone | Date | Status |
|-----------|------|--------|
| Phase I Complete | Dec 7, 2025 | ✅ |
| Phase II Complete | Dec 14, 2025 | ✅ |
| Phase III Complete | Dec 21, 2025 | ✅ |
| Phase IV Complete | Jan 4, 2026 | ✅ |
| Phase V Complete | Jan 18, 2026 | ✅ |

## 🏆 Features Implemented

### Basic Level (Core Essentials)
- ✅ Add Task
- ✅ Delete Task
- ✅ Update Task
- ✅ View Task List
- ✅ Mark as Complete

### Intermediate Level (Organization & Usability)
- ✅ Priorities & Tags/Categories
- ✅ Search & Filter
- ✅ Sort Tasks

### Advanced Level (Intelligent Features)
- ✅ Recurring Tasks
- ✅ Due Dates & Time Reminders
- ✅ Email Notifications
- ✅ Event-Driven Architecture

## 🎯 Key Achievements

- ✅ **Spec-Driven Development:** All features implemented using SDD methodology
- ✅ **AI-Powered:** Natural language task management via chatbot
- ✅ **Cloud-Native:** Production deployment on GKE with auto-scaling
- ✅ **Event-Driven:** Microservices architecture with Kafka and Dapr
- ✅ **Secure:** JWT authentication, HTTPS, automatic SSL certificates
- ✅ **Scalable:** Kubernetes orchestration with horizontal pod autoscaling
- ✅ **Observable:** Comprehensive logging and monitoring

## 🤝 Contributing

This is a hackathon project demonstrating Spec-Driven Development. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the Spec-Driven Development workflow
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Developer:** Muhammad Hasnain
**Email:** developerhasnainraza@gmail.com
**GitHub:** [@devhasnainraza](https://github.com/devhasnainraza)

## 🙏 Acknowledgments

- **Panaversity** - For organizing the hackathon and providing guidance
- **Claude Code** - AI-powered development assistant
- **Spec-Kit Plus** - Spec-Driven Development framework
- **OpenAI** - AI agents and chatbot capabilities
- **Neon** - Serverless PostgreSQL database
- **Google Cloud** - GKE infrastructure
- **Dapr** - Distributed application runtime
- **Apache Kafka** - Event streaming platform

## 📊 Project Stats

- **Total Lines of Code:** ~15,000+
- **Number of Microservices:** 3 (Backend, Notification, Recurring Tasks)
- **Kubernetes Resources:** 20+ manifests
- **API Endpoints:** 15+
- **MCP Tools:** 5
- **Kafka Topics:** 2
- **Development Time:** 7 weeks
- **Phases Completed:** 5/5

## 🔗 Links

- **Live Application:** [https://puretasks.me](https://puretasks.me)
- **API Documentation:** [https://api.puretasks.me/docs](https://api.puretasks.me/docs)
- **Hackathon Details:** [GIAIC Hackathon II](https://docs.google.com/document/d/1KHxeDNnqG9uew-rEabQc5H8u3VmEN3OaJ_A1ZVVr9vY/edit?pli=1&tab=t.0)

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: developerhasnainraza@gmail.com

---

**Built with ❤️ using Spec-Driven Development, Claude Code, and modern cloud-native technologies.**

**Live Demo:** [https://puretasks.me](https://puretasks.me)
