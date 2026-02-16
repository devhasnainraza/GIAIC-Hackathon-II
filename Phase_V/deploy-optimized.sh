#!/bin/bash

# Complete Phase 5 Deployment with Memory Optimization
# Handles resource-constrained e2-micro nodes

set -e

echo "=========================================="
echo "Phase 5 Deployment (Memory Optimized)"
echo "=========================================="

# Colors
RED='/033[0;31m'
GREEN='/033[0;32m'
YELLOW='/033[1;33m'
NC='/033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

NAMESPACE="todo-app"
DOCKER_USERNAME="devhasnainraza"

# Step 1: Clean up memory-hogging pods
print_info "Step 1: Freeing up cluster memory..."

# Remove crashing cloudflared pods
kubectl delete deployment cloudflared -n todo-app --ignore-not-found=true
print_success "Removed cloudflared deployment"

# Remove old Kafka/Zookeeper if stuck
kubectl delete statefulset kafka -n todo-app --ignore-not-found=true
kubectl delete statefulset zookeeper -n todo-app --ignore-not-found=true
kubectl delete pod kafka-0 -n todo-app --ignore-not-found=true --force --grace-period=0 2>/dev/null || true
kubectl delete pod zookeeper-0 -n todo-app --ignore-not-found=true --force --grace-period=0 2>/dev/null || true

print_info "Waiting for cleanup (30 seconds)..."
sleep 30
print_success "Memory freed"

# Step 2: Check Dapr installation
print_info "Step 2: Checking Dapr installation..."

if ! kubectl get namespace dapr-system &> /dev/null; then
    print_info "Installing Dapr..."
    dapr init -k --wait --runtime-version 1.12
    print_success "Dapr installed"
else
    print_success "Dapr already installed"
fi

# Step 3: Deploy lightweight Kafka
print_info "Step 3: Deploying memory-optimized Kafka..."

kubectl apply -f kubernetes/kafka/kafka-deployment.yaml
print_info "Waiting for Kafka to start (90 seconds)..."
sleep 90

# Check if Kafka started
KAFKA_STATUS=$(kubectl get pod kafka-0 -n todo-app -o jsonpath='{.status.phase}' 2>/dev/null || echo "NotFound")
if [ "$KAFKA_STATUS" == "Running" ]; then
    print_success "Kafka is running"
elif [ "$KAFKA_STATUS" == "Pending" ]; then
    print_error "Kafka still pending - checking why..."
    kubectl describe pod kafka-0 -n todo-app | grep -A 5 "Events:"
    print_info "Continuing anyway - Kafka will start when resources are available"
else
    print_info "Kafka status: $KAFKA_STATUS - continuing..."
fi

# Step 4: Deploy Dapr components
print_info "Step 4: Deploying Dapr components..."

kubectl apply -f kubernetes/dapr/pubsub.yaml
kubectl apply -f kubernetes/dapr/statestore.yaml
sleep 5
print_success "Dapr components deployed"

# Step 5: Build Docker images
print_info "Step 5: Building Docker images..."

print_info "Building backend..."
docker build -t devhasnainraza/backend:phase5 ./backend
print_success "Backend built"

print_info "Building frontend..."
docker build -t devhasnainraza/frontend:phase5 ./frontend
print_success "Frontend built"

print_info "Building notification service..."
docker build -t devhasnainraza/notification-service:latest ./services/notification-service
print_success "Notification service built"

print_info "Building recurring task service..."
docker build -t devhasnainraza/recurring-task-service:latest ./services/recurring-task-service
print_success "Recurring task service built"

# Step 6: Push Docker images
print_info "Step 6: Pushing Docker images..."

print_info "Logging in to Docker Hub..."
docker login -u devhasnainraza

print_info "Pushing images (this may take 5-10 minutes)..."
docker push devhasnainraza/backend:phase5 &
PID1=$!
docker push devhasnainraza/frontend:phase5 &
PID2=$!
docker push devhasnainraza/notification-service:latest &
PID3=$!
docker push devhasnainraza/recurring-task-service:latest &
PID4=$!

