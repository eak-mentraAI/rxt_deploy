# Product Requirements Document

**Product Name:** RXT Deploy (Multi-Platform PaaS Layer)  
**Author:** Edward A. Kerr IV  
**Date:** October 2025  
**Version:** Draft v2.0 - Platform-Agnostic Architecture

---

## 1. Executive Summary

RXT Deploy is a **platform-agnostic**, developer-first PaaS layer designed to abstract infrastructure complexity across multiple Rackspace compute platforms. By providing a unified deployment experience regardless of underlying infrastructure, Deploy enables developers to push code and scale applications seamlessly—whether running on VMware-based SDDC Flex or Kubernetes-based RXT SPOT.

This modular architecture positions Rackspace to compete in the "Developer Cloud" category while maximizing infrastructure utilization across our diverse platform portfolio. Developers get the simplicity of Vercel or Render, while Rackspace maintains control, compliance, and flexibility to optimize workload placement.

### Key Architectural Principle: **Platform Abstraction**

RXT Deploy treats compute platforms as **pluggable backends**. The same deployment workflow, API, and user experience works across:
- **SDDC Flex** (VMware Cloud Foundation with vCenter/NSX)
- **RXT SPOT** (Kubernetes-based container platform)
- **Future platforms** (bare metal, serverless, edge)

---

## 2. Problem Statement

Current challenges:
1. **SDDC Flex** requires deep VMware expertise, limiting developer adoption
2. **RXT SPOT** and SDDC Flex have different deployment workflows, creating friction
3. **No unified platform** for workload portability or optimization across infrastructure types
4. **Developer experience** is inconsistent across Rackspace products

Customers need:
- **One deployment experience** regardless of infrastructure
- **Workload portability** between VM-based and container-based platforms
- **Automatic optimization** to place workloads on the most appropriate platform
- **Simplified developer workflows** that abstract infrastructure details

Without this, Rackspace risks:
- Platform fragmentation and customer confusion
- Underutilization of infrastructure investments
- Loss of developer mindshare to integrated hyperscaler platforms

---

## 3. Goals & Objectives

| Goal | Objective / KPI |
|------|----------------|
| **Drive Multi-Platform Consumption** | Increase overall compute utilization by 20-30% across SDDC Flex and RXT SPOT within 12 months |
| **Developer Adoption** | Launch with 15+ internal teams and 8+ external design partners |
| **Platform Flexibility** | Support seamless workload migration between VM and container platforms |
| **Operational Efficiency** | Reduce platform-specific onboarding time by 70% |
| **Customer Experience** | Deliver push-to-deploy experience with <10min environment creation on either platform |
| **Future Extensibility** | Architecture supports adding new compute backends with <2 month integration time |

---

## 4. Target Users

| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Developers** | Build and deploy apps without infrastructure knowledge | Platform-agnostic workflows, Git integration, consistent APIs |
| **DevOps Engineers** | Manage environments and CI/CD across platforms | Infrastructure-as-code, workload portability, unified observability |
| **Platform Engineers** | Optimize cost and performance across infrastructure | Placement policies, resource utilization analytics, platform health |
| **IT Managers** | Govern multi-platform environments | Unified RBAC, compliance, cost visibility across all platforms |
| **Rackspace Delivery Teams** | Onboard customers to appropriate platforms | Template library, automated provisioning, usage analytics |

---

## 5. Market Context

- Customers demand **developer experience parity** with modern platforms (Vercel, Railway, Render)
- Multi-cloud and hybrid strategies require **workload portability**
- **Kubernetes adoption** is growing, but VM workloads remain prevalent
- **Regulated industries** need private PaaS with choice of infrastructure primitives
- Rackspace's **platform diversity** (SDDC Flex, RXT SPOT) is a strength if unified, or a weakness if fragmented

**Opportunity:** Be the first private cloud PaaS to offer seamless VM ↔ Container workload portability

---

## 6. Product Scope

### In-Scope

#### Core Platform Features
- **Unified API & UI** abstraction across compute platforms
- **Multi-platform runtime abstraction layer**
  - VM-based deployments (SDDC Flex + VMware Cloud Foundation)
  - Container-based deployments (RXT SPOT + Kubernetes)
- **Git integration** (GitHub, GitLab) with auto-deployments
- **Automated networking** (NSX for VMs, Ingress/LoadBalancer for K8s)
- **Unified observability** (metrics, logs, traces) regardless of platform
- **Cost dashboards** with cross-platform aggregation
- **Placement intelligence** to recommend optimal platform per workload

