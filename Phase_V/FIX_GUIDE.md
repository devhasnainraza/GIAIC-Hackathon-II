# Quick Fix Guide for Memory-Constrained GKE Cluster

## Problem
Your e2-micro nodes (4 nodes) are at 92-100% memory usage, preventing Kafka from starting.

## Solution Applied
I've optimized all resource requirements:
- **Kafka**: 512Mi → 200Mi (with heap limit)
- **Zookeeper**: 256Mi → 128Mi
- **Notification Service**: 256Mi → 128Mi
- **Recurring Task Service**: 256Mi → 128Mi

## Step-by-Step Fix

### Step 1: Clean Up and Fix Kafka

```bash
cd E:/Hackathon_II/Phase_V

# Run the fix script
./fix-kafka.sh
```

This will:
- Remove existing Kafka/Zookeeper pods
- Remove crashing cloudflared pods (freeing memory)
- Deploy lightweight Kafka configuration

### Step 2: Verify Kafka is Running

```bash
# Wait 2 minutes, then check
kubectl get pods -n todo-app

# You should see:
# kafka-0        1/1     Running
# zookeeper-0    1/1     Running
```

### Step 3: Continue with Deployment

Once Kafka is running, continue with the deployment:

```bash
# Deploy Dapr components
kubectl apply -f kubernetes/dapr/pubsub.yaml
kubectl apply -f kubernetes/dapr/statestore.yaml

# Build and push images (if not done already)
docker build -t devhasnainraza/backend:phase5 ./backend
docker build -t devhasnainraza/frontend:phase5 ./frontend
docker build -t devhasnainraza/notification-service:latest ./services/notification-service
docker build -t devhasnainraza/recurring-task-service:latest ./services/recurring-task-service

docker push devhasnainraza/backend:phase5
docker push devhasnainraza/frontend:phase5
docker push devhasnainraza/notification-service:latest
docker push devhasnainraza/recurring-task-service:latest

# Run database migration
kubectl delete job db-migration -n todo-app --ignore-not-found=true
kubectl create job db-migration --image=devhasnainraza/backend:phase5 -n todo-app -- alembic upgrade head

# Wait for migration
kubectl wait --for=condition=complete job/db-migration -n todo-app --timeout=120s

# Deploy microservices
kubectl apply -f kubernetes/notification-service-deployment.yaml
kubectl apply -f kubernetes/recurring-task-service-deployment.yaml

# Update backend and frontend
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl set image deployment/backend backend=devhasnainraza/backend:phase5 -n todo-app
kubectl set image deployment/frontend frontend=devhasnainraza/frontend:phase5 -n todo-app

# Wait for rollout
kubectl rollout status deployment/backend -n todo-app
kubectl rollout status deployment/frontend -n todo-app
kubectl rollout status deployment/notification-service -n todo-app
kubectl rollout status deployment/recurring-task-service -n todo-app
```

### Step 4: Verify Deployment

```bash
kubectl get pods -n todo-app
```

Expected output:
```
NAME                                      READY   STATUS    RESTARTS   AGE
backend-xxxxx                             2/2     Running   0          2m
frontend-xxxxx                            1/1     Running   0          2m
kafka-0                                   1/1     Running   0          5m
notification-service-xxxxx                2/2     Running   0          2m
recurring-task-service-xxxxx              2/2     Running   0          2m
zookeeper-0                               1/1     Running   0          5m
```

## Alternative: Use Managed Kafka (Recommended)

If Kafka still doesn't fit, use a managed Kafka service:

### Option A: Confluent Cloud (Free Tier)
1. Sign up at https://confluent.cloud/
2. Create a free cluster
3. Get bootstrap servers and credentials
4. Update Dapr pubsub.yaml with Confluent connection details

### Option B: Redpanda Cloud (Free Tier)
1. Sign up at https://redpanda.com/try-redpanda
2. Create a free cluster
3. Get connection details
4. Update Dapr pubsub.yaml

### Option C: Skip Kafka for Now
Deploy without Kafka (events won't be streamed, but app will work):

```bash
# Skip Kafka deployment
# Deploy everything else without event streaming
# Microservices won't work, but core app will function
```

## Memory Optimization Tips

### 1. Remove Unused Pods
```bash
# Check what's using memory
kubectl top pods -n todo-app

# Remove unused deployments
kubectl delete deployment cloudflared -n todo-app
```

### 2. Reduce Backend/Frontend Replicas
```bash
# Scale down to 1 replica each
kubectl scale deployment backend --replicas=1 -n todo-app
kubectl scale deployment frontend --replicas=1 -n todo-app
```

### 3. Check Node Memory
```bash
kubectl top nodes
```

## Troubleshooting

### If Kafka still won't start:
```bash
# Check why it's pending
kubectl describe pod kafka-0 -n todo-app

# Check available memory
kubectl top nodes

# Try even smaller limits
kubectl edit statefulset kafka -n todo-app
# Change memory requests to 150Mi and limits to 300Mi
```

### If other pods are evicted:
```bash
# Increase node memory by upgrading machine type
# Or reduce resource requests further
```

## Quick Commands Reference

```bash
# Check pod status
kubectl get pods -n todo-app

# Check memory usage
kubectl top nodes
kubectl top pods -n todo-app

# View logs
kubectl logs deployment/backend -n todo-app -c backend
kubectl logs kafka-0 -n todo-app

# Restart a pod
kubectl delete pod POD_NAME -n todo-app

# Force delete stuck pod
kubectl delete pod POD_NAME -n todo-app --force --grace-period=0
```

## Next Steps After Fix

1. Run `./fix-kafka.sh`
2. Wait for Kafka to start (2-3 minutes)
3. Continue with Step 3 above
4. Verify with `kubectl get pods -n todo-app`
5. Access frontend and test features

---

**Start with:** `./fix-kafka.sh`
