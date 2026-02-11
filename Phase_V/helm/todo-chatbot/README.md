# Todo Chatbot Helm Chart

AI-Powered Todo Chatbot with Conversational Interface - Kubernetes Deployment

## Overview

This Helm chart deploys the Todo AI Chatbot application on Kubernetes, consisting of:
- **Frontend**: Next.js 16 application with ChatKit UI
- **Backend**: FastAPI application with MCP server and OpenAI Agents SDK
- **Database**: External Neon Serverless PostgreSQL

## Prerequisites

- Kubernetes 1.28+ (Minikube, kind, or cloud cluster)
- Helm 3.12+
- kubectl configured to access your cluster
- Docker images built and available:
  - `todo-backend:latest`
  - `todo-frontend:latest`

## Quick Start

### 1. Build Container Images

```bash
# Backend
cd ../../../Phase_III/backend
docker build -t todo-backend:latest .

# Frontend
cd ../../../Phase_III/frontend
docker build -t todo-frontend:latest -f ../../../Phase_VI/docker/frontend/Dockerfile .
```

### 2. Load Images into Minikube (if using Minikube)

```bash
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
```

### 3. Configure Secrets

Edit `values-dev.yaml` and replace the base64-encoded secrets with your actual values:

```yaml
backend:
  secrets:
    DATABASE_URL: "<your-base64-encoded-neon-connection-string>"
    JWT_SECRET: "<your-base64-encoded-jwt-secret>"
    GEMINI_API_KEY: "<your-base64-encoded-gemini-key>"
```

To base64 encode values:
```bash
echo -n "your-value" | base64
```

### 4. Install the Chart

```bash
# Development environment
helm install todo-chatbot . -f values-dev.yaml

# Staging environment
helm install todo-chatbot . -f values-staging.yaml

# Production environment
helm install todo-chatbot . -f values-production.yaml
```

### 5. Access the Application

```bash
# Get Minikube IP
minikube ip

# Access frontend at http://<minikube-ip>:30000
```

## Configuration

### Required Values

These values **MUST** be configured before deployment:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `backend.secrets.DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `backend.secrets.JWT_SECRET` | JWT secret key (min 32 chars) | Generate with `openssl rand -base64 32` |
| `backend.secrets.GEMINI_API_KEY` | Google Gemini API key | Get from Google AI Studio |

### Optional Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `backend.replicas` | Number of backend replicas | `1` |
| `frontend.replicas` | Number of frontend replicas | `1` |
| `backend.resources.requests.memory` | Backend memory request | `256Mi` |
| `backend.resources.requests.cpu` | Backend CPU request | `250m` |
| `frontend.resources.requests.memory` | Frontend memory request | `512Mi` |
| `frontend.resources.requests.cpu` | Frontend CPU request | `500m` |
| `persistence.enabled` | Enable persistent storage | `false` |
| `persistence.size` | Storage size | `5Gi` |

### Environment-Specific Values

The chart includes three environment configurations:

- **values-dev.yaml**: Local development (1 replica, debug logging)
- **values-staging.yaml**: Staging environment (2 replicas, info logging)
- **values-production.yaml**: Production environment (3 replicas, warning logging)

## Upgrading

### Update Configuration

```bash
# Edit values file
vim values-dev.yaml

# Apply changes
helm upgrade todo-chatbot . -f values-dev.yaml
```

### Update Images

```bash
# Build new images with version tag
docker build -t todo-backend:1.1.0 .
docker build -t todo-frontend:1.1.0 .

# Update values file
# backend.image.tag: "1.1.0"
# frontend.image.tag: "1.1.0"

# Upgrade release
helm upgrade todo-chatbot . -f values-dev.yaml
```

## Rollback

```bash
# View release history
helm history todo-chatbot

# Rollback to previous version
helm rollback todo-chatbot

# Rollback to specific revision
helm rollback todo-chatbot 2
```

## Scaling

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment backend -n todo-app --replicas=3

# Scale frontend
kubectl scale deployment frontend -n todo-app --replicas=2
```

### Via Helm

```bash
# Edit values file
# backend.replicas: 3
# frontend.replicas: 2

# Apply changes
helm upgrade todo-chatbot . -f values-dev.yaml
```

## Monitoring

### Check Pod Status

```bash
kubectl get pods -n todo-app
kubectl describe pod -n todo-app <pod-name>
```

### View Logs

```bash
# Backend logs
kubectl logs -n todo-app -l app=backend -f

# Frontend logs
kubectl logs -n todo-app -l app=frontend -f

# Specific pod
kubectl logs -n todo-app <pod-name> -f
```

### Health Checks

```bash
# Backend health
kubectl port-forward -n todo-app service/backend-service 8000:8000
curl http://localhost:8000/api/health

# Frontend health
curl http://<minikube-ip>:30000
```

## Troubleshooting

### Pods Not Starting

**Check pod events:**
```bash
kubectl describe pod -n todo-app <pod-name>
```

**Common issues:**
- Images not loaded into Minikube: `minikube image load <image-name>`
- Insufficient resources: Increase Minikube memory/CPU
- Missing secrets: Verify secrets are configured correctly

### Database Connection Errors

**Check backend logs:**
```bash
kubectl logs -n todo-app -l app=backend
```

**Verify DATABASE_URL:**
```bash
kubectl get secret -n todo-app todo-app-secrets -o jsonpath='{.data.DATABASE_URL}' | base64 -d
```

### Frontend Cannot Reach Backend

**Check service DNS:**
```bash
kubectl exec -n todo-app -it <frontend-pod> -- nslookup backend-service
```

**Verify NEXT_PUBLIC_API_URL:**
```bash
kubectl get deployment frontend -n todo-app -o jsonpath='{.spec.template.spec.containers[0].env[?(@.name=="NEXT_PUBLIC_API_URL")].value}'
```

## Uninstalling

```bash
# Uninstall release
helm uninstall todo-chatbot

# Delete namespace (removes all resources)
kubectl delete namespace todo-app
```

## Values Reference

See [values.yaml](values.yaml) for complete configuration options with detailed comments.

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/todo-chatbot/issues
- Documentation: https://github.com/yourusername/todo-chatbot/tree/main/Phase_VI

## License

MIT License - See LICENSE file for details
