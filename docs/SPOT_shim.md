# RXT SPOT Adapter Specification

**Purpose:** Translate platform-agnostic `deploy.yaml` manifests into RXT SPOT (Kubernetes-based) primitives.

**Platform:** RXT SPOT - Managed Kubernetes clusters on Rackspace infrastructure

**API Integration:** Kubernetes API, Helm, RXT SPOT Public API

---

## Overview

The RXT SPOT Adapter is a **thin, stateless microservice** that implements the `IComputePlatform` interface to provision and manage containerized workloads on Rackspace's Kubernetes-based platform.

### Responsibilities

1. **Translate** unified `deploy.yaml` ’ Kubernetes manifests (Deployments, Services, Ingress)
2. **Provision** namespaces, resource quotas, network policies
3. **Deploy** applications via kubectl or Helm
4. **Configure** Ingress controllers, LoadBalancers, TLS certificates
5. **Monitor** pod health, resource usage, and emit platform events
6. **Scale** deployments via HPA (Horizontal Pod Autoscaler)

### Integration Points

| System | Purpose | API Endpoint |
|--------|---------|--------------|
| **RXT SPOT API** | Cluster provisioning, node management | `https://api.spot.rackspace.com/v1` |
| **Kubernetes API** | Workload orchestration | `https://<cluster-endpoint>:6443` |
| **Helm** | Package management | Tiller/Helm 3 library |
| **Ingress Controller** | HTTP routing, TLS termination | NGINX/Traefik/HAProxy |
| **cert-manager** | Automated TLS certificate management | Let's Encrypt integration |
| **Metrics Server** | Resource usage metrics | Kubernetes Metrics API |

---

## IComputePlatform Interface Implementation

```typescript
interface IComputePlatform {
  provisionEnvironment(spec: DeploySpec): Promise<EnvironmentResult>
  deployApplication(envId: string, artifact: Artifact, config: AppConfig): Promise<DeploymentResult>
  scaleResources(envId: string, resources: ResourceSpec): Promise<ScaleResult>
  getStatus(envId: string): Promise<EnvironmentStatus>
  destroyEnvironment(envId: string): Promise<DestroyResult>
}
```

### Method: `provisionEnvironment(spec)`

**Input:** Platform-agnostic deployment spec
```yaml
project: my-api
environment: production
platform:
  preference: container
resources:
  cpu: 4
  memory: 8Gi
  storage: 50Gi
  replicas: 3
```

**RXT SPOT Translation:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-api-production
  labels:
    project: my-api
    environment: production
    platform: rxt-spot
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: my-api-production-quota
  namespace: my-api-production
spec:
  hard:
    requests.cpu: "12"        # 4 CPU × 3 replicas
    requests.memory: "24Gi"   # 8Gi × 3 replicas
    persistentvolumeclaims: "3"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: my-api-production-limits
  namespace: my-api-production
spec:
  limits:
  - max:
      cpu: "4"
      memory: "8Gi"
    min:
      cpu: "100m"
      memory: "128Mi"
    type: Container
```

**Output Event:**
```json
{
  "event": "evt.provisioned",
  "envId": "env_abc123",
  "platform": "rxt-spot",
  "resourceIds": {
    "namespace": "my-api-production",
    "quota": "my-api-production-quota",
    "clusterId": "cluster_xyz789"
  },
  "endpoints": {
    "kubeconfig": "s3://rxt-deploy/kubeconfig/env_abc123.yaml"
  }
}
```

---

### Method: `deployApplication(envId, artifact, config)`

**Input:**
```json
{
  "envId": "env_abc123",
  "artifact": {
    "type": "docker",
    "registry": "registry.rxt.cloud",
    "image": "my-api",
    "tag": "sha-5dd2014",
    "digest": "sha256:abc123..."
  },
  "config": {
    "run": {
      "command": "node server.js",
      "ports": [{"name": "http", "port": 3000}]
    },
    "networking": {
      "expose": [
        {"domain": "api.example.com", "port": 3000, "tls": "auto"}
      ]
    },
    "secrets": ["DATABASE_URL", "API_SECRET_KEY"],
    "health": {
      "http": {"path": "/health", "port": 3000, "interval": "30s"}
    }
  }
}
```

**RXT SPOT Translation:**

#### 1. Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
  namespace: my-api-production
  labels:
    app: my-api
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-api
  template:
    metadata:
      labels:
        app: my-api
        version: sha-5dd2014
    spec:
      containers:
      - name: my-api
        image: registry.rxt.cloud/my-api:sha-5dd2014@sha256:abc123...
        command: ["node", "server.js"]
        ports:
        - name: http
          containerPort: 3000
          protocol: TCP
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: my-api-secrets
              key: DATABASE_URL
        - name: API_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: my-api-secrets
              key: API_SECRET_KEY
        resources:
          requests:
            cpu: "4"
            memory: "8Gi"
          limits:
            cpu: "4"
            memory: "8Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
      imagePullSecrets:
      - name: registry-credentials
```

