#!/bin/bash

# Phase 5 Automated Deployment Script for GKE
# This script automates the entire deployment process

set -e  # Exit on any error

echo "=========================================="
echo "Phase 5 Deployment - Starting..."
echo "=========================================="

# Colors for output
RED='/033[0;31m'
GREEN='/033[0;32m'
YELLOW='/033[1;33m'
NC='/033[0m' # No Color

# Configuration
NAMESPACE="todo-app"
DOCKER_USERNAME="devhasnainraza"
BACKEND_IMAGE="${DOCKER_USERNAME}/backend:phase5"
FRONTEND_IMAGE="${DOCKER_USERNAME}/frontend:phase5"
NOTIFICATION_IMAGE="${DOCKER_USERNAME}/notification-service:latest"
RECURRING_TASK_IMAGE="${DOCKER_USERNAME}/recurring-task-service:latest"

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Verify prerequisites
print_info "Step 1: Verifying prerequisites..."

if ! command_exists kubectl; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists dapr; then
    print_error "Dapr CLI is not installed. Please install Dapr CLI first."
    exit 1
fi

print_success "All prerequisites are installed"

# Step 2: Check GKE cluster connection
print_info "Step 2: Checking GKE cluster connection..."

if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster. Please configure kubectl."
    exit 1
fi

print_success "Connected to Kubernetes cluster"

# Step 3: Create namespace if not exists
print_info "Step 3: Creating namespace..."

kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
print_success "Namespace ${NAMESPACE} ready"

# Step 4: Install Dapr on Kubernetes
print_info "Step 4: Installing Dapr on Kubernetes..."

if ! kubectl get namespace dapr-system &> /dev/null; then
    print_info "Installing Dapr..."
    dapr init -k --wait --runtime-version 1.12
    print_success "Dapr installed successfully"
else
    print_success "Dapr already installed"
fi

# Step 5: Deploy Kafka cluster
print_info "Step 5: Deploying Kafka cluster..."

kubectl apply -f kubernetes/kafka/kafka-deployment.yaml
print_info "Waiting for Kafka to be ready (this may take 2-3 minutes)..."
kubectl wait --for=condition=ready pod -l app=kafka -n todo-app --timeout=300s || true
print_success "Kafka cluster deployed"

# Step 6: Deploy Dapr components
print_info "Step 6: Deploying Dapr components..."

kubectl apply -f kubernetes/dapr/pubsub.yaml
kubectl apply -f kubernetes/dapr/statestore.yaml
sleep 5  # Wait for components to be registered
print_success "Dapr components deployed"

# Step 7: Build Docker images
print_info "Step 7: Building Docker images..."

print_info "Building backend image..."
docker build -t ${BACKEND_IMAGE} ./backend
print_success "Backend image built"

print_info "Building frontend image..."
docker build -t ${FRONTEND_IMAGE} ./frontend
print_success "Frontend image built"

print_info "Building notification service image..."
docker build -t ${NOTIFICATION_IMAGE} ./services/notification-service
print_success "Notification service image built"

print_info "Building recurring task service image..."
docker build -t ${RECURRING_TASK_IMAGE} ./services/recurring-task-service
print_success "Recurring task service image built"

# Step 8: Push Docker images
print_info "Step 8: Pushing Docker images to Docker Hub..."

print_info "Logging in to Docker Hub..."
echo "Please enter your Docker Hub password:"
docker login -u ${DOCKER_USERNAME}

print_info "Pushing backend image..."
docker push ${BACKEND_IMAGE}
print_success "Backend image pushed"

print_info "Pushing frontend image..."
docker push ${FRONTEND_IMAGE}
print_success "Frontend image pushed"

print_info "Pushing notification service image..."
docker push ${NOTIFICATION_IMAGE}
print_success "Notification service image pushed"

print_info "Pushing recurring task service image..."
docker push ${RECURRING_TASK_IMAGE}
print_success "Recurring task service image pushed"

# Step 9: Run database migration
print_info "Step 9: Running database migration..."

kubectl delete job db-migration -n ${NAMESPACE} --ignore-not-found=true
kubectl create job db-migration --image=${BACKEND_IMAGE} -n ${NAMESPACE} -- alembic upgrade head

