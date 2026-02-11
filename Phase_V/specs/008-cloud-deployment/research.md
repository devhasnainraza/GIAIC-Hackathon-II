# Research & Discovery: Cloud Deployment

**Feature**: Cloud Deployment & Production Upgrade
**Date**: 2026-02-09
**Phase**: 0 - Research

## Overview

This document consolidates research findings for deploying the Todo AI Chatbot to a cloud Kubernetes cluster. All technical decisions are documented with rationale and alternatives considered.

---

## RT-001: Cloud Provider Free Tier Analysis

### Decision: Oracle Cloud Infrastructure (OCI) - Always Free Tier

**Rationale**:
- **Always Free** (not trial): 2 AMD-based Compute VMs with 1/8 OCPU and 1 GB memory each
- **Kubernetes**: Oracle Kubernetes Engine (OKE) available in free tier
- **No time limit**: Resources remain free indefinitely (not 12-month trial)
- **Sufficient resources**: Can run 2-node cluster for demo deployment
- **Container registry**: Oracle Container Image Registry (OCIR) included free

**Alternatives Considered**:

| Provider | Free Tier | Limitations | Rejected Because |
|----------|-----------|-------------|------------------|
| Google Cloud (GKE) | $300 credit, 90 days | Trial only, expires | Not always-free, requires credit card |
| Azure (AKS) | $200 credit, 30 days | Trial only, expires | Short trial period |
| AWS (EKS) | Control plane $0.10/hour | Not free | EKS control plane costs ~$73/month |
| Minikube (local) | Free | Local only | Not cloud deployment |

**Implementation Path**:
1. Create OCI account (free tier)
2. Provision OKE cluster with 2 nodes (1 GB RAM each)
3. Configure kubectl access via OCI CLI
4. Verify cluster connectivity

**Resource Limits**:
- 2 VM instances (1/8 OCPU, 1 GB RAM each)
- 100 GB block storage
- 10 GB object storage
- Outbound data transfer: 10 TB/month

**Backup Option**: If OCI proves difficult, use **Minikube with ngrok** for public access (not true cloud but demonstrates deployment readiness).

---

## RT-002: Container Registry Options

### Decision: Docker Hub Free Tier

**Rationale**:
- **Simplicity**: Widely used, well-documented, easy setup
- **Free tier**: Unlimited public repositories
- **Pull limits**: 200 pulls per 6 hours (sufficient for demo)
- **GitHub Actions integration**: Native support with docker/login-action
- **No cloud provider lock-in**: Works with any Kubernetes cluster

**Alternatives Considered**:

| Registry | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| GitHub Container Registry (GHCR) | Unlimited public | Native GitHub integration | Requires GitHub token management |
| Oracle OCIR | Included with OCI | Same provider as cluster | OCI-specific, less portable |
| Google GCR | $0.026/GB/month | High performance | Not free, requires billing |

**Implementation Path**:
1. Create Docker Hub account
2. Create public repositories: `username/todo-backend`, `username/todo-frontend`
3. Generate Docker Hub access token
4. Store token in GitHub Secrets for CI/CD
5. Configure Kubernetes to pull from Docker Hub (public, no auth needed)

**Image Naming Convention**:
- Backend: `dockerhub-username/todo-backend:latest`
- Frontend: `dockerhub-username/todo-frontend:latest`
- Tag strategy: `latest` for main branch, `v1.0.0` for releases

---

## RT-003: Public Access Strategy

### Decision: LoadBalancer Service (OKE Default)

**Rationale**:
- **Simplicity**: Single Kubernetes Service with `type: LoadBalancer`
- **OKE support**: OCI automatically provisions load balancer
- **No additional setup**: Works out-of-the-box with OKE
- **Free tier**: OCI includes 1 load balancer in always-free tier
- **Automatic IP assignment**: Public IP assigned automatically

**Alternatives Considered**:

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| Ingress Controller | Advanced routing, TLS termination | Requires nginx-ingress setup, more complex | Rejected: Overkill for single frontend |
| NodePort | Simple, no LB needed | Requires firewall rules, non-standard ports | Rejected: Not production-like |
| Port Forwarding | No cost | Local only, not public | Rejected: Not true public access |

**Implementation Path**:
1. Update `frontend-service.yaml` to `type: LoadBalancer`
2. Apply Helm chart to OKE cluster
3. Wait for `EXTERNAL-IP` assignment (2-5 minutes)
4. Access application via `http://<EXTERNAL-IP>`
5. (Optional) Configure DNS to point to external IP

