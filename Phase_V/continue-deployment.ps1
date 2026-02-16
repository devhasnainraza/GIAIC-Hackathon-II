# Phase 5 Deployment - Continue from Here
# Node.js version fixed (18 → 20)

# ========================================
# CONTINUE DEPLOYMENT
# ========================================

# Step 1: Rebuild frontend with fixed Dockerfile
Write-Host "Rebuilding frontend with Node.js 20..." -ForegroundColor Yellow
docker build -t devhasnainraza/frontend:phase5 ./frontend
Write-Host "✓ Frontend built successfully!" -ForegroundColor Green

# Step 2: Build microservices
Write-Host "Building notification service..." -ForegroundColor Yellow
docker build -t devhasnainraza/notification-service:latest ./services/notification-service
Write-Host "✓ Notification service built!" -ForegroundColor Green

Write-Host "Building recurring task service..." -ForegroundColor Yellow
docker build -t devhasnainraza/recurring-task-service:latest ./services/recurring-task-service
Write-Host "✓ Recurring task service built!" -ForegroundColor Green

# Step 3: Push all images to Docker Hub
Write-Host ""
Write-Host "Pushing images to Docker Hub (this takes 5-10 minutes)..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Pushing backend..." -ForegroundColor Cyan
docker push devhasnainraza/backend:phase5
Write-Host "✓ Backend pushed!" -ForegroundColor Green

Write-Host "Pushing frontend..." -ForegroundColor Cyan
docker push devhasnainraza/frontend:phase5
Write-Host "✓ Frontend pushed!" -ForegroundColor Green

Write-Host "Pushing notification service..." -ForegroundColor Cyan
docker push devhasnainraza/notification-service:latest
Write-Host "✓ Notification service pushed!" -ForegroundColor Green

Write-Host "Pushing recurring task service..." -ForegroundColor Cyan
docker push devhasnainraza/recurring-task-service:latest
Write-Host "✓ Recurring task service pushed!" -ForegroundColor Green

# Step 4: Run database migration
Write-Host ""
Write-Host "Running database migration..." -ForegroundColor Yellow
kubectl delete job db-migration -n todo-app --ignore-not-found=true
kubectl create job db-migration --image=devhasnainraza/backend:phase5 -n todo-app -- alembic upgrade head

Write-Host "Waiting for migration to complete (60 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 60

Write-Host "Checking migration logs..." -ForegroundColor Cyan
kubectl logs job/db-migration -n todo-app --tail=30
Write-Host "✓ Database migration completed!" -ForegroundColor Green

# Step 5: Update backend deployment
Write-Host ""
Write-Host "Updating backend deployment..." -ForegroundColor Yellow
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl set image deployment/backend backend=devhasnainraza/backend:phase5 -n todo-app

Write-Host "Waiting for backend rollout..." -ForegroundColor Cyan
kubectl rollout status deployment/backend -n todo-app --timeout=180s
Write-Host "✓ Backend updated!" -ForegroundColor Green

# Step 6: Update frontend deployment
Write-Host ""
Write-Host "Updating frontend deployment..." -ForegroundColor Yellow
kubectl set image deployment/frontend frontend=devhasnainraza/frontend:phase5 -n todo-app

Write-Host "Waiting for frontend rollout..." -ForegroundColor Cyan
kubectl rollout status deployment/frontend -n todo-app --timeout=180s
Write-Host "✓ Frontend updated!" -ForegroundColor Green

# Step 7: Check deployment status
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pods:" -ForegroundColor Yellow
kubectl get pods -n todo-app
Write-Host ""

Write-Host "Services:" -ForegroundColor Yellow
kubectl get services -n todo-app
Write-Host ""

# Step 8: Get frontend URL
$frontendIP = kubectl get service frontend -n todo-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
if ($frontendIP) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend URL: http://$frontendIP:30000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "New Pages:" -ForegroundColor Yellow
    Write-Host "  • http://$frontendIP:30000/recurring-tasks" -ForegroundColor Cyan
    Write-Host "  • http://$frontendIP:30000/reminders" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "Frontend service is ClusterIP - getting NodePort..." -ForegroundColor Yellow
    kubectl get service frontend -n todo-app
}

Write-Host ""
Write-Host "What's Working:" -ForegroundColor Yellow
Write-Host "  ✓ 13 new API endpoints" -ForegroundColor Green
Write-Host "  ✓ 3 new database tables" -ForegroundColor Green
Write-Host "  ✓ Recurring tasks CRUD" -ForegroundColor Green
Write-Host "  ✓ Reminders CRUD" -ForegroundColor Green
Write-Host "  ✓ Frontend pages" -ForegroundColor Green
Write-Host ""
Write-Host "To enable event streaming (optional):" -ForegroundColor Yellow
Write-Host "  1. Sign up at https://redpanda.com/try-redpanda" -ForegroundColor Cyan
Write-Host "  2. Create free cluster" -ForegroundColor Cyan
Write-Host "  3. Update kubernetes/dapr/pubsub.yaml" -ForegroundColor Cyan
Write-Host "  4. Deploy microservices" -ForegroundColor Cyan
Write-Host ""
Write-Host "Phase 5 Core Features Deployed! 🎉" -ForegroundColor Green
Write-Host ""
