Product Requirements Document
Product Name: Rackspace Deploy (Vercel-like Layer for SDDC Flex)
Author: Edward A. Kerr IV
Date: October 2025
Version: Draft v1.0
________________________________________
1. Executive Summary
Rackspace Deploy is a developer-first platform layer built on top of Rackspace SDDC Flex, designed to abstract complex infrastructure into a simple, app-centric deployment experience.
By integrating with existing Rackspace services (Undercloud, VMware Cloud Director, NSX, and Billing APIs), Deploy allows developers to push code, deploy environments, and scale applications—while Rackspace transparently drives consumption of the underlying compute, network, and storage resources.
This initiative enables Rackspace to compete in the “Developer Cloud” category—delivering the ease of Vercel or Render with the control, compliance, and performance of private cloud infrastructure.
________________________________________
2. Problem Statement
Current SDDC Flex adoption is primarily infrastructure-led, requiring significant customer or Racker involvement to create, configure, and deploy workloads. This limits consumption growth and excludes developer-led use cases such as rapid prototyping, edge-app testing, or ephemeral environments.
Customers need:
•	Simpler, self-service deployment workflows that abstract away VMware complexity.
•	A consistent app model across multi-tenant environments.
•	A developer experience (CLI, API, Git integration) that aligns with modern DevOps practices.
Without this, Rackspace risks losing developer mindshare and incremental consumption revenue to hyperscalers and public PaaS vendors.
________________________________________
3. Goals & Objectives
Goal	Objective / KPI
Drive Consumption	Increase SDDC Flex compute utilization by 15–20% within 12 months.
Developer Adoption	Launch with at least 10 internal developer teams and 5 external design partners.
Operational Efficiency	Reduce manual provisioning and ticketed requests by 50%.
Customer Experience	Deliver “push-to-deploy” experience with <10 min environment creation.
________________________________________
4. Target Users
Persona	Description	Primary Needs
Developers	Build and deploy apps quickly without managing VMs or networks.	Push-to-deploy workflows, API access, Git integration.
DevOps Engineers	Manage environments as code and automate testing.	CI/CD integration, environment previews, scalability.
IT Managers	Maintain governance and compliance while enabling agility.	RBAC, cost visibility, and policy guardrails.
Rackspace Delivery Teams	Simplify customer onboarding and reduce manual builds.	Templates, automation, and telemetry.
________________________________________
5. Market Context
•	Customers increasingly demand developer experience parity with hyperscalers and modern platforms like Vercel, Render, and Fly.io.
•	Private cloud customers (especially in regulated sectors) cannot adopt these platforms due to data residency or compliance constraints.
•	Rackspace’s SDDC Flex and Undercloud APIs provide the foundation to build a differentiated, compliant, private PaaS that meets both enterprise and developer expectations.
________________________________________
6. Product Scope
In-Scope
•	Unified API and UI abstraction over SDDC Flex
•	Git integration (GitHub, GitLab) for auto-deployments
•	CI/CD runner provisioning within Flex environments
•	Automated network and DNS configuration via NSX
•	Metrics, logs, and cost dashboards per project
•	Integration with Rackspace billing and identity systems
Out-of-Scope (Phase 1)
•	Multi-cloud deployments (AWS, Azure, GCP)
•	Marketplace integrations (e.g., pre-built app stacks)
•	Advanced autoscaling (beyond vApp-level)
•	Custom CDN edge network
________________________________________
7. Functional Requirements
Feature	Description	Priority
API Gateway Layer	Orchestrates deployments via VCD, Undercloud, and NSX APIs.	P0
Project Model	Logical grouping of environments, linked to tenant billing.	P0
GitOps Integration	Git-based deployments (triggered via webhook).	P0
CLI & Web Portal	Developer interface for deploys, logs, and usage.	P0
Build & Runtime Manager	Controls isolated CI/CD runners and base templates.	P1
Networking Automation	Automated ingress, TLS, and DNS via NSX.	P1
Observability Hooks	Auto-provision Datadog/SL1 dashboards per project.	P1
Billing Metering Service	Attribute consumption by project/app.	P1
RBAC & IAM	Role-based access is integrated with Rackspace identity.	P1
Blueprint Templates	Common deployment patterns (web app, API, static site).	P2
________________________________________
8. Non-Functional Requirements
Category	Requirement
Performance	Deployments complete within 10 minutes for typical app.
Scalability	Support 500 concurrent deployment requests.
Security	Full tenant isolation, TLS 1.3, and token-based auth.
Compliance	PCI/HIPAA-ready by design with audit trail logging.
Reliability	99.9% uptime target for API and UI layers.
Usability	<3-click deploy experience in the UI.
________________________________________
9. Architecture Overview
Core Components:
1.	Rackspace Deploy Gateway – API and orchestration layer between developer interface and Flex services.
2.	App Runtime Engine – Manages vApp templates and lifecycle automation.
3.	CI/CD Runner Pool – Executes builds and syncs from Git repositories.
4.	Networking Controller – Automates NSX ingress, TLS, and DNS.
5.	Observability Bridge – Connects app telemetry to Datadog/SL1.
6.	Billing Adapter – Feeds usage data into Undercloud and Quote Manager.
(Architecture diagram can be added next iteration – would you like me to generate a Mermaid or architecture visual next?)
________________________________________
10. Dependencies & Integrations
System	Integration Purpose
VMware Cloud Director	VM and vApp orchestration
NSX	Networking and ingress automation
Undercloud API	Provisioning and billing hooks
Datadog / SL1	Observability integration
Rackspace Identity	Authentication and RBAC
Quote Manager	Usage-based billing injection
________________________________________
11. Workstreams & Deliverables
Workstream	Outcome
Platform Abstraction Layer	Unified Deploy API and resource model
Developer Experience	CLI, UI, GitHub integration
Build/Runtime Orchestration	CI/CD runner automation and templates
Networking & Routing	Automated ingress and domain provisioning
Observability & Billing	Usage dashboards and billing feed
Governance & IAM	RBAC, audit trail, and compliance enforcement
Launch Readiness	Beta with internal workloads, then limited GA
________________________________________
12. Risks & Mitigations
Risk	Impact	Mitigation
Complexity of abstracting VCD APIs	High	Start with narrow use cases (web/API workloads)
Integration debt with existing systems	Medium	Reuse Undercloud adapters and billing logic
Lack of developer adoption	High	Pilot with internal teams and partner customers
Performance overhead	Medium	Cache layer for frequent API calls
Security and isolation	High	Use strict tenancy boundaries and NSX micro segmentation
________________________________________
13. Success Metrics
•	20% increase in SDDC Flex resource consumption within 12 months
•	50% reduction in time-to-deploy workloads
•	75% positive satisfaction from developer pilot group
•	<5% deployment failure rate
•	100% telemetry and billing coverage across projects
________________________________________
14. Reference Docs
Architectural XMind: https://xmind.app/m/ysU8G5
 
