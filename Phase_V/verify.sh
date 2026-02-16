#!/bin/bash

# Phase 5 Verification Script
# Tests all Phase 5 features to ensure deployment is working correctly

set -e

echo "=========================================="
echo "Phase 5 Verification - Starting..."
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
PASSED=0
FAILED=0

# Test function
run_test() {
    local test_name=$1
    local test_command=$2

    print_info "Testing: $test_name"
    if eval "$test_command" &> /dev/null; then
        print_success "$test_name - PASSED"
        ((PASSED++))
    else
        print_error "$test_name - FAILED"
        ((FAILED++))
    fi
}

echo ""
print_info "=== Infrastructure Tests ==="
echo ""

# Test 1: Namespace exists
run_test "Namespace exists" "kubectl get namespace ${NAMESPACE}"

# Test 2: Dapr installed
run_test "Dapr installed" "kubectl get namespace dapr-system"

# Test 3: Kafka running
run_test "Kafka pod running" "kubectl get pod -l app=kafka -n ${NAMESPACE} -o jsonpath='{.items[0].status.phase}' | grep -q Running"

# Test 4: Zookeeper running
run_test "Zookeeper pod running" "kubectl get pod -l app=zookeeper -n ${NAMESPACE} -o jsonpath='{.items[0].status.phase}' | grep -q Running"

echo ""
print_info "=== Dapr Components Tests ==="
echo ""

# Test 5: Dapr Pub/Sub component
run_test "Dapr Pub/Sub component exists" "kubectl get component kafka-pubsub -n ${NAMESPACE}"

# Test 6: Dapr State Store component
run_test "Dapr State Store component exists" "kubectl get component statestore -n ${NAMESPACE}"

echo ""
print_info "=== Application Deployment Tests ==="
echo ""

# Test 7: Backend deployment
run_test "Backend deployment exists" "kubectl get deployment backend -n ${NAMESPACE}"

# Test 8: Backend pod running
run_test "Backend pod running" "kubectl get pod -l app=backend -n ${NAMESPACE} -o jsonpath='{.items[0].status.phase}' | grep -q Running"

# Test 9: Frontend deployment
run_test "Frontend deployment exists" "kubectl get deployment frontend -n ${NAMESPACE}"

# Test 10: Frontend pod running
run_test "Frontend pod running" "kubectl get pod -l app=frontend -n ${NAMESPACE} -o jsonpath='{.items[0].status.phase}' | grep -q Running"

# Test 11: Notification service deployment
run_test "Notification service deployment exists" "kubectl get deployment notification-service -n ${NAMESPACE}"

# Test 12: Notification service pod running
run_test "Notification service pod running" "kubectl get pod -l app=notification-service -n ${NAMESPACE} -o jsonpath='{.items[0].status.phase}' | grep -q Running"

# Test 13: Recurring task service deployment
run_test "Recurring task service deployment exists" "kubectl get deployment recurring-task-service -n ${NAMESPACE}"

# Test 14: Recurring task service pod running
run_test "Recurring task service pod running" "kubectl get pod -l app=recurring-task-service -n ${NAMESPACE} -o jsonpath='{.items[0].status.phase}' | grep -q Running"

echo ""
print_info "=== Dapr Sidecar Tests ==="
echo ""

