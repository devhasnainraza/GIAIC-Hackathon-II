# Data Model: Kubernetes Resources

**Feature**: 007-local-k8s-deployment
**Date**: 2026-02-01
**Purpose**: Define all Kubernetes resources, their specifications, and relationships

---

## Resource Hierarchy

```
Namespace: todo-app
├── ConfigMap: todo-app-config
├── Secret: todo-app-secrets
├── Backend Stack
│   ├── Deployment: backend
│   └── Service: backend-service (ClusterIP)
└── Frontend Stack
    ├── Deployment: frontend
    └── Service: frontend-service (NodePort)
```

---

## 1. Namespace

**Resource**: `Namespace`
**Name**: `todo-app`

**Specification**:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: todo-app
  labels:
    app: todo-chatbot
    environment: development
    managed-by: helm
```

**Purpose**: Isolate all application resources in a dedicated namespace for organization and resource management.

**Labels**:
- `app`: Application identifier
- `environment`: Deployment environment (development/staging/production)
- `managed-by`: Indicates Helm management

---

## 2. ConfigMap

**Resource**: `ConfigMap`
**Name**: `todo-app-config`
**Namespace**: `todo-app`

**Specification**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: todo-app-config
  namespace: todo-app
  labels:
    app: todo-chatbot
data:
  # Application Environment
  ENVIRONMENT: "development"
  LOG_LEVEL: "INFO"

  # CORS Configuration
  CORS_ORIGINS: "http://localhost:30000"

  # Frontend URL
  FRONTEND_URL: "http://localhost:30000"

  # MCP Server Configuration
  MCP_SERVER_NAME: "puretasks-mcp-server"
  MCP_SERVER_PORT: "8001"

  # Rate Limiting
  RATE_LIMIT_PER_MINUTE: "60"

  # Database Pool Configuration
  DATABASE_POOL_SIZE: "5"
  DATABASE_MAX_OVERFLOW: "10"

  # Email Configuration
  EMAIL_PROVIDER: "console"
  FROM_EMAIL: "noreply@puretasks.com"
```

**Purpose**: Store non-sensitive configuration that can be shared across pods and easily updated without rebuilding images.

**Usage**: Mounted as environment variables in both backend and frontend deployments.

---

## 3. Secret

**Resource**: `Secret`
**Name**: `todo-app-secrets`
**Namespace**: `todo-app`
**Type**: `Opaque`

**Specification**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: todo-app-secrets
  namespace: todo-app
  labels:
    app: todo-chatbot
type: Opaque
data:
  # Database Connection (base64 encoded)
  DATABASE_URL: <base64-encoded-neon-connection-string>

  # JWT Authentication (base64 encoded)
  JWT_SECRET: <base64-encoded-secret-key>
  JWT_ALGORITHM: SFMyNTY=  # HS256
  JWT_EXPIRATION_HOURS: MTY4  # 168

  # AI API Keys (base64 encoded)
  OPENAI_API_KEY: <base64-encoded-openai-key>
  GEMINI_API_KEY: <base64-encoded-gemini-key>

  # Cloudinary Configuration (base64 encoded)
  CLOUDINARY_CLOUD_NAME: <base64-encoded-cloud-name>
  CLOUDINARY_API_KEY: <base64-encoded-api-key>
  CLOUDINARY_API_SECRET: <base64-encoded-api-secret>

  # Email Configuration (base64 encoded)
  GMAIL_EMAIL: <base64-encoded-gmail>
  GMAIL_APP_PASSWORD: <base64-encoded-app-password>
  RESEND_API_KEY: <base64-encoded-resend-key>
```

**Purpose**: Store sensitive credentials securely. Values are base64 encoded and should never be committed to version control.

**Base64 Encoding Example**:
```bash
echo -n "postgresql://user:pass@host/db" | base64
```

**Usage**: Mounted as environment variables in backend deployment only (frontend doesn't need secrets).

---

## 4. Backend Deployment

**Resource**: `Deployment`
**Name**: `backend`
**Namespace**: `todo-app`

**Specification**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: todo-app
  labels:
    app: backend
    component: api
    tier: backend
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
        component: api
        tier: backend
    spec:
      containers:
      - name: backend
        image: todo-backend:latest
        imagePullPolicy: IfNotPresent
        ports:
        - name: http
          containerPort: 8000
          protocol: TCP

        # Environment Variables from ConfigMap
        envFrom:
        - configMapRef:
            name: todo-app-config
        - secretRef:
            name: todo-app-secrets

        # Resource Limits
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

        # Startup Probe (allows 60s for cold start)
        startupProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 0
          periodSeconds: 10
          failureThreshold: 6
          timeoutSeconds: 5

        # Liveness Probe (detects hung processes)
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          failureThreshold: 3
          timeoutSeconds: 5

        # Readiness Probe (controls traffic routing)
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 2
          timeoutSeconds: 3

        # Volume Mounts (optional)
        volumeMounts:
        - name: uploads
          mountPath: /app/uploads

      # Volumes (optional, for persistent uploads)
      volumes:
      - name: uploads
        emptyDir: {}  # Default: ephemeral storage
        # For persistence, use:
        # persistentVolumeClaim:
        #   claimName: backend-uploads-pvc
```

