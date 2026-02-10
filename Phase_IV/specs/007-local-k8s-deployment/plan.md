# Implementation Plan: Local Cloud-Native Deployment

**Branch**: `007-local-k8s-deployment` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-local-k8s-deployment/spec.md`

## Summary

Deploy the Phase III Todo AI Chatbot as a cloud-native application on local Kubernetes (Minikube) using containerization, Helm package management, and AI-assisted DevOps tools. The deployment will containerize the existing Next.js frontend and FastAPI backend, create Kubernetes manifests for orchestration, package everything with Helm for reproducible deployments, and integrate AI tools (Gordon, kubectl-ai, kagent) for deployment automation and troubleshooting.

**Technical Approach**: Leverage existing Dockerfile for backend, create new Dockerfile for frontend, design Kubernetes Deployments with health checks and resource limits, expose services via NodePort for local access, use Helm charts for configuration management, and integrate AI DevOps tools for natural language deployment operations.

## Technical Context

**Language/Version**:
- Backend: Python 3.11
- Frontend: Node.js 20+ (Next.js 16)
- Container Runtime: Docker Desktop
- Orchestration: Kubernetes 1.28+ (Minikube)

**Primary Dependencies**:
- Backend: FastAPI 0.109.0, SQLModel 0.0.14, OpenAI Agents SDK 0.7.0, MCP SDK 1.0.0
- Frontend: Next.js 16.1.1, React 19.2.3, ChatKit 1.4.3, Better Auth 1.4.10
- Infrastructure: Docker, Minikube, Helm 3.x, kubectl

**Storage**:
- Database: External Neon Serverless PostgreSQL (no local persistence needed)
- Uploads: Persistent Volume for backend uploads directory (avatars, attachments)

**Testing**:
- Container testing: Docker build and run locally
- Kubernetes testing: kubectl get pods, logs, port-forward
- Integration testing: End-to-end user flows via browser
- AI tool testing: Natural language commands via kubectl-ai and kagent

**Target Platform**:
- Local development: Windows/macOS/Linux with Minikube
- Container images: linux/amd64 architecture
- Kubernetes: Single-node local cluster

**Project Type**: Web application (frontend + backend microservices)

**Performance Goals**:
- Container startup: < 30 seconds per service
- Deployment time: < 3 minutes from helm install to ready
- Pod restart: < 15 seconds
- Health check response: < 2 seconds

**Constraints**:
- Local resources: 4GB RAM minimum, 2 CPU cores
- Network: NodePort range 30000-32767 for service exposure
- Storage: 10GB disk space for images and persistent volumes
- Database: External Neon connection (no local PostgreSQL)

**Scale/Scope**:
- Development deployment: 1-2 replicas per service
- Concurrent users: 1-5 developers
- Request volume: < 100 req/min
- Data volume: < 1GB uploads

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Correctness & Specification Adherence
- All functional requirements from spec.md will be implemented
- Deployment must maintain Phase III functionality identically
- Acceptance criteria defined for each user story

### ✅ Principle II: Security-First Design
- JWT tokens passed via environment variables (not hardcoded)
- Secrets managed via Kubernetes Secrets
- HTTPS not required for local development (HTTP acceptable)
- Database connection uses SSL (Neon requirement)

### ✅ Principle III: User Data Isolation
- No changes to application code (isolation already enforced)
- Deployment preserves existing user_id filtering
- Database remains external (Neon) with existing access controls

### ✅ Principle IV: AI-First Development
- All Dockerfiles, Kubernetes manifests, and Helm charts generated via AI prompts
- Gordon for Docker operations
- kubectl-ai for Kubernetes deployments
- Deployment steps documented as prompts

### ✅ Principle V: Technology Stack Immutability
- No application code changes
- Deployment uses specified tools: Docker, Minikube, Helm
- AI tools: Gordon, kubectl-ai, kagent as specified

### ✅ Principle VI: Reproducibility & Quality
- Helm charts enable single-command deployment
- All configuration version-controlled
- Documentation includes step-by-step reproduction guide
- Environment variables externalized via ConfigMaps/Secrets

### ✅ Principle VII: Stateless & Scalable Architecture
- Application already stateless (verified in codebase review)
- Conversation history loaded from database per request
- No in-memory session state
- Horizontal scaling ready (can increase replicas)

### ✅ Principle VIII: MCP Tool Primacy
- No changes to MCP architecture
- MCP server runs alongside FastAPI (same container)
- Tools remain stateless and database-backed

### ✅ Principle IX: Modular Architecture
- Frontend and backend deployed as separate Kubernetes Deployments
- Services communicate via Kubernetes DNS
- Each component independently scalable
- Clear layer boundaries preserved

### ✅ Principle X: User-Centric UX
- No UX changes (deployment only)
- Application remains accessible via browser
- Performance maintained (startup time < 3 minutes)

### ✅ Principle XI: Cloud-Native Mindset
- **PRIMARY FOCUS**: Container-first architecture
- Kubernetes-native deployment patterns
- Infrastructure as code (Helm charts)
- Health checks and readiness probes
- Resource limits and requests defined
- Horizontal pod autoscaling ready

**Gate Status**: ✅ PASSED - All principles satisfied, no violations

## Project Structure

### Documentation (this feature)

```text
E:/Hackathon_II/Phase_VI/specs/007-local-k8s-deployment/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (containerization best practices)
├── data-model.md        # Phase 1 output (Kubernetes resources)
├── quickstart.md        # Phase 1 output (deployment guide)
├── contracts/           # Phase 1 output (Helm values schema)
│   └── helm-values.yaml
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (Phase III application - READ ONLY)

