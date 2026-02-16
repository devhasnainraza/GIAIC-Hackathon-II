# Quickstart Guide: Local Kubernetes Deployment

**Feature**: 007-local-k8s-deployment
**Date**: 2026-02-01
**Purpose**: Step-by-step guide to deploy Todo AI Chatbot on local Kubernetes

---

## Overview

This guide walks you through deploying the Phase III Todo AI Chatbot on a local Kubernetes cluster using Minikube and Helm. The entire process takes approximately 10-15 minutes.

**What You'll Deploy**:
- Frontend: Next.js 16 application with ChatKit UI
- Backend: FastAPI application with MCP server
- Database: External Neon Serverless PostgreSQL
- Orchestration: Kubernetes via Minikube
- Package Management: Helm charts

**Access After Deployment**:
- Frontend: `http://<minikube-ip>:30000`
- Backend API: Internal only (via Kubernetes DNS)

---

## Prerequisites

### Required Software

1. **Docker Desktop** (v20.10+)
   - Download: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`
   - Ensure Docker daemon is running

2. **Minikube** (v1.30+)
   - Download: https://minikube.sigs.k8s.io/docs/start/
   - Verify: `minikube version`

3. **kubectl** (v1.28+)
   - Download: https://kubernetes.io/docs/tasks/tools/
   - Verify: `kubectl version --client`

4. **Helm** (v3.12+)
   - Download: https://helm.sh/docs/intro/install/
   - Verify: `helm version`

### Optional AI DevOps Tools

5. **Gordon** (Docker AI)
   - Included with Docker Desktop
   - Verify: `docker ai --help`

6. **kubectl-ai**
   - Install: `kubectl krew install ai`
   - Requires: OpenAI API key

7. **kagent**
   - Download: https://github.com/kagent-ai/kagent
   - Requires: API key

### System Requirements

- **CPU**: 2 cores minimum, 4 cores recommended
- **Memory**: 4GB minimum, 8GB recommended
- **Disk**: 20GB free space
- **OS**: Windows 10/11, macOS 11+, or Linux

---

## Step 1: Start Minikube

Start a local Kubernetes cluster with sufficient resources:

```bash
# Start Minikube with 2 CPUs and 4GB memory
minikube start --cpus=2 --memory=4096 --driver=docker

# Verify cluster is running
minikube status

# Expected output:
# minikube
# type: Control Plane
# host: Running
# kubelet: Running
# apiserver: Running
# kubeconfig: Configured
```

**Troubleshooting**:
- If Minikube fails to start, try: `minikube delete && minikube start --cpus=2 --memory=4096`
- On Windows, ensure Hyper-V or WSL2 is enabled
- On macOS, ensure Docker Desktop has sufficient resources allocated

---

## Step 2: Build Container Images

Build Docker images for frontend and backend:

### Backend Image

```bash
# Navigate to Phase_III backend directory
cd E:/Hackathon_II/Phase_III/backend

# Build backend image
docker build -t todo-backend:latest .

# Verify image was created
docker images | grep todo-backend

# Expected output:
# todo-backend   latest   <image-id>   <time>   <size>
```

### Frontend Image

First, create the frontend Dockerfile (if not exists):

**File**: `E:/Hackathon_II/Phase_VI/docker/frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["node", "server.js"]
```

```bash
# Navigate to Phase_III frontend directory
cd E:/Hackathon_II/Phase_III/frontend

# Build frontend image
docker build -t todo-frontend:latest -f E:/Hackathon_II/Phase_VI/docker/frontend/Dockerfile .

# Verify image was created
docker images | grep todo-frontend
```

### Load Images into Minikube

```bash
# Load backend image
minikube image load todo-backend:latest

# Load frontend image
minikube image load todo-frontend:latest

