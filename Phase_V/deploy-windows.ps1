# Phase 5 Deployment - PowerShell Commands
# For Windows users with memory-constrained GKE clusters

# ========================================
# OPTION 1: Deploy WITHOUT Kafka (Recommended for your cluster)
# ========================================
# This will deploy everything except Kafka/microservices
# Core app will work, but event streaming won't be active

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase 5 Deployment (No Kafka)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build and push backend
Write-Host "Step 1: Building backend..." -ForegroundColor Yellow
docker build -t devhasnainraza/backend:phase5 ./backend
docker push devhasnainraza/backend:phase5
Write-Host "✓ Backend built and pushed" -ForegroundColor Green

# Step 2: Build and push frontend
Write-Host "Step 2: Building frontend..." -ForegroundColor Yellow
docker build -t devhasnainraza/frontend:phase5 ./frontend
docker push devhasnainraza/frontend:phase5
Write-Host "✓ Frontend built and pushed" -ForegroundColor Green

# Step 3: Build and push microservices (for later use)
Write-Host "Step 3: Building microservices..." -ForegroundColor Yellow
docker build -t devhasnainraza/notification-service:latest ./services/notification-service
docker push devhasnainraza/notification-service:latest
docker build -t devhasnainraza/recurring-task-service:latest ./services/recurring-task-service
docker push devhasnainraza/recurring-task-service:latest
Write-Host "✓ Microservices built and pushed" -ForegroundColor Green

# Step 4: Run database migration
Write-Host "Step 4: Running database migration..." -ForegroundColor Yellow
kubectl delete job db-migration -n todo-app --ignore-not-found=true
kubectl create job db-migration --image=devhasnainraza/backend:phase5 -n todo-app -- alembic upgrade head
Start-Sleep -Seconds 60
kubectl logs job/db-migration -n todo-app --tail=20
Write-Host "✓ Database migration completed" -ForegroundColor Green

# Step 5: Update backend and frontend
Write-Host "Step 5: Updating deployments..." -ForegroundColor Yellow
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl set image deployment/backend backend=devhasnainraza/backend:phase5 -n todo-app
kubectl set image deployment/frontend frontend=devhasnainraza/frontend:phase5 -n todo-app
Write-Host "✓ Deployments updated" -ForegroundColor Green

# Step 6: Wait for rollout
Write-Host "Step 6: Waiting for rollout..." -ForegroundColor Yellow
kubectl rollout status deployment/backend -n todo-app --timeout=180s
kubectl rollout status deployment/frontend -n todo-app --timeout=180s
Write-Host "✓ Rollout complete" -ForegroundColor Green

# Step 7: Check status
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
kubectl get pods -n todo-app
Write-Host ""
kubectl get service frontend -n todo-app
Write-Host ""
Write-Host "✓ Phase 5 deployed (without Kafka)" -ForegroundColor Green
Write-Host ""
Write-Host "What works:" -ForegroundColor Yellow
Write-Host "  ✓ Recurring tasks API endpoints" -ForegroundColor Green
Write-Host "  ✓ Reminders API endpoints" -ForegroundColor Green
Write-Host "  ✓ Frontend pages (/recurring-tasks, /reminders)" -ForegroundColor Green
Write-Host "  ✓ Database with 3 new tables" -ForegroundColor Green
Write-Host ""
Write-Host "What doesn't work (needs Kafka):" -ForegroundColor Yellow
Write-Host "  ✗ Event streaming" -ForegroundColor Red
Write-Host "  ✗ Automatic task instance creation" -ForegroundColor Red
Write-Host "  ✗ Reminder notifications" -ForegroundColor Red
Write-Host ""
Write-Host "To enable full functionality, use managed Kafka:" -ForegroundColor Yellow
Write-Host "  1. Sign up at https://redpanda.com/try-redpanda (free tier)" -ForegroundColor Cyan
Write-Host "  2. Create a cluster and get connection details" -ForegroundColor Cyan
Write-Host "  3. Update kubernetes/dapr/pubsub.yaml with connection info" -ForegroundColor Cyan
Write-Host "  4. Deploy microservices" -ForegroundColor Cyan
Write-Host ""

# ========================================
# OPTION 2: Try Ultra-Minimal Kafka (150Mi)
# ========================================
# Uncomment below to try deploying Kafka with absolute minimum memory
# WARNING: May still fail if cluster has no memory

<#
Write-Host "Attempting ultra-minimal Kafka deployment..." -ForegroundColor Yellow
kubectl apply -f kubernetes/kafka/kafka-deployment.yaml
Start-Sleep -Seconds 90
$kafkaStatus = kubectl get pod kafka-0 -n todo-app -o jsonpath='{.status.phase}' 2>$null
if ($kafkaStatus -eq "Running") {
    Write-Host "✓ Kafka is running!" -ForegroundColor Green

    # Deploy microservices
    kubectl apply -f kubernetes/notification-service-deployment.yaml
    kubectl apply -f kubernetes/recurring-task-service-deployment.yaml

    Write-Host "✓ Full Phase 5 deployed with Kafka!" -ForegroundColor Green
} else {
    Write-Host "✗ Kafka failed to start - insufficient memory" -ForegroundColor Red
    Write-Host "Cluster memory usage:" -ForegroundColor Yellow
    kubectl top nodes
}
#>
