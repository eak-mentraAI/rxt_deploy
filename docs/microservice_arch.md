Great constraint—treat the **Frontend** as its own microservice and avoid a “thin-UI + fat-API” two-tier. Below is an opinionated, event-driven control plane broken into **bounded-context services**. Each service owns its data, exposes a narrow API, and publishes/consumes domain events over the bus (NATS/RabbitMQ). This lets you scale/fail independently, swap vendors (VCD/NSX), and keep tenant isolation tight.

---

# Core microservices (besides the Frontend)

| Service                                | Core responsibility (single reason to change)                             | Sync API (examples)                                               | Private store                        | Async contracts (topics/events)                                                                               | Scale pattern                    |
| -------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Edge/API Gateway**                   | AuthN/AuthZ, request routing, rate limits, idempotency                    | `POST /deployments`, `GET /projects/:id`                          | none (stateless)                     | Publishes `cmd.*` to bus; consumes `evt.*` for request/response bridges                                       | Horizontally; CPU-bound          |
| **Identity & Access**                  | Tenants, orgs, users, roles, SSO; token mint/verify                       | `POST /orgs`, `POST /invites`, `GET /roles`                       | Postgres (RLS)                       | Emits `evt.access.changed`                                                                                    | Low, bursts at login             |
| **Project Registry**                   | Projects, repos, envs, manifests (source of truth)                        | `POST /projects`, `PATCH /environments/:id`, `GET /manifests/:id` | Postgres                             | Emits `evt.project.created/updated`; consumes `evt.repo.verified`                                             | Moderate                         |
| **Webhook & VCS**                      | Git webhooks, PR sync, commit metadata, signatures                        | `POST /webhooks/github`                                           | Redis (dedupe), Postgres             | Emits `evt.commit.pushed`, `evt.pr.opened`                                                                    | Spiky on commit storms           |
| **Platform Abstraction Layer**         | Routes deploy.yaml to correct platform adapter; translate unified spec    | `POST /platforms/select`, `POST /deploy/translate`                | Redis (placement cache)              | Consumes `cmd.deploy.apply`; emits `cmd.sddc.*` or `cmd.spot.*` based on placement                            | Stateless; CPU-light             |
| **Orchestrator**                       | Stateful workflows: manifest → platform selection → provision, deploy, promote, rollback, destroy (sagas) | `POST /workflows/:type/start`, `GET /workflows/:id`               | Postgres (workflow states)           | Consumes `cmd.deploy.apply`; emits `cmd.provision.*`, `cmd.network.*`, `evt.deploy.*`                         | CPU+IO mixed; run many workers   |
| **Workload Placement Engine**          | Analyzes deploy.yaml and recommends optimal platform (VM vs K8s)          | `POST /placement/recommend`, `GET /placement/explain/:envId`      | Redis (ML model cache), Postgres     | Consumes `cmd.deploy.apply`; emits `evt.placement.recommended {platform, score, reasoning}`                    | CPU-light; cache decisions       |
| **SDDC Flex Adapter (VMs)**            | vApp/VM lifecycle in SDDC Flex via vCenter/NSX                            | `POST /sddc/provision/check`                                      | none                                 | Consumes `cmd.sddc.provision.*`; emits `evt.provisioned`, `evt.provision.failed`                              | IO-bound; parallelism by tenant  |
| **RXT SPOT Adapter (K8s)**             | Pod/deployment lifecycle in RXT SPOT via Kubernetes API                   | `POST /spot/provision/check`                                      | none                                 | Consumes `cmd.spot.provision.*`; emits `evt.provisioned`, `evt.provision.failed`                              | IO-bound; parallelism by tenant  |
| **SDDC Networking Adapter (NSX)**      | NSX LB, segments, FW rules, DNS, TLS for SDDC Flex                        | `POST /sddc/network/validate`                                     | none                                 | Consumes `cmd.sddc.network.*`; emits `evt.network.ready/failed`                                               | IO-bound                         |
| **SPOT Networking Adapter (K8s)**      | Ingress, LoadBalancer, DNS, TLS for RXT SPOT                              | `POST /spot/network/validate`                                     | none                                 | Consumes `cmd.spot.network.*`; emits `evt.network.ready/failed`                                               | IO-bound                         |
| **Runner Controller**                  | CI/CD runner pools (shared/dedicated/ephemeral)                           | `POST /runners/pools`, `POST /runners/scale`                      | Postgres (pool/lease), Redis (locks) | Consumes `cmd.runners.ensure`; emits `evt.runners.ready`                                                      | Burst scale on build queues      |
| **Build Service**                      | Docker-based build pipeline for both VM and container targets             | `POST /builds`, `GET /builds/:id/logs`                            | MinIO/S3 (artifacts), Postgres       | Consumes `evt.commit.pushed`; emits `evt.build.succeeded/failed`, streams logs                                | CPU/IO heavy; isolate per tenant |
| **Secrets Service**                    | K/V secrets, rotations, short-lived creds                                 | `POST /secrets`, `POST /secrets/:id/rotate`                       | Vault/KMS + Postgres index           | Emits `evt.secret.rotated`; consumes `cmd.secret.issue`                                                       | Latency sensitive; small         |
| **Usage & Billing**                    | Cross-platform metering, aggregation, billing export                      | `GET /usage`, `POST /budgets`                                     | Postgres (rollups)                   | Consumes `evt.deploy.started/stopped`, infra samples; emits `evt.usage.window.closed`; posts to Undercloud/QM | Batchy; memory for rollups       |
| **Observability Bridge**               | Unified logs/metrics/traces from both VM and K8s platforms                | `POST /dashboards`, `POST /annotations`                           | none                                 | Consumes `evt.deploy.*`; emits `evt.obs.annotated`                                                            | Light; external API limits       |
| **Policy (OPA Gatekeeper)**            | Admission & runtime policy evaluation                                     | `POST /evaluate`                                                  | Rego bundles in object store         | Emits `evt.policy.violation`                                                                                  | CPU-light; cache decisions       |
| **Audit Log**                          | Append-only audit trail (immutable)                                       | `GET /audit?object=...`                                           | Postgres → WORM/object export        | Consumes all `evt.*` via tap                                                                                  | Write-heavy; cheap reads         |
| **Domains Service**                    | Domain↔env binding, ACME/TLS lifecycle                                    | `POST /domains`, `POST /domains/:id/validate`                     | Postgres                             | Consumes `cmd.domain.*`; emits `evt.domain.valid/invalid`                                                     | IO-bound                         |
| **Templates/Blueprints**               | Golden templates, compliance variants                                     | `GET /templates`, `POST /templates`                               | Object store + Postgres index        | Emits `evt.template.published`                                                                                | Low, cacheable                   |
| **Notifications**                      | Email/Slack/Webhook routing & retries                                     | `POST /notify`                                                    | Redis (outbox), Postgres             | Consumes notable events → fanout                                                                              | Bursty; idempotent               |

