# RXT Deploy Backend Implementation Epics

**Version:** 1.0
**Last Updated:** October 21, 2025
**Status:** Planning
**Aligned With:** PRD v2.0, microservice_arch.md, SPOT_shim.md

---

## Overview

This document tracks the implementation of the RXT Deploy backend platform. Each epic represents a major body of work that delivers a complete, deployable capability. Epics are organized by implementation phase and dependency order.

**Progress Tracking:**
- ✅ Complete
- 🔄 In Progress
- ⏸️ Blocked
- ⏭️ Deferred
- ⬜ Not Started

---

## Phase 1: Foundation & Core Platform (Months 1-3)

### Epic 1.1: Infrastructure & DevOps Setup ⬜

**Goal:** Establish development, staging, and production environments with CI/CD pipelines.

**Acceptance Criteria:**
- [ ] Provision Kubernetes clusters for control plane services
- [ ] Set up container registry (Harbor/ECR)
- [ ] Configure GitHub Actions CI/CD pipelines
- [ ] Establish Terraform IaC repository
- [ ] Deploy monitoring stack (Prometheus, Grafana)
- [ ] Set up centralized logging (ELK/Loki)
- [ ] Configure secrets management (Vault/AWS Secrets Manager)
- [ ] Establish database infrastructure (PostgreSQL primary + replicas)
- [ ] Deploy Redis cluster for caching
- [ ] Set up object storage (MinIO/S3)
- [ ] Configure VPN/network access to SDDC Flex and RXT SPOT

**Dependencies:** None
**Team:** DevOps, Platform Engineering
**Estimated Effort:** 3-4 weeks

---

### Epic 1.2: Event Bus & Messaging Infrastructure ⬜

**Goal:** Deploy and configure event-driven messaging backbone (NATS/RabbitMQ).

**Acceptance Criteria:**
- [ ] Deploy NATS/RabbitMQ cluster with HA
- [ ] Define topic/queue naming conventions
- [ ] Implement dead-letter queue (DLQ) handling
- [ ] Create event schema registry
- [ ] Build event publishing library (TypeScript/Go)
- [ ] Build event consumption library with retry logic
- [ ] Implement event replay capability
- [ ] Set up event monitoring and alerting
- [ ] Document event-first contracts (cmd.*, evt.*)
- [ ] Create event bus testing utilities

**Dependencies:** Epic 1.1
**Team:** Backend, Platform Engineering
**Estimated Effort:** 2-3 weeks

---

### Epic 1.3: Identity & Access Service ⬜

**Goal:** Build authentication, authorization, and multi-tenancy foundation.

**Acceptance Criteria:**
- [ ] Design database schema (tenants, orgs, users, roles, permissions)
- [ ] Implement JWT token minting and verification
- [ ] Build SSO integration (SAML/OIDC)
- [ ] Implement RBAC policy engine
- [ ] Create API endpoints: `POST /orgs`, `POST /users`, `POST /invites`
- [ ] Implement Row-Level Security (RLS) in PostgreSQL
- [ ] Build middleware for request authentication
- [ ] Implement API key management for service-to-service auth
- [ ] Create audit logging for access changes
- [ ] Emit `evt.access.changed` events
- [ ] Write integration tests with multiple tenants
- [ ] Document API contracts and RBAC model

**Dependencies:** Epic 1.1, Epic 1.2
**Team:** Backend, Security
**Estimated Effort:** 4-5 weeks

---

### Epic 1.4: Edge/API Gateway ⬜

**Goal:** Build unified API gateway with routing, rate limiting, and request/response translation.

**Acceptance Criteria:**
- [ ] Deploy Kong/Tyk/custom gateway
- [ ] Implement request routing to backend services
- [ ] Configure rate limiting per tenant/API key
- [ ] Implement idempotency key handling
- [ ] Build request validation middleware
- [ ] Implement CORS and security headers
- [ ] Create health check endpoints
- [ ] Set up API versioning strategy
- [ ] Implement request/response logging
- [ ] Build event bridge (HTTP → event bus)
- [ ] Configure TLS termination
- [ ] Create API documentation (OpenAPI/Swagger)
- [ ] Implement circuit breaker patterns
- [ ] Write load tests (10k req/sec target)

**Dependencies:** Epic 1.2, Epic 1.3
**Team:** Backend
**Estimated Effort:** 3-4 weeks

---

### Epic 1.5: Project Registry Service ⬜

**Goal:** Build source of truth for projects, environments, and deployment manifests.