#### Platform-Specific Adapters
- **SDDC Flex Adapter:**
  - vCenter API integration for VM provisioning
  - NSX integration for networking and security
  - vApp templates and customization
- **RXT SPOT Adapter:**
  - Kubernetes API for pod/deployment management
  - Helm chart templating
  - Ingress controller integration

### Out-of-Scope (Phase 1)
- Multi-cloud deployments (AWS, Azure, GCP)
- Bare metal provisioning
- Custom CDN edge network
- Advanced autoscaling across platforms
- Serverless function deployments

---

## 7. Architectural Principles

### 1. Platform Agnosticism
The core deployment workflow is **platform-independent**. Developers describe *what* they want to deploy, not *how* it should run.

### 2. Pluggable Compute Backends
Platform adapters are modular and implement a standard interface:
```
IComputePlatform {
  provisionEnvironment(spec)
  deployApplication(artifact, config)
  scaleResources(envId, resources)
  getStatus(envId)
  destroyEnvironment(envId)
}
```

### 3. Unified Resource Model
Applications are described in a platform-neutral format (`deploy.yaml`). The platform adapter translates this to:
- **SDDC Flex**: vApp templates, VM specs, NSX rules
- **RXT SPOT**: Kubernetes manifests, Helm values, Ingress rules

### 4. Abstracted Networking
Networking concepts (load balancing, TLS, domains) are standardized:
- **SDDC Flex**: NSX Load Balancer, edge gateways
- **RXT SPOT**: Kubernetes Ingress, LoadBalancer services

### 5. Portable Observability
Logs, metrics, and traces are collected uniformly via agents/sidecars and exported to centralized observability platforms (Datadog, SL1).

### 6. Cost Attribution
Usage is tracked per environment/project regardless of platform, enabling unified billing and chargebacks.

---

## 8. Functional Requirements

| Feature | Description | Priority | Platform Support |
|---------|-------------|----------|-----------------|
| **API Gateway Layer** | Platform-agnostic orchestration API | P0 | Both |
| **Project Model** | Logical grouping of environments with billing | P0 | Both |
| **Platform Abstraction Layer** | Translates deploy specs to platform primitives | P0 | Both |
| **SDDC Flex Adapter** | vCenter/NSX integration for VM workloads | P0 | SDDC Flex |
| **RXT SPOT Adapter** | Kubernetes integration for container workloads | P0 | RXT SPOT |
| **GitOps Integration** | Git-based deployments via webhook | P0 | Both |
| **CLI & Web Portal** | Unified developer interface | P0 | Both |
| **Build System** | Docker-based builds for both platforms | P1 | Both |
| **Networking Automation** | Automated ingress, TLS, DNS | P1 | Both |
| **Observability Hooks** | Unified logging and metrics collection | P1 | Both |
| **Billing Metering Service** | Cross-platform usage attribution | P1 | Both |
| **RBAC & IAM** | Unified access control | P1 | Both |
| **Workload Placement Engine** | Recommend optimal platform per workload type | P2 | Both |
| **Live Migration** | Move workloads between platforms | P3 | Both |

---

## 9. Platform Adapter Architecture

### SDDC Flex Adapter (VM-Based)
**Target:** Traditional applications, stateful workloads, lift-and-shift migrations

**Integration Points:**
- vCenter API for VM lifecycle
- NSX for networking, load balancing, micro-segmentation
- vApp templates for application packaging
- Cloud-init for VM bootstrapping

**Deployment Flow:**
1. Translate `deploy.yaml` → vApp template + VM specs
2. Provision VMs via vCenter
3. Configure networking via NSX (LB, firewall rules, NAT)
4. Bootstrap application via cloud-init
5. Install observability agents (Datadog, Telegraf)
6. Register with DNS and provision TLS

### RXT SPOT Adapter (Kubernetes-Based)
**Target:** Cloud-native apps, microservices, stateless workloads

**Integration Points:**
- Kubernetes API for pod/deployment management
- Helm for application packaging
- Ingress controller for routing
- Persistent volumes for stateful storage

**Deployment Flow:**
1. Translate `deploy.yaml` → Kubernetes manifests
2. Create namespace + resource quotas
3. Deploy application via kubectl/Helm
4. Configure Ingress with TLS
5. Attach service mesh (optional)
6. Enable observability via sidecar injection

---

## 10. Unified Deployment Manifest

