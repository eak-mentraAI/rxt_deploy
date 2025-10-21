# RXT Deploy Backend Implementation Epics

**Version:** 2.0 (Revised)
**Last Updated:** October 21, 2025
**Status:** Planning
**Aligned With:** PRD v2.0, microservice_arch.md, SPOT_shim.md

---

## Overview

This document tracks the implementation of the RXT Deploy backend platform. Each epic represents a major body of work that delivers a complete, deployable capability. Epics are organized by implementation phase and dependency order.

**Version 2.0 Updates:**
- Enforced adapter contract compliance with conformance tests
- Explicit event schema governance as blocking requirement
- Tighter MVP path focusing on SPOT first (8-10 weeks to working deploy)
- End-to-end idempotency and exactly-once semantics
- Multi-tenant isolation test requirements
- Operational readiness Go/No-Go gates per phase

**Progress Tracking:**
- ✅ Complete
- 🔄 In Progress
- ⏸️ Blocked
- ⏭️ Deferred
- ⬜ Not Started

---

## Revised MVP Strategy

**Core Principle:** Get to "hello world deploy" on RXT SPOT in 8-10 weeks by:
1. Scoping out Build Service initially (use GitHub Actions for artifacts)
2. Focus on Orchestrator + SPOT Adapter + SPOT Networking
3. Minimal but complete: Edge/API, Identity, Registry, Webhooks (minimal), Secrets, OPA-lite, Audit

**SDDC Flex Adapters** are built in parallel or deferred to Phase 3.

---

## Phase 1: Foundation & Core Platform (Month 1: Weeks 1-4)

### Epic 1.1: Infrastructure & DevOps Setup ⬜

**Goal:** Establish development, staging, and production environments with CI/CD pipelines.

**Acceptance Criteria:**
- [ ] Provision Kubernetes clusters for control plane services (dev, staging, prod)
- [ ] Set up container registry (Harbor/ECR) with vulnerability scanning
- [ ] Configure GitHub Actions CI/CD pipelines with multi-stage (build → test → deploy)
- [ ] Establish Terraform IaC repository with state backend (S3+DynamoDB or Terraform Cloud)
- [ ] Deploy monitoring stack (Prometheus, Grafana) with golden dashboards per service
- [ ] Set up centralized logging (ELK/Loki) with log retention policies
- [ ] Configure secrets management (Vault/AWS Secrets Manager) with per-tenant namespaces
- [ ] Establish database infrastructure (PostgreSQL primary + 2 replicas) with automated backups
- [ ] Deploy Redis cluster (3 nodes) for caching and idempotency storage
- [ ] Set up object storage (MinIO/S3) for artifacts, Rego bundles, WORM audit exports
- [ ] Configure VPN/network access to RXT SPOT (defer SDDC Flex for MVP)
- [ ] **NEW:** Create synthetic probe infrastructure for continuous health checks
- [ ] **NEW:** Establish on-call rotation and runbook repository

**Dependencies:** None
**Team:** DevOps, Platform Engineering
**Estimated Effort:** 3-4 weeks

**Go/No-Go Gate:**
- [ ] All control plane services deployed and healthy
- [ ] CI/CD pipeline successfully deploys test service
- [ ] Monitoring dashboards showing metrics from all infrastructure components
- [ ] Runbooks documented for infrastructure recovery scenarios

---

### Epic 1.2: Event Bus & Messaging Infrastructure ⬜

**Goal:** Deploy and configure event-driven messaging backbone (NATS/RabbitMQ) with schema governance.

**Acceptance Criteria:**
- [ ] Deploy NATS/RabbitMQ cluster with HA (3 nodes minimum)
- [ ] Define topic/queue naming conventions (cmd.*, evt.*, per-service routing)
- [ ] Implement dead-letter queue (DLQ) handling with retry backoff and max retries
- [ ] **NEW:** Create AsyncAPI schema registry with versioned event definitions
- [ ] **NEW:** Implement AsyncAPI validation in CI - producer builds fail on incompatible schema changes
- [ ] **NEW:** All events require `idempotencyKey`, `causationId`, `correlationId` fields
- [ ] Build event publishing library (TypeScript/Go) with automatic schema validation
- [ ] Build event consumption library with retry logic, DLQ routing, and deduplication
- [ ] Implement event replay capability from offset/timestamp
- [ ] Set up event monitoring (lag, DLQ size, throughput) and alerting
- [ ] **NEW:** Create sample payload fixtures for all event types
- [ ] Document event-first contracts (cmd.*, evt.*) in AsyncAPI format
- [ ] Create event bus testing utilities (local fake bus, contract test harness)
- [ ] **NEW:** Implement idempotency storage in Redis (key: idempotencyKey, TTL: 24h)

**Dependencies:** Epic 1.1
**Team:** Backend, Platform Engineering
**Estimated Effort:** 2-3 weeks

**Go/No-Go Gate:**
- [ ] Event schema registry operational with backward-compat checks
- [ ] Sample event published and consumed with deduplication verified
- [ ] DLQ tested with failed message routing
- [ ] Event replay verified from historical offset

