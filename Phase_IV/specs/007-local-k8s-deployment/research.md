# Research: Local Cloud-Native Deployment

**Feature**: 007-local-k8s-deployment
**Date**: 2026-02-01
**Purpose**: Research containerization strategies, Kubernetes deployment patterns, and AI DevOps tool integration

---

## 1. Container Optimization Research

### Decision: Multi-Stage Docker Builds

**Frontend (Next.js)**:
- **Strategy**: Multi-stage build with separate build and runtime stages
- **Base Image**: node:20-alpine (smallest Node.js image)
- **Build Stage**: Install dependencies, build Next.js app
- **Runtime Stage**: Copy only production files and node_modules
- **Expected Size**: 200-400MB (vs 1GB+ without optimization)

**Rationale**: Next.js standalone output mode (already configured in next.config.js) produces optimized production builds. Multi-stage builds eliminate dev dependencies and build artifacts.

**Backend (FastAPI)**:
- **Strategy**: Single-stage build with python:3.11-slim
- **Base Image**: python:3.11-slim (balance of size and compatibility)
- **Why not Alpine**: psycopg2-binary requires glibc (not available in Alpine), would need compilation
- **Expected Size**: 250-350MB
- **Existing Dockerfile**: Already optimized, may need minor enhancements

**Rationale**: Slim images provide good size reduction without Alpine's compatibility issues. Backend Dockerfile already exists and follows best practices.

### Layer Caching Strategies

**Best Practices**:
1. Copy dependency files first (requirements.txt, package.json)
2. Install dependencies in separate layer
3. Copy application code last (changes most frequently)
4. Use .dockerignore to exclude unnecessary files

**Frontend .dockerignore**:
```
node_modules
.next
.git
.env*
*.md
.vscode
.idea
```

**Backend .dockerignore** (already exists):
```
venv
__pycache__
*.pyc
.git
.env
uploads
tests
```

---

## 2. Kubernetes Resource Configuration

### Resource Requests and Limits

**Backend (FastAPI)**:
- **Requests**: 256Mi memory, 250m CPU
  - Rationale: FastAPI is lightweight, minimal memory footprint
  - 250m CPU = 25% of one core (sufficient for local dev)
- **Limits**: 512Mi memory, 500m CPU
  - Rationale: 2x requests provides headroom for spikes
  - Prevents single pod from consuming all cluster resources

**Frontend (Next.js)**:
- **Requests**: 512Mi memory, 500m CPU
  - Rationale: Next.js SSR requires more memory than backend
  - Node.js runtime has higher baseline memory usage
- **Limits**: 1Gi memory, 1000m CPU
  - Rationale: Next.js can spike during SSR operations
  - 1 full CPU core for responsive UI rendering

**Total Cluster Requirements**:
- Minimum: 768Mi memory, 750m CPU (1 replica each)
- Recommended: 2Gi memory, 2 CPU cores (allows scaling + system overhead)

### Health Check Configuration