**HTTPS/TLS**:
- **Phase 1**: HTTP only (sufficient for demo)
- **Phase 2** (future): Add Ingress with cert-manager for Let's Encrypt TLS

---

## RT-004: CI/CD Pipeline Design

### Decision: GitHub Actions with Multi-Stage Workflow

**Rationale**:
- **Native integration**: GitHub Actions built into GitHub
- **Free tier**: 2,000 minutes/month for public repos
- **Docker support**: Official docker/build-push-action
- **Kubernetes support**: kubectl available in runners
- **Secrets management**: GitHub Secrets for credentials

**Workflow Architecture**:

```yaml
# .github/workflows/deploy-cloud.yml
name: Build and Deploy to Cloud

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Login to Docker Hub
      - Build backend image
      - Push backend image
      - Build frontend image
      - Push frontend image

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - Setup kubectl with OCI credentials
      - Update Helm deployment
      - Verify pod health
      - Report deployment status
```

**Required GitHub Secrets**:
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token
- `OCI_CLI_USER`: OCI user OCID
- `OCI_CLI_TENANCY`: OCI tenancy OCID
- `OCI_CLI_FINGERPRINT`: API key fingerprint
- `OCI_CLI_KEY_CONTENT`: Private key content
- `OCI_CLI_REGION`: OCI region (e.g., us-ashburn-1)
- `KUBECONFIG_CONTENT`: Base64-encoded kubeconfig

**Deployment Strategy**:
- **Trigger**: Push to main branch or manual dispatch
- **Build**: Docker images built in GitHub Actions
- **Push**: Images pushed to Docker Hub with `latest` tag
- **Deploy**: Helm upgrade with new image tags
- **Verify**: Health check endpoints tested post-deployment

**Rollback Strategy**:
- Keep previous image tags (e.g., `v1.0.0`, `v1.0.1`)
- Manual rollback via `helm rollback` command
- Future: Automated rollback on health check failure

---

## RT-005: Kubernetes Secrets Management

### Decision: Kubernetes Secrets with Helm Integration

**Rationale**:
- **Native Kubernetes**: Built-in Secrets resource
- **Helm support**: Secrets referenced in templates
- **Base64 encoding**: Automatic encoding/decoding
- **Namespace isolation**: Secrets scoped to namespace
- **No external dependencies**: No need for Vault, Sealed Secrets, etc.

**Secrets Architecture**:

```yaml
# Create secret manually (not in Git)
kubectl create secret generic todo-app-secrets /
  --from-literal=DATABASE_URL='postgresql://...' /
  --from-literal=JWT_SECRET='...' /
  --from-literal=GEMINI_API_KEY='...' /
  --from-literal=OPENAI_API_KEY='...' /
  --from-literal=CLOUDINARY_API_SECRET='...' /
  --from-literal=GMAIL_APP_PASSWORD='...' /
  --from-literal=RESEND_API_KEY='...' /
  -n todo-app
```

**Helm Integration**:

```yaml
# templates/backend-deployment.yaml
envFrom:
  - secretRef:
      name: todo-app-secrets
```

**Best Practices**:
- ✅ Secrets created manually via kubectl (not in Helm charts)
- ✅ Secrets never committed to Git
- ✅ `.gitignore` includes `secrets.yaml`, `*.secret.yaml`
- ✅ Documentation includes secret creation steps
- ✅ CI/CD does not manage secrets (manual setup required)

**Secret Rotation**:
- Update secret: `kubectl edit secret todo-app-secrets -n todo-app`
- Restart pods: `kubectl rollout restart deployment/backend -n todo-app`

---

## RT-006: External Database Connectivity

### Decision: Direct Connection to Neon PostgreSQL

**Rationale**:
- **Neon already provisioned**: Database exists and is configured
- **Outbound access**: OKE clusters have internet access by default
- **Connection pooling**: Neon handles pooling server-side
- **SSL/TLS**: Neon requires SSL (already configured in DATABASE_URL)
- **No firewall issues**: Neon accepts connections from any IP

**Connectivity Validation**:

