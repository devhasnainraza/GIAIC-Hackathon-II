# Cloud Deployment Checklist

**Feature**: Cloud Deployment & Production Upgrade
**Purpose**: Pre-deployment validation to ensure all prerequisites are met
**Date**: 2026-02-09

---

## Phase 1: Prerequisites

### Local Environment Setup

- [ ] **Docker installed and running**
  - Version: 24.0 or higher
  - Test: `docker --version`
  - Test: `docker ps` (should not error)

- [ ] **kubectl installed**
  - Version: 1.24 or higher
  - Test: `kubectl version --client`

- [ ] **Helm installed**
  - Version: 3.0 or higher
  - Test: `helm version`

- [ ] **Git repository access**
  - Repository cloned locally
  - On main branch with latest changes
  - Test: `git status`

---

## Phase 2: Cloud Provider Setup

### Oracle Cloud Infrastructure (OCI)

- [ ] **OCI account created**
  - Free tier account activated
  - Email verified

- [ ] **OKE cluster provisioned**
  - Cluster name: `todo-chatbot-cluster`
  - Node count: 2
  - Node shape: VM.Standard.E2.1.Micro (free tier)
  - Kubernetes version: 1.28+
  - Status: ACTIVE

- [ ] **kubectl configured for OKE**
  - kubeconfig downloaded from OCI console
  - Test: `kubectl cluster-info`
  - Test: `kubectl get nodes` (should show 2 nodes in Ready state)

- [ ] **Namespace created**
  - Command: `kubectl create namespace todo-app`
  - Test: `kubectl get namespace todo-app`

---

## Phase 3: Container Registry Setup

### Docker Hub

- [ ] **Docker Hub account created**
  - Username: _______________
  - Email verified

- [ ] **Repositories created**
  - Backend: `<username>/todo-backend` (public)
  - Frontend: `<username>/todo-frontend` (public)
  - Test: Visit https://hub.docker.com/u/<username>

- [ ] **Access token generated**
  - Token name: `github-actions-deploy`
  - Permissions: Read, Write, Delete
  - Token saved securely (will be used in GitHub Secrets)

- [ ] **Local Docker login**
  - Command: `docker login`
  - Test: `docker info | grep Username`

---

## Phase 4: Secrets Configuration

### Kubernetes Secrets

- [ ] **Database URL available**
  - Neon PostgreSQL connection string
  - Format: `postgresql://user:pass@host/db?sslmode=require`
  - Test connection: `psql "<DATABASE_URL>"`

- [ ] **JWT secret generated**
  - Random 32+ character string
  - Command: `openssl rand -base64 32`

- [ ] **API keys collected**
  - OpenAI API key (if using)
  - Gemini API key (if using)
  - Cloudinary credentials (if using)
  - Gmail app password (if using email)
  - Resend API key (if using email)

- [ ] **Kubernetes Secret created**
  - Command executed:
    ```bash
    kubectl create secret generic todo-app-secrets /
      --from-literal=DATABASE_URL='<value>' /
      --from-literal=JWT_SECRET='<value>' /
      --from-literal=GEMINI_API_KEY='<value>' /
      --from-literal=OPENAI_API_KEY='<value>' /
      --from-literal=CLOUDINARY_CLOUD_NAME='<value>' /
      --from-literal=CLOUDINARY_API_KEY='<value>' /
      --from-literal=CLOUDINARY_API_SECRET='<value>' /
      --from-literal=GMAIL_EMAIL='<value>' /
      --from-literal=GMAIL_APP_PASSWORD='<value>' /
      --from-literal=RESEND_API_KEY='<value>' /
      -n todo-app
    ```
  - Test: `kubectl get secret todo-app-secrets -n todo-app`
  - Test: `kubectl describe secret todo-app-secrets -n todo-app` (should show all keys)

---

## Phase 5: Docker Images

### Build and Push Images

- [ ] **Backend image built**
  - Command: `docker build -t <username>/todo-backend:latest -f docker/backend/Dockerfile ./backend`
  - Test: `docker images | grep todo-backend`

- [ ] **Backend image pushed**
  - Command: `docker push <username>/todo-backend:latest`
  - Test: Visit Docker Hub repository

- [ ] **Frontend image built**
  - Command: `docker build -t <username>/todo-frontend:latest -f docker/frontend/Dockerfile ./frontend`
  - Test: `docker images | grep todo-frontend`

- [ ] **Frontend image pushed**
  - Command: `docker push <username>/todo-frontend:latest`
  - Test: Visit Docker Hub repository

---

## Phase 6: Helm Configuration

### Helm Values Update

- [ ] **Cloud values file created**
  - File: `specs/008-cloud-deployment/contracts/helm-values-cloud.yaml`
  - Docker Hub username updated in image repositories
  - All placeholders replaced

- [ ] **Helm chart validated**
  - Command: `helm lint ./helm/todo-chatbot`
  - No errors or warnings

- [ ] **Dry-run deployment**
  - Command: `helm install todo-chatbot ./helm/todo-chatbot -f specs/008-cloud-deployment/contracts/helm-values-cloud.yaml --dry-run --debug -n todo-app`
  - No errors in output

---

## Phase 7: Initial Deployment

### Deploy Application