**Backend Health Endpoint** (already exists at `/api/health`):
```python
@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

**Frontend Health Endpoint** (needs creation):
- Create `/app/api/health/route.ts`
- Return JSON: `{"status": "healthy"}`
- No database check needed (frontend is stateless)

**Probe Configuration**:

**Backend**:
- **Startup Probe**: 60s failure threshold (allows for Neon cold start)
  - Path: /api/health
  - Initial delay: 0s
  - Period: 10s
  - Failure threshold: 6 (60s total)
- **Liveness Probe**: Detects if app is hung
  - Path: /api/health
  - Initial delay: 30s
  - Period: 10s
  - Failure threshold: 3
- **Readiness Probe**: Detects if app can serve traffic
  - Path: /api/health
  - Initial delay: 10s
  - Period: 5s
  - Failure threshold: 2

**Frontend**:
- **Startup Probe**: 30s failure threshold (Next.js starts faster)
  - Path: /api/health
  - Initial delay: 0s
  - Period: 5s
  - Failure threshold: 6
- **Liveness Probe**: Detects if Node.js is responsive
  - Path: /api/health
  - Initial delay: 20s
  - Period: 10s
  - Failure threshold: 3
- **Readiness Probe**: Detects if Next.js is ready
  - Path: /api/health
  - Initial delay: 10s
  - Period: 5s
  - Failure threshold: 2

**Rationale**: Startup probes prevent premature liveness failures during slow starts. Readiness probes ensure traffic only routes to ready pods. Liveness probes restart hung containers.

### Rolling Update Strategy

**Configuration**:
- **maxSurge**: 1 (one extra pod during update)
- **maxUnavailable**: 0 (zero downtime updates)
- **Strategy**: RollingUpdate (default)

**Rationale**: For local development, zero downtime is nice-to-have but not critical. This configuration ensures smooth updates without service interruption.

---

## 3. Service Exposure Patterns

### Decision: NodePort for Frontend, ClusterIP for Backend

**Frontend Service**:
- **Type**: NodePort
- **Port**: 3000 (internal)
- **NodePort**: 30000 (external)
- **Access**: http://<minikube-ip>:30000

**Rationale**: NodePort is simplest for local access. No need for Ingress controller overhead in local development. Port 30000 is easy to remember and unlikely to conflict.

**Backend Service**:
- **Type**: ClusterIP (internal only)
- **Port**: 8000
- **Access**: Via Kubernetes DNS (backend-service:8000)

**Rationale**: Backend should not be directly accessible from host. Frontend communicates via cluster networking. This matches production patterns where backend is behind API gateway.

### Service Discovery

**Frontend → Backend Communication**:
- Frontend env var: `NEXT_PUBLIC_API_URL=http://backend-service:8000`
- Kubernetes DNS resolves `backend-service` to ClusterIP
- No hardcoded IPs, works across environments

**CORS Configuration**:
- Backend already configured with CORS_ORIGINS env var
- Set to: `http://localhost:30000` for local development
- Allows frontend at NodePort to call backend API

---

## 4. Persistent Storage Strategy

### Decision: Optional hostPath for Development

**Uploads Directory**:
- **Current**: Backend stores uploads in `/app/uploads` (avatars, attachments)
- **Problem**: Data lost on pod restart
- **Solution**: Mount persistent volume

**Implementation Options**:

**Option 1: hostPath (Simplest)**:
```yaml
volumes:
  - name: uploads
    hostPath:
      path: /mnt/data/uploads
      type: DirectoryOrCreate
```
- Pros: Simple, no PV/PVC needed
- Cons: Data tied to specific node (not an issue for single-node Minikube)

**Option 2: PersistentVolume + PersistentVolumeClaim**:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: backend-uploads-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /mnt/data/uploads
```
- Pros: More production-like, portable
- Cons: More complex, overkill for local dev

**Decision**: Make persistence optional (disabled by default)
- Helm value: `persistence.enabled: false`
- For testing persistence, users can enable via values override
- Document both approaches in quickstart.md

**Rationale**: Most local testing doesn't require persistent uploads. Making it optional reduces complexity. Users who need it can enable easily.

---

## 5. Helm Chart Best Practices

### Chart Structure

**Chart.yaml**:
```yaml
apiVersion: v2
name: todo-chatbot
description: AI-Powered Todo Chatbot with Conversational Interface
version: 1.0.0
appVersion: "1.0.0"
keywords:
  - todo
  - chatbot
  - ai
  - kubernetes
maintainers:
  - name: Phase VI Team