---

### Epic 1.3: Identity & Access Service ⬜

**Goal:** Build authentication, authorization, and multi-tenancy foundation.

**Acceptance Criteria:**
- [ ] Design database schema (tenants, orgs, users, roles, permissions) with RLS policies
- [ ] Implement JWT token minting and verification with short TTL (15 min access, 7 day refresh)
- [ ] **NEW:** Implement service-to-service mTLS (SPIFFE or mutual TLS) across control plane
- [ ] Build SSO integration (SAML/OIDC) - optional for MVP, defer if needed
- [ ] Implement RBAC policy engine with default-deny
- [ ] Create API endpoints: `POST /orgs`, `POST /users`, `POST /invites`
- [ ] **NEW:** Implement Row-Level Security (RLS) toggle per table with default deny policies
- [ ] **NEW:** RLS optional for MVP but schema must support it
- [ ] Build middleware for request authentication with token refresh
- [ ] Implement API key management for service-to-service auth (rotate keys every 90 days)
- [ ] Create audit logging for all access changes (user created, role changed, etc.)
- [ ] Emit `evt.access.changed` events
- [ ] **NEW:** Write multi-tenant chaos tests: parallel operations across tenants, cross-tenant access attempts must fail
- [ ] Write integration tests with multiple tenants
- [ ] Document API contracts (OpenAPI) and RBAC model

**Dependencies:** Epic 1.1, Epic 1.2
**Team:** Backend, Security
**Estimated Effort:** 3-4 weeks (trimmed from 4-5 by deferring SSO for MVP)

**Go/No-Go Gate:**
- [ ] Multi-tenant isolation verified via chaos tests
- [ ] JWT auth flow working with refresh tokens
- [ ] RBAC denies unauthorized access attempts
- [ ] Audit log capturing all access changes

---

### Epic 1.4: Edge/API Gateway ⬜

**Goal:** Build unified API gateway with routing, rate limiting, idempotency, and request/response translation.

**Acceptance Criteria:**
- [ ] Deploy Kong/Tyk/custom gateway with 3+ replicas
- [ ] Implement request routing to backend services with health checks
- [ ] Configure rate limiting per tenant/API key (e.g., 1000 req/min)
- [ ] **NEW:** Implement idempotency key handling - propagate from edge → orchestrator → adapters
- [ ] **NEW:** Store idempotency keys in Redis (TTL: 24h) with response caching
- [ ] Build request validation middleware (schema validation, required headers)
- [ ] Implement CORS and security headers (CSP, HSTS, X-Frame-Options)
- [ ] Create health check endpoints (`/health`, `/ready`)
- [ ] Set up API versioning strategy (v1, v2 path prefixes)
- [ ] Implement request/response logging with correlation IDs
- [ ] Build event bridge (HTTP → event bus) for async operations
- [ ] Configure TLS termination with automated cert renewal
- [ ] **NEW:** Create OpenAPI documentation with examples
- [ ] Implement circuit breaker patterns (fail fast after 5 consecutive errors)
- [ ] **NEW:** Write realistic SLO tests: p95 < 250ms under 1k RPS, error budget 0.1%, soak test with production-like traffic replay

**Dependencies:** Epic 1.2, Epic 1.3
**Team:** Backend
**Estimated Effort:** 3-4 weeks

**Go/No-Go Gate:**
- [ ] Load test achieving p95 < 250ms at 1k RPS
- [ ] Idempotency verified: duplicate requests return cached response
- [ ] Circuit breaker activates under simulated downstream failure
- [ ] OpenAPI docs published and validated

---

### Epic 1.5: Project Registry Service ⬜

**Goal:** Build source of truth for projects, environments, and deployment manifests with versioning and immutability.

**Acceptance Criteria:**
- [ ] Design database schema (projects, environments, manifests, repos) with tenant isolation
- [ ] Implement project CRUD operations with RBAC checks
- [ ] Implement environment CRUD operations with RBAC checks
- [ ] **NEW:** Build manifest storage with content-addressable hashing (SHA-256)
- [ ] **NEW:** Manifest diffing: deployments always reference a content digest (immutable)
- [ ] **NEW:** Schema versioning for deploy.yaml - reject incompatible changes with clear error messages
- [ ] Create API endpoints: `POST /projects`, `PATCH /environments/:id`, `GET /manifests/:id`
- [ ] Implement manifest validation (deploy.yaml JSON schema)
- [ ] Build Git repository metadata storage (repo URL, branch, commit SHA)
- [ ] Emit `evt.project.created/updated` events with before/after diffs
- [ ] Consume `evt.repo.verified` events from VCS service
- [ ] Implement project deletion with cascade (soft delete with 30-day retention)
- [ ] Create project templates library (defer detailed templates to Phase 3)
- [ ] Write integration tests with manifest versioning scenarios
- [ ] Document API contracts (OpenAPI)

**Dependencies:** Epic 1.2, Epic 1.3
**Team:** Backend
**Estimated Effort:** 3-4 weeks