# Verify images are available in Minikube
minikube image ls | grep todo
```

**Note**: This step is crucial. Minikube runs in its own Docker environment, so images must be explicitly loaded.

---

## Step 3: Configure Secrets

Create a secrets file with your actual credentials:

```bash
# Navigate to Phase_VI directory
cd E:/Hackathon_II/Phase_VI

# Create secrets file from example
cp kubernetes/secrets.yaml.example kubernetes/secrets.yaml
```

**Edit** `kubernetes/secrets.yaml` with your values:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: todo-app-secrets
  namespace: todo-app
type: Opaque
data:
  # Base64 encode your values:
  # echo -n "your-value" | base64

  # REQUIRED: Neon PostgreSQL connection string
  DATABASE_URL: <base64-encoded-connection-string>

  # REQUIRED: JWT secret (minimum 32 characters)
  JWT_SECRET: <base64-encoded-secret>

  # REQUIRED: Gemini API key (for AI chat)
  GEMINI_API_KEY: <base64-encoded-api-key>

  # OPTIONAL: Other API keys
  OPENAI_API_KEY: <base64-encoded-openai-key>
  CLOUDINARY_CLOUD_NAME: <base64-encoded-cloud-name>
  CLOUDINARY_API_KEY: <base64-encoded-api-key>
  CLOUDINARY_API_SECRET: <base64-encoded-api-secret>
```

**Base64 Encoding Examples**:

```bash
# On Linux/macOS
echo -n "postgresql://user:pass@host/db?sslmode=require" | base64

# On Windows (PowerShell)
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your-value"))

# Example values from Phase_III .env.example:
# DATABASE_URL: DATABASE_URL
# JWT_SECRET: JWT_SECRET
# GEMINI_API_KEY: GEMINI_API_KEY
```

**⚠️ Security Warning**: Never commit `secrets.yaml` to version control. It's already in `.gitignore`.

---

## Step 4: Deploy with Helm

Deploy the application using Helm charts:

```bash
# Navigate to Phase_VI directory
cd E:/Hackathon_II/Phase_VI

# Install the Helm chart
helm install todo-chatbot ./helm/todo-chatbot -f ./helm/todo-chatbot/values-dev.yaml

# Expected output:
# NAME: todo-chatbot
# LAST DEPLOYED: <timestamp>
# NAMESPACE: default
# STATUS: deployed
# REVISION: 1
# NOTES:
# [Post-install instructions will appear here]
```

**Verify Deployment**:

```bash
# Check all pods are running
kubectl get pods -n todo-app

# Expected output:
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
# frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m

# Check services
kubectl get services -n todo-app

# Expected output:
# NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# backend-service    ClusterIP   10.96.xxx.xxx   <none>        8000/TCP         2m
# frontend-service   NodePort    10.96.xxx.xxx   <none>        3000:30000/TCP   2m
```

**Wait for Pods to be Ready**:

```bash
# Watch pod status (Ctrl+C to exit)
kubectl get pods -n todo-app -w

# Wait until both pods show 1/1 READY and Running status
```

---

## Step 5: Access the Application

Get the Minikube IP and access the frontend:

```bash
# Get Minikube IP address
minikube ip

# Example output: 192.168.49.2
```

**Open in Browser**:
- URL: `http://<minikube-ip>:30000`
- Example: `http://192.168.49.2:30000`

**Expected Result**:
- Frontend loads successfully
- You can sign up / sign in
- Chat interface is accessible
- Todo operations work correctly

---

## Step 6: Verify Functionality

Test the complete application flow:

### 6.1 Check Backend Health

```bash
# Port-forward backend service to localhost
kubectl port-forward -n todo-app service/backend-service 8000:8000

# In another terminal, test health endpoint
curl http://localhost:8000/api/health

# Expected output:
# {"status":"healthy","timestamp":"2026-02-01T12:00:00","version":"2.0.0","database":"connected"}
```

### 6.2 Check Frontend Health