#### 2. Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-api
  namespace: my-api-production
spec:
  selector:
    app: my-api
  ports:
  - name: http
    port: 3000
    targetPort: 3000
    protocol: TCP
  type: ClusterIP
```

#### 3. Ingress + TLS
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-api
  namespace: my-api-production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "1000"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: my-api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-api
            port:
              number: 3000
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-api-tls
  namespace: my-api-production
spec:
  secretName: my-api-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - api.example.com
```

#### 4. Secrets (pre-populated from Secrets Service)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-api-secrets
  namespace: my-api-production
type: Opaque
data:
  DATABASE_URL: <base64-encoded>
  API_SECRET_KEY: <base64-encoded>
```

**Output Event:**
```json
{
  "event": "evt.deploy.ready",
  "envId": "env_abc123",
  "platform": "rxt-spot",
  "urls": ["https://api.example.com"],
  "resourceIds": {
    "deployment": "my-api",
    "service": "my-api",
    "ingress": "my-api",
    "pods": ["my-api-7d9f5c8b-1a2b3", "my-api-7d9f5c8b-4c5d6", "my-api-7d9f5c8b-7e8f9"]
  }
}
```

---

### Method: `scaleResources(envId, resources)`

**Input:**
```json
{
  "envId": "env_abc123",
  "resources": {
    "replicas": 5,
    "hpa": {
      "enabled": true,
      "minReplicas": 3,
      "maxReplicas": 10,
      "targetCPUUtilization": 70
    }
  }
}
```

**RXT SPOT Translation:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-api
  namespace: my-api-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

### Method: `getStatus(envId)`

**Kubernetes API Queries:**
```bash
# Get deployment status
kubectl get deployment my-api -n my-api-production -o json

# Get pod health
kubectl get pods -n my-api-production -l app=my-api -o json

# Get resource usage
kubectl top pods -n my-api-production -l app=my-api

# Get ingress status
kubectl get ingress my-api -n my-api-production -o json
```

**Output:**
```json
{
  "envId": "env_abc123",
  "platform": "rxt-spot",
  "status": "healthy",
  "deployment": {
    "replicas": {
      "desired": 3,
      "ready": 3,
      "available": 3
    },
    "conditions": [
      {"type": "Available", "status": "True"}
    ]
  },
  "pods": [
    {"name": "my-api-7d9f5c8b-1a2b3", "status": "Running", "ready": true, "restarts": 0},
    {"name": "my-api-7d9f5c8b-4c5d6", "status": "Running", "ready": true, "restarts": 0},
    {"name": "my-api-7d9f5c8b-7e8f9", "status": "Running", "ready": true, "restarts": 0}
  ],
  "ingress": {
    "hostname": "api.example.com",
    "tlsEnabled": true,
    "certificateValid": true
  },
  "resources": {
    "cpu": {"used": "8.2", "requested": "12", "limit": "12"},
    "memory": {"used": "18.4Gi", "requested": "24Gi", "limit": "24Gi"}
  }
}
```

---

### Method: `destroyEnvironment(envId)`

**Kubernetes Operations:**
```bash
# Delete all resources in namespace
kubectl delete namespace my-api-production

# This cascades to:
# - Deployments
# - Pods
# - Services
# - Ingress
# - Secrets
# - ConfigMaps
# - PersistentVolumeClaims
```

**Output Event:**
```json
{
  "event": "evt.environment.destroyed",
  "envId": "env_abc123",
  "platform": "rxt-spot",
  "deletedResources": {
    "namespace": "my-api-production",
    "deployments": 1,
    "pods": 3,
    "services": 1,
    "ingresses": 1
  }
}
```

---

## Event Bus Integration

### Consumed Commands

```typescript
// Platform Abstraction Layer sends this after determining RXT SPOT is the target
interface SpotProvisionCommand {
  topic: 'cmd.spot.provision.request'
  payload: {
    tenant: string
    project: string
    environment: string
    helmChart?: string        // Optional: use pre-packaged Helm chart
    k8sManifests?: object[]   // Or raw manifests
    resources: {
      cpu: string
      memory: string
      storage: string
      replicas: number
    }
  }
}