**Go/No-Go Gate:**
- [ ] Manifest content-addressable storage verified (same content = same digest)
- [ ] deploy.yaml schema validation rejecting invalid manifests
- [ ] Project deletion cascade tested with no orphaned resources
- [ ] API docs complete with manifest format examples

---

### Epic 1.6: Webhook & VCS Integration Service (Minimal for MVP) ⬜

**Goal:** Handle Git webhooks from GitHub and emit commit events (GitLab deferred).

**Acceptance Criteria:**
- [ ] Implement webhook receiver for GitHub only (GitLab in Phase 3)
- [ ] Build webhook signature verification (HMAC-SHA256)
- [ ] Implement event deduplication using Redis (key: delivery_id, TTL: 1h)
- [ ] Parse commit metadata (SHA, author, message, timestamp)
- [ ] Emit `evt.commit.pushed` events only (defer PR events for MVP)
- [ ] Store webhook history in PostgreSQL (last 1000 events per project)
- [ ] Build webhook retry mechanism (3 retries with exponential backoff)
- [ ] Implement branch filtering (only deploy from main/master/production branches)
- [ ] Create API: `POST /webhooks/github`
- [ ] Write integration tests with mock GitHub webhooks
- [ ] Document webhook setup guide with GitHub screenshot walkthrough

**Dependencies:** Epic 1.2, Epic 1.5
**Team:** Backend
**Estimated Effort:** 1-2 weeks (trimmed by focusing on GitHub only)

**Go/No-Go Gate:**
- [ ] GitHub webhook received and `evt.commit.pushed` emitted
- [ ] Signature verification blocks invalid webhooks
- [ ] Deduplication prevents duplicate events from retries
- [ ] Branch filtering working correctly

---

### Epic 1.7: Secrets Service ⬜

**Goal:** Secure storage, rotation, and short-lived credential distribution.

**Acceptance Criteria:**
- [ ] Integrate with Vault/AWS Secrets Manager with HA configuration
- [ ] Implement per-tenant namespacing in Vault (path: `rxt-deploy/{tenantId}/secrets/`)
- [ ] Build secret CRUD API: `POST /secrets`, `GET /secrets/:id`, `DELETE /secrets/:id`
- [ ] Implement secret rotation API: `POST /secrets/:id/rotate`
- [ ] **NEW:** Build short-lived kubeconfig issuance for SPOT deployments (TTL: 1h)
- [ ] **NEW:** Vault broker returns short-lived credentials only (no long-lived tokens stored)
- [ ] Create secret injection into deployments (environment variables, mounted files)
- [ ] Emit `evt.secret.rotated` events
- [ ] Implement secret access audit logging (who accessed which secret when)
- [ ] Build secret versioning (keep last 5 versions)
- [ ] Implement secret encryption at rest (AES-256-GCM)
- [ ] Write security tests (unauthorized access blocked, encryption verified)
- [ ] Document secret management best practices

**Dependencies:** Epic 1.1, Epic 1.3
**Team:** Backend, Security
**Estimated Effort:** 3-4 weeks

**Go/No-Go Gate:**
- [ ] Short-lived kubeconfig issued and expires correctly
- [ ] Secret access audit log capturing all reads
- [ ] Unauthorized cross-tenant access blocked
- [ ] Secret rotation tested and events emitted

---

### Epic 1.8: Audit Log Service ⬜

**Goal:** Immutable append-only audit trail for all mutating operations with integrity verification.

**Acceptance Criteria:**
- [ ] Design audit log schema (actor, action, object, timestamp, metadata, hash)
- [ ] Build event consumer that logs all `evt.*` events via event bus tap
- [ ] Implement write-only API (no updates/deletes - append only)
- [ ] Create query API: `GET /audit?object=...&actor=...&action=...&timeRange=...`
- [ ] Store logs in PostgreSQL with time-based partitioning (monthly)
- [ ] Export old logs (>90 days) to object storage (WORM mode)
- [ ] Implement log retention policies (7 years for compliance)
- [ ] **NEW:** Implement log integrity verification via hash chains (each record hashes previous record)
- [ ] Build compliance report generation (CSV/PDF export)
- [ ] Create audit log search UI (defer to Phase 3, API-only for MVP)
- [ ] Set up log forwarding to SIEM (optional for MVP)
- [ ] Write compliance tests (verify all mutations logged)
- [ ] Document audit log schema and query patterns

**Dependencies:** Epic 1.2
**Team:** Backend, Security
**Estimated Effort:** 2-3 weeks

**Go/No-Go Gate:**
- [ ] All mutating events captured in audit log
- [ ] Hash chain integrity verified (tampering detected)
- [ ] Query API returns filtered results correctly
- [ ] WORM export tested for old logs

---

## Phase 2: Platform Abstraction & Deployment Core (Month 2: Weeks 5-8)

### Epic 2.1: Provider Router & Contracts (formerly "Platform Abstraction Layer") ⬜

**Goal:** Define and enforce modular provider interface with conformance tests and capability discovery.