```

**values.yaml Structure**:
- Top-level keys: `global`, `backend`, `frontend`, `persistence`
- Nested configuration: `backend.image`, `backend.resources`, etc.
- Sensible defaults for local development
- Comments explaining each value

**Template Helpers (_helpers.tpl)**:
```yaml
{{- define "todo-chatbot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "todo-chatbot.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "todo-chatbot.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "todo-chatbot.labels" -}}
app.kubernetes.io/name: {{ include "todo-chatbot.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

**Conditional Resources**:
```yaml
{{- if .Values.persistence.enabled }}
# PersistentVolumeClaim template
{{- end }}
```

**NOTES.txt**:
- Display access instructions after install
- Show Minikube IP command
- Show frontend URL
- Show useful kubectl commands

---

## 6. AI DevOps Tool Integration

### Gordon (Docker AI)

**Installation**:
```bash
# Docker Desktop includes Gordon
docker ai --help
```

**Example Commands**:
```bash
docker ai "Create Dockerfile for Next.js 16 app with multi-stage build"
docker ai "Build image todo-frontend from current directory"
docker ai "Run container on port 3000 with environment variable API_URL"
```

**Limitations**:
- May not understand complex multi-stage builds
- Better for simple operations
- Manual Dockerfile creation may be more reliable

**Decision**: Use Gordon for exploration, manual Dockerfiles for production

### kubectl-ai

**Installation**:
```bash
# Via kubectl plugin manager
kubectl krew install ai
```

**Example Commands**:
```bash
kubectl-ai "deploy todo backend with 2 replicas"
kubectl-ai "scale frontend to 3 replicas"
kubectl-ai "why is my pod in CrashLoopBackOff?"
kubectl-ai "show logs for backend pod"
```

**Limitations**:
- Requires OpenAI API key
- May generate incorrect YAML
- Better for operations than initial setup

**Decision**: Use kubectl-ai for operations and debugging, Helm for deployment

### kagent

**Installation**:
```bash
# Via GitHub release
# https://github.com/kagent-ai/kagent
```

**Example Commands**:
```bash
kagent "analyze cluster health"
kagent "optimize resource allocation for todo-app namespace"
kagent "suggest improvements for backend deployment"
```

**Limitations**:
- Requires API key
- May not be installed by all users
- Analysis quality varies

**Decision**: Make AI tools optional, provide manual alternatives

---

## 7. Environment Configuration Management

### ConfigMap vs Secret Decision

**ConfigMap** (non-sensitive):
- ENVIRONMENT (development/production)
- LOG_LEVEL (INFO/DEBUG)
- CORS_ORIGINS
- FRONTEND_URL
- MCP_SERVER_NAME
- MCP_SERVER_PORT

**Secret** (sensitive):
- DATABASE_URL (contains password)
- JWT_SECRET (cryptographic key)
- OPENAI_API_KEY
- GEMINI_API_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- GMAIL_EMAIL
- GMAIL_APP_PASSWORD

**Secret Management**:
- Create `secrets.yaml.example` with placeholders
- User copies to `secrets.yaml` and fills values
- Add `secrets.yaml` to .gitignore
- Base64 encode values: `echo -n "value" | base64`

**Environment-Specific Values**:
- `values.yaml`: Production defaults
- `values-dev.yaml`: Local development overrides
- `values-staging.yaml`: Staging environment (future)

---

## 8. Health Check Implementation

### Backend Health Endpoint

**Already Exists**: `/api/health` in `src/api/health.py`

**Current Implementation**:
```python
@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0"
    }
```

**Enhancement Needed**: Add database connectivity check

```python
@router.get("/health")
async def health_check(session: Session = Depends(get_session)):
    try:
        # Test database connection
        session.exec(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = "disconnected"
        logger.error(f"Database health check failed: {e}")

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "database": db_status
    }
```

### Frontend Health Endpoint

**Needs Creation**: `/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
```

**Rationale**: Simple health check without dependencies. Frontend is stateless, no database check needed.

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Frontend Image | Multi-stage build, node:20-alpine | Minimize size, optimize for production |
| Backend Image | python:3.11-slim | Balance size and compatibility |
| Backend Resources | 256Mi/250m requests, 512Mi/500m limits | Lightweight FastAPI, sufficient for local |
| Frontend Resources | 512Mi/500m requests, 1Gi/1000m limits | Next.js SSR needs more resources |
| Service Exposure | NodePort (frontend), ClusterIP (backend) | Simple local access, internal backend |
| Persistent Storage | Optional hostPath | Simplify local dev, enable when needed |
| Health Checks | Startup + Liveness + Readiness probes | Robust pod lifecycle management |
| Helm Structure | Standard chart with helpers | Follow best practices, maintainable |
| AI Tools | Optional, manual alternatives provided | Not all users have tools installed |
| Secrets | Kubernetes Secrets, base64 encoded | Secure, standard approach |
| Environment Config | ConfigMap for non-sensitive | Separate concerns, easy updates |

---

## Next Steps

1. Create data-model.md with detailed Kubernetes resource specifications
2. Create contracts/helm-values.yaml with complete schema
3. Create quickstart.md with step-by-step deployment guide
4. Proceed to implementation (Phase 2)
