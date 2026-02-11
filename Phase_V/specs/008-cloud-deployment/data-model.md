# Data Model: Cloud Deployment Configuration

**Feature**: Cloud Deployment & Production Upgrade
**Date**: 2026-02-09
**Phase**: 1 - Design

## Overview

This document defines the configuration model for cloud deployment. Unlike application data models (users, tasks, conversations), this model describes the infrastructure and deployment configuration entities.

---

## Entity: Cloud Cluster

**Description**: Kubernetes cluster hosted on cloud provider

**Attributes**:
- **provider**: Cloud provider name (e.g., "Oracle Cloud", "Google Cloud")
- **cluster_name**: Unique identifier for the cluster
- **region**: Geographic region (e.g., "us-ashburn-1")
- **node_count**: Number of worker nodes (2-3 for free tier)
- **node_size**: VM size per node (e.g., "1GB RAM, 1/8 OCPU")
- **kubernetes_version**: K8s version (e.g., "1.28")
- **kubeconfig**: Authentication configuration for kubectl access

**Relationships**:
- Hosts multiple **Helm Releases**
- Contains multiple **Namespaces**
- Pulls images from **Container Registry**

**Validation Rules**:
- node_count must be >= 1
- kubernetes_version must be >= 1.24
- kubeconfig must be valid and accessible

**State Transitions**:
- PROVISIONING → ACTIVE → UPDATING → ACTIVE
- ACTIVE → DELETING → DELETED

---

## Entity: Container Registry

**Description**: Storage for Docker images

**Attributes**:
- **registry_type**: Registry provider (e.g., "Docker Hub", "GHCR")
- **registry_url**: Base URL (e.g., "docker.io")
- **username**: Registry account username
- **access_token**: Authentication token (secret)
- **repositories**: List of image repositories
  - backend_repo: "username/todo-backend"
  - frontend_repo: "username/todo-frontend"

**Relationships**:
- Stores **Container Images**
- Accessed by **Cloud Cluster** for image pulls
- Updated by **CI/CD Pipeline**

**Validation Rules**:
- access_token must be valid and not expired
- repositories must exist and be accessible
- pull rate limits must not be exceeded

---

## Entity: Container Image

**Description**: Packaged application artifact

**Attributes**:
- **repository**: Full repository path (e.g., "username/todo-backend")
- **tag**: Version identifier (e.g., "latest", "v1.0.0")
- **digest**: SHA256 hash of image content
- **size**: Image size in MB
- **created_at**: Build timestamp
- **platform**: Architecture (e.g., "linux/amd64")

**Relationships**:
- Stored in **Container Registry**
- Referenced by **Helm Release**
- Built by **CI/CD Pipeline**

**Validation Rules**:
- tag must follow semantic versioning or be "latest"
- digest must be valid SHA256 hash
- platform must match cluster architecture

**Lifecycle**:
- BUILD → PUSH → AVAILABLE → DEPLOYED → DEPRECATED

---

## Entity: Helm Release

**Description**: Deployed instance of the application

**Attributes**:
- **release_name**: Unique name (e.g., "todo-chatbot")
- **namespace**: Kubernetes namespace (e.g., "todo-app")
- **chart_version**: Helm chart version (e.g., "1.0.0")
- **revision**: Deployment revision number (increments on upgrade)
- **status**: Deployment status (e.g., "deployed", "failed")
- **values**: Configuration overrides (values.yaml)

**Relationships**:
- Deployed to **Cloud Cluster**
- References **Container Images**
- Uses **Kubernetes Secrets**
- Exposes **Services**

**Validation Rules**:
- release_name must be unique within namespace
- chart_version must exist
- values must be valid YAML

**State Transitions**:
- PENDING → DEPLOYED → SUPERSEDED
- DEPLOYED → FAILED → ROLLED_BACK

---

## Entity: Kubernetes Secret

**Description**: Sensitive configuration data

**Attributes**:
- **secret_name**: Unique identifier (e.g., "todo-app-secrets")
- **namespace**: Kubernetes namespace
- **type**: Secret type (e.g., "Opaque")
- **data**: Key-value pairs (base64 encoded)
  - DATABASE_URL
  - JWT_SECRET
  - GEMINI_API_KEY
  - OPENAI_API_KEY
  - CLOUDINARY_API_SECRET
  - GMAIL_APP_PASSWORD
  - RESEND_API_KEY

**Relationships**:
- Used by **Helm Release**
- Injected into **Pods** as environment variables
- Created manually (not in Git)