**Acceptance Criteria:**
- [ ] **NEW:** Create `@rxt/platform-sdk` package (TypeScript/Go) with:
  - [ ] `IComputePlatform` interface (provisionEnvironment, deployApplication, scaleResources, getStatus, destroyEnvironment)
  - [ ] Types: `ComputePlatform`, `ProvisionRequest`, `NetworkSpec`, `DeploymentOutcome`
  - [ ] AsyncAPI contracts for `cmd.*` and `evt.*` topics
  - [ ] **Contract test harness** with golden test fixtures
  - [ ] Local fake event bus for testing
- [ ] **NEW:** Define `provider.yaml` schema (name, version, capabilities, constraints)
- [ ] **NEW:** Build provider conformance suite: create/update/delete env, network, TLS, health checks
- [ ] **NEW:** Conformance suite runs in CI against each adapter (SPOT, SDDC Flex)
- [ ] Implement platform selection logic (auto, vm, container) with OPA pre-check
- [ ] Build manifest translation orchestration (deploy.yaml → platform-specific primitives)
- [ ] Create API: `POST /platforms/select`, `POST /deploy/translate`
- [ ] **NEW:** Implement capability discovery endpoint: `GET /providers/{id}/capabilities`
- [ ] Build adapter registry with dynamic loading (read providers from DB + signed bundles in object storage)
- [ ] **NEW:** Support hot-plug: enable/disable providers without redeployment
- [ ] Consume `cmd.deploy.apply` events
- [ ] Emit `cmd.sddc.*` or `cmd.spot.*` based on placement + policy
- [ ] Implement platform failover logic (if SPOT unavailable, try SDDC if allowed)
- [ ] Cache platform metadata and capabilities in Redis
- [ ] Create platform health probe endpoints
- [ ] Write unit tests for routing logic
- [ ] Document platform selection algorithm with decision tree

**Dependencies:** Epic 1.2, Epic 1.5, Epic 2.9 (OPA pre-check)
**Team:** Backend
**Estimated Effort:** 4-5 weeks

**Go/No-Go Gate:**
- [ ] Conformance suite passing for at least one provider (SPOT)
- [ ] `provider.yaml` loaded and capabilities exposed via API
- [ ] Platform selection correctly routes based on deploy.yaml preference
- [ ] Hot-plug tested: provider disabled without downtime

---

### Epic 2.2: Workload Placement Engine ⬜

**Goal:** Rules-based platform recommendation with compliance constraints and cost estimation.

**Acceptance Criteria:**
- [ ] Design decision matrix (stateful→VM, stateless→K8s, compliance→VM, etc.)
- [ ] Implement rules-based placement algorithm (Rego or custom logic)
- [ ] Parse deploy.yaml for placement hints (`platform.preference`, `platform.constraints`)
- [ ] Analyze workload characteristics (CPU, memory, persistence, scaling patterns)
- [ ] Create API: `POST /placement/recommend`, `GET /placement/explain/:envId`
- [ ] Implement compliance constraint evaluation (PCI-DSS→force VM, PII→specific regions)
- [ ] Build cost estimation integration (estimate VM cost vs K8s pod cost)
- [ ] **NEW:** Emit `evt.placement.recommended` with reasoning (why this platform was chosen)
- [ ] **NEW:** Placement recommendations **annotate** the deploy request; OPA admits/denies
- [ ] Cache placement decisions in Redis/PostgreSQL (invalidate on manifest change)
- [ ] Create placement override mechanism for operators
- [ ] Build placement analytics dashboard (defer to Phase 3, API-only for MVP)
- [ ] Write tests for all decision matrix branches
- [ ] Document placement strategy with examples

**Dependencies:** Epic 2.1, Epic 2.9 (OPA integration)
**Team:** Backend
**Estimated Effort:** 2-3 weeks (simplified to rules-only, defer ML to Phase 4)

**Go/No-Go Gate:**
- [ ] Placement logic correctly routes stateful workload to VM platform
- [ ] Compliance constraints enforced (PCI workload blocked from K8s)
- [ ] Cost estimation returns plausible values
- [ ] `explain` endpoint returns human-readable reasoning

---

### Epic 2.3: Orchestrator Service ⬜

**Goal:** Stateful workflow engine with saga pattern for deploy, rollback, destroy.

**Acceptance Criteria:**
- [ ] Deploy Temporal/custom workflow engine with HA (3+ workers)
- [ ] Design workflow state machine (receive deploy → placement → provision → build → deploy → verify)
- [ ] **NEW:** Implement deterministic workflow IDs keyed by (tenant, project, env, commit SHA)
- [ ] Implement saga pattern for compensating transactions (rollback on failure)
- [ ] **NEW:** Sagas emit compensation events with reason codes and stack traces
- [ ] **NEW:** Test saga reentrancy: kill orchestrator mid-deploy, restart, verify resume from checkpoint
- [ ] Build deployment workflow with rollback capability
- [ ] Build environment promotion workflow (staging → production)
- [ ] Build environment destruction workflow with confirmation
- [ ] Create API: `POST /workflows/:type/start`, `GET /workflows/:id`, `POST /workflows/:id/cancel`
- [ ] Store workflow states in PostgreSQL with event sourcing
- [ ] Consume `cmd.deploy.apply` events
- [ ] Emit `cmd.provision.*`, `cmd.network.*`, `evt.deploy.*`
- [ ] Implement workflow timeout (max 30 min) and retry logic with backoff
- [ ] **NEW:** Implement idempotency: same workflow ID + idempotency key returns existing workflow status
- [ ] Build workflow visualization UI (defer to Phase 3, API-only for MVP)
- [ ] Write saga integration tests with simulated failures at each step
- [ ] Document workflow state machines with Mermaid diagrams