**Acceptance Criteria:**
- [ ] Design database schema (projects, environments, manifests, repos)
- [ ] Implement project CRUD operations
- [ ] Implement environment CRUD operations
- [ ] Build manifest storage and versioning
- [ ] Create API endpoints: `POST /projects`, `PATCH /environments/:id`, `GET /manifests/:id`
- [ ] Implement manifest validation (deploy.yaml schema)
- [ ] Build Git repository metadata storage
- [ ] Emit `evt.project.created/updated` events
- [ ] Consume `evt.repo.verified` events
- [ ] Implement project deletion with cascade
- [ ] Create project templates library
- [ ] Write integration tests
- [ ] Document API contracts

**Dependencies:** Epic 1.2, Epic 1.3
**Team:** Backend
**Estimated Effort:** 3-4 weeks

---

### Epic 1.6: Webhook & VCS Integration Service ⬜

**Goal:** Handle Git webhooks from GitHub/GitLab and emit commit events.

**Acceptance Criteria:**
- [ ] Implement webhook receivers for GitHub/GitLab
- [ ] Build webhook signature verification
- [ ] Implement event deduplication (Redis)
- [ ] Parse commit metadata and PR details
- [ ] Emit `evt.commit.pushed`, `evt.pr.opened` events
- [ ] Store webhook history in PostgreSQL
- [ ] Build webhook retry mechanism
- [ ] Implement branch filtering (only deploy main/prod)
- [ ] Create API: `POST /webhooks/github`, `POST /webhooks/gitlab`
- [ ] Handle webhook payload variations (push, PR, tag)
- [ ] Build admin UI for webhook debugging
- [ ] Write integration tests with mock Git events
- [ ] Document webhook setup guide

**Dependencies:** Epic 1.2, Epic 1.5
**Team:** Backend
**Estimated Effort:** 2-3 weeks

---

### Epic 1.7: Secrets Service ⬜

**Goal:** Secure storage, rotation, and distribution of secrets to applications.

**Acceptance Criteria:**
- [ ] Integrate with Vault/AWS Secrets Manager
- [ ] Implement per-tenant namespacing in Vault
- [ ] Build secret CRUD API: `POST /secrets`, `GET /secrets/:id`, `DELETE /secrets/:id`
- [ ] Implement secret rotation API: `POST /secrets/:id/rotate`
- [ ] Build short-lived credential issuance for runners
- [ ] Create secret injection into deployments (env vars)
- [ ] Emit `evt.secret.rotated` events
- [ ] Implement secret access audit logging
- [ ] Build secret versioning and rollback
- [ ] Create CLI commands for secret management
- [ ] Implement secret encryption at rest (AES-256)
- [ ] Write security tests (unauthorized access, encryption)
- [ ] Document secret management best practices

**Dependencies:** Epic 1.1, Epic 1.3
**Team:** Backend, Security
**Estimated Effort:** 3-4 weeks

---

### Epic 1.8: Audit Log Service ⬜

**Goal:** Immutable append-only audit trail for all mutating operations.

**Acceptance Criteria:**
- [ ] Design audit log schema (actor, action, object, timestamp, metadata)
- [ ] Build event consumer that logs all `evt.*` events
- [ ] Implement write-only API (no updates/deletes)
- [ ] Create query API: `GET /audit?object=...&actor=...`
- [ ] Store logs in PostgreSQL with partitioning
- [ ] Export old logs to object storage (WORM)
- [ ] Implement log retention policies
- [ ] Build compliance report generation
- [ ] Create audit log search UI
- [ ] Implement log integrity verification (hash chains)
- [ ] Set up log forwarding to SIEM
- [ ] Write compliance tests
- [ ] Document audit log schema and queries

**Dependencies:** Epic 1.2
**Team:** Backend, Security
**Estimated Effort:** 2-3 weeks

---

## Phase 2: Platform Abstraction & Deployment Core (Months 2-4)

### Epic 2.1: Platform Abstraction Layer ⬜

**Goal:** Route deployment requests to correct platform adapter (SDDC Flex vs RXT SPOT).

**Acceptance Criteria:**
- [ ] Define `IComputePlatform` interface in TypeScript/Go
- [ ] Implement platform selection logic (auto, vm, container)
- [ ] Build manifest translation orchestration
- [ ] Create API: `POST /platforms/select`, `POST /deploy/translate`
- [ ] Implement platform capability detection
- [ ] Build adapter registry and dynamic loading
- [ ] Consume `cmd.deploy.apply` events
- [ ] Emit `cmd.sddc.*` or `cmd.spot.*` based on selection
- [ ] Implement platform failover logic
- [ ] Cache platform metadata in Redis
- [ ] Create platform health checks
- [ ] Write unit tests for routing logic
- [ ] Document platform selection algorithm

**Dependencies:** Epic 1.2, Epic 1.5
**Team:** Backend
**Estimated Effort:** 4-5 weeks

---