interface SpotNetworkCommand {
  topic: 'cmd.spot.network.configure'
  payload: {
    envId: string
    ingressRules: IngressRule[]
    serviceLB?: LoadBalancerConfig
    networkPolicies?: NetworkPolicy[]
    tls: { enabled: boolean, issuer?: string }
    dns: { records: DNSRecord[] }
  }
}

interface SpotScaleCommand {
  topic: 'cmd.spot.scale'
  payload: {
    envId: string
    replicas?: number
    hpa?: HPAConfig
  }
}
```

### Emitted Events

```typescript
interface ProvisionedEvent {
  topic: 'evt.provisioned'
  payload: {
    envId: string
    platform: 'rxt-spot'
    resourceIds: {
      namespace: string
      clusterId: string
      quota: string
    }
    endpoints: {
      kubeconfig: string
      apiServer: string
    }
  }
}

interface PodCreatedEvent {
  topic: 'evt.spot.pod.created'
  payload: {
    podId: string
    deploymentId: string
    envId: string
    image: string
    status: 'Pending' | 'Running' | 'Failed'
  }
}

interface IngressConfiguredEvent {
  topic: 'evt.spot.ingress.configured'
  payload: {
    ingressId: string
    hostname: string
    envId: string
    tlsEnabled: boolean
  }
}

interface UsageSampleEvent {
  topic: 'evt.usage.sample'
  payload: {
    envId: string
    platform: 'rxt-spot'
    timestamp: string
    cpu: number       // CPU cores used
    memory: number    // Memory in GB
    storage: number   // Storage in GB
    egressBytes: number
  }
}
```

---

## RXT SPOT API Integration

### Cluster Provisioning

When a new project is created, the SPOT Adapter may need to provision a dedicated cluster or namespace in a shared cluster.

**API Call:**
```bash
POST https://api.spot.rackspace.com/v1/clusters
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "my-api-production",
  "region": "us-east-1",
  "nodeCount": 3,
  "nodeType": "standard-4-8",  # 4 vCPU, 8GB RAM
  "autoscaling": {
    "enabled": true,
    "minNodes": 3,
    "maxNodes": 10
  },
  "networking": {
    "vpcId": "vpc-abc123",
    "subnets": ["subnet-1", "subnet-2"]
  }
}
```

**Response:**
```json
{
  "clusterId": "cluster_xyz789",
  "status": "provisioning",
  "apiServer": "https://k8s-api.us-east-1.spot.rackspace.com",
  "kubeconfig": "<base64-encoded-kubeconfig>"
}
```

### Node Scaling

**API Call:**
```bash
PATCH https://api.spot.rackspace.com/v1/clusters/{clusterId}/scale
Authorization: Bearer <token>
Content-Type: application/json

{
  "nodeCount": 5
}
```

---

## Helm Integration (Optional)

For applications that provide Helm charts, the SPOT Adapter can use Helm for deployment:

```bash
# Add artifact registry as Helm repo
helm repo add rxt-registry https://registry.rxt.cloud/helm

# Install chart
helm install my-api rxt-registry/my-api \
  --namespace my-api-production \
  --create-namespace \
  --set image.tag=sha-5dd2014 \
  --set resources.cpu=4 \
  --set resources.memory=8Gi \
  --set replicas=3 \
  --set ingress.enabled=true \
  --set ingress.hostname=api.example.com \
  --set ingress.tls=true
```

---

## Observability Integration

### Metrics Collection

The SPOT Adapter periodically queries Kubernetes Metrics API and emits usage samples:

```bash
# Query metrics
kubectl top pods -n my-api-production -l app=my-api --containers

# Emit usage event every 60 seconds
{
  "event": "evt.usage.sample",
  "envId": "env_abc123",
  "platform": "rxt-spot",
  "timestamp": "2025-10-21T20:30:00Z",
  "cpu": 8.2,
  "memory": 18.4,
  "storage": 45.2,
  "egressBytes": 1024000000
}
```

### Log Streaming

Logs are streamed from pods and forwarded to the Observability Bridge:

```bash
# Stream logs from all pods
kubectl logs -f -n my-api-production -l app=my-api --all-containers