**Key Specifications**:

**Replicas**: 1 (default), scalable to 3
- Single replica sufficient for local development
- Can scale horizontally for load testing

**Strategy**: RollingUpdate with maxSurge=1, maxUnavailable=0
- Zero downtime updates
- One extra pod created during update
- Old pod terminated only after new pod is ready

**Image**: `todo-backend:latest`
- Built from Phase_III/backend
- Loaded into Minikube with `minikube image load`

**Port**: 8000 (HTTP)
- FastAPI default port
- Matches existing application configuration

**Resources**:
- Requests: 256Mi memory, 250m CPU (guaranteed)
- Limits: 512Mi memory, 500m CPU (maximum)
- Rationale: FastAPI is lightweight, these limits prevent resource exhaustion

**Probes**:
- **Startup**: 60s total (6 failures × 10s period) for Neon cold start
- **Liveness**: Restarts pod if unhealthy for 30s (3 failures × 10s)
- **Readiness**: Removes from service if unhealthy for 10s (2 failures × 5s)

**Volumes**:
- Default: `emptyDir` (ephemeral, lost on pod restart)
- Optional: PersistentVolumeClaim for persistent uploads

---

## 5. Backend Service

**Resource**: `Service`
**Name**: `backend-service`
**Namespace**: `todo-app`
**Type**: `ClusterIP`

**Specification**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: todo-app
  labels:
    app: backend
    component: api
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - name: http
    port: 8000
    targetPort: 8000
    protocol: TCP
  sessionAffinity: None
```

**Key Specifications**:

**Type**: ClusterIP (internal only)
- Not accessible from outside cluster
- Frontend accesses via Kubernetes DNS: `backend-service:8000`
- Matches production pattern (backend behind gateway)

**Selector**: `app: backend`
- Routes traffic to pods with matching label
- Automatically load balances across multiple replicas

**Port Mapping**:
- Service port: 8000 (what clients connect to)
- Target port: 8000 (container port)
- Protocol: TCP

**Session Affinity**: None
- Stateless application doesn't require sticky sessions
- Allows even load distribution

---

## 6. Frontend Deployment

**Resource**: `Deployment`
**Name**: `frontend`
**Namespace**: `todo-app`

**Specification**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: todo-app
  labels:
    app: frontend
    component: ui
    tier: frontend
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
        component: ui
        tier: frontend
    spec:
      containers:
      - name: frontend
        image: todo-frontend:latest
        imagePullPolicy: IfNotPresent
        ports:
        - name: http
          containerPort: 3000
          protocol: TCP

        # Environment Variables
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://backend-service:8000"
        - name: NODE_ENV
          value: "production"

        # Resource Limits
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"

        # Startup Probe (Next.js starts faster than backend)
        startupProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 0
          periodSeconds: 5
          failureThreshold: 6
          timeoutSeconds: 3

        # Liveness Probe
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 20
          periodSeconds: 10
          failureThreshold: 3
          timeoutSeconds: 3

        # Readiness Probe
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 2
          timeoutSeconds: 3
```

**Key Specifications**:

**Replicas**: 1 (default), scalable to 2
- Single replica sufficient for local development
- Limited scaling due to higher resource requirements

**Image**: `todo-frontend:latest`
- Built from Phase_III/frontend
- Multi-stage build with Next.js standalone output

**Port**: 3000 (HTTP)
- Next.js default port
- Matches existing application configuration

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: Backend service URL via Kubernetes DNS
- `NODE_ENV`: production (enables Next.js optimizations)

**Resources**:
- Requests: 512Mi memory, 500m CPU (guaranteed)
- Limits: 1Gi memory, 1000m CPU (maximum)
- Rationale: Next.js SSR requires more resources than backend

**Probes**:
- **Startup**: 30s total (6 failures × 5s period) for Next.js initialization
- **Liveness**: Restarts pod if unhealthy for 30s
- **Readiness**: Removes from service if unhealthy for 10s

---

## 7. Frontend Service