### Epic 2.2: Workload Placement Engine ⬜

**Goal:** Intelligent platform recommendation based on workload characteristics.

**Acceptance Criteria:**
- [ ] Design decision matrix (stateful→VM, stateless→K8s, etc.)
- [ ] Implement rules-based placement algorithm
- [ ] Parse deploy.yaml for placement hints
- [ ] Analyze workload characteristics (CPU, memory, persistence)
- [ ] Create API: `POST /placement/recommend`, `GET /placement/explain/:envId`
- [ ] Implement compliance constraint evaluation (PCI-DSS→VM)
- [ ] Build cost estimation integration
- [ ] Emit `evt.placement.recommended` with reasoning
- [ ] Cache placement decisions in Redis/PostgreSQL
- [ ] Create placement override mechanism
- [ ] Build placement analytics dashboard
- [ ] Write tests for decision matrix
- [ ] Document placement strategy

**Dependencies:** Epic 2.1
**Team:** Backend
**Estimated Effort:** 3-4 weeks

---

### Epic 2.3: Orchestrator Service ⬜

**Goal:** Stateful workflow engine for deploy, rollback, promote, destroy operations.

**Acceptance Criteria:**
- [ ] Deploy Temporal/Airflow/custom workflow engine
- [ ] Design workflow state machine (provision→build→deploy→verify)
- [ ] Implement saga pattern for compensating transactions
- [ ] Build deployment workflow with rollback
- [ ] Build environment promotion workflow
- [ ] Build environment destruction workflow
- [ ] Create API: `POST /workflows/:type/start`, `GET /workflows/:id`
- [ ] Store workflow states in PostgreSQL
- [ ] Consume `cmd.deploy.apply` events
- [ ] Emit `cmd.provision.*`, `cmd.network.*`, `evt.deploy.*`
- [ ] Implement workflow timeout and retry logic
- [ ] Build workflow visualization UI
- [ ] Write saga integration tests
- [ ] Document workflow state machines

**Dependencies:** Epic 1.2, Epic 2.1
**Team:** Backend
**Estimated Effort:** 5-6 weeks

---

### Epic 2.4: Build Service ⬜

**Goal:** Docker-based build pipeline producing multi-arch images for both platforms.

**Acceptance Criteria:**
- [ ] Implement Docker build orchestration
- [ ] Support Dockerfile builds from Git repos
- [ ] Build multi-arch images (amd64, arm64)
- [ ] Push artifacts to container registry
- [ ] Create API: `POST /builds`, `GET /builds/:id/logs`
- [ ] Consume `evt.commit.pushed` events
- [ ] Emit `evt.build.succeeded/failed` events
- [ ] Stream build logs in real-time (WebSocket/SSE)
- [ ] Implement build caching for faster builds
- [ ] Store build artifacts in MinIO/S3
- [ ] Build layer caching and optimization
- [ ] Implement build isolation per tenant
- [ ] Write build performance tests
- [ ] Document Dockerfile best practices

**Dependencies:** Epic 1.2, Epic 1.6, Epic 1.7
**Team:** Backend
**Estimated Effort:** 4-5 weeks

---

### Epic 2.5: SDDC Flex Adapter (VM Provisioning) ⬜

**Goal:** Integrate with vCenter/NSX to provision VM-based workloads.

**Acceptance Criteria:**
- [ ] Implement vCenter API client (govc/govmomi)
- [ ] Build vApp template management
- [ ] Implement VM provisioning from templates
- [ ] Configure VM specs (CPU, memory, storage)
- [ ] Implement cloud-init bootstrapping
- [ ] Install Docker runtime on VMs
- [ ] Deploy container images inside VMs
- [ ] Create API: `POST /sddc/provision/check`
- [ ] Consume `cmd.sddc.provision.*` events
- [ ] Emit `evt.provisioned`, `evt.provision.failed` events
- [ ] Emit `evt.sddc.vm.created` platform-specific events
- [ ] Implement VM lifecycle management (start, stop, destroy)
- [ ] Write integration tests with vCenter mock
- [ ] Document vCenter integration

**Dependencies:** Epic 1.1, Epic 1.2, Epic 2.3
**Team:** Backend, Infrastructure
**Estimated Effort:** 6-8 weeks

---

### Epic 2.6: SDDC Networking Adapter (NSX) ⬜

**Goal:** Configure NSX load balancers, firewall rules, and TLS for SDDC Flex.