```text
E:/Hackathon_II/Phase_III/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # Database connection
│   │   ├── api/                 # REST endpoints
│   │   ├── models/              # SQLModel entities
│   │   ├── services/            # Business logic
│   │   └── mcp/                 # MCP server and tools
│   ├── Dockerfile               # Existing backend Dockerfile
│   ├── docker-compose.yml       # Existing compose file
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment template
│
└── frontend/
    ├── app/                     # Next.js App Router pages
    ├── components/              # React components
    ├── lib/                     # API clients and utilities
    ├── package.json             # Node dependencies
    ├── next.config.js           # Next.js configuration
    └── .env.local               # Frontend environment
```

### Deployment Artifacts (NEW - Phase VI)

```text
E:/Hackathon_II/Phase_VI/
├── docker/
│   ├── backend/
│   │   └── Dockerfile           # Enhanced backend Dockerfile
│   └── frontend/
│       ├── Dockerfile           # New frontend Dockerfile
│       └── .dockerignore        # Frontend build exclusions
│
├── kubernetes/
│   ├── namespace.yaml           # todo-app namespace
│   ├── configmap.yaml           # Non-sensitive configuration
│   ├── secrets.yaml.example     # Secret template (not committed)
│   ├── backend-deployment.yaml  # Backend Deployment
│   ├── backend-service.yaml     # Backend Service (ClusterIP)
│   ├── frontend-deployment.yaml # Frontend Deployment
│   ├── frontend-service.yaml    # Frontend Service (NodePort)
│   └── persistent-volume.yaml   # PV for uploads (optional)
│
└── helm/
    └── todo-chatbot/
        ├── Chart.yaml           # Helm chart metadata
        ├── values.yaml          # Default configuration
        ├── values-dev.yaml      # Development overrides
        ├── templates/
        │   ├── namespace.yaml
        │   ├── configmap.yaml
        │   ├── secrets.yaml
        │   ├── backend-deployment.yaml
        │   ├── backend-service.yaml
        │   ├── frontend-deployment.yaml
        │   ├── frontend-service.yaml
        │   ├── _helpers.tpl     # Template helpers
        │   └── NOTES.txt        # Post-install instructions
        └── README.md            # Helm chart documentation
```

**Structure Decision**: Web application structure with separate frontend and backend directories. Deployment artifacts stored in Phase_VI to keep Phase_III application code unchanged. Helm charts provide the single source of truth for Kubernetes resources, with raw YAML manifests available for reference and kubectl-ai operations.

## Complexity Tracking

> **No violations - this section intentionally left empty**

All deployment patterns follow standard Kubernetes and Helm best practices. No complexity justification needed.

---

## Phase 0: Research & Best Practices

**Objective**: Research containerization strategies, Kubernetes deployment patterns, Helm chart structure, and AI DevOps tool integration.

### Research Tasks