```bash
# Access frontend health endpoint
curl http://<minikube-ip>:30000/api/health

# Expected output:
# {"status":"healthy","timestamp":"2026-02-01T12:00:00","version":"1.0.0"}
```

### 6.3 Test User Flow

1. **Sign Up**: Create a new account
2. **Sign In**: Log in with credentials
3. **Chat**: Send a message to the AI assistant
4. **Create Todo**: Ask AI to create a task
5. **List Todos**: Verify task appears
6. **Complete Todo**: Mark task as done
7. **Verify Persistence**: Restart pods and verify data persists

### 6.4 Test Pod Restart Resilience

```bash
# Delete backend pod (Kubernetes will recreate it)
kubectl delete pod -n todo-app -l app=backend

# Watch pod restart
kubectl get pods -n todo-app -w

# Verify application still works after restart
# Access frontend and check that todos and conversations are still there
```

---

## Step 7: Scale the Application (Optional)

Test horizontal scaling:

```bash
# Scale backend to 2 replicas
kubectl scale deployment backend -n todo-app --replicas=2

# Scale frontend to 2 replicas
kubectl scale deployment frontend -n todo-app --replicas=2

# Verify scaling
kubectl get pods -n todo-app

# Expected output:
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-xxxxxxxxxx-xxxxx    1/1     Running   0          5m
# backend-xxxxxxxxxx-yyyyy    1/1     Running   0          30s
# frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
# frontend-xxxxxxxxxx-yyyyy   1/1     Running   0          30s

# Scale back to 1 replica
kubectl scale deployment backend -n todo-app --replicas=1
kubectl scale deployment frontend -n todo-app --replicas=1
```

---

## Step 8: AI-Assisted Operations (Optional)

If you have AI DevOps tools installed, try these commands:

### Using kubectl-ai

```bash
# Deploy with natural language
kubectl-ai "show me all pods in todo-app namespace"

# Scale with natural language
kubectl-ai "scale backend deployment to 2 replicas in todo-app namespace"

# Debug with natural language
kubectl-ai "why is my backend pod in CrashLoopBackOff in todo-app namespace?"

# Get logs
kubectl-ai "show logs for backend pod in todo-app namespace"
```

### Using kagent

```bash
# Analyze cluster health
kagent "analyze cluster health"

# Get optimization suggestions
kagent "suggest resource optimizations for todo-app namespace"

# Troubleshoot issues
kagent "diagnose issues in todo-app namespace"
```

### Using Gordon

```bash
# Build images with natural language
docker ai "build image from current directory tagged as todo-backend:v2"

# Run containers
docker ai "run todo-backend container on port 8000 with environment variables from .env"
```

---

## Troubleshooting

### Pods Not Starting

**Symptom**: Pods stuck in `Pending`, `CrashLoopBackOff`, or `ImagePullBackOff`

**Solutions**:

```bash
# Check pod status
kubectl describe pod -n todo-app <pod-name>

# Check logs
kubectl logs -n todo-app <pod-name>

# Common issues:
# 1. Images not loaded into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# 2. Insufficient resources
minikube delete
minikube start --cpus=4 --memory=8192

# 3. Database connection failure
# Verify DATABASE_URL in secrets.yaml is correct
kubectl get secret -n todo-app todo-app-secrets -o yaml
```

### Cannot Access Frontend

**Symptom**: Browser cannot reach `http://<minikube-ip>:30000`

**Solutions**:

```bash
# Verify Minikube IP
minikube ip

# Verify service is exposed
kubectl get service -n todo-app frontend-service

# Check if NodePort is correct (should be 30000)
# If different, use the actual NodePort shown

# Test with curl
curl http://<minikube-ip>:30000

# Alternative: Use minikube service command
minikube service frontend-service -n todo-app
```

### Backend Cannot Connect to Database

**Symptom**: Backend pod logs show database connection errors

**Solutions**:

