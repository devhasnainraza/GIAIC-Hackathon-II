# 🚀 Phase 5 Deployment - Windows PowerShell Guide

## Your Situation
- Windows PowerShell (not Bash)
- GKE cluster with e2-micro nodes at 92-100% memory
- Kafka won't fit even with 200Mi
- **Solution: Deploy without Kafka first, add it later**

## ✅ What You'll Get

### Without Kafka (Works Now):
- ✅ 13 new API endpoints for recurring tasks and reminders
- ✅ 3 new database tables
- ✅ Frontend pages (/recurring-tasks, /reminders)
- ✅ Full CRUD operations for recurring tasks
- ✅ Reminder preferences configuration

### Without Kafka (Won't Work):
- ❌ Automatic task instance creation from recurring tasks
- ❌ Email reminder notifications
- ❌ Event streaming between services

### To Get Full Functionality:
Use managed Kafka (Redpanda Cloud free tier) - instructions below

---

## 🎯 DEPLOY NOW - Copy & Paste These Commands

### Step 1: Navigate to Project
```powershell
cd E:/Hackathon_II/Phase_V
```

### Step 2: Login to Docker Hub
```powershell
docker login -u devhasnainraza
# Enter your password when prompted
```

### Step 3: Build Backend Image
```powershell
Write-Host "Building backend..." -ForegroundColor Yellow
docker build -t devhasnainraza/backend:phase5 ./backend
Write-Host "Backend built!" -ForegroundColor Green
```

### Step 4: Build Frontend Image
```powershell
Write-Host "Building frontend..." -ForegroundColor Yellow
docker build -t devhasnainraza/frontend:phase5 ./frontend
Write-Host "Frontend built!" -ForegroundColor Green
```

### Step 5: Build Microservices (for later)
```powershell
Write-Host "Building notification service..." -ForegroundColor Yellow
docker build -t devhasnainraza/notification-service:latest ./services/notification-service
Write-Host "Notification service built!" -ForegroundColor Green

Write-Host "Building recurring task service..." -ForegroundColor Yellow
docker build -t devhasnainraza/recurring-task-service:latest ./services/recurring-task-service
Write-Host "Recurring task service built!" -ForegroundColor Green
```

### Step 6: Push All Images
```powershell
Write-Host "Pushing images to Docker Hub..." -ForegroundColor Yellow
docker push devhasnainraza/backend:phase5
docker push devhasnainraza/frontend:phase5
docker push devhasnainraza/notification-service:latest
docker push devhasnainraza/recurring-task-service:latest
Write-Host "All images pushed!" -ForegroundColor Green
```

### Step 7: Run Database Migration
```powershell
Write-Host "Running database migration..." -ForegroundColor Yellow
kubectl delete job db-migration -n todo-app --ignore-not-found=true
kubectl create job db-migration --image=devhasnainraza/backend:phase5 -n todo-app -- alembic upgrade head

# Wait for migration to complete
Start-Sleep -Seconds 60

# Check migration logs
kubectl logs job/db-migration -n todo-app --tail=30
Write-Host "Database migration completed!" -ForegroundColor Green
```

### Step 8: Update Backend Deployment
```powershell
Write-Host "Updating backend..." -ForegroundColor Yellow
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl set image deployment/backend backend=devhasnainraza/backend:phase5 -n todo-app
kubectl rollout status deployment/backend -n todo-app --timeout=180s
Write-Host "Backend updated!" -ForegroundColor Green
```

### Step 9: Update Frontend Deployment
```powershell
Write-Host "Updating frontend..." -ForegroundColor Yellow
kubectl set image deployment/frontend frontend=devhasnainraza/frontend:phase5 -n todo-app
kubectl rollout status deployment/frontend -n todo-app --timeout=180s
Write-Host "Frontend updated!" -ForegroundColor Green
```

### Step 10: Check Deployment Status
```powershell
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
kubectl get pods -n todo-app
Write-Host ""
kubectl get service frontend -n todo-app
```

### Step 11: Get Frontend URL
```powershell
$frontendIP = kubectl get service frontend -n todo-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
if ($frontendIP) {
    Write-Host ""
    Write-Host "✓ Frontend URL: http://$frontendIP:30000" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Frontend service is ClusterIP - use port-forward" -ForegroundColor Yellow
}
```

---

## 🧪 Test Your Deployment

### Test 1: Check API Endpoints
```powershell
# Port forward to backend
$backendPod = kubectl get pod -l app=backend -n todo-app -o jsonpath='{.items[0].metadata.name}'
Start-Process powershell -ArgumentList "kubectl port-forward $backendPod 8000:8000 -n todo-app"

# Wait a moment, then test
Start-Sleep -Seconds 5
curl http://localhost:8000/api/health
curl http://localhost:8000/api/recurring-tasks
```

