# Front-End Architecture (at a glance)

* **Stack**: React (Next.js or Remix), TypeScript, Tailwind + shadcn/ui, Zustand/Redux Toolkit for client state, React Query for server state, WebSockets/SSE for live deploy logs.
* **Layout**: App shell with **Global Header** (org/project switcher, search, notifications, help) + **Left Nav** (Projects → Environments → Deployments → Logs → Metrics → Domains → Networking → Secrets → Settings).
* **State**

  * *Server state*: projects, envs, builds, logs, metrics, invoices (React Query).
  * *Client state*: UI prefs (dark mode, column widths), transient filters (Zustand).
* **Auth**: OIDC/OAuth SSO → short-lived JWT + refresh; per-project RBAC guards at route and component level.
* **Observability hooks**: log frames and metric charts stream from backend; client renders collapsible panes.
* **Design system**: one **“App Object Model”**: *Org → Project → Environment → Deployment → Resource (VM/vApp, LB, Domain, Secret)*; every screen binds to it.

---

# Information Architecture & Routes

```
/auth/*                      (SSO callback, login)
/onboarding                  (first-run checklist)
/orgs/:orgId                 (switcher, billing summary)
/orgs/:orgId/projects        (project list)
/orgs/:orgId/projects/new    (create project wizard)

/projects/:projectId         (project overview)
  /overview
  /environments              (list: dev, staging, prod, previews)
  /environments/:envId
    /deployments             (history + current)
    /deployments/:deployId   (live logs, steps, artifacts)
    /logs                    (stream + search)
    /metrics                 (latency, error rate, CPU/RAM/GB-hours)
    /domains                 (map domain ↔ env, TLS)
    /networking              (LBs, routes, firewall rules)
    /secrets                 (K/V secrets, rotation)
    /settings                (builds, variables, webhooks, delete env)
  /templates                 (blueprints catalog)
  /usage                     (cost/usage, budgets, alerts)
  /access                    (members, roles, audit trail)
  /settings                  (repo, CI runners, notifications)

/marketplace (later)         (add-ons, integrations)
/support                     (guides, runbooks, ticket link, status)
```

---

# Pages, Primary Actions, and Key Features

## 1) Onboarding

* **Page**: “Welcome / Connect your repo”
* **Primary buttons**: *Connect GitHub/GitLab*, *Create Project*
* **Features**:

  * Repo OAuth picker + branch selection
  * Auto-detect `deploy.yaml` (or guide to add)
  * Choose template (Static site / API / Full-stack)
  * Create default envs: *dev, staging, prod*
  * Finalize: *Create project* (starts first build for *dev*)

## 2) Project Overview

* **KPIs**: latest deployment status per env, traffic, error rate, spend month-to-date
* **Buttons**: *New Deployment*, *Add Environment*, *View Logs*, *Invite Team*
* **Widgets**: deployments feed, incidents, domain & TLS health, budget status

## 3) Environments (List & Detail)

* **List**: cards for *dev / staging / prod / previews*, health, last deploy
* **Detail tabs**: *Summary* | *Deployments* | *Logs* | *Metrics* | *Domains* | *Networking* | *Secrets* | *Settings*
* **Actions**: *Deploy*, *Rollback*, *Scale*, *Pause*, *Clone env*, *Delete env*

## 4) Deployments (History & Detail)

* **History table**: commit, author, branch, status, duration, artifact size
* **Detail view**:

  * **Timeline**: Build → Provision → Configure Net → Health checks → Go-Live
  * **Live logs** (WebSocket/SSE), **step cards**, **artifact panel**
  * **Buttons**: *Promote to…*, *Rollback*, *Re-run with cache*, *Download logs*

## 5) Logs

* **Stream + Search** (server-side filtering): service, level, instance, text query
* **Features**: pin queries, shareable links, quick ranges (last 15m/1h/24h)
* **Buttons**: *Live Tail*, *Pause*, *Export*, *Open in Datadog*

## 6) Metrics

* **Charts**: latency, throughput, error rate, saturation; infra (CPU/RAM/IOPS)
* **Overlays**: deployment markers; SLO lines; budget trend
* **Buttons**: *Set SLO*, *Create Alert*, *Open in Datadog/SL1*

## 7) Domains

* **Table**: domain, env binding, TLS status, CAA/DNS checks
* **Actions**: *Add Domain*, *Auto-provision TLS*, *Force renew*, *Delete*
* **Wizards**: DNS delegation or manual TXT/CAA setup

## 8) Networking

* **Visual map**: LB → routes → backends; segmentation badges
* **Controls**:

  * L7 rules (path/host), sticky sessions, timeouts
  * Micro-segmentation “Profiles”: *Open / App / Restricted / PCI / HIPAA*
* **Buttons**: *Add Load Balancer*, *Add Route*, *Attach WAF (later)*