**Resource**: `Service`
**Name**: `frontend-service`
**Namespace**: `todo-app`
**Type**: `NodePort`

**Specification**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: todo-app
  labels:
    app: frontend
    component: ui
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - name: http
    port: 3000
    targetPort: 3000
    nodePort: 30000
    protocol: TCP
  sessionAffinity: None
```

**Key Specifications**:

**Type**: NodePort (external access)
- Accessible from host machine
- URL: `http://<minikube-ip>:30000`
- Simplest option for local development

**Selector**: `app: frontend`
- Routes traffic to frontend pods
- Load balances across replicas

**Port Mapping**:
- Service port: 3000 (internal cluster access)
- Target port: 3000 (container port)
- Node port: 30000 (external access)
- Protocol: TCP

**NodePort Range**: 30000-32767 (Kubernetes default)
- 30000 chosen for easy memorization
- Unlikely to conflict with other services

---

## 8. PersistentVolume (Optional)

**Resource**: `PersistentVolume`
**Name**: `backend-uploads-pv`

**Specification**:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: backend-uploads-pv
  labels:
    type: local
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /mnt/data/uploads
    type: DirectoryOrCreate
```

**Key Specifications**:

**Capacity**: 5Gi
- Sufficient for development uploads
- Can be increased if needed

**Access Mode**: ReadWriteOnce
- Single node can mount read-write
- Appropriate for single-node Minikube

**Reclaim Policy**: Retain
- Data preserved after PVC deletion
- Manual cleanup required

**Storage Class**: manual
- Indicates manual provisioning
- Matches PVC storageClassName

**hostPath**: `/mnt/data/uploads`
- Minikube host directory
- Persists across pod restarts

---

## 9. PersistentVolumeClaim (Optional)

**Resource**: `PersistentVolumeClaim`
**Name**: `backend-uploads-pvc`
**Namespace**: `todo-app`

**Specification**:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backend-uploads-pvc
  namespace: todo-app
  labels:
    app: backend
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: manual
```

**Key Specifications**:

**Access Mode**: ReadWriteOnce
- Matches PV access mode
- Single pod can mount

**Storage Request**: 5Gi
- Matches PV capacity
- Kubernetes binds PVC to matching PV

**Storage Class**: manual
- Matches PV storageClassName
- Enables binding

**Usage**: Referenced in backend Deployment volume:
```yaml
volumes:
- name: uploads
  persistentVolumeClaim:
    claimName: backend-uploads-pvc
```

---

## Resource Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    Namespace: todo-app                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌──────────────┐              │
│  │  ConfigMap   │────────▶│   Backend    │              │
│  │              │         │  Deployment  │              │
│  └──────────────┘         └──────┬───────┘              │
│                                   │                      │
│  ┌──────────────┐                 │                      │
│  │    Secret    │────────────────▶│                      │
│  │              │                 │                      │
│  └──────────────┘                 ▼                      │
│                           ┌──────────────┐               │
│                           │   Backend    │               │
│                           │   Service    │               │
│                           │  (ClusterIP) │               │
│                           └──────┬───────┘               │
│                                  │                       │
│                                  │ DNS: backend-service  │
│                                  │                       │
│  ┌──────────────┐                │                       │
│  │  Frontend    │◀───────────────┘                       │
│  │  Deployment  │                                        │
│  └──────┬───────┘                                        │
│         │                                                 │
│         ▼                                                 │
│  ┌──────────────┐                                        │
│  │  Frontend    │                                        │
│  │   Service    │                                        │
│  │  (NodePort)  │                                        │
│  └──────┬───────┘                                        │
│         │                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │
          ▼
    Host Browser
  http://<minikube-ip>:30000
```

---

## Summary

**Total Resources**: 7 core + 2 optional
- 1 Namespace
- 1 ConfigMap
- 1 Secret
- 2 Deployments (backend, frontend)
- 2 Services (backend ClusterIP, frontend NodePort)
- 2 Optional (PersistentVolume, PersistentVolumeClaim)

**Resource Requirements**:
- Minimum: 768Mi memory, 750m CPU (1 replica each)
- Recommended: 2Gi memory, 2 CPU cores (with overhead)

**Network Flow**:
1. User → `http://<minikube-ip>:30000` → Frontend Service (NodePort)
2. Frontend Service → Frontend Pod (port 3000)
3. Frontend Pod → `http://backend-service:8000` → Backend Service (ClusterIP)
4. Backend Service → Backend Pod (port 8000)
5. Backend Pod → Neon PostgreSQL (external)

**Data Persistence**:
- Default: Ephemeral (emptyDir)
- Optional: Persistent (PV + PVC)
- Database: External (Neon)