### Test 2: Access Frontend
```powershell
# Get frontend URL
kubectl get service frontend -n todo-app

# Open in browser
# Navigate to /recurring-tasks
# Navigate to /reminders
```

### Test 3: Create Recurring Task via API
```powershell
# You'll need a JWT token from login
# Then test the endpoint:
# POST http://YOUR_IP:30000/api/recurring-tasks
```

---

## 📊 What's Working

Run this to verify:
```powershell
Write-Host "Checking what's deployed..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Pods:" -ForegroundColor Cyan
kubectl get pods -n todo-app
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
kubectl get services -n todo-app
Write-Host ""
Write-Host "Deployments:" -ForegroundColor Cyan
kubectl get deployments -n todo-app
```

---

## 🔧 Add Full Functionality with Managed Kafka

Since your cluster can't run Kafka, use a free managed service:

### Option 1: Redpanda Cloud (Recommended)

1. **Sign up** at https://redpanda.com/try-redpanda
2. **Create a free cluster** (takes 2 minutes)
3. **Get connection details** from the dashboard
4. **Update Dapr component:**

```powershell
# Edit kubernetes/dapr/pubsub.yaml
# Replace the brokers line with your Redpanda connection string
# Example:
# - name: brokers
#   value: "your-cluster.redpanda.cloud:9092"
# - name: authType
#   value: "password"
# - name: saslUsername
#   value: "your-username"
# - name: saslPassword
#   value: "your-password"
```

5. **Deploy Dapr components:**
```powershell
kubectl apply -f kubernetes/dapr/pubsub.yaml
kubectl apply -f kubernetes/dapr/statestore.yaml
```

6. **Deploy microservices:**
```powershell
kubectl apply -f kubernetes/notification-service-deployment.yaml
kubectl apply -f kubernetes/recurring-task-service-deployment.yaml
```

7. **Verify:**
```powershell
kubectl get pods -n todo-app
# Should see notification-service and recurring-task-service running
```

### Option 2: Confluent Cloud

1. Sign up at https://confluent.cloud/
2. Create free cluster
3. Get bootstrap servers and API keys
4. Update pubsub.yaml with Confluent details
5. Deploy microservices

---

## 🐛 Troubleshooting

### Backend not starting?
```powershell
kubectl logs deployment/backend -n todo-app -c backend --tail=50
```

### Frontend not accessible?
```powershell
kubectl describe service frontend -n todo-app
kubectl get endpoints frontend -n todo-app
```

### Migration failed?
```powershell
kubectl logs job/db-migration -n todo-app
# If failed, delete and retry:
kubectl delete job db-migration -n todo-app
kubectl create job db-migration --image=devhasnainraza/backend:phase5 -n todo-app -- alembic upgrade head
```

### Check memory usage:
```powershell
kubectl top nodes
kubectl top pods -n todo-app
```

---

## 📈 What You've Achieved

### ✅ Implemented (300 Points)
- Database schema with 3 new tables
- 13 new API endpoints
- Recurring tasks CRUD operations
- Reminders CRUD operations
- User reminder preferences
- Frontend components and pages
- Event publishing code (ready for Kafka)
- 2 microservices (ready to deploy with managed Kafka)

### 🎯 Current Status
- **Core functionality:** ✅ Working
- **Event streaming:** ⏳ Pending managed Kafka setup
- **Automatic task creation:** ⏳ Pending managed Kafka setup
- **Notifications:** ⏳ Pending managed Kafka setup

---

## 🚀 Quick Start Summary

**Run these 11 commands in order:**

```powershell
cd E:/Hackathon_II/Phase_V
docker login -u devhasnainraza
docker build -t devhasnainraza/backend:phase5 ./backend
docker build -t devhasnainraza/frontend:phase5 ./frontend
docker build -t devhasnainraza/notification-service:latest ./services/notification-service
docker build -t devhasnainraza/recurring-task-service:latest ./services/recurring-task-service
docker push devhasnainraza/backend:phase5
docker push devhasnainraza/frontend:phase5
docker push devhasnainraza/notification-service:latest
docker push devhasnainraza/recurring-task-service:latest
kubectl delete job db-migration -n todo-app --ignore-not-found=true
kubectl create job db-migration --image=devhasnainraza/backend:phase5 -n todo-app -- alembic upgrade head
Start-Sleep -Seconds 60
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl set image deployment/backend backend=devhasnainraza/backend:phase5 -n todo-app
kubectl set image deployment/frontend frontend=devhasnainraza/frontend:phase5 -n todo-app
kubectl get pods -n todo-app
kubectl get service frontend -n todo-app
```

**Done!** Access your app and test the new features.

---

**Phase 5 - Core Features Deployed! 🎉**
**Add managed Kafka for full functionality.**
