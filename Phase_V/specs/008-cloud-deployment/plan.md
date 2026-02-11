# Implementation Plan: Cloud Deployment & Production Upgrade

**Branch**: `main` | **Date**: 2026-02-09 | **Spec**: [specs/008-cloud-deployment/spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-cloud-deployment/spec.md`

## Summary

Upgrade the Todo AI Chatbot from local Kubernetes (Minikube) deployment to a production-ready cloud environment. The system will be deployed on a cloud Kubernetes cluster with public access, external database persistence, container registry integration, and CI/CD automation. The deployment must operate within free tier limits while supporting real-world usage with 100 concurrent users and 99% uptime.

**Technical Approach**: Leverage existing Dockerfiles and Helm charts, extend them for cloud deployment, configure container registry for image distribution, set up LoadBalancer/Ingress for public access, integrate with external Neon PostgreSQL database, and establish GitHub Actions CI/CD pipeline for automated deployments.

## Technical Context

**Language/Version**: Python 3.11 (backend), Node.js 20 (frontend) - unchanged from existing application
**Primary Dependencies**:
- **Infrastructure**: Kubernetes 1.28+, Helm 3.x, Docker 24+
- **Cloud Provider**: Oracle Cloud (OKE), Google Cloud (GKE), Azure (AKS), or AWS (EKS) - free tier compatible
- **Container Registry**: Docker Hub (free tier), GitHub Container Registry, or cloud provider registry
- **CI/CD**: GitHub Actions (free for public repos)
- **Existing App Stack**: FastAPI, Next.js 16+, SQLModel, Neon PostgreSQL (unchanged)

**Storage**: Neon Serverless PostgreSQL (already provisioned, external to cluster)
**Testing**:
- Kubernetes deployment validation (kubectl get pods, helm test)
- Health check endpoint verification
- Public access testing from external network
- Load testing with 100 concurrent users
- Pod restart and scaling tests

**Target Platform**: Cloud Kubernetes cluster (any Kubernetes-compliant provider with free tier)
**Project Type**: Web application (frontend + backend) with cloud infrastructure
**Performance Goals**:
- 100 concurrent users without degradation
- 99% uptime for public access
- <30 minute deployment time from scratch
- <10 minute CI/CD deployment time
- <2 minute scaling operations
- <30 second pod restart time

**Constraints**:
- Must operate within free tier limits (no unexpected costs)
- Must maintain compatibility with existing local Kubernetes setup
- Must not require code changes to application (infrastructure-only changes)
- Must support any Kubernetes-compliant cloud provider (portability)
- Must handle external database connectivity from cloud cluster

**Scale/Scope**:
- Demo-ready production deployment
- 2-3 node Kubernetes cluster
- 1-3 replicas per service (scalable)
- Support for 100+ concurrent users
- Reproducible deployment via documented steps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Correctness & Specification Adherence
✅ **PASS** - Deployment will follow spec exactly:
- All 7 user stories have clear acceptance criteria
- Deployment steps will be documented and reproducible
- Success criteria are measurable and verifiable
- No deviation from specified requirements

### Principle II: Security-First Design
✅ **PASS** - Security maintained in cloud deployment:
- Kubernetes Secrets for sensitive data (DATABASE_URL, JWT_SECRET, API keys)
- No hardcoded credentials in Helm charts or CI/CD configs
- HTTPS for public access (LoadBalancer with TLS or Ingress with cert-manager)
- Existing JWT authentication unchanged
- Network policies to restrict pod-to-pod communication (optional enhancement)

### Principle III: User Data Isolation
✅ **PASS** - Not affected by deployment:
- Application-level isolation already implemented
- External database maintains user data separation
- Cloud deployment does not change data access patterns

### Principle IV: AI-First Development
✅ **PASS** - Following agentic workflow:
- This plan created via `/sp.plan` command
- Implementation will use specialized agents
- PHRs will document all development sessions
- No manual infrastructure coding outside Claude Code workflow

### Principle V: Technology Stack Immutability
✅ **PASS** - No application stack changes:
- Frontend remains Next.js 16+ with App Router
- Backend remains Python FastAPI
- Database remains Neon PostgreSQL
- Authentication remains Better Auth with JWT
- **Infrastructure additions only**: Kubernetes, Helm, Docker, CI/CD (not part of app stack)

### Principle VI: Reproducibility & Quality
✅ **PASS** - Deployment will be fully reproducible:
- All infrastructure as code (Helm charts, Dockerfiles)
- Documented setup steps in quickstart.md
- Version-controlled configurations
- CI/CD pipeline ensures consistent deployments
- Another developer can follow prompts to recreate

### Principle VII: Stateless & Scalable Architecture
✅ **PASS** - Already designed for cloud:
- Application is stateless (no server-side sessions)
- All state persists in external database
- Horizontal scaling ready (multiple replicas)
- Pod restarts do not affect user experience
- Cloud deployment enables true horizontal scaling

### Principle VIII: MCP Tool Primacy
✅ **PASS** - Not affected by deployment:
- MCP tools remain the interface for data operations
- Agent architecture unchanged
- Cloud deployment is transparent to application logic

### Principle IX: Modular Architecture
✅ **PASS** - Layer separation maintained:
- Frontend, backend, database remain separate
- Cloud infrastructure adds deployment layer
- Each component independently scalable
- Clear boundaries preserved

### Principle X: User-Centric UX
✅ **PASS** - Enhanced by cloud deployment:
- Public access enables real-world usage
- High availability improves user experience
- Scalability ensures consistent performance
- Application UX unchanged

### Principle XI: Cloud-Native Mindset
✅ **PASS** - This IS cloud-native deployment:
- Container-first architecture (Docker)
- Kubernetes-ready deployments (Helm charts)
- Infrastructure as code
- Environment-based configuration
- Health checks and readiness probes
- Horizontal scaling enabled
- Observability through logs

**Overall Assessment**: ✅ ALL GATES PASSED - No constitution violations. This feature enhances cloud-native capabilities without compromising any principles.

## Project Structure

### Documentation (this feature)

```text
specs/008-cloud-deployment/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (cloud provider research)
├── data-model.md        # Phase 1 output (deployment configuration model)
├── quickstart.md        # Phase 1 output (cloud deployment guide)
├── contracts/           # Phase 1 output (deployment contracts)
│   ├── helm-values-cloud.yaml      # Cloud-specific Helm values template
│   ├── github-actions-ci.yaml      # CI/CD workflow configuration
│   └── deployment-checklist.md     # Pre-deployment validation checklist
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Existing structure (unchanged)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Existing infrastructure (to be extended)
docker/
├── backend/
│   └── Dockerfile           # Existing, may need optimization
└── frontend/
    └── Dockerfile           # Existing, may need optimization

helm/
└── todo-chatbot/
    ├── Chart.yaml           # Existing
    ├── values.yaml          # Existing (local config)
    ├── values-cloud.yaml    # NEW: Cloud-specific overrides
    ├── templates/
    │   ├── backend-deployment.yaml
    │   ├── backend-service.yaml
    │   ├── frontend-deployment.yaml
    │   ├── frontend-service.yaml
    │   ├── secrets.yaml
    │   └── configmap.yaml
    └── README.md            # Existing, to be updated

# New CI/CD configuration
.github/
└── workflows/
    ├── build-and-push.yml   # NEW: Build and push images to registry
    ├── deploy-cloud.yml     # NEW: Deploy to cloud cluster
    └── health-check.yml     # NEW: Post-deployment validation

# New cloud deployment documentation
docs/
└── deployment/
    ├── cloud-setup.md       # NEW: Cloud provider setup guide
    ├── registry-setup.md    # NEW: Container registry configuration
    ├── cicd-setup.md        # NEW: CI/CD pipeline setup
    └── troubleshooting.md   # NEW: Common deployment issues
```

**Structure Decision**: Existing web application structure (backend/ + frontend/) is maintained. Cloud deployment adds infrastructure configuration (Helm values, CI/CD workflows) and documentation without modifying application code. This separation ensures the application remains cloud-agnostic while deployment configurations are cloud-specific.

## Complexity Tracking

> **No violations to justify** - All constitution checks passed without requiring complexity justifications.

## Phase 0: Research & Discovery

### Research Tasks

#### RT-001: Cloud Provider Free Tier Analysis
**Objective**: Identify the best free-tier Kubernetes service for deployment

**Research Questions**:
- Which cloud providers offer free Kubernetes clusters?
- What are the resource limits (nodes, CPU, memory, storage)?
- What are the time limits (trial periods, always-free tiers)?
- Which provider has the simplest setup process?
- Which provider integrates best with free container registries?

**Deliverable**: Comparison table in research.md with recommendation

#### RT-002: Container Registry Options
**Objective**: Select a container registry compatible with cloud Kubernetes

**Research Questions**:
- Docker Hub free tier limits (pulls, storage, private repos)?
- GitHub Container Registry capabilities and limits?
- Cloud provider registries (OCI Registry, GCR, ACR, ECR) free tiers?
- Which registry has best integration with GitHub Actions?
- Authentication methods for cluster to pull images?

**Deliverable**: Registry selection with authentication setup guide

#### RT-003: Public Access Strategy
**Objective**: Determine LoadBalancer vs Ingress for public access

**Research Questions**:
- Do free-tier clusters support LoadBalancer services?
- What are the costs/limits for LoadBalancers?
- Is Ingress controller available in free tier?
- Which approach is simpler for demo deployment?
- How to configure HTTPS/TLS for public access?

**Deliverable**: Public access architecture decision with implementation steps

#### RT-004: CI/CD Pipeline Design
**Objective**: Design GitHub Actions workflow for automated deployment

**Research Questions**:
- How to trigger builds on code push?
- How to build and push Docker images in GitHub Actions?
- How to authenticate GitHub Actions with cloud Kubernetes?
- How to update Helm deployments from CI/CD?
- How to validate deployment success in pipeline?

**Deliverable**: CI/CD workflow architecture with security best practices

#### RT-005: Kubernetes Secrets Management
**Objective**: Secure secrets handling in cloud deployment

**Research Questions**:
- How to create Kubernetes Secrets from environment variables?
- How to reference secrets in Helm charts?
- How to update secrets without redeploying?
- How to avoid committing secrets to Git?
- Best practices for secret rotation?

**Deliverable**: Secrets management strategy with Helm integration

#### RT-006: External Database Connectivity
**Objective**: Ensure cloud cluster can connect to Neon PostgreSQL

**Research Questions**:
- Do cloud Kubernetes clusters have outbound internet access?
- Are there firewall rules blocking external database connections?
- How to configure connection pooling for cloud deployment?
- How to handle database connection failures gracefully?
- What are Neon's connection limits for free tier?

**Deliverable**: Database connectivity validation and configuration guide

#### RT-007: Health Checks and Monitoring
**Objective**: Implement robust health checks for production

**Research Questions**:
- What health check endpoints should be exposed?
- How to configure Kubernetes liveness/readiness probes?
- How to monitor pod health and restarts?
- How to access logs from cloud-deployed pods?
- What metrics should be tracked for production?

**Deliverable**: Health check and monitoring implementation plan

### Research Consolidation

**Output**: `research.md` document containing:
- Cloud provider recommendation with justification
- Container registry selection and setup steps
- Public access architecture (LoadBalancer or Ingress)
- CI/CD pipeline design and workflow files
- Secrets management strategy
- Database connectivity validation
- Health check and monitoring configuration

**Success Criteria**: All NEEDS CLARIFICATION items resolved with concrete technical decisions and implementation paths.

## Phase 1: Design & Contracts

### Design Artifacts

#### DA-001: Data Model (data-model.md)
**Content**: Deployment configuration model

**Entities**:
- **Cloud Cluster Configuration**: Provider, region, node count, node size
- **Container Images**: Repository URLs, tags, pull secrets
- **Helm Release**: Release name, namespace, values overrides
- **Secrets**: List of required secrets (DATABASE_URL, JWT_SECRET, API keys)
- **Service Exposure**: LoadBalancer/Ingress configuration, public URL
- **CI/CD Pipeline**: Trigger conditions, build steps, deployment steps

**Relationships**:
- Cluster hosts Helm Release
- Helm Release references Container Images
- Container Images stored in Registry
- Secrets injected into Pods
- Service Exposure routes traffic to Pods

#### DA-002: API Contracts (contracts/)
**Content**: Deployment contracts and configurations

**Files**:
1. **helm-values-cloud.yaml**: Cloud-specific Helm values template
   ```yaml
   # Image configuration
   backend:
     image:
       repository: <registry>/todo-backend
       tag: latest
       pullPolicy: Always

   frontend:
     image:
       repository: <registry>/todo-frontend
       tag: latest
       pullPolicy: Always

   # Service exposure
   frontend:
     service:
       type: LoadBalancer  # or ClusterIP with Ingress
       port: 80

   # Resource limits (free tier)
   backend:
     resources:
       requests:
         memory: "256Mi"
         cpu: "250m"
       limits:
         memory: "512Mi"
         cpu: "500m"

   # Secrets (from Kubernetes Secret)
   secrets:
     DATABASE_URL: <from-k8s-secret>
     JWT_SECRET: <from-k8s-secret>
   ```

2. **github-actions-ci.yaml**: CI/CD workflow
   ```yaml
   name: Build and Deploy
   on:
     push:
       branches: [main]

   jobs:
     build:
       - Build Docker images
       - Push to container registry

     deploy:
       - Update Kubernetes deployment
       - Verify health checks
   ```

3. **deployment-checklist.md**: Pre-deployment validation
   - Cloud cluster provisioned and accessible
   - Container registry configured
   - Secrets created in Kubernetes
   - Database connectivity verified
   - Helm charts validated
   - CI/CD pipeline tested

#### DA-003: Quickstart Guide (quickstart.md)
**Content**: Step-by-step cloud deployment guide

**Sections**:
1. **Prerequisites**: Cloud account, kubectl, helm, docker
2. **Cloud Cluster Setup**: Provision cluster, configure kubectl
3. **Container Registry Setup**: Create registry, configure authentication
4. **Secrets Configuration**: Create Kubernetes secrets
5. **Image Build and Push**: Build images, push to registry
6. **Helm Deployment**: Install/upgrade Helm release
7. **Public Access Verification**: Test public URL
8. **CI/CD Setup**: Configure GitHub Actions
9. **Scaling and Monitoring**: Scale replicas, view logs
10. **Troubleshooting**: Common issues and solutions

### Agent Context Update

**Action**: Run `.specify/scripts/bash/update-agent-context.sh claude`

**Updates**:
- Add cloud Kubernetes deployment knowledge
- Add Helm chart configuration patterns
- Add CI/CD pipeline setup
- Add container registry integration
- Add Kubernetes secrets management

**Preserved**: Existing application context (FastAPI, Next.js, authentication, MCP tools)

## Phase 2: Task Generation

**Note**: Phase 2 (task generation) is handled by the `/sp.tasks` command, not `/sp.plan`.

The `/sp.tasks` command will break down this plan into atomic, testable tasks organized by user story priority (P1, P2, P3).

## Next Steps

1. **Complete Phase 0**: Execute research tasks to resolve all technical decisions
2. **Complete Phase 1**: Generate data-model.md, contracts/, and quickstart.md
3. **Run `/sp.tasks`**: Generate actionable task list from this plan
4. **Run `/sp.implement`**: Execute tasks using specialized agents

## Success Metrics

This plan succeeds when:
- ✅ All research questions answered with concrete decisions
- ✅ Cloud provider and registry selected
- ✅ Helm values template created for cloud deployment
- ✅ CI/CD workflow designed and documented
- ✅ Quickstart guide enables another developer to deploy
- ✅ All design artifacts ready for task generation
- ✅ No unresolved NEEDS CLARIFICATION items