```bash
# Test from within cluster
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- /
  psql "postgresql://neondb_owner:password@ep-tiny-shadow-ahq6dtsj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Connection Configuration**:
- **DATABASE_URL**: Stored in Kubernetes Secret
- **Connection string**: Includes `sslmode=require` for security
- **Pooling**: Neon's pooler endpoint (`-pooler` suffix)
- **Timeout**: Backend configured with 30-second connection timeout

**Failure Handling**:
- **Startup probe**: 30-second initial delay, 20 retries (200 seconds total)
- **Liveness probe**: 60-second initial delay, 5 retries
- **Readiness probe**: 30-second initial delay, 5 retries
- **Graceful degradation**: Backend returns 503 if database unreachable

**Neon Free Tier Limits**:
- **Compute**: 0.25 vCPU, 1 GB RAM
- **Storage**: 0.5 GB
- **Connections**: 100 concurrent connections
- **Sufficient for**: Demo deployment with 2-3 backend replicas

---

## RT-007: Health Checks and Monitoring

### Decision: Kubernetes Probes + Application Health Endpoints

**Rationale**:
- **Built-in**: Kubernetes liveness/readiness/startup probes
- **Application-aware**: Backend exposes `/api/health` endpoint
- **Database validation**: Health endpoint checks database connectivity
- **No external tools**: No need for Prometheus, Grafana (Phase 1)
- **Sufficient for demo**: Logs + health checks adequate for troubleshooting

**Health Check Architecture**:

```yaml
# Backend health endpoint
GET /api/health
Response:
{
  "status": "healthy",
  "timestamp": "2026-02-09T12:00:00Z",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful"
    },
    "system": {
      "status": "healthy",
      "cpu_percent": 15.2,
      "memory_percent": 32.5,
      "disk_percent": 1.8
    }
  }
}
```

**Kubernetes Probe Configuration**:

```yaml
# Startup probe (initial startup)
startupProbe:
  httpGet:
    path: /api/health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 20  # 200 seconds total
  timeoutSeconds: 10

# Liveness probe (restart if unhealthy)
livenessProbe:
  httpGet:
    path: /api/health
    port: 8000
  initialDelaySeconds: 60
  periodSeconds: 15
  failureThreshold: 5
  timeoutSeconds: 10

# Readiness probe (remove from service if not ready)
readinessProbe:
  httpGet:
    path: /api/health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 5
  timeoutSeconds: 10
```

**Monitoring Strategy**:

| Metric | Tool | Access Method |
|--------|------|---------------|
| Pod status | kubectl | `kubectl get pods -n todo-app` |
| Pod logs | kubectl | `kubectl logs -f <pod-name> -n todo-app` |
| Health checks | curl | `curl http://<EXTERNAL-IP>/api/health` |
| Resource usage | kubectl top | `kubectl top pods -n todo-app` |
| Events | kubectl | `kubectl get events -n todo-app` |

**Alerting** (Phase 2 - Future):
- Prometheus for metrics collection
- Grafana for visualization
- Alertmanager for notifications
- **Phase 1**: Manual monitoring via kubectl

---

## Summary of Decisions

| Research Area | Decision | Rationale |
|---------------|----------|-----------|
| **Cloud Provider** | Oracle Cloud (OKE) | Always-free tier, no time limit, includes Kubernetes |
| **Container Registry** | Docker Hub | Simple, free public repos, GitHub Actions integration |
| **Public Access** | LoadBalancer Service | OKE native support, automatic IP assignment, free tier |
| **CI/CD** | GitHub Actions | Native integration, free for public repos, Docker/kubectl support |
| **Secrets** | Kubernetes Secrets | Native, Helm-integrated, no external dependencies |
| **Database** | Direct Neon Connection | Already provisioned, outbound access works, SSL enabled |
| **Monitoring** | Kubernetes Probes + Logs | Built-in, sufficient for demo, no external tools needed |

---

## Implementation Readiness

✅ **All research questions answered**
✅ **All technical decisions made with rationale**
✅ **All alternatives considered and documented**
✅ **No unresolved NEEDS CLARIFICATION items**
✅ **Ready for Phase 1: Design & Contracts**

---

## Next Steps

1. **Phase 1**: Generate data-model.md (deployment configuration model)
2. **Phase 1**: Generate contracts/ (Helm values, CI/CD workflows, checklists)
3. **Phase 1**: Generate quickstart.md (step-by-step deployment guide)
4. **Phase 1**: Update agent context with cloud deployment knowledge
5. **Phase 2**: Run `/sp.tasks` to generate actionable task list
