# Phase 5 Deployment Guide - GKE with Kafka and Dapr

## Prerequisites

- GKE cluster running (3 × e2-micro nodes in Mumbai)
- kubectl configured to access the cluster
- Docker installed locally
- Dapr CLI installed (`dapr --version`)
- Access to Docker Hub account (devhasnainraza)

## Deployment Steps

### Step 1: Install Dapr on GKE

```bash
# Initialize Dapr on Kubernetes
dapr init -k --wait --runtime-version 1.12

# Verify Dapr installation
kubectl get pods -n dapr-system

# Expected output: dapr-operator, dapr-sidecar-injector, dapr-sentry, dapr-placement-server
```

### Step 2: Deploy Kafka Cluster

```bash
# Create namespace if not exists
kubectl create namespace todo-app

# Deploy Zookeeper and Kafka
kubectl apply -f kubernetes/kafka/kafka-deployment.yaml

# Wait for Kafka to be ready
kubectl wait --for=condition=ready pod -l app=kafka -n todo-app --timeout=300s

# Verify Kafka is running
kubectl get pods -n todo-app | grep kafka
```

### Step 3: Deploy Dapr Components

```bash
# Apply Dapr Pub/Sub component (Kafka)
kubectl apply -f kubernetes/dapr/pubsub.yaml

# Apply Dapr State Store component (Redis - optional)
kubectl apply -f kubernetes/dapr/statestore.yaml

# Verify Dapr components
kubectl get components -n todo-app
```

### Step 4: Run Database Migration

```bash
# Build migration job image
cd backend
docker build -t devhasnainraza/backend:phase5 .
docker push devhasnainraza/backend:phase5

# Run migration as Kubernetes Job
kubectl create job db-migration --image=devhasnainraza/backend:phase5 /
  --namespace=todo-app /
  -- alembic upgrade head

# Check migration logs
kubectl logs job/db-migration -n todo-app

# Verify migration completed
kubectl get jobs -n todo-app
```

### Step 5: Build and Push Microservice Images

```bash
# Build Notification Service
cd services/notification-service
docker build -t devhasnainraza/notification-service:latest .
docker push devhasnainraza/notification-service:latest

# Build Recurring Task Service
cd ../recurring-task-service
docker build -t devhasnainraza/recurring-task-service:latest .
docker push devhasnainraza/recurring-task-service:latest

# Build updated Backend
cd ../../backend
docker build -t devhasnainraza/backend:phase5 .
docker push devhasnainraza/backend:phase5

# Build updated Frontend
cd ../frontend
docker build -t devhasnainraza/frontend:phase5 .
docker push devhasnainraza/frontend:phase5
```

### Step 6: Deploy Microservices

```bash
# Deploy Notification Service with Dapr sidecar
kubectl apply -f kubernetes/notification-service-deployment.yaml

# Deploy Recurring Task Service with Dapr sidecar
kubectl apply -f kubernetes/recurring-task-service-deployment.yaml

# Update Backend deployment (with Dapr annotations)
kubectl apply -f kubernetes/backend-deployment.yaml

# Update Frontend deployment
kubectl set image deployment/frontend frontend=devhasnainraza/frontend:phase5 -n todo-app

# Verify all pods are running
kubectl get pods -n todo-app
```

### Step 7: Verify Dapr Sidecars

```bash
# Check that Dapr sidecars are injected
kubectl get pods -n todo-app -o jsonpath='{range .items[*]}{.metadata.name}{"/t"}{.spec.containers[*].name}{"/n"}{end}'

# Expected output should show 'daprd' container alongside app containers

# Check Dapr logs
kubectl logs deployment/backend -c daprd -n todo-app
kubectl logs deployment/notification-service -c daprd -n todo-app
kubectl logs deployment/recurring-task-service -c daprd -n todo-app
```

### Step 8: Test Event Flow

```bash
# Get backend pod name
BACKEND_POD=$(kubectl get pod -l app=backend -n todo-app -o jsonpath='{.items[0].metadata.name}')

# Port forward to backend
kubectl port-forward $BACKEND_POD 8000:8000 -n todo-app &

# Create a test task (should publish event to Kafka)
curl -X POST http://localhost:8000/api/tasks /
  -H "Authorization: Bearer YOUR_JWT_TOKEN" /
  -H "Content-Type: application/json" /
  -d '{
    "title": "Test Task",
    "description": "Testing event publishing",
    "status": "todo",
    "priority": "high"
  }'

# Check Kafka events in Dapr logs
kubectl logs deployment/backend -c daprd -n todo-app | grep "task-events"

# Check microservice logs
kubectl logs deployment/notification-service -n todo-app
kubectl logs deployment/recurring-task-service -n todo-app
```

### Step 9: Create Test Recurring Task