- [ ] **Helm install executed**
  - Command: `helm install todo-chatbot ./helm/todo-chatbot -f specs/008-cloud-deployment/contracts/helm-values-cloud.yaml -n todo-app --create-namespace`
  - Output: `STATUS: deployed`

- [ ] **Pods running**
  - Command: `kubectl get pods -n todo-app`
  - Backend pods: 2/2 Running
  - Frontend pods: 1/1 Running
  - No CrashLoopBackOff or Error states

- [ ] **Services created**
  - Command: `kubectl get svc -n todo-app`
  - backend-service: ClusterIP
  - frontend-service: LoadBalancer with EXTERNAL-IP assigned

- [ ] **LoadBalancer IP assigned**
  - Wait 2-5 minutes for IP assignment
  - Command: `kubectl get svc frontend-service -n todo-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'`
  - IP address: _______________

---

## Phase 8: Verification

### Health Checks

- [ ] **Backend health endpoint**
  - Get backend pod: `kubectl get pod -n todo-app -l app=backend -o jsonpath='{.items[0].metadata.name}'`
  - Test: `kubectl exec -n todo-app <pod-name> -- curl http://localhost:8000/api/health`
  - Response: `{"status":"healthy"}`

- [ ] **Frontend accessible**
  - URL: `http://<EXTERNAL-IP>`
  - Test: Open in browser
  - Expected: Frontend loads successfully

- [ ] **API connectivity**
  - Test: Login via frontend
  - Test: Create a task
  - Test: View tasks
  - Expected: All operations work

- [ ] **Database connectivity**
  - Backend logs show successful database connection
  - Command: `kubectl logs -n todo-app -l app=backend --tail=50 | grep -i database`
  - No connection errors

---

## Phase 9: CI/CD Setup

### GitHub Actions Configuration

- [ ] **Workflow file created**
  - File: `.github/workflows/deploy-cloud.yml`
  - Content copied from `specs/008-cloud-deployment/contracts/github-actions-ci.yaml`

- [ ] **GitHub Secrets configured**
  - DOCKERHUB_USERNAME: _______________
  - DOCKERHUB_TOKEN: _______________
  - KUBECONFIG_CONTENT: (base64-encoded kubeconfig)
  - Test: Visit repository Settings → Secrets and variables → Actions

- [ ] **Kubeconfig encoded**
  - Command: `cat ~/.kube/config | base64 -w 0`
  - Output copied to KUBECONFIG_CONTENT secret

- [ ] **Workflow triggered**
  - Push to main branch or manual trigger
  - Test: Visit repository Actions tab
  - Expected: Workflow runs successfully

---

## Phase 10: Post-Deployment

### Update Configuration

- [ ] **CORS origins updated**
  - Update `helm-values-cloud.yaml` with actual EXTERNAL-IP
  - Change `CORS_ORIGINS: "http://<EXTERNAL_IP>"`
  - Upgrade: `helm upgrade todo-chatbot ./helm/todo-chatbot -f specs/008-cloud-deployment/contracts/helm-values-cloud.yaml -n todo-app`

- [ ] **Frontend URL updated**
  - Update `FRONTEND_URL: "http://<EXTERNAL_IP>"`
  - Upgrade Helm release

- [ ] **Documentation updated**
  - README.md includes cloud deployment URL
  - Deployment guide includes actual IP address

---

## Phase 11: Scaling Test

### Horizontal Scaling

- [ ] **Scale backend to 3 replicas**
  - Command: `kubectl scale deployment backend -n todo-app --replicas=3`
  - Test: `kubectl get pods -n todo-app -l app=backend`
  - Expected: 3 pods running

- [ ] **Verify load distribution**
  - Make multiple API requests
  - Check logs from different pods
  - Expected: Requests distributed across replicas

- [ ] **Scale back to 2 replicas**
  - Command: `kubectl scale deployment backend -n todo-app --replicas=2`
  - Test: Graceful pod termination

---

## Phase 12: Monitoring

### Observability

- [ ] **Pod logs accessible**
  - Backend: `kubectl logs -f -n todo-app -l app=backend`
  - Frontend: `kubectl logs -f -n todo-app -l app=frontend`

- [ ] **Resource usage monitored**
  - Command: `kubectl top pods -n todo-app`
  - Expected: Within resource limits

- [ ] **Events monitored**
  - Command: `kubectl get events -n todo-app --sort-by='.lastTimestamp'`
  - No error events

---

## Completion Criteria

✅ **All checklist items completed**
✅ **Application accessible via public URL**
✅ **All features working (login, tasks, chat)**
✅ **CI/CD pipeline functional**
✅ **Scaling tested successfully**
✅ **Monitoring and logs accessible**

---

## Rollback Plan

If deployment fails:

1. **Check pod status**: `kubectl get pods -n todo-app`
2. **Check pod logs**: `kubectl logs <pod-name> -n todo-app`
3. **Check events**: `kubectl get events -n todo-app`
4. **Rollback Helm**: `helm rollback todo-chatbot -n todo-app`
5. **Delete and retry**: `helm uninstall todo-chatbot -n todo-app` then reinstall

---

## Support Resources

- **OCI Documentation**: https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm
- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **Helm Documentation**: https://helm.sh/docs/
- **Docker Hub**: https://hub.docker.com/
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Deployment Date**: _______________
**Deployed By**: _______________
**External IP**: _______________
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Completed | ⬜ Failed