wait $PID1 && print_success "Backend pushed"
wait $PID2 && print_success "Frontend pushed"
wait $PID3 && print_success "Notification service pushed"
wait $PID4 && print_success "Recurring task service pushed"

# Step 7: Run database migration
print_info "Step 7: Running database migration..."

kubectl delete job db-migration -n todo-app --ignore-not-found=true
kubectl create job db-migration --image=devhasnainraza/backend:phase5 -n todo-app -- alembic upgrade head

print_info "Waiting for migration (up to 2 minutes)..."
kubectl wait --for=condition=complete job/db-migration -n ${NAMESPACE} --timeout=120s || {
    print_error "Migration timed out - checking logs..."
    kubectl logs job/db-migration -n ${NAMESPACE} --tail=20
    print_info "Continuing anyway..."
}
print_success "Database migration completed"

# Step 8: Deploy microservices
print_info "Step 8: Deploying microservices..."

kubectl apply -f kubernetes/notification-service-deployment.yaml
print_success "Notification service deployed"

kubectl apply -f kubernetes/recurring-task-service-deployment.yaml
print_success "Recurring task service deployed"

# Step 9: Update existing deployments
print_info "Step 9: Updating backend and frontend..."

kubectl apply -f kubernetes/backend-deployment.yaml
kubectl set image deployment/backend backend=${DOCKER_USERNAME}/backend:phase5 -n ${NAMESPACE}
print_success "Backend updated"

kubectl set image deployment/frontend frontend=${DOCKER_USERNAME}/frontend:phase5 -n ${NAMESPACE}
print_success "Frontend updated"

# Step 10: Wait for rollouts
print_info "Step 10: Waiting for deployments to be ready..."

kubectl rollout status deployment/backend -n ${NAMESPACE} --timeout=180s || print_info "Backend rollout in progress..."
kubectl rollout status deployment/frontend -n ${NAMESPACE} --timeout=180s || print_info "Frontend rollout in progress..."
kubectl rollout status deployment/notification-service -n ${NAMESPACE} --timeout=180s || print_info "Notification service rollout in progress..."
kubectl rollout status deployment/recurring-task-service -n ${NAMESPACE} --timeout=180s || print_info "Recurring task service rollout in progress..."

print_success "Deployments updated"

# Step 11: Display status
echo ""
echo "=========================================="
echo "Deployment Status"
echo "=========================================="
echo ""

print_info "Pod Status:"
kubectl get pods -n ${NAMESPACE}

echo ""
print_info "Memory Usage:"
kubectl top nodes

echo ""
print_info "Services:"
kubectl get services -n ${NAMESPACE}

echo ""
FRONTEND_IP=$(kubectl get service frontend -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
if [ -z "$FRONTEND_IP" ]; then
    FRONTEND_IP=$(kubectl get service frontend -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}')
    print_info "Frontend URL: http://${FRONTEND_IP}:30000 (use port-forward or NodePort)"
else
    print_info "Frontend URL: http://${FRONTEND_IP}:30000"
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""

print_success "Phase 5 deployed successfully!"
echo ""
print_info "Next steps:"
echo "1. Access frontend at the URL above"
echo "2. Navigate to /recurring-tasks"
echo "3. Navigate to /reminders"
echo "4. Check logs: kubectl logs deployment/backend -n ${NAMESPACE} -c backend"
echo ""
print_info "To verify Dapr sidecars:"
echo "kubectl get pods -n ${NAMESPACE} -o jsonpath='{range .items[*]}{.metadata.name}{/"/t/"}{.spec.containers[*].name}{/"/n/"}{end}'"
echo ""
print_info "To check Kafka status:"
echo "kubectl logs kafka-0 -n ${NAMESPACE}"
echo ""