1. **Container Optimization Research**
   - Multi-stage Docker builds for Next.js (reduce image size)
   - Python slim vs alpine base images (compatibility vs size)
   - Layer caching strategies for faster builds
   - .dockerignore patterns for frontend and backend

2. **Kubernetes Resource Configuration**
   - Resource requests and limits for FastAPI (CPU/memory)
   - Resource requests and limits for Next.js (CPU/memory)
   - Health check endpoints (liveness vs readiness)
   - Startup probe timing for cold starts
   - Rolling update strategies (maxSurge, maxUnavailable)

3. **Service Exposure Patterns**
   - NodePort vs LoadBalancer vs Ingress for local development
   - Port mapping conventions (frontend: 30000, backend: 30001)
   - Service discovery via Kubernetes DNS
   - CORS configuration for cross-service communication

4. **Persistent Storage Strategy**
   - hostPath vs local PersistentVolume for Minikube
   - Volume mount paths for uploads directory
   - Storage class selection for local development
   - Backup and restore considerations

5. **Helm Chart Best Practices**
   - Chart.yaml metadata and versioning
   - values.yaml structure and documentation
   - Template helpers for common patterns
   - Conditional resource creation
   - NOTES.txt for post-install guidance

6. **AI DevOps Tool Integration**
   - Gordon Docker commands and syntax
   - kubectl-ai natural language patterns
   - kagent cluster analysis capabilities
   - Tool installation and configuration requirements

7. **Environment Configuration Management**
   - ConfigMap vs Secret decision criteria
   - External secrets (DATABASE_URL, JWT_SECRET, API keys)
   - Environment-specific values files (dev, staging, prod)
   - Secret rotation strategies

8. **Health Check Implementation**
   - FastAPI health endpoint design (/api/health)
   - Next.js health endpoint (custom API route)
   - Database connectivity checks
   - Dependency health aggregation

**Output**: `research.md` with findings, decisions, and rationale for each area

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

### 1.1 Data Model (Kubernetes Resources)

**File**: `data-model.md`

Document all Kubernetes resources and their relationships:

**Namespace**:
- Name: `todo-app`
- Purpose: Isolate application resources
- Labels: `app=todo-chatbot, environment=development`

**ConfigMap** (`todo-app-config`):
- `ENVIRONMENT`: development
- `LOG_LEVEL`: INFO
- `CORS_ORIGINS`: http://localhost:30000
- `FRONTEND_URL`: http://localhost:30000
- `MCP_SERVER_NAME`: puretasks-mcp-server
- `MCP_SERVER_PORT`: 8001

**Secret** (`todo-app-secrets`):
- `DATABASE_URL`: (base64 encoded Neon connection string)
- `JWT_SECRET`: (base64 encoded secret key)
- `OPENAI_API_KEY`: (base64 encoded API key)
- `GEMINI_API_KEY`: (base64 encoded API key)
- `CLOUDINARY_CLOUD_NAME`: (base64 encoded)
- `CLOUDINARY_API_KEY`: (base64 encoded)
- `CLOUDINARY_API_SECRET`: (base64 encoded)

**Backend Deployment**:
- Name: `backend`
- Replicas: 1 (scalable to 3)
- Container: `todo-backend:latest`
- Port: 8000
- Resources:
  - Requests: 256Mi memory, 250m CPU
  - Limits: 512Mi memory, 500m CPU
- Probes:
  - Liveness: GET /api/health (30s initial delay)
  - Readiness: GET /api/health (10s initial delay)
  - Startup: GET /api/health (60s failure threshold)
- Environment: From ConfigMap and Secret
- Volume: uploads (hostPath or PV)

**Backend Service**:
- Name: `backend-service`
- Type: ClusterIP
- Port: 8000 → targetPort: 8000
- Selector: `app=backend`

**Frontend Deployment**:
- Name: `frontend`
- Replicas: 1 (scalable to 2)
- Container: `todo-frontend:latest`
- Port: 3000
- Resources:
  - Requests: 512Mi memory, 500m CPU
  - Limits: 1Gi memory, 1000m CPU
- Probes:
  - Liveness: GET /api/health (20s initial delay)
  - Readiness: GET /api/health (10s initial delay)
- Environment:
  - `NEXT_PUBLIC_API_URL`: http://backend-service:8000

