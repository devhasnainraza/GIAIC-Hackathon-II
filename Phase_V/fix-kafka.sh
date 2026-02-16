#!/bin/bash

# Fix Kafka Deployment - Cleanup and Redeploy with Reduced Resources

echo "=========================================="
echo "Fixing Kafka Deployment Issue"
echo "=========================================="

NAMESPACE="todo-app"

# Step 1: Clean up existing Kafka/Zookeeper
echo "Step 1: Cleaning up existing Kafka/Zookeeper..."
kubectl delete statefulset kafka -n ${NAMESPACE} --ignore-not-found=true
kubectl delete statefulset zookeeper -n ${NAMESPACE} --ignore-not-found=true
kubectl delete pod kafka-0 -n ${NAMESPACE} --ignore-not-found=true --force --grace-period=0
kubectl delete pod zookeeper-0 -n ${NAMESPACE} --ignore-not-found=true --force --grace-period=0
echo "✓ Cleanup complete"

# Step 2: Clean up crashing cloudflared pods (freeing up resources)
echo "Step 2: Removing crashing cloudflared pods..."
kubectl delete deployment cloudflared -n ${NAMESPACE} --ignore-not-found=true
echo "✓ Cloudflared removed"

# Step 3: Wait for cleanup
echo "Step 3: Waiting for cleanup to complete..."
sleep 10

# Step 4: Deploy lightweight Kafka
echo "Step 4: Deploying lightweight Kafka configuration..."
kubectl apply -f kubernetes/kafka/kafka-deployment.yaml
echo "✓ Kafka deployment applied"

# Step 5: Wait for pods to be scheduled
echo "Step 5: Waiting for pods to be scheduled (60 seconds)..."
sleep 60

# Step 6: Check status
echo "Step 6: Checking pod status..."
kubectl get pods -n ${NAMESPACE}

echo ""
echo "=========================================="
echo "Kafka Fix Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Verify Kafka is running: kubectl get pods -n ${NAMESPACE} | grep kafka"
echo "2. Continue deployment: ./deploy.sh"
echo ""