## 9) Secrets & Config

* **K/V Secrets**: namespacing by env; masked; version history
* **Env Vars**: build-time vs runtime; diff across envs
* **Buttons**: *Add Secret*, *Rotate*, *Bulk Import*, *Reveal (RBAC-gated)*

## 10) Templates (Blueprints)

* **Catalog**: Static site, Node API, Python API, Full-stack SSR, Worker/Job
* **Cards**: stack, CI steps, base image, estimated footprint
* **Buttons**: *Use Template*, *Preview files*, *View IaC*
* **Feature**: *“Compliance guardrail aware”* templates (PCI/HIPAA)

## 11) Usage & Billing

* **Charts**: CPU/RAM/GB-hours by env/project; cost by tag
* **Controls**: budgets, thresholds, notifications
* **Buttons**: *Create Budget*, *Export CSV*, *Open in Quote Manager*

## 12) Access (RBAC) & Audit

* **Members**: user, role (Owner/Admin/Dev/Viewer), last activity
* **Invites**: by email or SSO group
* **Audit log**: filter by actor, object (domain, LB, secret), action
* **Buttons**: *Invite*, *Change Role*, *Revoke*, *Export Audit*

## 13) Project Settings

* **Repo**: repo/branch, webhook status, deploy hooks
* **Builds**: base image, cache, artifacts retention, timeouts
* **Runners**: dedicated vs shared, concurrency, regions
* **Notifications**: Slack/Email/Webhook routing by event
* **Danger zone**: transfer, archive, delete

## 14) Support

* **Guides**: “First deploy,” “Bring your domain,” “PCI mode,” “HCX notes”
* **Buttons**: *Open Ticket*, *Contact Support*, *Status Page*

---

# Critical UX Flows (MVP)

1. **Push-to-Deploy**

* Connect repo → auto-detect `deploy.yaml` → create project/envs → first deploy kicks off → live logs → deployment URL → promote to staging/prod.

2. **Preview Environments**

* PR opened → auto-create *preview env* with unique domain → reviewers see URL → on merge, preview destroyed (auto-cleanup).

3. **Domain + TLS**

* Add domain → guided DNS validation → automatic TLS → status badges in overview.

4. **Rollback**

* From deployment detail → *Rollback* → confirm → traffic switches back → markers on metrics.

5. **Secrets Rotation**

* Rotate secret → diff list of affected envs → one-click redeploy with new secret.

6. **Budget Guardrails**

* Set project budget → alerting rules → banner warnings on overview when trending to exceed.

---

# Role-Aware UI (RBAC)

* **Owner/Admin**: Everything + billing/access.
* **Developer**: Deploy, logs, metrics, domains, networking (non-destructive), secrets (view masked, rotate if allowed).
* **Viewer/Auditor**: Read-only, export logs/metrics/audit.

Controls (buttons/menus) should **render or disable** based on role; destructive actions require **re-auth + reason** (audit).

---

# Component/System Design

* **AppShell**: Header (Org/Project switcher, search, notifications, help) + LeftNav + Content + Toaster.
* **ProjectPicker**: fuzzy search + recent projects.
* **EnvHeader**: env chips (dev/stage/prod/preview) + status + quick actions (Deploy / Rollback / Scale).
* **DataGrids**: virtualized tables (10k+ rows), saved views, column show/hide.
* **LogViewer**: streaming with backpressure; tail/pause; copy selection.
* **MetricCharts**: single-series line charts with lightweight zoom, markers for deployments.
* **Forms**: all forms have review/confirm step with RBAC checks and “will do” summary.
* **Empty/Loading/Error states**: always offer primary next action (e.g., “Connect repo”).

---

# Manifest (what the UI edits)

A simple, app-centric manifest to keep the UX predictable:

```yaml
# deploy.yaml
project: my-api
environments:
  - name: dev
    resources: { cpu: 2, ram: 4Gi, storage: 20Gi }
    build:
      base: node:20
      commands:
        - npm ci
        - npm run build
    run:
      command: node dist/server.js
      ports: [3000]
    networking:
      expose:
        - host: dev.my-api.example.com
          tls: auto
          paths:
            - path: /
              targetPort: 3000
    secrets: [DB_URL, API_KEY]
```

UI editors (Build, Networking, Secrets) basically **write/patch this file** per environment.

---

# MVP vs. Phase-Next

**MVP (must-have)**

* Onboarding, Project Overview
* Envs (dev/stage/prod), Deployments, Live Logs
* Domains/TLS, Secrets, Basic Networking
* Usage dashboard + Budgets
* RBAC + Audit
* Guides + ticketing link
* Preview envs for every PR (auto cleanup)
* Template catalog with compliance modes
* Runner management UI, dedicated pools
* SLOs and error budgets views
* WAF integration, canned micro-segmentation profiles
* Service maps (topology)

-