# Forward to observability platform
# Logs are tagged with: envId, platform=rxt-spot, podName, containerName
```

---

## Error Handling & Retries

### Provision Failures

**Scenario:** Namespace creation fails due to quota limits
```json
{
  "event": "evt.provision.failed",
  "envId": "env_abc123",
  "platform": "rxt-spot",
  "reason": "Namespace quota exceeded",
  "retryable": false,
  "action": "Contact administrator to increase cluster quotas"
}
```

### Deployment Failures

**Scenario:** Pod fails to pull image
```json
{
  "event": "evt.deploy.failed",
  "envId": "env_abc123",
  "platform": "rxt-spot",
  "step": "image-pull",
  "reason": "ImagePullBackOff: registry authentication failed",
  "retryable": true,
  "retryAfter": 60
}
```

---

## Security Considerations

### RBAC

The SPOT Adapter uses a service account with limited permissions:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: rxt-deploy-spot-adapter
  namespace: rxt-deploy-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: rxt-deploy-spot-adapter
rules:
- apiGroups: [""]
  resources: ["namespaces", "secrets", "services", "pods"]
  verbs: ["create", "get", "list", "watch", "delete"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["create", "get", "list", "watch", "update", "delete"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["create", "get", "list", "watch", "delete"]
- apiGroups: ["autoscaling"]
  resources: ["horizontalpodautoscalers"]
  verbs: ["create", "get", "list", "watch", "update", "delete"]
```

### Network Policies

Enforce isolation between environments:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: my-api-production-isolation
  namespace: my-api-production
spec:
  podSelector:
    matchLabels:
      app: my-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to:
    - podSelector: {}
    ports:
    - protocol: TCP
      port: 5432  # Database
```

---

## Performance Considerations

### Caching

- **Kubeconfig caching**: Store kubeconfig in Redis for 1 hour TTL
- **Cluster metadata**: Cache cluster endpoints and capabilities
- **Manifest templates**: Pre-generate common manifests

### Batch Operations

For multi-environment deployments, batch Kubernetes API calls:

```bash
# Apply all manifests at once
kubectl apply -f - <<EOF
<namespace.yaml>
---
<deployment.yaml>
---
<service.yaml>
---
<ingress.yaml>
EOF
```

---

## Testing Strategy

### Unit Tests
- Manifest translation logic
- Resource quota calculations
- Event emission

### Integration Tests
- Kubernetes API mocking (using `kind` or `k3s`)
- End-to-end deployment workflows
- Rollback scenarios

### Load Tests
- 100 concurrent deployments
- 1000 pods across 50 namespaces
- API throttling behavior

---

## Reference Implementation

```typescript
// spot-adapter/src/index.ts
import { K8sClient } from './clients/kubernetes'
import { RXTSpotClient } from './clients/rxt-spot-api'
import { EventBus } from './messaging/event-bus'
import { ManifestTranslator } from './translators/manifest'

class RXTSpotAdapter implements IComputePlatform {
  private k8s: K8sClient
  private spotApi: RXTSpotClient
  private eventBus: EventBus
  private translator: ManifestTranslator

  async provisionEnvironment(spec: DeploySpec): Promise<EnvironmentResult> {
    const namespace = await this.k8s.createNamespace(spec)
    const quota = await this.k8s.createResourceQuota(spec)

    this.eventBus.emit('evt.provisioned', {
      envId: spec.envId,
      platform: 'rxt-spot',
      resourceIds: { namespace: namespace.name, quota: quota.name }
    })

    return { envId: spec.envId, status: 'ready' }
  }

  async deployApplication(envId: string, artifact: Artifact, config: AppConfig): Promise<DeploymentResult> {
    const manifests = this.translator.translate(config)

    await this.k8s.applyManifests(envId, manifests)

    const urls = await this.waitForIngress(envId)

    this.eventBus.emit('evt.deploy.ready', {
      envId,
      platform: 'rxt-spot',
      urls
    })

    return { envId, urls, status: 'deployed' }
  }

  // ... other methods
}
```

---

## Appendix: Platform Comparison

| Feature | SDDC Flex (VMs) | RXT SPOT (K8s) |
|---------|----------------|----------------|
| **Provisioning Unit** | Virtual Machine (vApp) | Pod/Container |
| **Networking** | NSX Load Balancer | Ingress Controller |
| **Scaling** | VM cloning | Pod replicas + HPA |
| **Storage** | vSphere Datastore | PersistentVolume |
| **TLS** | Manual NSX config | cert-manager automation |
| **Cold Start** | ~60-90 seconds | ~5-10 seconds |
| **Density** | Lower (VM overhead) | Higher (container efficiency) |
| **Best For** | Stateful, legacy apps | Cloud-native, microservices |

---

**End of RXT SPOT Adapter Specification**