print_info "Waiting for migration to complete..."
kubectl wait --for=condition=complete job/db-migration -n ${NAMESPACE} --timeout=120s || {
    print_error "Migration failed. Check logs with: kubectl logs job/db-migration -n ${NAMESPACE}"
    exit 1
}
print_success "Database migration completed"

# Step 10: Deploy microservices
print_info "Step 10: Deploying microservices..."

print_info "Deploying notification service..."
kubectl apply -f kubernetes/notification-service-deployment.yaml
print_success "Notification service deployed"

print_info "Deploying recurring task service..."
kubectl apply -f kubernetes/recurring-task-service-deployment.yaml
print_success "Recurring task service deployed"

# Step 11: Update existing deployments
print_info "Step 11: Updating existing deployments..."

print_info "Updating backend deployment..."
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl set image deployment/backend backend=${BACKEND_IMAGE} -n ${NAMESPACE}
print_success "Backend deployment updated"

print_info "Updating frontend deployment..."
kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE} -n ${NAMESPACE}
print_success "Frontend deployment updated"

# Step 12: Wait for all deployments to be ready
print_info "Step 12: Waiting for all deployments to be ready..."

kubectl rollout status deployment/backend -n ${NAMESPACE} --timeout=300s
kubectl rollout status deployment/frontend -n ${NAMESPACE} --timeout=300s
kubectl rollout status deployment/notification-service -n ${NAMESPACE} --timeout=300s
kubectl rollout status deployment/recurring-task-service -n ${NAMESPACE} --timeout=300s

print_success "All deployments are ready"

# Step 13: Verify Dapr sidecars
print_info "Step 13: Verifying Dapr sidecars..."

BACKEND_POD=$(kubectl get pod -l app=backend -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
NOTIFICATION_POD=$(kubectl get pod -l app=notification-service -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
RECURRING_POD=$(kubectl get pod -l app=recurring-task-service -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')

if kubectl get pod ${BACKEND_POD} -n ${NAMESPACE} -o jsonpath='{.spec.containers[*].name}' | grep -q "daprd"; then
    print_success "Backend has Dapr sidecar"
else
    print_error "Backend missing Dapr sidecar"
fi

if kubectl get pod ${NOTIFICATION_POD} -n ${NAMESPACE} -o jsonpath='{.spec.containers[*].name}' | grep -q "daprd"; then
    print_success "Notification service has Dapr sidecar"
else
    print_error "Notification service missing Dapr sidecar"
fi

if kubectl get pod ${RECURRING_POD} -n ${NAMESPACE} -o jsonpath='{.spec.containers[*].name}' | grep -q "daprd"; then
    print_success "Recurring task service has Dapr sidecar"
else
    print_error "Recurring task service missing Dapr sidecar"
fi

# Step 14: Display deployment information
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""

print_info "Getting service information..."
kubectl get services -n ${NAMESPACE}

echo ""
print_info "Getting pod status..."
kubectl get pods -n ${NAMESPACE}

echo ""
print_info "Frontend URL:"
FRONTEND_IP=$(kubectl get service frontend -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ -z "$FRONTEND_IP" ]; then
    FRONTEND_IP=$(kubectl get service frontend -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}')
    echo "http://${FRONTEND_IP}:30000 (ClusterIP - use port-forward or NodePort)"
else
    echo "http://${FRONTEND_IP}:30000"
fi

echo ""
print_success "Phase 5 deployment completed successfully!"
echo ""
print_info "Next steps:"
echo "1. Access frontend at the URL above"
echo "2. Navigate to /recurring-tasks to create recurring tasks"
echo "3. Navigate to /reminders to configure reminder preferences"
echo "4. Check logs: kubectl logs deployment/backend -n ${NAMESPACE} -c backend"
echo "5. Check Dapr logs: kubectl logs deployment/backend -n ${NAMESPACE} -c daprd"
echo ""
print_info "To verify event flow:"
echo "kubectl logs deployment/notification-service -n ${NAMESPACE} --tail=50 -f"
echo "kubectl logs deployment/recurring-task-service -n ${NAMESPACE} --tail=50 -f"
echo ""