**Acceptance Criteria:**
- [ ] Implement NSX API client
- [ ] Build NSX load balancer configuration
- [ ] Implement firewall rule creation
- [ ] Configure micro-segmentation for isolation
- [ ] Implement DNS record management
- [ ] Build TLS certificate provisioning (Let's Encrypt)
- [ ] Create API: `POST /sddc/network/validate`
- [ ] Consume `cmd.sddc.network.*` events
- [ ] Emit `evt.network.ready/failed` events
- [ ] Emit `evt.sddc.nsx.configured` platform-specific events
- [ ] Implement rate limiting via NSX
- [ ] Build network policy templates
- [ ] Write integration tests with NSX mock
- [ ] Document NSX integration

**Dependencies:** Epic 1.2, Epic 2.5
**Team:** Backend, Networking
**Estimated Effort:** 5-6 weeks

---

### Epic 2.7: RXT SPOT Adapter (Kubernetes Provisioning) ⬜

**Goal:** Integrate with Kubernetes API to provision container-based workloads.

**Acceptance Criteria:**
- [ ] Implement Kubernetes API client (client-go)
- [ ] Build namespace provisioning with quotas
- [ ] Implement Deployment manifest generation
- [ ] Create Service and Ingress resources
- [ ] Configure PersistentVolume claims
- [ ] Implement HPA (Horizontal Pod Autoscaler)
- [ ] Create API: `POST /spot/provision/check`
- [ ] Consume `cmd.spot.provision.*` events
- [ ] Emit `evt.provisioned`, `evt.provision.failed` events
- [ ] Emit `evt.spot.pod.created` platform-specific events
- [ ] Implement pod lifecycle management
- [ ] Build Helm chart deployment support
- [ ] Write integration tests with kind/k3s
- [ ] Document Kubernetes integration (SPOT_shim.md alignment)

**Dependencies:** Epic 1.1, Epic 1.2, Epic 2.3
**Team:** Backend
**Estimated Effort:** 5-6 weeks

---

### Epic 2.8: SPOT Networking Adapter (K8s Ingress) ⬜

**Goal:** Configure Ingress controllers, LoadBalancers, and TLS for RXT SPOT.

**Acceptance Criteria:**
- [ ] Implement Ingress resource creation (NGINX/Traefik)
- [ ] Build LoadBalancer service configuration
- [ ] Integrate cert-manager for TLS automation
- [ ] Configure DNS record management
- [ ] Implement network policies for isolation
- [ ] Create API: `POST /spot/network/validate`
- [ ] Consume `cmd.spot.network.*` events
- [ ] Emit `evt.network.ready/failed` events
- [ ] Emit `evt.spot.ingress.configured` platform-specific events
- [ ] Implement rate limiting via Ingress annotations
- [ ] Build Ingress templates for common patterns
- [ ] Write integration tests with Ingress controller
- [ ] Document Ingress configuration patterns

**Dependencies:** Epic 1.2, Epic 2.7
**Team:** Backend
**Estimated Effort:** 3-4 weeks

---

### Epic 2.9: Policy Service (OPA Gatekeeper) ⬜

**Goal:** Admission and runtime policy evaluation for compliance and security.

**Acceptance Criteria:**
- [ ] Deploy Open Policy Agent (OPA)
- [ ] Design Rego policy bundle structure
- [ ] Implement policy evaluation API: `POST /evaluate`
- [ ] Build admission policies (TLS required, resource limits, etc.)
- [ ] Implement compliance policies (PCI-DSS, HIPAA)
- [ ] Store Rego bundles in object storage
- [ ] Emit `evt.policy.violation` events
- [ ] Build policy testing framework
- [ ] Create policy override mechanism for emergencies
- [ ] Implement policy version control
- [ ] Build policy violation dashboard
- [ ] Write policy unit tests
- [ ] Document policy authoring guide

**Dependencies:** Epic 1.1, Epic 1.2
**Team:** Backend, Security
**Estimated Effort:** 4-5 weeks

---

## Phase 3: Observability & Operations (Months 3-5)

### Epic 3.1: Observability Bridge ⬜

**Goal:** Unified log, metric, and trace collection from both platforms.

**Acceptance Criteria:**
- [ ] Deploy observability agents (Datadog/Telegraf/OTEL)
- [ ] Implement VM log collection (SDDC Flex)
- [ ] Implement pod log collection (RXT SPOT)
- [ ] Build metric aggregation from both platforms
- [ ] Create unified dashboard templates
- [ ] Create API: `POST /dashboards`, `POST /annotations`
- [ ] Consume `evt.deploy.*` events for annotations
- [ ] Emit `evt.obs.annotated` events
- [ ] Build cross-platform metric correlation
- [ ] Implement distributed tracing
- [ ] Create alert rule templates
- [ ] Integrate with PagerDuty/Opsgenie
- [ ] Write observability integration tests
- [ ] Document dashboard creation guide

**Dependencies:** Epic 1.2, Epic 2.5, Epic 2.7
**Team:** Backend, SRE
**Estimated Effort:** 4-5 weeks

---

### Epic 3.2: Usage & Billing Service ⬜

**Goal:** Cross-platform metering, aggregation, and billing export.

**Acceptance Criteria:**
- [ ] Design usage rollup schema (CPU, memory, storage, egress)
- [ ] Implement usage sample collection from SDDC Flex VMs
- [ ] Implement usage sample collection from RXT SPOT pods
- [ ] Consume `evt.deploy.started/stopped` events
- [ ] Consume `evt.usage.sample` events
- [ ] Build time-series rollup aggregation
- [ ] Create API: `GET /usage`, `POST /budgets`
- [ ] Emit `evt.usage.window.closed` events
- [ ] Integrate with Undercloud/Quote Manager
- [ ] Build cost estimation API
- [ ] Implement budget alerts and notifications
- [ ] Create usage analytics dashboard
- [ ] Write billing reconciliation tests
- [ ] Document billing model and pricing

**Dependencies:** Epic 1.2, Epic 2.5, Epic 2.7
**Team:** Backend
**Estimated Effort:** 5-6 weeks

---

### Epic 3.3: Domains Service ⬜

**Goal:** Domain-to-environment binding and ACME/TLS lifecycle management.

**Acceptance Criteria:**
- [ ] Design domain registry schema
- [ ] Implement domain CRUD operations
- [ ] Build domain validation (DNS TXT records)
- [ ] Integrate with ACME providers (Let's Encrypt)
- [ ] Create API: `POST /domains`, `POST /domains/:id/validate`
- [ ] Consume `cmd.domain.*` events
- [ ] Emit `evt.domain.valid/invalid` events
- [ ] Implement TLS certificate renewal automation
- [ ] Build wildcard domain support
- [ ] Implement domain ownership verification
- [ ] Create custom domain configuration UI
- [ ] Write domain validation tests
- [ ] Document domain setup guide

**Dependencies:** Epic 1.2, Epic 1.5
**Team:** Backend
**Estimated Effort:** 3-4 weeks

---

### Epic 3.4: Notifications Service ⬜

**Goal:** Multi-channel notification delivery (Email, Slack, Webhook) with retries.

**Acceptance Criteria:**
- [ ] Implement notification template engine
- [ ] Build email delivery (SMTP/SendGrid)
- [ ] Build Slack integration (webhooks)
- [ ] Build custom webhook delivery
- [ ] Create API: `POST /notify`
- [ ] Consume notable events (deploy success/failure, policy violations)
- [ ] Implement notification routing rules per user/org
- [ ] Build retry logic with exponential backoff
- [ ] Store notification history in PostgreSQL
- [ ] Implement notification preferences UI
- [ ] Build notification delivery reporting
- [ ] Write notification delivery tests
- [ ] Document notification configuration

**Dependencies:** Epic 1.2
**Team:** Backend
**Estimated Effort:** 2-3 weeks

---

### Epic 3.5: Templates/Blueprints Service ⬜

**Goal:** Golden templates and compliance-ready project blueprints.

**Acceptance Criteria:**
- [ ] Design template schema (frameworks, compliance variants)
- [ ] Build template CRUD API: `GET /templates`, `POST /templates`
- [ ] Create framework templates (Next.js, Django, Spring Boot, etc.)
- [ ] Create compliance templates (PCI-DSS, HIPAA, SOC2)
- [ ] Store templates in object storage
- [ ] Index templates in PostgreSQL
- [ ] Emit `evt.template.published` events
- [ ] Implement template versioning
- [ ] Build template preview/validation
- [ ] Create template marketplace UI
- [ ] Implement template forking
- [ ] Write template validation tests
- [ ] Document template authoring guide

**Dependencies:** Epic 1.1, Epic 1.2
**Team:** Backend
**Estimated Effort:** 3-4 weeks

---

### Epic 3.6: Runner Controller (Optional) ⬜

**Goal:** Manage CI/CD runner pools (shared/dedicated/ephemeral) for on-prem builds.

**Acceptance Criteria:**
- [ ] Design runner pool schema
- [ ] Implement runner provisioning (Docker/VM-based)
- [ ] Build runner lease management
- [ ] Create API: `POST /runners/pools`, `POST /runners/scale`
- [ ] Consume `cmd.runners.ensure` events
- [ ] Emit `evt.runners.ready` events
- [ ] Implement runner auto-scaling
- [ ] Build runner health monitoring
- [ ] Implement runner cleanup (ephemeral)
- [ ] Store runner metadata in PostgreSQL
- [ ] Use Redis for runner locks
- [ ] Write runner scaling tests
- [ ] Document runner setup guide

**Dependencies:** Epic 1.1, Epic 1.2, Epic 1.7
**Team:** Backend
**Estimated Effort:** 4-5 weeks
**Status:** ⏭️ Deferred (use external CI initially)

---

## Phase 4: Advanced Features & Optimization (Months 6-9)

### Epic 4.1: CLI Tool ⬜

**Goal:** Developer-friendly command-line interface for RXT Deploy.

**Acceptance Criteria:**
- [ ] Build CLI in Go/Rust with Cobra/Clap
- [ ] Implement authentication flow (OAuth device code)
- [ ] Create commands: `rxt init`, `rxt deploy`, `rxt logs`, `rxt scale`
- [ ] Implement project scaffolding
- [ ] Build interactive deployment wizard
- [ ] Implement log streaming from CLI
- [ ] Build shell completion (bash, zsh, fish)
- [ ] Implement configuration file management (.rxtrc)
- [ ] Create plugin system for extensibility
- [ ] Build update notification mechanism
- [ ] Package for multiple platforms (homebrew, apt, etc.)
- [ ] Write CLI integration tests
- [ ] Document CLI commands and usage

**Dependencies:** Epic 1.4
**Team:** Developer Experience
**Estimated Effort:** 5-6 weeks

---

### Epic 4.2: GraphQL API (Optional) ⬜

**Goal:** Flexible query API for frontend and integrations.

**Acceptance Criteria:**
- [ ] Deploy GraphQL server (Apollo/Hasura)
- [ ] Define schema for projects, environments, deployments
- [ ] Implement queries (projects, logs, metrics)
- [ ] Implement mutations (deploy, scale, rollback)
- [ ] Implement subscriptions (deployment status, logs)
- [ ] Build DataLoader for N+1 prevention
- [ ] Implement field-level authorization
- [ ] Create GraphQL playground
- [ ] Build query complexity limits
- [ ] Implement caching strategy
- [ ] Write GraphQL integration tests
- [ ] Document GraphQL schema

**Dependencies:** Epic 1.4
**Team:** Backend
**Estimated Effort:** 4-5 weeks
**Status:** ⏭️ Deferred (REST API sufficient initially)

---

### Epic 4.3: Live Migration Service ⬜

**Goal:** Migrate running workloads between SDDC Flex and RXT SPOT with minimal downtime.

**Acceptance Criteria:**
- [ ] Design migration workflow state machine
- [ ] Implement VM→Container migration orchestration
- [ ] Implement Container→VM migration orchestration
- [ ] Build data migration strategies (volumes, databases)
- [ ] Implement blue/green deployment for cutover
- [ ] Build DNS cutover automation
- [ ] Create API: `POST /migrations/start`, `GET /migrations/:id/status`
- [ ] Implement rollback capability
- [ ] Build migration dry-run mode
- [ ] Create migration validation checks
- [ ] Implement migration progress tracking
- [ ] Write migration integration tests
- [ ] Document migration playbooks

**Dependencies:** Epic 2.5, Epic 2.6, Epic 2.7, Epic 2.8
**Team:** Backend, SRE
**Estimated Effort:** 8-10 weeks
**Status:** ⏭️ Deferred to Phase 4

---

### Epic 4.4: Advanced Autoscaling ⬜

**Goal:** Intelligent autoscaling based on custom metrics and business logic.

**Acceptance Criteria:**
- [ ] Implement custom metric collection
- [ ] Build autoscaling decision engine
- [ ] Integrate with HPA (Kubernetes)
- [ ] Implement VM cloning for SDDC Flex scaling
- [ ] Build predictive scaling (ML-based)
- [ ] Create API: `POST /autoscaling/policies`, `GET /autoscaling/recommendations`
- [ ] Implement scaling cooldown periods
- [ ] Build cost-aware scaling policies
- [ ] Create autoscaling simulation mode
- [ ] Implement scaling event history
- [ ] Build autoscaling analytics dashboard
- [ ] Write autoscaling tests
- [ ] Document autoscaling strategies

**Dependencies:** Epic 2.5, Epic 2.7, Epic 3.1
**Team:** Backend, ML Engineering
**Estimated Effort:** 6-8 weeks
**Status:** ⏭️ Deferred to Phase 4

---

### Epic 4.5: Multi-Region Support ⬜

**Goal:** Deploy applications across multiple regions with automatic failover.

**Acceptance Criteria:**
- [ ] Design multi-region data replication
- [ ] Implement cross-region deployment orchestration
- [ ] Build global load balancing configuration
- [ ] Implement region affinity routing
- [ ] Create API: `POST /regions`, `GET /regions/:id/health`
- [ ] Build automatic region failover
- [ ] Implement data residency compliance
- [ ] Create multi-region cost optimization
- [ ] Build region health monitoring
- [ ] Implement cross-region deployment visualization
- [ ] Write multi-region integration tests
- [ ] Document multi-region architecture

**Dependencies:** Epic 2.3, Epic 2.5, Epic 2.7
**Team:** Backend, SRE
**Estimated Effort:** 10-12 weeks
**Status:** ⏭️ Deferred to Phase 4

---

### Epic 4.6: Disaster Recovery Automation ⬜

**Goal:** Automated backup, restore, and disaster recovery orchestration.

**Acceptance Criteria:**
- [ ] Implement automated environment snapshots
- [ ] Build backup scheduling and retention policies
- [ ] Implement cross-region backup replication
- [ ] Build point-in-time restore capability
- [ ] Create API: `POST /backups`, `POST /restore/:backupId`
- [ ] Implement disaster recovery runbooks as code
- [ ] Build disaster recovery testing automation
- [ ] Create RTO/RPO monitoring
- [ ] Implement backup encryption
- [ ] Build backup validation and verification
- [ ] Create disaster recovery dashboard
- [ ] Write disaster recovery tests
- [ ] Document DR procedures

**Dependencies:** Epic 2.5, Epic 2.7, Epic 4.5
**Team:** Backend, SRE
**Estimated Effort:** 6-8 weeks
**Status:** ⏭️ Deferred to Phase 4

---

### Epic 4.7: Cost Optimization Engine ⬜

**Goal:** Automated cost analysis and optimization recommendations.

**Acceptance Criteria:**
- [ ] Build resource utilization analysis
- [ ] Implement rightsizing recommendations
- [ ] Build idle resource detection
- [ ] Create reserved capacity optimization
- [ ] Implement spot instance recommendations (RXT SPOT)
- [ ] Create API: `GET /cost/analysis`, `GET /cost/recommendations`
- [ ] Build cost anomaly detection
- [ ] Implement budget forecasting
- [ ] Create cost allocation by team/project
- [ ] Build cost optimization automation (optional)
- [ ] Create cost optimization dashboard
- [ ] Write cost optimization tests
- [ ] Document cost optimization strategies

**Dependencies:** Epic 3.2
**Team:** Backend, FinOps
**Estimated Effort:** 5-6 weeks
**Status:** ⏭️ Deferred to Phase 4

---

### Epic 4.8: Compliance & Security Hardening ⬜

**Goal:** Enhanced compliance controls for regulated industries (PCI-DSS, HIPAA, SOC2).

**Acceptance Criteria:**
- [ ] Implement compliance policy packs (PCI, HIPAA, SOC2)
- [ ] Build compliance scanning and reporting
- [ ] Implement security posture monitoring
- [ ] Create vulnerability scanning integration
- [ ] Build compliance certification workflows
- [ ] Create API: `GET /compliance/status`, `POST /compliance/scan`
- [ ] Implement encryption at rest validation
- [ ] Build network segmentation verification
- [ ] Create compliance audit reports
- [ ] Implement continuous compliance monitoring
- [ ] Build compliance violation remediation
- [ ] Write compliance validation tests
- [ ] Document compliance controls

**Dependencies:** Epic 1.8, Epic 2.9
**Team:** Security, Compliance
**Estimated Effort:** 8-10 weeks
**Status:** ⏭️ Deferred to Phase 4

---

## Phase 5: Integration & Ecosystem (Ongoing)

### Epic 5.1: Terraform Provider ⬜

**Goal:** Infrastructure-as-Code support via Terraform provider.

**Acceptance Criteria:**
- [ ] Build Terraform provider in Go
- [ ] Implement resources: `rxt_project`, `rxt_environment`, `rxt_deployment`
- [ ] Implement data sources
- [ ] Build state management integration
- [ ] Create provider documentation
- [ ] Publish to Terraform Registry
- [ ] Build example configurations
- [ ] Implement import functionality
- [ ] Write provider integration tests
- [ ] Create migration guide from manual deployments

**Dependencies:** Epic 1.4
**Team:** Developer Experience
**Estimated Effort:** 4-5 weeks

---

### Epic 5.2: GitHub Actions Integration ⬜

**Goal:** Pre-built GitHub Actions for CI/CD workflows.

**Acceptance Criteria:**
- [ ] Create `rxt-deploy` GitHub Action
- [ ] Implement authentication via OIDC
- [ ] Build deployment action with status checks
- [ ] Create rollback action
- [ ] Build preview environment action (PR deployments)
- [ ] Implement comment-based commands (/deploy, /rollback)
- [ ] Create action marketplace listing
- [ ] Build example workflows
- [ ] Write action integration tests
- [ ] Document action usage

**Dependencies:** Epic 1.4, Epic 4.1
**Team:** Developer Experience
**Estimated Effort:** 2-3 weeks

---

### Epic 5.3: GitLab CI Integration ⬜

**Goal:** Pre-built GitLab CI/CD templates.

**Acceptance Criteria:**
- [ ] Create GitLab CI templates
- [ ] Implement authentication integration
- [ ] Build deployment jobs
- [ ] Create review app templates
- [ ] Implement merge request automation
- [ ] Create template repository
- [ ] Build example pipelines
- [ ] Write integration tests
- [ ] Document template usage

**Dependencies:** Epic 1.4, Epic 4.1
**Team:** Developer Experience
**Estimated Effort:** 2-3 weeks

---

### Epic 5.4: Datadog Integration ⬜

**Goal:** Deep integration with Datadog for observability.

**Acceptance Criteria:**
- [ ] Build Datadog dashboard templates
- [ ] Implement deployment event annotations
- [ ] Create monitor templates (error rate, latency, etc.)
- [ ] Build SLO tracking integration
- [ ] Implement log correlation
- [ ] Create Datadog app/integration listing
- [ ] Build alert routing to RXT Deploy
- [ ] Write integration guide
- [ ] Document dashboard customization

**Dependencies:** Epic 3.1
**Team:** Backend, SRE
**Estimated Effort:** 2-3 weeks

---

### Epic 5.5: Slack Bot ⬜

**Goal:** ChatOps interface for deployments and monitoring.

**Acceptance Criteria:**
- [ ] Build Slack bot application
- [ ] Implement slash commands (/rxt deploy, /rxt status)
- [ ] Build deployment notifications
- [ ] Create interactive deployment approvals
- [ ] Implement deployment status updates
- [ ] Build incident response workflows
- [ ] Create Slack app directory listing
- [ ] Write bot interaction tests
- [ ] Document Slack bot setup

**Dependencies:** Epic 1.4, Epic 3.4
**Team:** Developer Experience
**Estimated Effort:** 3-4 weeks

---

## Summary & Metrics

### Total Epics: 43

**By Phase:**
- Phase 1 (Foundation): 8 epics
- Phase 2 (Platform Core): 9 epics
- Phase 3 (Observability): 6 epics
- Phase 4 (Advanced): 8 epics
- Phase 5 (Ecosystem): 5 epics

**By Priority:**
- **P0 (Critical Path):** 17 epics
- **P1 (Important):** 14 epics
- **P2 (Nice to Have):** 12 epics

**Estimated Timeline:**
- Phase 1-2: 3-4 months (MVP)
- Phase 3: 2-3 months (Production-ready)
- Phase 4: 3-4 months (Enterprise features)
- Phase 5: Ongoing

---

## Critical Path to MVP

The following epics represent the **minimum viable product** to support basic deployments on both platforms:

1. ✅ Epic 1.1: Infrastructure Setup
2. ✅ Epic 1.2: Event Bus
3. ✅ Epic 1.3: Identity & Access
4. ✅ Epic 1.4: API Gateway
5. ✅ Epic 1.5: Project Registry
6. ✅ Epic 1.6: Webhook & VCS
7. ✅ Epic 1.7: Secrets Service
8. ✅ Epic 2.1: Platform Abstraction Layer
9. ✅ Epic 2.2: Workload Placement Engine
10. ✅ Epic 2.3: Orchestrator
11. ✅ Epic 2.4: Build Service
12. Choose platform path:
    - **SDDC Flex:** Epic 2.5 + Epic 2.6
    - **RXT SPOT:** Epic 2.7 + Epic 2.8
    - **Both:** All four adapters

**Estimated MVP Delivery:** 4-5 months with a team of 5-7 backend engineers

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| vCenter/NSX API instability | High | Build comprehensive retry logic, fallback workflows |
| Kubernetes version compatibility | Medium | Test against multiple K8s versions (1.25-1.29) |
| Event bus message loss | High | Implement DLQ, event replay, idempotent consumers |
| Platform adapter performance | Medium | Load test adapters, implement caching, parallel operations |
| Cost tracking accuracy | High | Reconciliation jobs, audit trails, manual verification |
| Multi-tenancy data leaks | Critical | RLS, comprehensive security testing, penetration tests |

---

## Success Criteria

**Technical:**
- [ ] Deploy to both SDDC Flex and RXT SPOT from unified manifest
- [ ] <10 min environment creation time
- [ ] <5% deployment failure rate
- [ ] 99.9% API uptime
- [ ] 100% cost attribution accuracy

**Business:**
- [ ] 15+ internal teams onboarded
- [ ] 8+ external design partners
- [ ] 30% increase in total compute utilization
- [ ] 70% reduction in platform onboarding time

---

**Last Updated:** October 21, 2025
**Next Review:** Weekly during active development