**Dependencies:** Epic 1.2, Epic 2.1
**Team:** Backend
**Estimated Effort:** 5-6 weeks

**Go/No-Go Gate:**
- [ ] Deployment workflow completes successfully end-to-end
- [ ] Saga compensation tested: failure at step 3 triggers rollback of steps 2 and 1
- [ ] Workflow survives orchestrator restart (persistence verified)
- [ ] Idempotency verified: retried deploy returns existing workflow

---

### Epic 2.4: Build Service ⬜ **[DEFERRED FOR MVP]**

**Goal:** Docker-based build pipeline producing multi-arch images for both platforms.

**Status:** ⏭️ **Deferred - Use GitHub Actions for builds in MVP**

**Rationale:** To reach working deploy faster, rely on GitHub Actions to build and push Docker images. Developers provide pre-built image references. Build Service added in Phase 3 for integrated builds.

**MVP Alternative:**
- Developers push code to GitHub
- GitHub Actions workflow builds Docker image
- Image pushed to container registry
- Webhook triggers deployment with image reference

**Future Epic (Phase 3):** Internal build service for on-prem customers or integrated build logs.

**Dependencies:** Epic 1.2, Epic 1.6, Epic 1.7 (future)
**Team:** Backend
**Estimated Effort:** 4-5 weeks (when prioritized)

---

### Epic 2.5: SDDC Flex Adapter (VM Provisioning) ⬜ **[DEFERRED TO PHASE 3]**

**Status:** ⏭️ **Deferred - Build SPOT Adapter first for faster MVP**

**Rationale:** RXT SPOT (K8s) is faster to integrate and has better API ergonomics. SDDC Flex requires vCenter/NSX which adds complexity. Focus on SPOT for MVP (8-10 weeks), then add SDDC Flex in parallel workstream.

**Future Epic (Phase 3):** Integrate vCenter API and NSX for VM-based workloads.

**Dependencies:** Epic 1.1, Epic 1.2, Epic 2.3 (future)
**Team:** Backend, Infrastructure
**Estimated Effort:** 6-8 weeks (when prioritized)

---

### Epic 2.6: SDDC Networking Adapter (NSX) ⬜ **[DEFERRED TO PHASE 3]**

**Status:** ⏭️ **Deferred - Build SPOT Networking first**

**Rationale:** Tied to SDDC Flex Adapter. Defer to Phase 3.

**Dependencies:** Epic 1.2, Epic 2.5 (future)
**Team:** Backend, Networking
**Estimated Effort:** 5-6 weeks (when prioritized)

---

### Epic 2.7: RXT SPOT Adapter (Kubernetes Provisioning) ⬜ **[MVP PRIORITY]**

**Goal:** Integrate with Kubernetes API to provision container-based workloads on RXT SPOT with conformance to provider interface.

**Acceptance Criteria:**
- [ ] **NEW:** Implement `IComputePlatform` interface from `@rxt/platform-sdk`
- [ ] **NEW:** Pass provider conformance suite (Epic 2.1)
- [ ] **NEW:** Ship `provider.yaml` with capabilities: `platform: rxt-spot, compute: k8s, networking: ingress, storage: pvc`
- [ ] Implement Kubernetes API client (client-go) with credential broker
- [ ] Build namespace provisioning with resource quotas and limit ranges
- [ ] Implement Deployment manifest generation from deploy.yaml
- [ ] Create Service resources (ClusterIP, LoadBalancer)
- [ ] Configure PersistentVolumeClaim resources
- [ ] Implement HPA (Horizontal Pod Autoscaler) based on CPU/memory metrics
- [ ] Create API: `POST /spot/provision/check`
- [ ] Consume `cmd.spot.provision.*` events with idempotency key handling
- [ ] Emit `evt.provisioned`, `evt.provision.failed` events
- [ ] Emit `evt.spot.pod.created` platform-specific events
- [ ] **NEW:** Implement Kubernetes RBAC: least privilege service account per environment
- [ ] **NEW:** Kubeconfig broker returns short-lived credentials (TTL: 1h) via Secrets Service
- [ ] Implement pod lifecycle management (create, update, delete, restart)
- [ ] Build Helm chart deployment support (optional for MVP, raw manifests sufficient)
- [ ] **NEW:** Write integration tests with kind/k3s cluster (spin up local cluster in CI)
- [ ] **NEW:** Test idempotency: same provision request returns existing namespace
- [ ] Document Kubernetes integration (alignment with SPOT_shim.md)