**Validation Rules**:
- All required keys must be present
- Values must be base64 encoded
- Never committed to version control

**Security Requirements**:
- Access restricted to namespace
- Encrypted at rest in etcd
- Rotated periodically

---

## Entity: Service Exposure

**Description**: Public access configuration

**Attributes**:
- **service_name**: Kubernetes Service name (e.g., "frontend-service")
- **service_type**: Type of service (e.g., "LoadBalancer")
- **port**: Internal port (e.g., 3000)
- **target_port**: Container port (e.g., 3000)
- **external_ip**: Public IP address (assigned by cloud)
- **protocol**: Network protocol (e.g., "TCP")

**Relationships**:
- Routes traffic to **Pods**
- Part of **Helm Release**
- Accessed by end users

**Validation Rules**:
- service_type must be valid (ClusterIP, NodePort, LoadBalancer)
- external_ip must be assigned for LoadBalancer type
- port must be available and not conflicting

**State Transitions**:
- PENDING → ACTIVE (when external_ip assigned)
- ACTIVE → UPDATING → ACTIVE

---

## Entity: CI/CD Pipeline

**Description**: Automated build and deployment workflow

**Attributes**:
- **pipeline_name**: Workflow identifier (e.g., "deploy-cloud")
- **trigger**: Event that starts pipeline (e.g., "push to main")
- **stages**: Ordered list of execution stages
  - build: Build Docker images
  - push: Push images to registry
  - deploy: Update Kubernetes deployment
  - verify: Run health checks
- **status**: Current execution status
- **last_run**: Timestamp of last execution
- **success_rate**: Percentage of successful runs

**Relationships**:
- Builds **Container Images**
- Pushes to **Container Registry**
- Updates **Helm Release**
- Uses **GitHub Secrets** for credentials

**Validation Rules**:
- All required secrets must be configured
- Stages must execute in order
- Deployment must pass health checks

**Execution Flow**:
1. Trigger event (code push)
2. Checkout code
3. Build images
4. Push to registry
5. Update Helm deployment
6. Verify health checks
7. Report status

---

## Entity: Deployment Configuration

**Description**: Environment-specific settings

**Attributes**:
- **environment**: Environment name (e.g., "cloud", "local")
- **replicas**: Number of pod replicas per service
  - backend_replicas: 1-3
  - frontend_replicas: 1-3
- **resources**: Resource limits per pod
  - memory_request: "256Mi"
  - memory_limit: "512Mi"
  - cpu_request: "250m"
  - cpu_limit: "500m"
- **health_checks**: Probe configuration
  - startup_delay: 30s
  - liveness_period: 15s
  - readiness_period: 10s

**Relationships**:
- Applied to **Helm Release**
- Varies by **Environment**

**Validation Rules**:
- replicas must be >= 1
- resource limits must be >= requests
- health check timings must be reasonable

---

## Configuration Hierarchy

```
Cloud Cluster
├── Namespace: todo-app
│   ├── Helm Release: todo-chatbot
│   │   ├── Deployment: backend
│   │   │   ├── Pod: backend-xxx (replica 1)
│   │   │   └── Pod: backend-yyy (replica 2)
│   │   ├── Deployment: frontend
│   │   │   └── Pod: frontend-zzz (replica 1)
│   │   ├── Service: backend-service (ClusterIP)
│   │   └── Service: frontend-service (LoadBalancer)
│   └── Secret: todo-app-secrets
└── Container Registry
    ├── Image: username/todo-backend:latest
    └── Image: username/todo-frontend:latest
```

---

## Deployment Workflow

```
Developer pushes code
    ↓
CI/CD Pipeline triggered
    ↓
Build Docker images
    ↓
Push to Container Registry
    ↓
Update Helm Release
    ↓
Kubernetes pulls new images
    ↓
Rolling update of Pods
    ↓
Health checks verify deployment
    ↓
LoadBalancer routes traffic to new Pods
    ↓
Deployment complete
```

---

## Summary

This data model defines the infrastructure entities required for cloud deployment. Unlike application data (users, tasks), these entities represent deployment configuration and are managed through infrastructure-as-code (Helm charts, CI/CD workflows) rather than application APIs.

**Key Relationships**:
- Cloud Cluster hosts Helm Releases
- Helm Releases reference Container Images
- Container Images stored in Registry
- Secrets injected into Pods
- Services expose Pods publicly
- CI/CD Pipeline automates the entire flow

**Next Steps**:
- Generate contracts/ with concrete configurations
- Create quickstart.md with step-by-step instructions
- Update agent context with deployment knowledge