```bash
# Create a recurring task
curl -X POST http://localhost:8000/api/recurring-tasks /
  -H "Authorization: Bearer YOUR_JWT_TOKEN" /
  -H "Content-Type: application/json" /
  -d '{
    "title": "Daily Standup",
    "description": "Team standup meeting",
    "status": "todo",
    "priority": "high",
    "recurrence_pattern": "daily",
    "recurrence_interval": 1,
    "start_date": "2026-02-12T09:00:00Z"
  }'

# Verify recurring task created
curl http://localhost:8000/api/recurring-tasks /
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 10: Verify Frontend Access

```bash
# Get frontend service external IP
kubectl get service frontend -n todo-app

# Access frontend
# http://EXTERNAL_IP:30000

# Navigate to:
# - /recurring-tasks - View and manage recurring tasks
# - /reminders - View reminders and configure preferences
```

## Monitoring and Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n todo-app
kubectl describe pod POD_NAME -n todo-app
```

### View Logs
```bash
# Backend logs
kubectl logs deployment/backend -n todo-app -c backend --tail=100 -f

# Notification Service logs
kubectl logs deployment/notification-service -n todo-app --tail=100 -f

# Recurring Task Service logs
kubectl logs deployment/recurring-task-service -n todo-app --tail=100 -f

# Dapr sidecar logs
kubectl logs deployment/backend -n todo-app -c daprd --tail=100 -f
```

### Check Kafka Topics
```bash
# Exec into Kafka pod
kubectl exec -it kafka-0 -n todo-app -- bash

# List topics
kafka-topics --list --bootstrap-server localhost:9092

# Expected topics: task-events, reminders, task-updates

# Consume messages from topic
kafka-console-consumer --bootstrap-server localhost:9092 --topic task-events --from-beginning
```

### Check Dapr Components
```bash
kubectl get components -n todo-app
kubectl describe component kafka-pubsub -n todo-app
```

### Health Checks
```bash
# Backend health
curl http://BACKEND_IP:8000/api/health

# Notification Service health
curl http://NOTIFICATION_SERVICE_IP:8001/health

# Recurring Task Service health
curl http://RECURRING_TASK_SERVICE_IP:8002/health
```

## Rollback Plan

If deployment fails:

```bash
# Rollback backend
kubectl rollout undo deployment/backend -n todo-app

# Rollback frontend
kubectl rollout undo deployment/frontend -n todo-app

# Delete microservices
kubectl delete deployment notification-service -n todo-app
kubectl delete deployment recurring-task-service -n todo-app

# Rollback database migration
kubectl exec -it deployment/backend -n todo-app -c backend -- alembic downgrade -1
```

## Performance Tuning

### Increase Resources (if needed)
```bash
# Edit deployment
kubectl edit deployment backend -n todo-app

# Update resources:
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Scale Replicas
```bash
# Scale backend
kubectl scale deployment backend --replicas=2 -n todo-app

# Scale microservices
kubectl scale deployment notification-service --replicas=2 -n todo-app
kubectl scale deployment recurring-task-service --replicas=2 -n todo-app
```

## Verification Checklist

- [ ] Dapr installed on GKE
- [ ] Kafka cluster running
- [ ] Dapr components configured
- [ ] Database migration completed
- [ ] All Docker images built and pushed
- [ ] Backend deployment updated with Dapr annotations
- [ ] Notification Service deployed
- [ ] Recurring Task Service deployed
- [ ] All pods running with Dapr sidecars
- [ ] Event publishing working (check logs)
- [ ] Recurring tasks can be created
- [ ] Reminders can be configured
- [ ] Frontend accessible and functional

## Expected Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                           │
│  - RecurringTaskForm, ReminderSettings components              │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP/REST
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI + Dapr)                     │
│  - /api/recurring-tasks, /api/reminders endpoints              │
│  - Event publishers via Dapr Pub/Sub                           │
└─────────────────────────────────────────────────────────────────┘
                              │ Dapr Pub/Sub
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    KAFKA CLUSTER                                │
│  Topics: task-events, reminders, task-updates                  │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
        ┌───────────┘                           └───────────┐
        ↓                                                   ↓
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  NOTIFICATION SERVICE        │    │  RECURRING TASK SERVICE      │
│  - Consumes reminders topic  │    │  - Consumes task-events      │
│  - Sends email notifications │    │  - Creates task instances    │
│  - Dapr sidecar              │    │  - Dapr sidecar              │
└──────────────────────────────┘    └──────────────────────────────┘
```

## Success Criteria

✅ All pods running with status "Running"
✅ Dapr sidecars injected (2 containers per pod)
✅ Kafka topics created automatically
✅ Events published to Kafka after task CRUD operations
✅ Notification Service consuming reminder events
✅ Recurring Task Service consuming task events
✅ Frontend pages accessible (/recurring-tasks, /reminders)
✅ API endpoints responding correctly
✅ Database migration applied successfully

## Support

For issues:
1. Check pod logs: `kubectl logs POD_NAME -n todo-app`
2. Check Dapr logs: `kubectl logs POD_NAME -c daprd -n todo-app`
3. Verify Kafka connectivity: `kubectl exec -it kafka-0 -n todo-app -- kafka-topics --list --bootstrap-server localhost:9092`
4. Check Dapr components: `kubectl get components -n todo-app`
