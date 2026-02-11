# Cloud Deployment Quickstart Guide

**Feature**: Cloud Deployment & Production Upgrade
**Audience**: Developers deploying Todo AI Chatbot to cloud Kubernetes
**Time**: 30-45 minutes (first-time setup)

---

## Overview

This guide walks you through deploying the Todo AI Chatbot from local Kubernetes (Minikube) to a production cloud environment. By the end, your application will be publicly accessible with automated CI/CD.

**What You'll Deploy**:
- Backend (FastAPI) - 2 replicas
- Frontend (Next.js) - 1 replica
- External database (Neon PostgreSQL)
- Public access via LoadBalancer
- CI/CD via GitHub Actions

**Prerequisites**:
- Docker, kubectl, helm installed locally
- Git repository with application code
- Cloud provider account (Oracle Cloud recommended for free tier)
- Docker Hub account
- GitHub repository

---

## Step 1: Cloud Cluster Setup (15 minutes)

### 1.1 Create Oracle Cloud Account

1. Visit https://www.oracle.com/cloud/free/
2. Click "Start for free"
3. Complete registration (requires credit card for verification, but won't be charged)
4. Verify email address

### 1.2 Provision OKE Cluster

1. Login to OCI Console: https://cloud.oracle.com/
2. Navigate to: **Developer Services** → **Kubernetes Clusters (OKE)**
3. Click **Create Cluster**
4. Select **Quick Create** (easier setup)
5. Configure cluster:
   - **Name**: `todo-chatbot-cluster`
   - **Kubernetes Version**: 1.28 or higher
   - **Node Pool**:
     - Shape: `VM.Standard.E2.1.Micro` (free tier)
     - Node count: 2
     - Memory: 1 GB per node
   - **Visibility**: Public
6. Click **Create Cluster**
7. Wait 5-10 minutes for cluster creation (status: ACTIVE)

### 1.3 Configure kubectl Access

1. In OCI Console, open your cluster
2. Click **Access Cluster**
3. Follow instructions to download kubeconfig:
   ```bash
   oci ce cluster create-kubeconfig --cluster-id <cluster-ocid> --file $HOME/.kube/config --region <region> --token-version 2.0.0
   ```
4. Verify connectivity:
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```
   Expected: 2 nodes in "Ready" state

### 1.4 Create Namespace

```bash
kubectl create namespace todo-app
kubectl get namespace todo-app
```

---

## Step 2: Container Registry Setup (5 minutes)

### 2.1 Create Docker Hub Account

1. Visit https://hub.docker.com/signup
2. Create account (free tier)
3. Verify email

### 2.2 Create Repositories

1. Login to Docker Hub
2. Click **Create Repository**
3. Create two public repositories:
   - Name: `todo-backend`, Visibility: Public
   - Name: `todo-frontend`, Visibility: Public

### 2.3 Generate Access Token

1. Go to **Account Settings** → **Security**
2. Click **New Access Token**
3. Name: `github-actions-deploy`
4. Permissions: Read, Write, Delete
5. Click **Generate**
6. **Copy token immediately** (won't be shown again)

### 2.4 Login Locally

```bash
docker login
# Enter username and token (as password)
```

---

## Step 3: Secrets Configuration (5 minutes)

### 3.1 Gather Secret Values

Collect the following values:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: Generate with `openssl rand -base64 32`
- `GEMINI_API_KEY`: From Google AI Studio
- `OPENAI_API_KEY`: From OpenAI dashboard (optional)
- `CLOUDINARY_*`: From Cloudinary dashboard (optional)
- `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD`: For email (optional)
- `RESEND_API_KEY`: From Resend dashboard (optional)

### 3.2 Create Kubernetes Secret

```bash
kubectl create secret generic todo-app-secrets /
  --from-literal=DATABASE_URL='postgresql://user:pass@host/db?sslmode=require' /
  --from-literal=JWT_SECRET='your-generated-secret' /
  --from-literal=JWT_ALGORITHM='HS256' /
  --from-literal=JWT_EXPIRATION_HOURS='168' /
  --from-literal=GEMINI_API_KEY='your-gemini-key' /
  --from-literal=OPENAI_API_KEY='your-openai-key' /
  --from-literal=CLOUDINARY_CLOUD_NAME='your-cloud-name' /
  --from-literal=CLOUDINARY_API_KEY='your-api-key' /
  --from-literal=CLOUDINARY_API_SECRET='your-api-secret' /
  --from-literal=GMAIL_EMAIL='your-email@gmail.com' /
  --from-literal=GMAIL_APP_PASSWORD='your-app-password' /
  --from-literal=RESEND_API_KEY='your-resend-key' /
  -n todo-app
```

### 3.3 Verify Secret

```bash
kubectl get secret todo-app-secrets -n todo-app
kubectl describe secret todo-app-secrets -n todo-app
```

---

## Step 4: Build and Push Images (10 minutes)

### 4.1 Build Backend Image

```bash
cd /path/to/project
docker build -t <your-dockerhub-username>/todo-backend:latest -f docker/backend/Dockerfile ./backend
```

### 4.2 Push Backend Image

```bash
docker push <your-dockerhub-username>/todo-backend:latest
```

### 4.3 Build Frontend Image

```bash
docker build -t <your-dockerhub-username>/todo-frontend:latest -f docker/frontend/Dockerfile ./frontend
```

### 4.4 Push Frontend Image

```bash
docker push <your-dockerhub-username>/todo-frontend:latest
```

### 4.5 Verify Images

Visit Docker Hub and confirm both images are uploaded.

---

## Step 5: Configure Helm Values (5 minutes)

### 5.1 Update Cloud Values File

Edit `specs/008-cloud-deployment/contracts/helm-values-cloud.yaml`:

1. Replace `<DOCKERHUB_USERNAME>` with your Docker Hub username:
   ```yaml
   backend:
     image:
       repository: your-username/todo-backend

   frontend:
     image:
       repository: your-username/todo-frontend
   ```

2. Save the file

### 5.2 Validate Helm Chart

```bash
helm lint ./helm/todo-chatbot
```

Expected: No errors or warnings

---

## Step 6: Deploy Application (5 minutes)

### 6.1 Install Helm Release

```bash
helm install todo-chatbot ./helm/todo-chatbot /
  -f specs/008-cloud-deployment/contracts/helm-values-cloud.yaml /
  -n todo-app /
  --create-namespace
```

### 6.2 Monitor Deployment

```bash
# Watch pods starting
kubectl get pods -n todo-app -w

# Wait for all pods to be Running
kubectl wait --for=condition=ready pod --all -n todo-app --timeout=5m
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxx-yyy             1/1     Running   0          2m
backend-xxx-zzz             1/1     Running   0          2m
frontend-xxx-aaa            1/1     Running   0          2m
```

### 6.3 Get LoadBalancer IP

```bash
kubectl get svc frontend-service -n todo-app
```

Wait 2-5 minutes for `EXTERNAL-IP` to be assigned (will show `<pending>` initially).

Once assigned, copy the IP address:
```bash
EXTERNAL_IP=$(kubectl get svc frontend-service -n todo-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Frontend URL: http://$EXTERNAL_IP"
```

---

## Step 7: Verify Deployment (5 minutes)

### 7.1 Test Backend Health

```bash
BACKEND_POD=$(kubectl get pod -n todo-app -l app=backend -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n todo-app $BACKEND_POD -- curl http://localhost:8000/api/health
```

Expected: `{"status":"healthy",...}`

### 7.2 Test Frontend Access

Open browser and navigate to: `http://<EXTERNAL-IP>`

Expected: Frontend loads successfully

### 7.3 Test Full Workflow

1. Click **Sign Up** and create an account
2. Login with credentials
3. Create a task via chat: "Add task: Deploy to cloud"
4. Verify task appears in task list
5. Test other features (edit, delete, chat)

### 7.4 Check Logs

```bash
# Backend logs
kubectl logs -f -n todo-app -l app=backend

# Frontend logs
kubectl logs -f -n todo-app -l app=frontend
```

---

## Step 8: Update CORS Configuration (5 minutes)

### 8.1 Update Helm Values

Edit `specs/008-cloud-deployment/contracts/helm-values-cloud.yaml`:

Replace `<EXTERNAL_IP>` with actual IP:
```yaml
backend:
  env:
    CORS_ORIGINS: "http://123.45.67.89"  # Your actual IP
    FRONTEND_URL: "http://123.45.67.89"
```

### 8.2 Upgrade Deployment

```bash
helm upgrade todo-chatbot ./helm/todo-chatbot /
  -f specs/008-cloud-deployment/contracts/helm-values-cloud.yaml /
  -n todo-app
```

### 8.3 Verify Update

```bash
kubectl rollout status deployment/backend -n todo-app
```

---

## Step 9: Setup CI/CD (10 minutes)

### 9.1 Create Workflow File

Copy the CI/CD workflow:
```bash
mkdir -p .github/workflows
cp specs/008-cloud-deployment/contracts/github-actions-ci.yaml .github/workflows/deploy-cloud.yml
```

### 9.2 Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   **DOCKERHUB_USERNAME**:
   - Value: Your Docker Hub username

   **DOCKERHUB_TOKEN**:
   - Value: Access token from Step 2.3

   **KUBECONFIG_CONTENT**:
   - Generate: `cat ~/.kube/config | base64 -w 0`
   - Value: Paste the base64-encoded output

### 9.3 Commit and Push

```bash
git add .github/workflows/deploy-cloud.yml
git commit -m "Add cloud deployment CI/CD workflow"
git push origin main
```

### 9.4 Verify Workflow

1. Go to repository **Actions** tab
2. Workflow should trigger automatically
3. Monitor progress (takes 5-10 minutes)
4. Expected: All jobs pass ✅

---

## Step 10: Test Scaling (5 minutes)

### 10.1 Scale Backend

```bash
kubectl scale deployment backend -n todo-app --replicas=3
kubectl get pods -n todo-app -l app=backend
```

Expected: 3 backend pods running

### 10.2 Verify Load Distribution

Make multiple API requests and check logs from different pods:
```bash
kubectl logs -n todo-app -l app=backend --tail=10
```

### 10.3 Scale Back

```bash
kubectl scale deployment backend -n todo-app --replicas=2
```

---

## Troubleshooting

### Pods Not Starting

**Symptom**: Pods stuck in `Pending` or `CrashLoopBackOff`

**Solutions**:
```bash
# Check pod events
kubectl describe pod <pod-name> -n todo-app

# Check logs
kubectl logs <pod-name> -n todo-app

# Common issues:
# - Image pull errors: Verify Docker Hub repository is public
# - Database connection: Verify DATABASE_URL in secret
# - Resource limits: Check node resources with `kubectl top nodes`
```

### LoadBalancer IP Not Assigned

**Symptom**: `EXTERNAL-IP` shows `<pending>` for >5 minutes

**Solutions**:
```bash
# Check service events
kubectl describe svc frontend-service -n todo-app

# Verify OCI load balancer quota
# OCI Console → Governance → Limits, Quotas and Usage

# Alternative: Use NodePort temporarily
kubectl patch svc frontend-service -n todo-app -p '{"spec":{"type":"NodePort"}}'
```

### Database Connection Errors

**Symptom**: Backend logs show "connection refused" or "timeout"

**Solutions**:
```bash
# Test database connectivity from pod
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- /
  psql "$DATABASE_URL"

# Verify secret is correct
kubectl get secret todo-app-secrets -n todo-app -o jsonpath='{.data.DATABASE_URL}' | base64 -d

# Check Neon database status at console.neon.tech
```

### CI/CD Pipeline Fails

**Symptom**: GitHub Actions workflow fails

**Solutions**:
- Verify all GitHub Secrets are set correctly
- Check KUBECONFIG_CONTENT is base64-encoded
- Ensure Docker Hub token has write permissions
- Review workflow logs for specific error messages

---

## Monitoring and Maintenance

### Daily Checks

```bash
# Check pod health
kubectl get pods -n todo-app

# Check resource usage
kubectl top pods -n todo-app

# Check recent events
kubectl get events -n todo-app --sort-by='.lastTimestamp' | tail -20
```

### Weekly Tasks

- Review application logs for errors
- Check database storage usage (Neon console)
- Verify CI/CD pipeline success rate
- Test application functionality end-to-end

### Updating Application

When you push code changes to main branch:
1. GitHub Actions automatically builds new images
2. Images pushed to Docker Hub
3. Helm deployment updated
4. Pods rolled out with zero downtime

Manual update:
```bash
# Rebuild and push images (Steps 4.1-4.4)
# Then upgrade Helm release
helm upgrade todo-chatbot ./helm/todo-chatbot /
  -f specs/008-cloud-deployment/contracts/helm-values-cloud.yaml /
  -n todo-app
```

---

## Cleanup (Optional)

To remove the deployment:

```bash
# Delete Helm release
helm uninstall todo-chatbot -n todo-app

# Delete namespace
kubectl delete namespace todo-app

# Delete OKE cluster (via OCI Console)
# Navigate to cluster → More Actions → Delete Cluster
```

---

## Success Criteria

✅ Application accessible via public URL
✅ All features working (signup, login, tasks, chat)
✅ Backend scaled to 2 replicas
✅ CI/CD pipeline functional
✅ Logs accessible via kubectl
✅ Health checks passing

---

## Next Steps

- **Custom Domain**: Configure DNS to point to LoadBalancer IP
- **HTTPS/TLS**: Add Ingress with cert-manager for SSL
- **Monitoring**: Set up Prometheus and Grafana
- **Alerting**: Configure alerts for pod failures
- **Backup**: Implement database backup strategy
- **Cost Optimization**: Monitor free tier usage

---

## Support

- **Documentation**: See `specs/008-cloud-deployment/` for detailed docs
- **Checklist**: Use `contracts/deployment-checklist.md` for validation
- **Issues**: Report problems in GitHub repository issues

**Deployment Complete! 🎉**

Your Todo AI Chatbot is now running in the cloud with automated CI/CD.