> Notes
> • *Adapters* (Provisioning, Networking) are purposely **thin** and **stateless**; they just translate domain commands to platform-specific APIs (vCenter/NSX for SDDC Flex, Kubernetes API for RXT SPOT) and emit events.
> • **Platform Abstraction Layer** routes deployments based on `platform.preference` in deploy.yaml (auto | vm | container).
> • **Workload Placement Engine** analyzes workload characteristics to recommend optimal platform when `preference: auto`.
> • **Build Service** produces Docker images that can run on both SDDC Flex (inside VMs) and RXT SPOT (as K8s pods).

---

## Event-first contracts (simplified)

* **Platform-Agnostic Commands** (`cmd.*`):

  * `cmd.deploy.apply {envId, artifactRef, manifest, platformPreference}`
  * `cmd.placement.recommend {manifest, constraints}`
  * `cmd.runners.ensure {tenant, project, kind, labels}`

* **SDDC Flex Commands** (`cmd.sddc.*`):

  * `cmd.sddc.provision.request {tenant, project, env, vAppTemplateRef, vmSpecs, resources}`
  * `cmd.sddc.network.configure {envId, nsxRoutes, nsxLB, firewallRules, tls, dns}`
  * `cmd.sddc.scale {envId, vmCount, cpuPerVm, ramPerVm}`

* **RXT SPOT Commands** (`cmd.spot.*`):

  * `cmd.spot.provision.request {tenant, project, env, helmChart, k8sManifests, resources}`
  * `cmd.spot.network.configure {envId, ingressRules, serviceLB, networkPolicies, tls, dns}`
  * `cmd.spot.scale {envId, replicas, hpa}`