**Frontend Service**:
- Name: `frontend-service`
- Type: NodePort
- Port: 3000 → targetPort: 3000
- NodePort: 30000
- Selector: `app=frontend`

**PersistentVolume** (optional):
- Name: `backend-uploads-pv`
- Capacity: 5Gi
- Access: ReadWriteOnce
- hostPath: /mnt/data/uploads

**PersistentVolumeClaim**:
- Name: `backend-uploads-pvc`
- Request: 5Gi
- Access: ReadWriteOnce

### 1.2 API Contracts (Helm Values Schema)

**File**: `contracts/helm-values.yaml`

```yaml
# Helm values schema with documentation
global:
  environment: development  # development, staging, production
  namespace: todo-app

backend:
  image:
    repository: todo-backend
    tag: latest
    pullPolicy: IfNotPresent

  replicas: 1

  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"
    limits:
      memory: "512Mi"
      cpu: "500m"

  service:
    type: ClusterIP
    port: 8000

  env:
    ENVIRONMENT: development
    LOG_LEVEL: INFO
    MCP_SERVER_PORT: 8001

  secrets:
    DATABASE_URL: ""  # Required: Neon PostgreSQL connection string
    JWT_SECRET: ""    # Required: Minimum 32 characters
    OPENAI_API_KEY: ""
    GEMINI_API_KEY: ""

frontend:
  image:
    repository: todo-frontend
    tag: latest
    pullPolicy: IfNotPresent

  replicas: 1

  resources:
    requests:
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
      cpu: "1000m"

  service:
    type: NodePort
    port: 3000
    nodePort: 30000

  env:
    NEXT_PUBLIC_API_URL: "http://backend-service:8000"

persistence:
  enabled: false  # Set to true for persistent uploads
  storageClass: standard
  size: 5Gi
```

### 1.3 Quickstart Guide

**File**: `quickstart.md`

Step-by-step deployment guide:

1. **Prerequisites**
   - Docker Desktop installed and running
   - Minikube installed
   - Helm 3.x installed
   - kubectl installed
   - (Optional) Gordon, kubectl-ai, kagent installed

2. **Start Minikube**
   ```bash
   minikube start --cpus=2 --memory=4096
   ```

3. **Build Container Images**
   ```bash
   # Backend
   docker build -t todo-backend:latest -f docker/backend/Dockerfile Phase_III/backend

   # Frontend
   docker build -t todo-frontend:latest -f docker/frontend/Dockerfile Phase_III/frontend

   # Load images into Minikube
   minikube image load todo-backend:latest
   minikube image load todo-frontend:latest
   ```

4. **Configure Secrets**
   ```bash
   # Copy example and fill in values
   cp kubernetes/secrets.yaml.example kubernetes/secrets.yaml
   # Edit secrets.yaml with your DATABASE_URL, JWT_SECRET, etc.
   ```

5. **Deploy with Helm**
   ```bash
   helm install todo-chatbot ./helm/todo-chatbot -f helm/todo-chatbot/values-dev.yaml
   ```

6. **Access Application**
   ```bash
   # Get Minikube IP
   minikube ip

   # Access frontend at http://<minikube-ip>:30000
   ```

7. **Verify Deployment**
   ```bash
   kubectl get pods -n todo-app
   kubectl logs -n todo-app deployment/backend
   kubectl logs -n todo-app deployment/frontend
   ```

8. **AI-Assisted Operations** (Optional)
   ```bash
   # Using kubectl-ai
   kubectl-ai "scale backend to 2 replicas"
   kubectl-ai "why is my frontend pod restarting?"

   # Using kagent
   kagent "analyze cluster health"
   kagent "optimize resource allocation for todo-app namespace"
   ```

---

## Phase 2: Implementation Phases

### Phase 2.1: Containerization

**Tasks**:
1. Create frontend Dockerfile with multi-stage build
2. Enhance backend Dockerfile (already exists, may need updates)
3. Create .dockerignore files
4. Build and test images locally
5. Document image build process

**Acceptance Criteria**:
- Frontend image builds successfully (< 500MB)
- Backend image builds successfully (< 300MB)
- Both containers run locally with docker run
- Health endpoints respond successfully
- Environment variables configurable

