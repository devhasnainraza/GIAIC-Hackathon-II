#!/bin/bash

# Phase 5 Rollback Script
# Use this script if deployment fails or you need to revert changes

set -e

echo "=========================================="
echo "Phase 5 Rollback - Starting..."
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

# Confirm rollback
echo ""
print_error "WARNING: This will rollback Phase 5 changes!"
echo "This will:"
echo "  - Rollback backend and frontend deployments"
echo "  - Delete notification and recurring task services"
echo "  - Rollback database migration"
echo "  - Keep Kafka and Dapr installed"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    print_info "Rollback cancelled"
    exit 0
fi

# Step 1: Rollback backend deployment
print_info "Step 1: Rolling back backend deployment..."
kubectl rollout undo deployment/backend -n ${NAMESPACE} || print_error "Backend rollback failed"
print_success "Backend rolled back"

# Step 2: Rollback frontend deployment
print_info "Step 2: Rolling back frontend deployment..."
kubectl rollout undo deployment/frontend -n ${NAMESPACE} || print_error "Frontend rollback failed"
print_success "Frontend rolled back"

# Step 3: Delete microservices
print_info "Step 3: Deleting microservices..."
kubectl delete deployment notification-service -n ${NAMESPACE} --ignore-not-found=true
kubectl delete service notification-service -n ${NAMESPACE} --ignore-not-found=true
kubectl delete deployment recurring-task-service -n ${NAMESPACE} --ignore-not-found=true
kubectl delete service recurring-task-service -n ${NAMESPACE} --ignore-not-found=true
print_success "Microservices deleted"

# Step 4: Rollback database migration
print_info "Step 4: Rolling back database migration..."
BACKEND_POD=$(kubectl get pod -l app=backend -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')

if [ -n "$BACKEND_POD" ]; then
    kubectl exec -it ${BACKEND_POD} -n ${NAMESPACE} -c backend -- alembic downgrade -1 || print_error "Database rollback failed"
    print_success "Database migration rolled back"
else
    print_error "Could not find backend pod for database rollback"
fi

# Step 5: Wait for rollback to complete
print_info "Step 5: Waiting for rollback to complete..."
kubectl rollout status deployment/backend -n ${NAMESPACE} --timeout=120s
kubectl rollout status deployment/frontend -n ${NAMESPACE} --timeout=120s
print_success "Rollback complete"

# Display status
echo ""
echo "=========================================="
echo "Rollback Complete!"
echo "=========================================="
echo ""
kubectl get pods -n ${NAMESPACE}
echo ""
print_success "Phase 5 changes have been rolled back"
print_info "Note: Kafka and Dapr are still installed. To remove them:"
echo "  kubectl delete -f kubernetes/kafka/kafka-deployment.yaml"
echo "  dapr uninstall -k"
echo ""