* **Platform-Agnostic Events** (`evt.*`):

  * `evt.placement.recommended {envId, platform: 'sddc-flex' | 'rxt-spot', score, reasoning}`
  * `evt.provisioned {envId, platform, resourceIds, endpoints}` / `evt.provision.failed {platform, reason}`
  * `evt.network.ready {envId, platform, hostnames, vip}` / `evt.network.failed {platform, reason}`
  * `evt.build.succeeded {artifactRef, digest, multiArch}` / `evt.build.failed {reason}`
  * `evt.deploy.ready {envId, platform, urls}` / `evt.deploy.failed {envId, platform, step, reason}`
  * `evt.usage.sample {envId, platform, cpu, ram, storage, egressBytes}`

* **Platform-Specific Events**:

  * **SDDC Flex**: `evt.sddc.vm.created {vmId, vAppId}`, `evt.sddc.nsx.configured {lbId, segmentId}`
  * **RXT SPOT**: `evt.spot.pod.created {podId, deploymentId}`, `evt.spot.ingress.configured {ingressId, hostname}`

This keeps coupling low: the **Platform Abstraction Layer** + **Orchestrator** coordinate, while **Platform Adapters** do the platform-specific work.

---

## Minimal "working" slice (first deployable set)

### Core Platform Services (Required)
1. **Edge/API Gateway**
2. **Identity & Access**
3. **Project Registry**
4. **Webhook & VCS** (receive pushes/PRs)
5. **Platform Abstraction Layer** (routing logic)
6. **Orchestrator** (sagas + compensation)
7. **Workload Placement Engine** (basic rules-based placement)
8. **Build Service** (Docker-based for both platforms)
9. **Secrets Service** (issue short-lived creds)
10. **Usage & Billing** (MVP: CPU/RAM/GB-hours rollups with platform attribution)
11. **Observability Bridge** (annotations + basic dashboards)
12. **Audit Log**
13. **Policy** (admission checks—TLS required, quotas)

### Platform Adapters (Choose One or Both)
#### SDDC Flex Path:
14. **SDDC Flex Adapter (VMs)** - vCenter integration
15. **SDDC Networking Adapter (NSX)** - NSX + TLS/DNS

#### RXT SPOT Path:
14. **RXT SPOT Adapter (K8s)** - Kubernetes API integration
15. **SPOT Networking Adapter (K8s)** - Ingress + TLS/DNS

### Optional (Can defer)
- **Runner Controller** (use external CI initially)
- **Templates/Blueprints** (start with basic templates)
- **Notifications** (use basic email initially)

Everything else (Domains/Notifications/Templates) can come shortly after or live as lightweight modules.

---

## Data & isolation stance (per service)

* **Each service owns its schema** (Postgres) and exposes read APIs; no cross-DB joins.
* **Redis** for dedupe, idempotency keys, deploy locks, rate limiting.
* **Vault/KMS** with per-tenant namespaces; secrets never stored in app DBs.
* **Object store (MinIO/S3)** for artifacts, Rego bundles, and WORM audit exports.
* **Network**: Control plane on a management segment; adapters are the only path to VCD/NSX/Undercloud; runners/apps live on tenant segments (NSX microseg).

---

## Why this avoids a two-tier trap

* The Frontend talks to **Edge/API Gateway** only.
* Domain logic is **decomposed** (Orchestrator, Adapters, Registry, Usage, etc.), so there isn’t a single “backend blob.”
* Cross-service effects flow via **events**, not chained HTTP calls.
* Vendor specifics are isolated in **Adapters**, making the platform portable.

---

## Optional consolidations (if you want fewer services to start)

* Merge **Identity & Access** into **Edge/API Gateway** (still keep separate module/bounded context).
* Merge **Domains** into **Networking Adapter** (one team).
* Use external CI only → defer **Build Service**; keep **Runner Controller** if you need on-prem runners.
* Collapse **Observability Bridge** into a library in Orchestrator (then split later).

---

## Sane SLIs/SLOs per service (quick sketch)

* Edge/API: p95 latency < 250 ms; 99.9% availability.
* Orchestrator: recover stalled jobs < 60 s (stream replay).
* Adapters: success rate > 99%; retries with jitter; DLQ < 0.1% of commands.
* Runner Controller: queue wait p95 < 60 s under normal load.
* Usage: billing export completeness = 100% (reconcilable).
* Audit: 100% of mutating requests logged with actor/object/action.