Developers use a **platform-neutral manifest** that adapts to the target infrastructure:

```yaml
# deploy.yaml
project: my-api
environments:
  - name: production
    # Platform hints (optional)
    platform:
      preference: auto  # auto | vm | container
      constraints:
        - compliance: pci-dss
        - persistence: required
    
    # Resources (abstracted)
    resources:
      cpu: 4
      memory: 8Gi
      storage: 50Gi
      replicas: 3
    
    # Build (Docker-based for both platforms)
    build:
      dockerfile: ./Dockerfile
      context: .
      args:
        NODE_ENV: production
    
    # Runtime
    run:
      command: node server.js
      ports:
        - name: http
          port: 3000
          protocol: TCP
    
    # Networking (platform-agnostic)
    networking:
      expose:
        - domain: api.example.com
          port: 3000
          tls: auto
      rules:
        - type: rate-limit
          requests: 1000
          window: 1m
    
    # Secrets
    secrets:
      - DATABASE_URL
      - API_SECRET_KEY
    
    # Health checks
    health:
      http:
        path: /health
        port: 3000
        interval: 30s
```

**Platform Adapter Behavior:**

**SDDC Flex:**
- Creates VM with 4 vCPU, 8GB RAM
- Provisions 50GB disk
- Deploys 3 VM instances behind NSX load balancer
- Runs Docker container inside VM
- Configures NSX firewall + rate limiting

**RXT SPOT:**
- Creates Kubernetes Deployment with 4 CPU, 8Gi memory
- Attaches 50Gi PersistentVolume
- Sets replicas: 3
- Creates Ingress with TLS
- Applies rate limit via Ingress annotation

---

## 11. Architecture Components

### Core Services (Platform-Agnostic)
1. **Deploy API Gateway**
   - REST + GraphQL API
   - Platform routing logic
   - Authentication/authorization

2. **Platform Abstraction Layer**
   - Interface definitions for compute backends
   - Deployment spec translation
   - Resource lifecycle management

3. **Orchestrator**
   - Workflow engine (Temporal/Airflow)
   - Cross-platform coordination
   - Rollback/recovery logic

4. **Build Service**
   - Docker-based builds
   - Multi-arch image support
   - Artifact registry

5. **Networking Controller**
   - Platform-agnostic DNS/TLS
   - Routing rule management
   - Certificate lifecycle

6. **Observability Bridge**
   - Unified log/metric collection
   - Datadog/SL1 integration
   - Cross-platform correlation

7. **Billing Adapter**
   - Usage metering per environment
   - Cross-platform cost aggregation
   - Integration with Undercloud/Quote Manager

### Platform Adapters
8. **SDDC Flex Adapter**
   - vCenter integration
   - NSX automation
   - VM lifecycle management

9. **RXT SPOT Adapter**
   - Kubernetes integration
   - Helm chart management
   - Pod lifecycle management

10. **Workload Placement Engine** (Future)
    - ML-based platform recommendations
    - Cost optimization
    - Performance profiling

---

## 12. Dependencies & Integrations

| System | Integration Purpose | SDDC Flex | RXT SPOT |
|--------|-------------------|-----------|----------|
| vCenter | VM orchestration | ✓ | ✗ |
| NSX | VM networking | ✓ | ✗ |
| Kubernetes API | Container orchestration | ✗ | ✓ |
| Helm | Package management | ✗ | ✓ |
| Docker Registry | Image storage | ✓ | ✓ |
| Undercloud API | Provisioning hooks | ✓ | ✓ |
| Datadog/SL1 | Observability | ✓ | ✓ |
| Rackspace Identity | Auth/RBAC | ✓ | ✓ |
| Quote Manager | Billing | ✓ | ✓ |
| Let's Encrypt | TLS automation | ✓ | ✓ |

---

## 13. Workload Placement Strategy

### Decision Matrix

| Workload Type | Recommended Platform | Rationale |
|--------------|---------------------|-----------|
| **Stateful databases** | SDDC Flex (VM) | Persistent storage, stable IPs |
| **Stateless APIs** | RXT SPOT (K8s) | Fast scaling, efficient resource usage |
| **Batch jobs** | RXT SPOT (K8s) | Ephemeral workloads, job scheduler |
| **Legacy apps** | SDDC Flex (VM) | Lift-and-shift, OS-level dependencies |
| **Microservices** | RXT SPOT (K8s) | Service mesh, sidecar injection |
| **Compliance-heavy** | SDDC Flex (VM) | Dedicated tenancy, NSX micro-segmentation |
| **High-throughput** | RXT SPOT (K8s) | Lower overhead, faster networking |