**Dependencies:** Epic 1.1, Epic 1.2, Epic 2.1, Epic 2.3
**Team:** Backend
**Estimated Effort:** 4-5 weeks

**Go/No-Go Gate:**
- [ ] Conformance suite passing for SPOT adapter
- [ ] Namespace created with pods running
- [ ] Kubeconfig short-lived credentials working
- [ ] Idempotency verified: duplicate provision returns existing resources
- [ ] Integration tests green on CI with kind cluster

---

### Epic 2.8: SPOT Networking Adapter (K8s Ingress) ⬜ **[MVP PRIORITY]**

**Goal:** Configure Ingress controllers, LoadBalancers, TLS, and network policies for RXT SPOT.

**Acceptance Criteria:**
- [ ] **NEW:** Implement `IComputePlatform` networking methods
- [ ] **NEW:** Pass network conformance tests (TLS, domain routing, network policies)
- [ ] Implement Ingress resource creation (NGINX or Traefik ingress controller)
- [ ] Build LoadBalancer service configuration (L4 load balancing)
- [ ] Integrate cert-manager for TLS automation (Let's Encrypt ACME)
- [ ] Configure DNS record management (Route53, Cloudflare, or manual)
- [ ] **NEW:** Implement network policies for tenant isolation (deny all ingress/egress by default, whitelist only)
- [ ] **NEW:** Write e2e tests verifying network policy enforcement (pod A cannot access pod B in different namespace)
- [ ] Create API: `POST /spot/network/validate`
- [ ] Consume `cmd.spot.network.*` events
- [ ] Emit `evt.network.ready/failed` events
- [ ] Emit `evt.spot.ingress.configured` platform-specific events
- [ ] Implement rate limiting via Ingress annotations (e.g., `nginx.ingress.kubernetes.io/rate-limit`)
- [ ] Build Ingress templates for common patterns (HTTP, gRPC, WebSocket)
- [ ] Write integration tests with Ingress controller in kind cluster
- [ ] Document Ingress configuration patterns and TLS setup

**Dependencies:** Epic 1.2, Epic 2.7
**Team:** Backend
**Estimated Effort:** 3-4 weeks

**Go/No-Go Gate:**
- [ ] Ingress created and serving HTTP traffic
- [ ] TLS certificate issued by cert-manager and HTTPS working
- [ ] Network policies tested: cross-namespace access denied
- [ ] Rate limiting verified via load test

---

### Epic 2.9: Policy Service (OPA Gatekeeper) ⬜

**Goal:** Admission and runtime policy evaluation as pre-check for Platform Abstraction Layer.

**Acceptance Criteria:**
- [ ] Deploy Open Policy Agent (OPA) with HA (3 replicas)
- [ ] Design Rego policy bundle structure (policies/, data/, tests/)
- [ ] **NEW:** Integrate OPA as pre-check for Platform Abstraction Layer (placement recommendations go to OPA for admit/deny)
- [ ] Implement policy evaluation API: `POST /evaluate`
- [ ] Build admission policies (TLS required, resource limits set, no public exposure for PCI workloads)
- [ ] Implement compliance policies (PCI-DSS→VM only, HIPAA→encryption at rest required)
- [ ] Store Rego bundles in object storage with versioning
- [ ] Emit `evt.policy.violation` events with policy name and reason
- [ ] Build policy testing framework (OPA test command in CI)
- [ ] Create policy override mechanism for break-glass scenarios (requires approval + audit log)
- [ ] Implement policy version control (bundle versioned with git SHA)
- [ ] Build policy violation dashboard (defer to Phase 3, API-only for MVP)
- [ ] Write policy unit tests for all rules
- [ ] Document policy authoring guide with examples

**Dependencies:** Epic 1.1, Epic 1.2
**Team:** Backend, Security
**Estimated Effort:** 3-4 weeks

**Go/No-Go Gate:**
- [ ] Policy evaluation blocking non-compliant deployments
- [ ] PCI workload blocked from K8s platform
- [ ] Policy violation events emitted and logged
- [ ] Policy tests passing in CI

---

## Phase 3: Observability & Operations (Month 3: Weeks 9-12)

### Epic 3.1: Observability Bridge ⬜

**Goal:** Unified log, metric, and trace collection from SPOT with golden dashboards.

**Acceptance Criteria:**
- [ ] Deploy observability agents (Datadog/Telegraf/OTEL) to SPOT clusters
- [ ] Implement pod log collection (RXT SPOT) with structured logging
- [ ] Build metric aggregation from Kubernetes metrics-server
- [ ] **NEW:** Create golden dashboards per service (RPS, p95 latency, 5xx rate, event bus lag, DLQ size, workflow states)
- [ ] **NEW:** Create unified dashboard showing deployment success/fail rate by platform
- [ ] Create API: `POST /dashboards`, `POST /annotations`
- [ ] Consume `evt.deploy.*` events for deployment annotations in Grafana/Datadog
- [ ] Emit `evt.obs.annotated` events
- [ ] Build cross-platform metric correlation (defer VM correlation to Phase 4)
- [ ] Implement distributed tracing (OpenTelemetry) for deployment workflows
- [ ] Create alert rule templates (deployment failures >5% over 1h, time-to-ready >12 min)
- [ ] Integrate with PagerDuty/Opsgenie for on-call alerts
- [ ] **NEW:** Set up synthetic deploy every 15 minutes; alert on failures
- [ ] Write observability integration tests
- [ ] **NEW:** Document runbooks: DLQ drain, stuck workflow retry, SPOT quota exceeded

**Dependencies:** Epic 1.2, Epic 2.7
**Team:** Backend, SRE
**Estimated Effort:** 4-5 weeks

**Go/No-Go Gate:**
- [ ] Golden dashboards showing live metrics from all services
- [ ] Synthetic deploy monitored and alerting on failures
- [ ] Deployment annotation visible in Grafana timeline
- [ ] Runbooks documented for top 5 incident scenarios

---

### Epic 3.2: Usage & Billing Service (Minimal for MVP) ⬜

**Goal:** SPOT usage sampling with cost estimation for early FinOps visibility.

**Acceptance Criteria:**
- [ ] Design usage rollup schema (CPU, memory, storage, egress) with platform field
- [ ] **NEW:** Implement usage sample collection from RXT SPOT pods (query metrics-server every 5 min)
- [ ] **NEW:** Estimate SPOT cost from node/pool pricing signals (cache public SPOT price API)
- [ ] Consume `evt.deploy.started/stopped` events to track billable time
- [ ] Consume `evt.usage.sample` events
- [ ] Build time-series rollup aggregation (hourly → daily → monthly)
- [ ] Create API: `GET /usage?tenant=...&project=...&timeRange=...`
- [ ] Emit `evt.usage.window.closed` events (hourly rollup completed)
- [ ] **NEW:** Implement reconciliation job: compare computed usage vs SPOT provider sources; alert on >2% divergence
- [ ] Integrate with Undercloud/Quote Manager (defer detailed billing integration to Phase 4)
- [ ] Build cost estimation API: `GET /cost/estimate?env=...`
- [ ] Create usage analytics dashboard (defer to Phase 4, API-only for MVP)
- [ ] Write billing reconciliation tests
- [ ] Document usage schema and cost estimation methodology

**Dependencies:** Epic 1.2, Epic 2.7
**Team:** Backend
**Estimated Effort:** 3-4 weeks (trimmed by deferring VM usage and detailed billing)

**Go/No-Go Gate:**
- [ ] Usage samples collected from SPOT pods
- [ ] Cost estimation returns plausible values
- [ ] Reconciliation job detects divergence in test scenario
- [ ] API returns usage data by tenant/project/time

---

### Epic 3.3: Domains Service ⬜ **[DEFERRED TO PHASE 4]**

**Status:** ⏭️ **Deferred - MVP uses Ingress hostnames without custom domains**

**Rationale:** Custom domain management adds complexity. MVP uses cluster-provided domains (e.g., `app-name.spot.rackspace.com`). Custom domains added in Phase 4.

---

### Epic 3.4: Notifications Service ⬜ **[DEFERRED TO PHASE 4]**

**Status:** ⏭️ **Deferred - Use basic email via SMTP for MVP**

**Rationale:** Build Slack/webhook integrations in Phase 5. MVP uses simple email notifications for deployment success/failure.

---

### Epic 3.5: Templates/Blueprints Service ⬜ **[DEFERRED TO PHASE 4]**

**Status:** ⏭️ **Deferred - MVP uses manual deploy.yaml authoring**

**Rationale:** Templates reduce time-to-value but aren't blocking for MVP. Add golden templates in Phase 4.

---

## Phase 4 & 5: Advanced Features (Months 4-9)

**[All Phase 4 and 5 epics remain as documented in v1.0, with updates noted below]**

### Key Updates to Phase 4 & 5:

- **Epic 2.5 & 2.6 (SDDC Flex Adapters):** Moved here from Phase 2
- **Epic 2.4 (Build Service):** Moved here from Phase 2
- **Epic 3.3 (Domains):** Moved here from Phase 3
- **Epic 3.4 (Notifications):** Enhanced Slack/webhook moved here
- **Epic 3.5 (Templates):** Moved here from Phase 3

**Additional Phase 4 Epics:**
- Implement full multi-platform Usage & Billing (SDDC + SPOT)
- Build live migration between platforms
- Add advanced autoscaling and cost optimization

**Additional Phase 5 Epics:**
- CLI tool with plugin system
- Terraform provider
- GitHub Actions / GitLab CI integrations
- Datadog deep integration
- Slack bot for ChatOps

---

## Revised MVP Critical Path (8-10 Weeks)

**Goal:** Working deploy to RXT SPOT with minimal but complete feature set

### Month 1 (Weeks 1-4): Foundation
1. Epic 1.1: Infrastructure
2. Epic 1.2: Event Bus with schema governance
3. Epic 1.3: Identity (defer SSO)
4. Epic 1.4: API Gateway with idempotency
5. **Spike:** Authenticate to SPOT, create namespace, get kubeconfig, verify `kubectl get nodes`

### Month 2 (Weeks 5-8): Platform Core
6. Epic 1.5: Project Registry
7. Epic 1.6: Webhooks (GitHub only)
8. Epic 2.1: Provider Router & Contracts
9. Epic 2.3: Orchestrator with deploy workflow only
10. Epic 2.7: SPOT Adapter
11. Epic 2.8: SPOT Networking
12. **Use GitHub Actions** for builds (no Build Service yet)

### Month 3 (Weeks 9-12): Ops Readiness
13. Epic 1.7: Secrets
14. Epic 1.8: Audit Log
15. Epic 2.2: Placement (rules-based)
16. Epic 2.9: Policy (OPA-lite)
17. Epic 3.1: Observability with golden dashboards
18. Epic 3.2: Usage (SPOT estimation only)

**Deliverable:** Push code → GitHub Actions builds image → Webhook triggers RXT Deploy → Orchestrator provisions SPOT namespace → Deploys pod → Configures Ingress with TLS → Returns URL

---

## Testing Strategy

### Contract Tests
- **Provider conformance suite** runs against SPOT (and eventually SDDC) adapter
- Tests run in CI against sandbox cluster
- Golden test fixtures for all `IComputePlatform` methods

### Chaos Tests
- **Multi-tenant isolation**: Parallel deploys across 10 tenants, verify no cross-contamination
- **Noisy neighbor**: One tenant consumes max quota, verify others unaffected
- **Orchestrator failure**: Kill orchestrator mid-deploy, verify resume after restart
- **Event bus partition**: Simulate NATS partition, verify DLQ and replay

### Security Tests
- **Tenancy isolation suite**: Token swapping attempts blocked, RBAC bypass attempts blocked, cross-namespace K8s access blocked
- **Secrets audit**: Verify all secret access logged
- **Network policy enforcement**: Pod A in tenant 1 cannot reach pod B in tenant 2

### Performance Tests
- **Sustained deploy throughput**: 50 concurrent deployments with <2% failures
- **Time-to-ready**: p95 < 10 minutes from webhook to healthy pod
- **API latency**: p95 < 250ms under 1k RPS

---

## Operational Readiness Gates (Go/No-Go per Phase)

### Phase 1 Gate (Foundation)
- [ ] All control plane services healthy and monitored
- [ ] Event schema registry enforcing validation
- [ ] Multi-tenant isolation verified via chaos tests
- [ ] Idempotency working end-to-end (edge → services)
- [ ] Runbooks documented for top 5 infrastructure scenarios

### Phase 2 Gate (Platform Core)
- [ ] Provider conformance suite passing for SPOT adapter
- [ ] End-to-end deploy working (code → webhook → deploy → URL)
- [ ] Saga compensation tested (rollback on failure)
- [ ] Network policies enforced (cross-tenant isolation verified)
- [ ] Synthetic deploy monitored and alerting

### Phase 3 Gate (Ops Readiness)
- [ ] Golden dashboards showing all service metrics
- [ ] On-call rotation established with runbooks
- [ ] Policy violations blocking non-compliant deploys
- [ ] Usage data accurate within 2% of SPOT provider
- [ ] Audit log integrity verified (hash chains)

---

## Documentation & Developer Experience

**Required Deliverables:**
- [ ] **OpenAPI** for Edge/API (all endpoints documented with examples)
- [ ] **AsyncAPI** for event bus (all event schemas versioned)
- [ ] **provider.yaml** spec documented with examples
- [ ] **Postman collection** for MVP SPOT path (end-to-end flow)
- [ ] **Sample app** with deploy.yaml demonstrating placement hints and policy evaluation
- [ ] **Runbooks** for top 10 operational scenarios

---

## Updated Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| vCenter/NSX API instability | High | Deferred to Phase 3; SPOT first reduces risk |
| Kubernetes version compatibility | Medium | Test against K8s 1.25-1.29; use stable APIs only |
| Event bus message loss | High | DLQ, replay, idempotent consumers, monitoring |
| Platform adapter performance | Medium | Load tests, caching, parallel operations |
| Cost tracking accuracy | High | Reconciliation jobs (2% threshold), audit trails |
| Multi-tenancy data leaks | **Critical** | RLS, chaos tests, security tests, penetration tests |
| **Adapter drift** | Medium | **Conformance suite** catches divergence in CI |
| **Price signal volatility (SPOT)** | Medium | **Cache + percentile-based guardrails** |
| **Auth token sprawl** | High | **Vault broker + short-lived tokens only** |

---

## Success Criteria

**Technical:**
- [ ] Deploy to RXT SPOT from unified manifest
- [ ] <10 min environment creation time (p95)
- [ ] <2% deployment failure rate (after retries)
- [ ] 99.9% API uptime
- [ ] Usage accuracy within 2% of provider data

**Business:**
- [ ] 10+ internal teams onboarded to SPOT
- [ ] 5+ external design partners
- [ ] 20% increase in RXT SPOT utilization
- [ ] 70% reduction in SPOT onboarding time

---

**Version:** 2.0 (Revised)
**Last Updated:** October 21, 2025
**Next Review:** Weekly during active development