### Phase 2.2: Kubernetes Manifests

**Tasks**:
1. Create namespace.yaml
2. Create configmap.yaml with non-sensitive config
3. Create secrets.yaml.example template
4. Create backend-deployment.yaml with probes
5. Create backend-service.yaml (ClusterIP)
6. Create frontend-deployment.yaml with probes
7. Create frontend-service.yaml (NodePort)
8. (Optional) Create persistent-volume.yaml

**Acceptance Criteria**:
- All manifests validate with kubectl apply --dry-run
- Deployments specify resource limits
- Health checks configured correctly
- Services expose correct ports
- Labels and selectors match

### Phase 2.3: Helm Chart Creation

**Tasks**:
1. Initialize Helm chart structure
2. Create Chart.yaml with metadata
3. Create values.yaml with defaults
4. Create values-dev.yaml for local development
5. Templatize all Kubernetes manifests
6. Create _helpers.tpl for common functions
7. Create NOTES.txt with post-install instructions
8. Write Helm chart README.md

**Acceptance Criteria**:
- helm lint passes without errors
- helm template renders correctly
- helm install succeeds
- helm upgrade works without downtime
- helm rollback restores previous version

### Phase 2.4: Local Deployment & Testing

**Tasks**:
1. Start Minikube cluster
2. Build and load container images
3. Create secrets from .env files
4. Deploy with Helm
5. Verify pod startup and readiness
6. Test frontend access via NodePort
7. Test backend API endpoints
8. Test end-to-end user flows
9. Test pod restart resilience
10. Test scaling operations

**Acceptance Criteria**:
- All pods reach Running state within 2 minutes
- Frontend accessible at http://<minikube-ip>:30000
- Backend health check returns 200 OK
- User can sign in and manage todos
- Conversation history persists across pod restarts
- Scaling to 2 replicas succeeds
- No data loss on pod restart

### Phase 2.5: AI DevOps Integration

**Tasks**:
1. Document Gordon commands for Docker operations
2. Document kubectl-ai commands for deployments
3. Document kagent commands for cluster analysis
4. Test AI tools with natural language prompts
5. Create prompt library for common operations
6. Document troubleshooting workflows

**Acceptance Criteria**:
- Gordon can build images from natural language
- kubectl-ai can deploy and scale services
- kubectl-ai can diagnose pod failures
- kagent provides cluster health insights
- 80% of common operations work via AI tools
- Prompt library covers deployment, scaling, debugging

### Phase 2.6: Documentation & Reproducibility

**Tasks**:
1. Write comprehensive quickstart.md
2. Document environment setup requirements
3. Create troubleshooting guide
4. Document AI tool usage examples
5. Create video walkthrough (optional)
6. Test reproduction on fresh machine

**Acceptance Criteria**:
- Another developer can deploy in < 10 minutes
- All prerequisites clearly documented
- Common issues have solutions
- AI tool examples are copy-pasteable
- Reproduction succeeds on clean environment

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Minikube resource constraints | High | Medium | Document minimum requirements, provide resource tuning guide |
| Container image size too large | Medium | Low | Use multi-stage builds, optimize layers |
| Database connection timeout | High | Medium | Increase startup probe timeout, add retry logic |
| Port conflicts on host | Medium | Medium | Document port requirements, provide alternative NodePort values |
| Helm chart complexity | Low | Low | Keep templates simple, use _helpers.tpl for reusable logic |
| AI tools not installed | Low | High | Make AI tools optional, provide manual alternatives |
| Secret management confusion | Medium | Medium | Provide clear secrets.yaml.example, document base64 encoding |

---

## Success Metrics

- ✅ Frontend accessible within 3 minutes of helm install
- ✅ Backend health check responds within 30 seconds
- ✅ Zero data loss on pod restart
- ✅ Scaling completes within 1 minute
- ✅ Another developer reproduces deployment in < 10 minutes
- ✅ 80% of operations succeed via AI tools
- ✅ All Phase III functionality works identically

---

## Next Steps

After this plan is approved:

1. Run `/sp.tasks` to generate detailed task breakdown
2. Execute Phase 0 research
3. Execute Phase 1 design and contracts
4. Execute Phase 2 implementation
5. Validate against success criteria
6. Document lessons learned