### Placement Hints

Developers can specify preferences in `deploy.yaml`:
```yaml
platform:
  preference: auto  # Let RXT Deploy decide
  # OR
  preference: vm    # Force SDDC Flex
  # OR
  preference: container  # Force RXT SPOT
  
  constraints:
    - compliance: pci-dss  # May require VM isolation
    - persistence: required # Favor VM for stable storage
    - scaling: aggressive  # Favor K8s for burst scaling
```

---

## 14. Migration & Portability

### VM → Container Migration Path
1. Application runs on SDDC Flex (VM)
2. Developer dockerizes application
3. RXT Deploy builds container image
4. Developer changes `platform.preference: container`
5. Next deployment provisions on RXT SPOT
6. DNS cutover with zero downtime
7. Old VM environment destroyed after soak period

### Container → VM Migration Path
1. Application runs on RXT SPOT (K8s)
2. RXT Deploy packages container as VM template
3. Developer changes `platform.preference: vm`
4. Next deployment provisions VM on SDDC Flex
5. Traffic shifted via load balancer
6. Kubernetes resources cleaned up

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Abstraction complexity** | High | Start with narrow use cases; iterate based on feedback |
| **Platform parity gaps** | Medium | Document feature matrix; provide escape hatches for platform-specific config |
| **Performance overhead** | Medium | Benchmark adapter latency; optimize critical paths |
| **Workload misplacement** | Medium | Conservative defaults; manual override options |
| **Migration failures** | High | Rollback automation; blue/green deployment support |
| **Cost unpredictability** | Medium | Cost estimation API; budget guardrails |

---

## 16. Success Metrics

### Business Metrics
- **30% increase** in total compute utilization (SDDC Flex + RXT SPOT) within 12 months
- **20+ customer workloads** deployed via RXT Deploy
- **70% reduction** in platform onboarding time

### Technical Metrics
- **<10 min** environment creation on either platform
- **<5% deployment failure rate** cross-platform
- **99.9% API uptime** for Deploy Gateway
- **100% cost attribution** accuracy

### User Satisfaction
- **80%+ positive** developer satisfaction (vs. direct platform usage)
- **<3 clicks** to deploy on any platform
- **<2 months** to add new compute backend

---

## 17. Phased Rollout

### Phase 1: Foundation (Months 1-3)
- ✅ Platform abstraction layer design
- ✅ SDDC Flex adapter (basic VM provisioning)
- ✅ RXT SPOT adapter (basic K8s deployments)
- ✅ Unified API + CLI
- ✅ Basic observability hooks

### Phase 2: Production-Ready (Months 4-6)
- Advanced networking (custom domains, TLS)
- Secrets management
- RBAC + multi-tenancy
- Usage dashboards + billing integration
- Template library

### Phase 3: Optimization (Months 7-9)
- Workload placement recommendations
- Cost optimization engine
- Live migration between platforms
- Advanced autoscaling

### Phase 4: Enterprise (Months 10-12)
- Compliance guardrails (PCI, HIPAA)
- Multi-region deployments
- Disaster recovery automation
- Advanced audit trails

---

## 18. Reference Documentation

- **Architectural XMind:** https://xmind.app/m/ysU8G5
- **Frontend Design Contract:** `/docs/RXT_Deploy_Design_Contract.md`
- **Frontend Architecture:** `/docs/RXT_FE_Architecture_v2.md`
- **API Specification:** TBD
- **Platform Adapter Interface:** TBD

---

## Appendix A: Platform Comparison

| Feature | SDDC Flex (VM) | RXT SPOT (K8s) | RXT Deploy Abstraction |
|---------|---------------|----------------|----------------------|
| **Provisioning** | vCenter API | kubectl apply | Unified API |
| **Networking** | NSX | Ingress | `networking:` block |
| **Scaling** | VM clones | Pod replicas | `replicas:` field |
| **Storage** | Datastore | PersistentVolume | `storage:` field |
| **Load Balancing** | NSX LB | Service LB | Auto-configured |
| **TLS** | Manual/NSX | cert-manager | `tls: auto` |
| **Observability** | Agent install | Sidecar injection | Unified |
| **Billing** | Per-VM | Per-pod | Per-environment |

---

**End of PRD v2.0**
