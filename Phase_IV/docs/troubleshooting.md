# Troubleshooting Guide: Local Kubernetes Deployment

**Feature**: 007-local-k8s-deployment
**Date**: 2026-02-01
**Purpose**: Common issues and solutions for local Kubernetes deployment

---

## Table of Contents

1. [Prerequisites Issues](#prerequisites-issues)
2. [Container Build Issues](#container-build-issues)
3. [Minikube Issues](#minikube-issues)
4. [Pod Startup Issues](#pod-startup-issues)
5. [Networking Issues](#networking-issues)
6. [Database Connection Issues](#database-connection-issues)
7. [Helm Issues](#helm-issues)
8. [Performance Issues](#performance-issues)

---

## Prerequisites Issues

### Docker Not Running

**Symptom**: `Cannot connect to the Docker daemon`

**Solution**:
```bash
# Windows: Start Docker Desktop
# Check status
docker ps

# If still failing, restart Docker Desktop
```

### Minikube Not Installed

**Symptom**: `minikube: command not found`

**Solution**:
```bash
# Windows (Chocolatey)
choco install minikube

# Windows (Direct download)
# Download from https://minikube.sigs.k8s.io/docs/start/

# Verify installation
minikube version
```

### Helm Not Installed

**Symptom**: `helm: command not found`

**Solution**:
```bash
# Windows (Chocolatey)
choco install kubernetes-helm

# Windows (Direct download)
# Download from https://helm.sh/docs/intro/install/

# Verify installation
helm version
```

---

## Container Build Issues

### Frontend Build Fails - Module Not Found

**Symptom**: `Error: Cannot find module 'next'`

**Solution**:
```bash
# Ensure you're building from Phase_III/frontend directory
cd E:/Hackathon_II/Phase_III/frontend

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Build image
docker build -t todo-frontend:latest -f ../../Phase_VI/docker/frontend/Dockerfile .
```

### Backend Build Fails - Requirements Error

**Symptom**: `ERROR: Could not find a version that satisfies the requirement`

**Solution**:
```bash
# Check Python version in Dockerfile matches requirements
# Ensure requirements.txt exists
cd E:/Hackathon_II/Phase_III/backend
cat requirements.txt

# Build with no cache
docker build --no-cache -t todo-backend:latest .
```

### Image Size Too Large

**Symptom**: Frontend image > 1GB

**Solution**:
```bash
# Verify multi-stage build is working
docker history todo-frontend:latest

# Check .dockerignore excludes node_modules
cat ../../Phase_VI/docker/frontend/.dockerignore

# Rebuild with proper exclusions
docker build -t todo-frontend:latest -f ../../Phase_VI/docker/frontend/Dockerfile .
```

---

## Minikube Issues

### Minikube Won't Start

**Symptom**: `Exiting due to HOST_VIRT_UNAVAILABLE`

**Solution**:
```bash
# Windows: Enable Hyper-V or WSL2
# Check virtualization is enabled in BIOS

# Try different driver
minikube start --driver=docker --cpus=2 --memory=4096

# If still failing, delete and recreate
minikube delete
minikube start --cpus=2 --memory=4096
```

### Insufficient Resources

**Symptom**: `Insufficient memory` or `Insufficient CPU`

**Solution**:
```bash
# Check current allocation
minikube config view

# Increase resources
minikube delete
minikube start --cpus=4 --memory=8192

# Or reduce application resource requests in values.yaml
```

### Images Not Available in Minikube

**Symptom**: `ImagePullBackOff` or `ErrImagePull`

**Solution**:
```bash
# Load images into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# Verify images are loaded
minikube image ls | grep todo

# Check pod events
kubectl describe pod -n todo-app <pod-name>
```

---

## Pod Startup Issues

### Pods Stuck in Pending

**Symptom**: Pods remain in `Pending` state

**Solution**:
```bash
# Check pod events
kubectl describe pod -n todo-app <pod-name>

# Common causes:
# 1. Insufficient resources
kubectl top nodes

# 2. PVC not bound
kubectl get pvc -n todo-app

# 3. Image not available
minikube image ls | grep todo
```

### Pods in CrashLoopBackOff

**Symptom**: Pods repeatedly crash and restart

**Solution**:
```bash
# Check pod logs
kubectl logs -n todo-app <pod-name>

# Common causes:
# 1. Database connection failure
# Check DATABASE_URL in secrets

# 2. Missing environment variables
kubectl describe pod -n todo-app <pod-name>

# 3. Application error
# Review logs for stack traces
kubectl logs -n todo-app <pod-name> --previous
```

### Startup Probe Failing

**Symptom**: Pod never becomes ready

**Solution**:
```bash
# Check startup probe configuration
kubectl describe pod -n todo-app <pod-name>

# Increase startup probe timeout in values.yaml:
backend:
  healthCheck:
    startup:
      failureThreshold: 12  # Increase from 6
      periodSeconds: 10

# Apply changes
helm upgrade todo-chatbot ./helm/todo-chatbot -f values-dev.yaml
```

### Liveness Probe Failing

**Symptom**: Pods restart frequently

**Solution**:
```bash
# Check health endpoint
kubectl port-forward -n todo-app <pod-name> 8000:8000
curl http://localhost:8000/api/health

# Increase liveness probe timeout
backend:
  healthCheck:
    liveness:
      failureThreshold: 5  # Increase from 3
      timeoutSeconds: 10   # Increase from 5
```

---

## Networking Issues

### Frontend Cannot Reach Backend

**Symptom**: Frontend shows API connection errors

**Solution**:
```bash
# 1. Verify backend service exists
kubectl get service -n todo-app backend-service

# 2. Test DNS resolution from frontend pod
kubectl exec -n todo-app <frontend-pod> -- nslookup backend-service

# 3. Check NEXT_PUBLIC_API_URL
kubectl get deployment frontend -n todo-app -o yaml | grep NEXT_PUBLIC_API_URL

# 4. Verify backend is responding
kubectl port-forward -n todo-app service/backend-service 8000:8000
curl http://localhost:8000/api/health
```

### Cannot Access Frontend from Browser

**Symptom**: Browser cannot reach http://<minikube-ip>:30000

**Solution**:
```bash
# 1. Get correct Minikube IP
minikube ip

# 2. Verify NodePort service
kubectl get service -n todo-app frontend-service

# 3. Check if port 30000 is in use
netstat -an | grep 30000

# 4. Use minikube service command
minikube service frontend-service -n todo-app

# 5. Alternative: Port forward
kubectl port-forward -n todo-app service/frontend-service 3000:3000
# Access at http://localhost:3000
```

### CORS Errors

**Symptom**: Browser console shows CORS errors

**Solution**:
```bash
# Update CORS_ORIGINS in configmap
kubectl edit configmap -n todo-app todo-app-config

# Or update values.yaml and upgrade
backend:
  env:
    CORS_ORIGINS: "http://<minikube-ip>:30000"

helm upgrade todo-chatbot ./helm/todo-chatbot -f values-dev.yaml
```

---

## Database Connection Issues

### Cannot Connect to Neon Database

**Symptom**: Backend logs show database connection errors

**Solution**:
```bash
# 1. Verify DATABASE_URL is correct
kubectl get secret -n todo-app todo-app-secrets -o jsonpath='{.data.DATABASE_URL}' | base64 -d

# 2. Test connection from pod
kubectl exec -n todo-app <backend-pod> -- python -c "
from sqlalchemy import create_engine
import os
engine = create_engine(os.environ['DATABASE_URL'])
conn = engine.connect()
print('Connection successful')
"

# 3. Check Neon database is accessible
# Verify database is not paused (Neon auto-pauses after inactivity)

# 4. Check SSL mode
# Neon requires sslmode=require in connection string
```

### Database Connection Pool Exhausted

**Symptom**: `QueuePool limit exceeded`

**Solution**:
```bash
# Increase pool size in configmap
kubectl edit configmap -n todo-app todo-app-config

# Or update values.yaml
backend:
  env:
    DATABASE_POOL_SIZE: "10"      # Increase from 5
    DATABASE_MAX_OVERFLOW: "20"   # Increase from 10

helm upgrade todo-chatbot ./helm/todo-chatbot -f values-dev.yaml
```

---

## Helm Issues

### Helm Install Fails - Validation Error

**Symptom**: `Error: YAML parse error` or `validation failed`

**Solution**:
```bash
# Lint the chart
helm lint ./helm/todo-chatbot -f values-dev.yaml

# Dry-run to see generated manifests
helm install todo-chatbot ./helm/todo-chatbot -f values-dev.yaml --dry-run --debug

# Check for syntax errors in templates
```

### Helm Upgrade Fails - Immutable Field

**Symptom**: `field is immutable`

**Solution**:
```bash
# Some fields cannot be changed after creation
# Delete and recreate the resource

# Option 1: Uninstall and reinstall
helm uninstall todo-chatbot
helm install todo-chatbot ./helm/todo-chatbot -f values-dev.yaml

# Option 2: Delete specific resource
kubectl delete deployment backend -n todo-app
helm upgrade todo-chatbot ./helm/todo-chatbot -f values-dev.yaml
```

### Secrets Not Applied

**Symptom**: Pods show missing environment variables

**Solution**:
```bash
# 1. Verify secrets exist
kubectl get secret -n todo-app todo-app-secrets

# 2. Check secret data
kubectl describe secret -n todo-app todo-app-secrets

# 3. Verify values are base64 encoded
echo -n "your-value" | base64

# 4. Update secrets and restart pods
helm upgrade todo-chatbot ./helm/todo-chatbot -f values-dev.yaml
kubectl rollout restart deployment -n todo-app backend
kubectl rollout restart deployment -n todo-app frontend
```

---

## Performance Issues

### Slow Pod Startup

**Symptom**: Pods take > 5 minutes to become ready

**Solution**:
```bash
# 1. Check if database is cold starting (Neon)
# Neon databases pause after inactivity

# 2. Increase startup probe timeout
backend:
  healthCheck:
    startup:
      failureThreshold: 12
      periodSeconds: 10

# 3. Pre-warm database connection
# Add database ping to startup script
```

### High Memory Usage

**Symptom**: Pods being OOMKilled

**Solution**:
```bash
# 1. Check current usage
kubectl top pods -n todo-app

# 2. Increase memory limits
backend:
  resources:
    limits:
      memory: "1Gi"  # Increase from 512Mi

# 3. Investigate memory leaks
kubectl logs -n todo-app <pod-name> | grep -i memory
```

### High CPU Usage

**Symptom**: Pods throttled, slow response times

**Solution**:
```bash
# 1. Check current usage
kubectl top pods -n todo-app

# 2. Increase CPU limits
backend:
  resources:
    limits:
      cpu: "1000m"  # Increase from 500m

# 3. Scale horizontally
kubectl scale deployment backend -n todo-app --replicas=2
```

---

## Getting Help

If issues persist:

1. **Collect diagnostic information**:
```bash
# Pod status
kubectl get pods -n todo-app -o wide

# Pod events
kubectl get events -n todo-app --sort-by='.lastTimestamp'

# Pod logs
kubectl logs -n todo-app <pod-name> --previous

# Describe resources
kubectl describe pod -n todo-app <pod-name>
kubectl describe deployment -n todo-app backend
```

2. **Check documentation**:
   - Kubernetes: https://kubernetes.io/docs/
   - Helm: https://helm.sh/docs/
   - Minikube: https://minikube.sigs.k8s.io/docs/

3. **Community support**:
   - GitHub Issues: https://github.com/yourusername/todo-chatbot/issues
   - Stack Overflow: Tag with `kubernetes`, `helm`, `minikube`

---

## Quick Reference

### Essential Commands

```bash
# Check everything
kubectl get all -n todo-app

# Restart deployment
kubectl rollout restart deployment -n todo-app backend

# View logs
kubectl logs -n todo-app -l app=backend -f

# Port forward
kubectl port-forward -n todo-app service/backend-service 8000:8000

# Delete and recreate
helm uninstall todo-chatbot
helm install todo-chatbot ./helm/todo-chatbot -f values-dev.yaml

# Clean slate
minikube delete
minikube start --cpus=2 --memory=4096
```