```bash
# Check backend logs
kubectl logs -n todo-app -l app=backend

# Verify DATABASE_URL secret
kubectl get secret -n todo-app todo-app-secrets -o jsonpath='{.data.DATABASE_URL}' | base64 -d

# Test database connection from pod
kubectl exec -n todo-app -it <backend-pod-name> -- python -c "
from src.database import engine
engine.connect()
print('Database connection successful')
"
```

### Secrets Not Applied

**Symptom**: Pods show environment variable errors

**Solutions**:

```bash
# Verify secrets exist
kubectl get secrets -n todo-app

# Check secret data
kubectl describe secret -n todo-app todo-app-secrets

# Recreate secrets
kubectl delete secret -n todo-app todo-app-secrets
kubectl apply -f kubernetes/secrets.yaml

# Restart pods to pick up new secrets
kubectl rollout restart deployment -n todo-app backend
kubectl rollout restart deployment -n todo-app frontend
```

---

## Useful Commands

### Viewing Resources

```bash
# Get all resources in namespace
kubectl get all -n todo-app

# Describe deployment
kubectl describe deployment -n todo-app backend

# Get pod logs
kubectl logs -n todo-app -l app=backend

# Follow logs in real-time
kubectl logs -n todo-app -l app=backend -f

# Get events
kubectl get events -n todo-app --sort-by='.lastTimestamp'
```

### Port Forwarding

```bash
# Forward backend to localhost
kubectl port-forward -n todo-app service/backend-service 8000:8000

# Forward frontend to localhost
kubectl port-forward -n todo-app service/frontend-service 3000:3000
```

### Helm Operations

```bash
# List installed releases
helm list

# Get release status
helm status todo-chatbot

# Upgrade release
helm upgrade todo-chatbot ./helm/todo-chatbot -f values-dev.yaml

# Rollback to previous version
helm rollback todo-chatbot

# Uninstall release
helm uninstall todo-chatbot

# Delete namespace
kubectl delete namespace todo-app
```

### Cleanup

```bash
# Uninstall Helm release
helm uninstall todo-chatbot

# Delete namespace (removes all resources)
kubectl delete namespace todo-app

# Stop Minikube
minikube stop

# Delete Minikube cluster
minikube delete
```

---

## Next Steps

After successful deployment:

1. **Test All Features**: Verify authentication, todo CRUD, chat functionality
2. **Monitor Performance**: Check resource usage with `kubectl top pods -n todo-app`
3. **Enable Persistence**: Set `persistence.enabled: true` in values to persist uploads
4. **Scale Testing**: Test with multiple replicas
5. **Update Application**: Make code changes and redeploy with `helm upgrade`

---

## Success Criteria Checklist

- [ ] Minikube cluster running
- [ ] Both container images built and loaded
- [ ] Secrets configured correctly
- [ ] Helm chart deployed successfully
- [ ] Both pods in Running state (1/1 READY)
- [ ] Frontend accessible at `http://<minikube-ip>:30000`
- [ ] Backend health check returns 200 OK
- [ ] User can sign up and sign in
- [ ] Chat interface works
- [ ] Todo operations (create, list, complete, delete) work
- [ ] Data persists across pod restarts
- [ ] Scaling works (optional)
- [ ] AI tools work (optional)

---

## Estimated Time

- **Prerequisites Setup**: 10-15 minutes (first time only)
- **Image Building**: 5-10 minutes
- **Deployment**: 2-3 minutes
- **Verification**: 2-5 minutes
- **Total**: 10-15 minutes (after prerequisites)

---

## Support

If you encounter issues not covered in this guide:

1. Check pod logs: `kubectl logs -n todo-app <pod-name>`
2. Check events: `kubectl get events -n todo-app`
3. Verify secrets: `kubectl describe secret -n todo-app todo-app-secrets`
4. Review Phase III application logs for application-specific errors
5. Consult Kubernetes documentation: https://kubernetes.io/docs/
6. Consult Helm documentation: https://helm.sh/docs/