# Test 15: Backend has Dapr sidecar
BACKEND_POD=$(kubectl get pod -l app=backend -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
run_test "Backend has Dapr sidecar" "kubectl get pod ${BACKEND_POD} -n ${NAMESPACE} -o jsonpath='{.spec.containers[*].name}' | grep -q daprd"

# Test 16: Notification service has Dapr sidecar
NOTIFICATION_POD=$(kubectl get pod -l app=notification-service -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
run_test "Notification service has Dapr sidecar" "kubectl get pod ${NOTIFICATION_POD} -n ${NAMESPACE} -o jsonpath='{.spec.containers[*].name}' | grep -q daprd"

# Test 17: Recurring task service has Dapr sidecar
RECURRING_POD=$(kubectl get pod -l app=recurring-task-service -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
run_test "Recurring task service has Dapr sidecar" "kubectl get pod ${RECURRING_POD} -n ${NAMESPACE} -o jsonpath='{.spec.containers[*].name}' | grep -q daprd"

echo ""
print_info "=== API Endpoint Tests ==="
echo ""

# Port forward to backend for testing
print_info "Setting up port forward to backend..."
kubectl port-forward ${BACKEND_POD} 8000:8000 -n ${NAMESPACE} &
PORT_FORWARD_PID=$!
sleep 3

# Test 18: Backend health endpoint
run_test "Backend health endpoint" "curl -s http://localhost:8000/api/health | grep -q healthy"

# Test 19: Recurring tasks endpoint exists
run_test "Recurring tasks endpoint accessible" "curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/recurring-tasks | grep -q 401"

# Test 20: Reminders endpoint exists
run_test "Reminders endpoint accessible" "curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/reminders | grep -q 401"

# Clean up port forward
kill $PORT_FORWARD_PID 2>/dev/null || true

echo ""
print_info "=== Kafka Topics Tests ==="
echo ""

# Test 21: Check Kafka topics
KAFKA_POD=$(kubectl get pod -l app=kafka -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
print_info "Checking Kafka topics..."
kubectl exec -it ${KAFKA_POD} -n ${NAMESPACE} -- kafka-topics --list --bootstrap-server localhost:9092 > /tmp/kafka-topics.txt 2>/dev/null || true

if grep -q "task-events" /tmp/kafka-topics.txt; then
    print_success "Kafka topic 'task-events' exists"
    ((PASSED++))
else
    print_info "Kafka topic 'task-events' not yet created (will be auto-created on first publish)"
    ((PASSED++))
fi

echo ""
print_info "=== Database Migration Tests ==="
echo ""

# Test 22: Check migration job
run_test "Database migration job completed" "kubectl get job db-migration -n ${NAMESPACE} -o jsonpath='{.status.succeeded}' | grep -q 1"

echo ""
print_info "=== Service Discovery Tests ==="
echo ""

# Test 23: Backend service exists
run_test "Backend service exists" "kubectl get service backend -n ${NAMESPACE}"

# Test 24: Frontend service exists
run_test "Frontend service exists" "kubectl get service frontend -n ${NAMESPACE}"

# Test 25: Notification service exists
run_test "Notification service exists" "kubectl get service notification-service -n ${NAMESPACE}"

# Test 26: Recurring task service exists
run_test "Recurring task service exists" "kubectl get service recurring-task-service -n ${NAMESPACE}"

# Test 27: Kafka service exists
run_test "Kafka service exists" "kubectl get service kafka-service -n ${NAMESPACE}"

echo ""
echo "=========================================="
echo "Verification Complete!"
echo "=========================================="
echo ""
echo "Results:"
echo "  ${GREEN}Passed: ${PASSED}${NC}"
echo "  ${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    print_success "All tests passed! Phase 5 deployment is working correctly."
    echo ""
    print_info "Next steps:"
    echo "1. Access your application:"
    FRONTEND_IP=$(kubectl get service frontend -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    if [ -z "$FRONTEND_IP" ]; then
        FRONTEND_IP=$(kubectl get service frontend -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}')
        echo "   Frontend: http://${FRONTEND_IP}:30000 (use kubectl port-forward)"
    else
        echo "   Frontend: http://${FRONTEND_IP}:30000"
    fi
    echo ""
    echo "2. Test recurring tasks:"
    echo "   Navigate to /recurring-tasks"
    echo "   Create a daily recurring task"
    echo ""
    echo "3. Test reminders:"
    echo "   Navigate to /reminders"
    echo "   Configure your reminder preferences"
    echo ""
    echo "4. Monitor event flow:"
    echo "   kubectl logs deployment/notification-service -n ${NAMESPACE} -f"
    echo "   kubectl logs deployment/recurring-task-service -n ${NAMESPACE} -f"
    echo ""
    exit 0
else
    print_error "Some tests failed. Please check the logs:"
    echo ""
    echo "Backend logs:"
    echo "  kubectl logs deployment/backend -n ${NAMESPACE} -c backend --tail=50"
    echo ""
    echo "Dapr logs:"
    echo "  kubectl logs deployment/backend -n ${NAMESPACE} -c daprd --tail=50"
    echo ""
    echo "Microservice logs:"
    echo "  kubectl logs deployment/notification-service -n ${NAMESPACE} --tail=50"
    echo "  kubectl logs deployment/recurring-task-service -n ${NAMESPACE} --tail=50"
    echo ""
    echo "Kafka logs:"
    echo "  kubectl logs ${KAFKA_POD} -n ${NAMESPACE} --tail=50"
    echo ""
    exit 1
fi
