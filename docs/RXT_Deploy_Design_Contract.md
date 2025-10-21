# RXT Deploy - Design Contract & Front-End Mock Specification

**Product**: Rackspace Deploy (Developer-First PaaS Layer)
**Author**: Design & Engineering Team
**Date**: October 2025
**Version**: 1.0
**Purpose**: Design contract for front-end mock/prototype showcasing RXT Deploy platform

---

## 1. Executive Summary

This design contract defines the visual language, component architecture, and technical implementation for the RXT Deploy front-end mock—a high-fidelity prototype demonstrating the developer-first PaaS platform built on Rackspace SDDC Flex.

**Design Goals**:
- Create a modern, developer-friendly interface matching platforms like Vercel, Render, and Railway
- Maintain Rackspace brand identity while feeling fresh and startup-inspired
- Build reusable component architecture aligned with shadcn/ui patterns
- Demonstrate core user flows: onboarding, deployment, logs, metrics, and domain management
- Ensure design is production-ready and translatable to Next.js/Remix implementation

---

## 2. Brand Guidelines & Visual Identity

### 2.1 Color Palette

**Primary Colors** (Rackspace Heritage):
```css
--rxt-red-primary: #E01F27      /* Primary CTA, accents */
--rxt-red-dark: #C91A21         /* Hover states, emphasis */
--rxt-red-light: #FF4449        /* Highlights, badges */
--rxt-red-50: #FEF2F2           /* Backgrounds, alerts */
--rxt-red-100: #FEE2E2          /* Subtle accents */
```

**Neutral Palette** (Interface Foundation):
```css
--slate-50: #F8FAFC
--slate-100: #F1F5F9
--slate-200: #E2E8F0            /* Borders, dividers */
--slate-300: #CBD5E1
--slate-400: #94A3B8            /* Placeholder text */
--slate-500: #64748B            /* Secondary text */
--slate-600: #475569            /* Primary text (light mode) */
--slate-700: #334155
--slate-800: #1E293B
--slate-900: #0F172A            /* Headings, dark mode text */
```

**Accent Colors** (Status & Feedback):
```css
--green-success: #10B981        /* Deployments live, healthy */
--green-success-bg: #D1FAE5
--yellow-warning: #F59E0B       /* Builds in progress */
--yellow-warning-bg: #FEF3C7
--red-error: #EF4444            /* Failed deploys */
--red-error-bg: #FEE2E2
--blue-info: #3B82F6            /* Informational */
--blue-info-bg: #DBEAFE
```

**Gradient Accents** (Hero, CTAs):
```css
--gradient-hero: linear-gradient(135deg, #E01F27 0%, #FF6B6B 100%);
--gradient-cta: linear-gradient(90deg, #E01F27 0%, #FF4449 100%);
--gradient-subtle: linear-gradient(180deg, #FEF2F2 0%, #FFFFFF 100%);
```

### 2.2 Typography

**Font Stack**:
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace;
```

**Type Scale**:
```css
--text-xs: 0.75rem (12px)       /* Labels, captions */
--text-sm: 0.875rem (14px)      /* Body small, table cells */
--text-base: 1rem (16px)        /* Default body */
--text-lg: 1.125rem (18px)      /* Large body, subheads */
--text-xl: 1.25rem (20px)       /* Section titles */
--text-2xl: 1.5rem (24px)       /* Page titles */
--text-3xl: 1.875rem (30px)     /* Hero headings */
--text-4xl: 2.25rem (36px)      /* Marketing hero */
--text-5xl: 3rem (48px)         /* Large marketing */
```

**Font Weights**:
- Regular: 400 (body text)
- Medium: 500 (buttons, labels)
- Semibold: 600 (section headings)
- Bold: 700 (page titles)
- Extrabold: 800 (hero text)

### 2.3 Logo Usage

**Primary Logo**: `/assets/logos/rackspace-logo.png`
- Use in navigation header (white or full color)
- Height: 28-32px in desktop nav, 24px mobile
- Clear space: minimum 16px padding all sides

**Icon/Favicon**: `/assets/logos/rxt_icon.png`
- Use for favicon, app icons, small badges
- Size: 32x32px minimum, scales to 16x16px

**Logo Placement**:
- Top-left of global header
- Paired with "Deploy" wordmark in custom font
- Link to `/` (project overview or dashboard)

---

## 3. Design System & Components

### 3.1 Component Library Foundation

**Base Framework**: React 19 + Tailwind CSS + shadcn/ui patterns

**Core Component Categories**:
1. **Layout**: AppShell, Header, LeftNav, ContentArea
2. **Navigation**: ProjectSwitcher, EnvTabs, Breadcrumbs
3. **Data Display**: DataGrid, MetricChart, LogViewer, StatusBadge
4. **Forms**: Input, Select, Button, Checkbox, Radio, Toggle
5. **Feedback**: Toast, Alert, Modal, ConfirmDialog
6. **Typography**: Heading, Text, Code, Link
7. **Utilities**: Avatar, Pill, Tooltip, Dropdown

### 3.2 Layout Components

#### AppShell
```jsx
<AppShell>
  <GlobalHeader />
  <LeftNav />
  <ContentArea>
    {children}
  </ContentArea>
  <Toaster />
</AppShell>
```

**Global Header**:
- Height: 64px
- Sticky position with backdrop blur
- Contents: Logo, ProjectSwitcher, GlobalSearch, Notifications, HelpMenu, UserAvatar
- Background: `bg-white/80 dark:bg-slate-900/80 backdrop-blur-md`
- Border: `border-b border-slate-200 dark:border-slate-800`

**Left Navigation**:
- Width: 240px (desktop), collapsible to 64px (icon-only)
- Fixed position, full height
- Background: `bg-slate-50 dark:bg-slate-900`
- Navigation items:
  - Projects
  - Environments
  - Deployments
  - Logs
  - Metrics
  - Domains
  - Networking
  - Secrets
  - Settings

**Content Area**:
- Max width: 1440px centered
- Padding: 32px (desktop), 16px (mobile)
- Background: `bg-white dark:bg-slate-950`

### 3.3 Navigation Components

#### ProjectSwitcher
```jsx
<ProjectSwitcher>
  <Trigger>
    <ProjectIcon />
    <ProjectName>my-api</ProjectName>
    <ChevronDown />
  </Trigger>
  <Dropdown>
    <FuzzySearch placeholder="Search projects..." />
    <RecentProjects />
    <AllProjects />
    <CreateProjectButton />
  </Dropdown>
</ProjectSwitcher>
```

Design specs:
- Dropdown width: 320px
- Max height: 480px with scroll
- Fuzzy search with keyboard navigation
- Recent projects (max 5) shown first
- Visual separator between recent and all

#### EnvTabs
```jsx
<EnvTabs>
  <Tab env="dev" status="healthy" />
  <Tab env="staging" status="deploying" />
  <Tab env="prod" status="healthy" />
  <AddEnvButton />
</EnvTabs>
```

Design specs:
- Horizontal tabs with status indicators
- Active tab: red underline (4px), bold text
- Status pill embedded in tab label
- Color-coded: dev (blue), staging (yellow), prod (red), preview (purple)

### 3.4 Data Display Components

#### StatusBadge
```jsx
<StatusBadge status="deploying" />
// States: deploying, healthy, error, paused, building
```

**Variants**:
- `deploying`: Yellow background, pulse animation
- `healthy`: Green background, checkmark icon
- `error`: Red background, alert icon
- `paused`: Gray background, pause icon
- `building`: Blue background, spinner icon

#### MetricChart
```jsx
<MetricChart
  title="Request Latency (p95)"
  data={timeSeriesData}
  markers={deploymentMarkers}
  slo={200}
/>
```

Design specs:
- Single-series line charts (use recharts or visx)
- Deployment markers as vertical dashed lines with tooltips
- SLO threshold as horizontal dotted line
- Hover tooltip shows timestamp + value
- Zoom controls in top-right corner
- Time range selector: 15m, 1h, 6h, 24h, 7d, 30d

#### LogViewer
```jsx
<LogViewer
  stream={logStream}
  onPause={handlePause}
  onCopy={handleCopy}
/>
```

Design specs:
- Virtualized scrolling (react-window) for 10k+ lines
- Monospace font (`JetBrains Mono`)
- Color-coded by level: debug (gray), info (blue), warn (yellow), error (red)
- Line numbers in left gutter
- Copy button on hover for each line
- Sticky controls bar: Live/Pause toggle, Clear, Export, Filter
- Search with regex support

#### DataGrid
```jsx
<DataGrid
  columns={columns}
  data={data}
  sortable
  filterable
  pagination
  savedViews
/>
```

Design specs:
- Virtualized rows for large datasets
- Column resize, reorder, show/hide
- Saved view presets (e.g., "Failed Deploys", "Last 24h")
- Inline editing for certain cells (role-gated)
- Bulk actions via checkbox selection
- Export to CSV/JSON

### 3.5 Form Components

#### Button
```jsx
<Button variant="primary" size="md" icon={<Deploy />}>
  Deploy Now
</Button>
```

**Variants**:
- `primary`: Red gradient background, white text
- `secondary`: White background, red border + text
- `ghost`: Transparent, red text on hover
- `danger`: Red background (destructive actions)
- `success`: Green background (confirms)

**Sizes**:
- `sm`: 32px height, 12px text
- `md`: 40px height, 14px text (default)
- `lg`: 48px height, 16px text

**States**:
- Default
- Hover (darken 10%)
- Active (darken 15%)
- Disabled (opacity 50%, cursor not-allowed)
- Loading (spinner icon, disabled)

#### Input
```jsx
<Input
  label="Project Name"
  placeholder="my-awesome-app"
  error={errors.name}
  helpText="Alphanumeric and hyphens only"
/>
```

Design specs:
- Height: 40px (md), 48px (lg)
- Border: 1px solid slate-300, red on error
- Focus ring: 2px red-500 with offset
- Label above input, 12px text, medium weight
- Error text below, 12px red-600
- Help text below, 12px slate-500

---

## 4. Page Layouts & Screen Specifications

### 4.1 Onboarding Flow

**Route**: `/onboarding`

**Layout**:
```
┌──────────────────────────────────────────┐
│  [Logo]              Step 2 of 4         │
├──────────────────────────────────────────┤
│                                          │
│          Connect Your Repository         │
│                                          │
│   [GitHub Button]  [GitLab Button]      │
│                                          │
│  ──────────── or ────────────            │
│                                          │
│   [Manual Setup →]                       │
│                                          │
│          [Back]        [Continue]        │
└──────────────────────────────────────────┘
```

**Steps**:
1. Welcome + Choose Source (GitHub/GitLab/Manual)
2. Select Repository + Branch
3. Detect or Create `deploy.yaml`
4. Choose Template (Static/API/Full-stack)
5. Create Environments (dev/staging/prod)
6. Review + Create Project

**Design Notes**:
- Centered card layout, max-width 600px
- Progress indicator at top
- Large CTA buttons with icons
- Auto-advance on selection where possible
- Preview pane on right for `deploy.yaml` content

### 4.2 Project Overview

**Route**: `/projects/:projectId`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  [Project Switcher ▼]  my-api                 [Avatar]  │
├─────────────────────────────────────────────────────────┤
│ Nav │  Overview                                         │
│     │                                                   │
│     │  ┌──────────────┬──────────────┬──────────────┐  │
│     │  │ Dev          │ Staging      │ Production    │  │
│     │  │ ✓ Healthy    │ ⚡ Deploying │ ✓ Healthy    │  │
│     │  │ 2m ago       │ 30s ago      │ 1h ago        │  │
│     │  └──────────────┴──────────────┴──────────────┘  │
│     │                                                   │
│     │  Recent Deployments        Traffic & Errors      │
│     │  [Table]                   [Charts]              │
│     │                                                   │
│     │  Domains & TLS             Budget This Month     │
│     │  [Status Cards]            [Usage Chart]         │
└─────────────────────────────────────────────────────────┘
```

**Components**:
- Environment health cards (3-column grid, responsive to 1-column mobile)
- Recent deployments table (last 10, link to full history)
- Traffic/error charts (sparkline style, last 24h)
- Domain status cards (green checkmark for healthy TLS)
- Budget progress bar with threshold warnings

**Key Actions**:
- Top-right: [New Deployment], [Add Environment], [Invite Team]
- Environment cards: Quick [Deploy], [View Logs], [Settings]

### 4.3 Deployments Detail

**Route**: `/projects/:projectId/environments/:envId/deployments/:deployId`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  my-api › staging › Deployment #1234                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Status: ⚡ Deploying    Started 2m ago   By: @alice   │
│                                                         │
│  ━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━                      │
│  Build  Provision  Network  Health  Live               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Step 1: Build (Completed - 45s)                 │  │
│  │  ✓ Pulled base image node:20                     │  │
│  │  ✓ npm ci (34s)                                  │  │
│  │  ✓ npm run build (8s)                            │  │
│  │  ✓ Artifact created (23.4 MB)                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Step 2: Provision Resources (In Progress - 1m)  │  │
│  │  ✓ vApp created (vapp-staging-1234)              │  │
│  │  ⚡ Configuring compute (2 vCPU, 4GB RAM)        │  │
│  │  ⏳ Attaching storage (20GB)                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Live Logs ──────────────────── [Pause] [Download]    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 1  [INFO] Starting build process...              │  │
│  │ 2  [INFO] Fetching dependencies...               │  │
│  │ 3  [INFO] Building application...                │  │
│  │ ...                                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Promote to Prod]  [Rollback]  [Re-run]              │
└─────────────────────────────────────────────────────────┘
```

**Components**:
- Deployment timeline (horizontal progress bar with stages)
- Step cards (expandable accordion, auto-expand active step)
- Live log viewer (WebSocket-powered, auto-scroll)
- Action buttons (context-aware based on deploy status)

**Real-Time Updates**:
- WebSocket connection for live logs and status
- Progress bar animation
- Step completion confetti animation (optional)
- Toast notification on deploy success/failure

### 4.4 Logs View

**Route**: `/projects/:projectId/environments/:envId/logs`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Logs › staging                          [Export] [⚙]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Live Tail ✓] [15m ▼] [Service: All ▼] [Level: All ▼] │
│  [Search: "error" ╳]                    1,234 matches   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 14:32:01  INFO   [api]  Request received GET /   │  │
│  │ 14:32:01  DEBUG  [api]  Query params: {}         │  │
│  │ 14:32:02  ERROR  [db]   Connection timeout       │  │
│  │ 14:32:02  WARN   [api]  Retrying request...      │  │
│  │ ...                                              │  │
│  │                                                  │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Pin Query] [Share Link]                              │
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Live tail toggle (WebSocket stream)
- Time range selector with custom range picker
- Multi-filter (service, level, instance, custom query)
- Syntax highlighting for JSON logs
- Copy individual lines or selection
- Share filtered view as URL

### 4.5 Metrics Dashboard

**Route**: `/projects/:projectId/environments/:envId/metrics`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Metrics › production               [24h ▼] [Refresh]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Request Latency (p95)                                  │
│  ┌────────────────────────────────┐  200ms (SLO) ─ ─   │
│  │         ╱╲                     │                     │
│  │        ╱  ╲        ╱╲          │  ↓ Deploy marker    │
│  │   ────╱────╲──────╱──╲─────    │                     │
│  └────────────────────────────────┘                     │
│  Now: 145ms  Avg: 132ms  Max: 203ms                    │
│                                                         │
│  Error Rate                                             │
│  ┌────────────────────────────────┐  2% (Budget) ─ ─   │
│  │          ╱│                     │                     │
│  │         ╱ │                     │                     │
│  │   ─────╱──│────────────────     │                     │
│  └────────────────────────────────┘                     │
│  Now: 0.3%  Avg: 0.5%  Budget remaining: 78%           │
│                                                         │
│  [+ Add Chart]  [Set SLO]  [Create Alert]              │
└─────────────────────────────────────────────────────────┘
```

**Charts**:
- Latency (p50, p95, p99)
- Throughput (requests/sec)
- Error rate (%)
- CPU/RAM/IOPS utilization
- Custom metrics (user-defined)

**Overlays**:
- Deployment markers (vertical line with hover tooltip)
- SLO threshold lines
- Budget trend line

### 4.6 Domains Management

**Route**: `/projects/:projectId/domains`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Domains                                   [Add Domain]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Domain              Env        TLS      Status   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ api.example.com     prod       ✓ Auto   ✓ Active│  │
│  │ staging.example.com staging    ✓ Auto   ✓ Active│  │
│  │ dev.example.com     dev        ✗ None   ⚠ DNS   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Selected: dev.example.com                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ DNS Configuration                                │  │
│  │                                                  │  │
│  │ Add these records to your DNS provider:         │  │
│  │                                                  │  │
│  │ Type   Name              Value                  │  │
│  │ A      dev.example.com   192.0.2.10  [Copy]    │  │
│  │ CAA    example.com       0 issue "letsencrypt" │  │
│  │                                                  │  │
│  │ [Re-check DNS]  [Force Renew TLS]               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Wizards**:
- Add Domain modal (3 steps: domain input, DNS config, TLS setup)
- Auto-provision TLS via Let's Encrypt
- Manual TXT/CAA record setup for validation

### 4.7 Networking Configuration

**Route**: `/projects/:projectId/environments/:envId/networking`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Networking › staging                  [Add Route]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Load Balancer: lb-staging-1234                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  Internet ───→ LB ───→ Route /api ───→ :3000    │  │
│  │                   └──→ Route /     ───→ :8080    │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Routes                                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Path    Target Port   TLS   Sticky  Timeout     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ /api    3000          ✓     ✗       30s  [⚙]   │  │
│  │ /       8080          ✓     ✓       60s  [⚙]   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Micro-Segmentation Profile: App (Standard)             │
│  [Open] [App] [Restricted] [PCI] [HIPAA]               │
│                                                         │
│  Firewall Rules                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Allow 443 from 0.0.0.0/0                        │  │
│  │ Allow 80 from 0.0.0.0/0 (redirect to 443)       │  │
│  │ Deny all other inbound                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Visual network topology map
- Route configuration with L7 rules
- Micro-segmentation profiles (presets for compliance)
- Firewall rule editor (RBAC-gated)

---

## 5. Interaction Patterns & Animations

### 5.1 Micro-interactions

**Button Hover**:
- Scale: 1.02 (subtle lift)
- Transition: 150ms ease-out
- Shadow increase: from shadow-sm to shadow-md

**Card Hover**:
- Border color: slate-300 → red-300
- Shadow: none → shadow-lg
- Transition: 200ms ease-out

**Status Badge Pulse** (for "deploying" state):
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

**Deployment Success Confetti** (optional):
- Trigger on deployment "healthy" status
- Library: canvas-confetti or react-confetti
- Duration: 3 seconds
- Colors: red-500, orange-500, yellow-400

### 5.2 Page Transitions

**Route Changes**:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.div>
```

**Modal/Dialog**:
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.15 }}
>
  {modalContent}
</motion.div>
```

**Overlay/Backdrop**:
- Fade in/out, 200ms
- Background: `bg-slate-900/50 backdrop-blur-sm`

### 5.3 Loading States

**Skeleton Loaders**:
- Use for cards, tables, charts on initial load
- Animated shimmer effect (gradient sweep)
- Match actual component dimensions

**Spinner**:
- Size: 16px (inline), 24px (button), 48px (page)
- Color: red-500 (primary), slate-400 (secondary)
- Animation: 1s linear infinite rotation

**Progress Bars**:
- Indeterminate (unknown duration): animated gradient slide
- Determinate (known %): fill from left, smooth transition

---

## 6. Responsive Design & Breakpoints

### 6.1 Breakpoints (Tailwind Defaults)

```css
sm:  640px   /* Landscape phones */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large desktops */
```

### 6.2 Mobile Adaptations

**Navigation**:
- Desktop: Fixed left sidebar (240px)
- Mobile: Bottom sheet nav (tap hamburger to expand)
- Tablet: Collapsible sidebar (64px icons only)

**Project Switcher**:
- Desktop: Dropdown (320px wide)
- Mobile: Full-screen modal with search

**Data Grids**:
- Desktop: Full table with all columns
- Tablet: Hide less critical columns, show/hide toggle
- Mobile: Card view (stacked, one row per card)

**Charts**:
- Desktop: Full-width with hover tooltips
- Mobile: Scroll horizontally, tap for tooltips

**Forms**:
- Desktop: Multi-column layouts (e.g., 2-col settings)
- Mobile: Single column, full-width inputs

---

## 7. Accessibility (WCAG 2.1 AA)

### 7.1 Color Contrast

- Text on white: minimum 4.5:1 (use slate-600 or darker)
- Text on red: white text only (verified 4.5:1+)
- Interactive elements: 3:1 contrast with background

### 7.2 Keyboard Navigation

- All interactive elements focusable via Tab
- Focus ring: 2px solid red-500 with 2px offset
- Skip to content link (hidden, visible on focus)
- Modal/dialog traps focus (Esc to close)

### 7.3 Screen Readers

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`
- ARIA labels for icon-only buttons
- ARIA live regions for deployment status updates
- Alt text for all images (logos, diagrams)

### 7.4 Form Accessibility

- Labels associated with inputs (for/id)
- Error messages announced (aria-describedby)
- Required fields marked with aria-required
- Disabled inputs have aria-disabled

---

## 8. Technical Implementation Stack

### 8.1 Core Technologies

**Framework**: React 19 (or Next.js 15 for production)
**Styling**: Tailwind CSS 3.4+
**Component Library**: shadcn/ui patterns (copy/paste components)
**Animation**: Framer Motion 12+
**Icons**: Lucide React (matching showmode design)
**Charts**: Recharts or Visx
**Virtualization**: react-window (for logs, large tables)
**State Management**: Zustand (client state), React Query (server state)

### 8.2 Build Tooling

**Dev Server**: Vite 7+ (fast HMR)
**Package Manager**: npm or pnpm
**CSS**: PostCSS + Autoprefixer
**Type Checking**: TypeScript 5+ (recommended, not required for mock)
**Linting**: ESLint + Prettier

### 8.3 Mock Data Strategy

For the front-end prototype, we'll use:
- **Static JSON files** in `/public/mock-data/` for initial render
- **MSW (Mock Service Worker)** for simulating API responses
- **Fake deployment timelines** with setTimeout to simulate real-time updates
- **Sample WebSocket messages** (can use mock WebSocket lib)

Example mock structure:
```
/public/mock-data/
  ├── projects.json           # List of projects
  ├── environments.json       # Envs per project
  ├── deployments.json        # Deployment history
  ├── logs.json               # Sample log lines
  ├── metrics.json            # Time-series data
  └── domains.json            # Domain configs
```

---

## 9. File Structure (React + Vite)

```
rxt-deploy-mock/
├── public/
│   ├── assets/
│   │   └── logos/
│   │       ├── rackspace-logo.png
│   │       └── rxt_icon.png
│   └── mock-data/           # Static mock JSON
│       ├── projects.json
│       ├── deployments.json
│       └── ...
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── GlobalHeader.jsx
│   │   │   ├── LeftNav.jsx
│   │   │   └── ContentArea.jsx
│   │   ├── navigation/
│   │   │   ├── ProjectSwitcher.jsx
│   │   │   ├── EnvTabs.jsx
│   │   │   └── Breadcrumbs.jsx
│   │   ├── data-display/
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── MetricChart.jsx
│   │   │   ├── LogViewer.jsx
│   │   │   └── DataGrid.jsx
│   │   ├── forms/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   └── ...
│   │   └── ui/              # shadcn/ui components
│   │       ├── avatar.jsx
│   │       ├── dropdown.jsx
│   │       ├── modal.jsx
│   │       └── ...
│   ├── pages/
│   │   ├── Onboarding.jsx
│   │   ├── ProjectOverview.jsx
│   │   ├── DeploymentDetail.jsx
│   │   ├── LogsView.jsx
│   │   ├── MetricsDashboard.jsx
│   │   ├── DomainsManagement.jsx
│   │   └── NetworkingConfig.jsx
│   ├── hooks/
│   │   ├── useProjects.js
│   │   ├── useDeployments.js
│   │   └── useLogs.js
│   ├── store/               # Zustand stores
│   │   ├── uiStore.js
│   │   └── authStore.js
│   ├── lib/
│   │   ├── api.js           # Mock API calls
│   │   └── utils.js
│   ├── styles/
│   │   └── index.css        # Tailwind imports + custom
│   ├── App.jsx              # Main routing component
│   └── main.jsx             # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 10. Page-by-Page Component Breakdown

### 10.1 Onboarding Page

**Components**:
- `<OnboardingShell>` (centered card, max-width 600px)
- `<ProgressStepper>` (visual step indicator: 1→2→3→4)
- `<ConnectRepoCard>` (GitHub/GitLab OAuth buttons)
- `<RepoSelector>` (fuzzy search dropdown)
- `<DeployYamlEditor>` (Monaco editor or CodeMirror)
- `<TemplateSelector>` (radio cards with icons)
- `<EnvSetupForm>` (checkboxes for dev/staging/prod)
- `<ReviewStep>` (summary of all choices)

**Interactions**:
- Auto-advance to next step on valid selection
- Back button to previous step (preserves state)
- Skip optional steps (e.g., template if deploy.yaml exists)

### 10.2 Project Overview Page

**Components**:
- `<ProjectHeader>` (project name, switcher, quick actions)
- `<EnvHealthCards>` (3-column grid, status + quick links)
- `<DeploymentsTable>` (last 10, sortable by time/status)
- `<TrafficChart>` (requests/sec, last 24h)
- `<ErrorRateChart>` (%, last 24h)
- `<DomainStatusList>` (domain + TLS badge)
- `<BudgetWidget>` (progress bar, current/projected spend)

**Data Sources** (mock):
- `/api/projects/:id` → project details
- `/api/projects/:id/environments` → env list + health
- `/api/projects/:id/deployments?limit=10` → recent deploys
- `/api/projects/:id/metrics/traffic?range=24h` → traffic data

### 10.3 Deployment Detail Page

**Components**:
- `<DeploymentHeader>` (status, timestamp, author)
- `<DeploymentTimeline>` (horizontal progress bar with stages)
- `<StepCard>` (accordion for each build/provision/network step)
- `<LiveLogViewer>` (virtualized, auto-scroll, color-coded)
- `<ArtifactPanel>` (collapsible, shows artifact size/download)
- `<DeploymentActions>` (Promote, Rollback, Re-run buttons)

**Real-Time Simulation**:
- Use `setInterval` to advance mock deployment stages every 10s
- Update step cards from "pending" → "in_progress" → "completed"
- Append log lines to log viewer
- Show toast on completion

### 10.4 Logs View Page

**Components**:
- `<LogsHeader>` (page title, export, settings)
- `<LogsFilterBar>` (live toggle, time range, service, level, search)
- `<LogsViewer>` (virtualized list, color-coded, copy on hover)
- `<LogsActions>` (pin query, share link, clear)

**Mock Data**:
- Load `/mock-data/logs.json` (500+ sample log lines)
- Simulate live tail by appending random log every 1-2s (when enabled)

### 10.5 Metrics Dashboard Page

**Components**:
- `<MetricsHeader>` (page title, time range selector, refresh)
- `<MetricChartGrid>` (2-column grid of charts)
- `<MetricChart>` (single chart with title, legend, zoom)
- `<SLOIndicator>` (threshold line on chart)
- `<DeploymentMarker>` (vertical line with tooltip on chart)
- `<MetricsActions>` (add chart, set SLO, create alert)

**Mock Data**:
- Load `/mock-data/metrics.json` (time-series arrays)
- Sample data: 144 points for 24h (10min intervals)
- Random variation within realistic bounds

### 10.6 Domains Management Page

**Components**:
- `<DomainsHeader>` (page title, add domain button)
- `<DomainsTable>` (domain, env, TLS status, actions)
- `<DomainDetailPanel>` (DNS config, CAA records, TLS info)
- `<AddDomainModal>` (3-step wizard)
- `<DNSInstructions>` (copy/paste records)

**Wizards**:
- Step 1: Enter domain name
- Step 2: Select environment to bind
- Step 3: Configure DNS (show A/CNAME/CAA records)
- Auto-provision TLS checkbox (simulates Let's Encrypt)

### 10.7 Networking Configuration Page

**Components**:
- `<NetworkingHeader>` (page title, env selector, add route)
- `<NetworkTopologyMap>` (visual diagram: Internet → LB → Routes → Backends)
- `<RoutesTable>` (path, target port, TLS, sticky, timeout, settings)
- `<MicroSegmentationPicker>` (radio cards for profiles)
- `<FirewallRulesEditor>` (table with add/edit/delete, RBAC-gated)

**Visual Map** (simplified):
```jsx
<div className="flex items-center gap-4 p-6 bg-slate-50 rounded-lg border-2 border-slate-200">
  <div className="text-center">
    <Globe className="h-12 w-12 text-blue-500" />
    <span className="text-xs">Internet</span>
  </div>
  <ArrowRight className="text-slate-400" />
  <div className="text-center">
    <Server className="h-12 w-12 text-red-500" />
    <span className="text-xs">Load Balancer</span>
  </div>
  <ArrowRight className="text-slate-400" />
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Code className="h-8 w-8 text-green-500" />
      <span className="text-xs">/api → :3000</span>
    </div>
    <div className="flex items-center gap-2">
      <Globe className="h-8 w-8 text-purple-500" />
      <span className="text-xs">/ → :8080</span>
    </div>
  </div>
</div>
```

---

## 11. Mock Data Examples

### 11.1 projects.json

```json
[
  {
    "id": "proj_abc123",
    "name": "my-api",
    "orgId": "org_xyz789",
    "repo": "github.com/acme/my-api",
    "branch": "main",
    "createdAt": "2025-10-15T10:00:00Z",
    "updatedAt": "2025-10-21T14:30:00Z"
  },
  {
    "id": "proj_def456",
    "name": "web-app",
    "orgId": "org_xyz789",
    "repo": "github.com/acme/web-app",
    "branch": "main",
    "createdAt": "2025-09-10T08:00:00Z",
    "updatedAt": "2025-10-20T16:00:00Z"
  }
]
```

### 11.2 deployments.json

```json
[
  {
    "id": "deploy_1234",
    "projectId": "proj_abc123",
    "envId": "env_staging",
    "status": "deploying",
    "commit": "a3f5b2c",
    "author": "alice@example.com",
    "startedAt": "2025-10-21T14:32:00Z",
    "currentStep": "provision",
    "steps": [
      {
        "name": "build",
        "status": "completed",
        "duration": 45,
        "logs": [
          "Pulled base image node:20",
          "npm ci (34s)",
          "npm run build (8s)",
          "Artifact created (23.4 MB)"
        ]
      },
      {
        "name": "provision",
        "status": "in_progress",
        "duration": null,
        "logs": [
          "vApp created (vapp-staging-1234)",
          "Configuring compute (2 vCPU, 4GB RAM)",
          "Attaching storage (20GB)..."
        ]
      }
    ]
  }
]
```

### 11.3 logs.json

```json
[
  {
    "timestamp": "2025-10-21T14:32:01Z",
    "level": "info",
    "service": "api",
    "message": "Request received GET /",
    "metadata": { "ip": "192.0.2.10", "path": "/" }
  },
  {
    "timestamp": "2025-10-21T14:32:02Z",
    "level": "error",
    "service": "db",
    "message": "Connection timeout",
    "metadata": { "host": "db.example.com", "timeout": 5000 }
  }
]
```

### 11.4 metrics.json

```json
{
  "latency_p95": {
    "timestamps": ["2025-10-21T00:00:00Z", "2025-10-21T00:10:00Z", ...],
    "values": [120, 135, 142, 128, ...]
  },
  "error_rate": {
    "timestamps": ["2025-10-21T00:00:00Z", "2025-10-21T00:10:00Z", ...],
    "values": [0.2, 0.3, 0.1, 0.5, ...]
  }
}
```

---

## 12. Brand Voice & Messaging

### 12.1 Tone

- **Professional but approachable**: Avoid overly technical jargon in UI copy
- **Action-oriented**: Use verbs (Deploy, Monitor, Scale)
- **Confidence without arrogance**: "We've got you covered" vs. "We're the best"
- **Transparent**: Show errors clearly, don't hide complexity

### 12.2 Key Messaging

**Tagline Options**:
- "Deploy with confidence. Built on Rackspace."
- "From code to cloud in minutes."
- "Developer-first. Enterprise-ready."

**Empty States**:
- Projects list (empty): "Ready to deploy? Connect your first repository."
- Logs (no results): "No logs match your filters. Try broadening your search."
- Deployments (empty): "No deployments yet. Push code or trigger a manual deploy."

**Success Messages**:
- Deployment complete: "Deployment successful! Your app is live."
- Domain added: "Domain configured. DNS propagation may take up to 24 hours."
- Secret rotated: "Secret rotated. Affected environments will redeploy."

**Error Messages**:
- Build failed: "Build failed. Check the logs for details."
- DNS validation failed: "DNS records not found. Verify your DNS configuration."
- Insufficient resources: "Unable to allocate resources. Contact support or upgrade your plan."

### 12.3 Microcopy Examples

**Buttons**:
- Primary action: "Deploy Now", "Add Domain", "Invite Team"
- Secondary action: "View Logs", "Download", "Learn More"
- Danger action: "Delete Environment", "Revoke Access"

**Labels**:
- Form fields: "Project Name", "Repository URL", "Environment Type"
- Settings: "Auto-deploy on push", "Enable preview environments"

**Tooltips**:
- Info icon next to "Micro-segmentation": "Automatic firewall rules based on compliance requirements."
- Help text for "SLO": "Service Level Objective. Your target performance goal."

---

## 13. Compliance & Security Indicators

### 13.1 Compliance Badges

For projects/environments with compliance requirements (PCI, HIPAA), display badges:

```jsx
<ComplianceBadge mode="PCI" />
// Renders: [Shield Icon] PCI Compliant
```

**Badge Styles**:
- PCI: Blue shield icon, blue-600 text
- HIPAA: Green shield icon, green-600 text
- SOC 2: Purple shield icon, purple-600 text

**Placement**:
- Environment cards (top-right corner)
- Project overview header
- Networking config page (active profile indicator)

### 13.2 Security Indicators

**TLS Status**:
- ✓ Auto (Let's Encrypt, auto-renew)
- ✓ Manual (uploaded cert, expiry date shown)
- ✗ None (red warning badge)

**Secrets Visibility**:
- Masked by default: `••••••••••••`
- "Reveal" button (RBAC-gated, logged in audit trail)
- Copy button (copies actual value without revealing)

**Audit Trail Link**:
- Small link in footer of sensitive pages: "View Audit Log"
- Opens modal with recent actions (actor, action, timestamp)

---

## 14. Performance Targets

### 14.1 Load Times

- Initial page load: <2s (LCP)
- Route transition: <300ms
- Chart render: <500ms (up to 1000 data points)
- Log viewer initial render: <1s (100k lines with virtualization)

### 14.2 Responsiveness

- Button click feedback: <100ms (visual state change)
- Form input debounce: 300ms (for search/filter)
- WebSocket message display: <50ms (log append)

### 14.3 Bundle Size

- Initial JS bundle: <200KB gzipped
- Lazy-load heavy components (charts, Monaco editor)
- Use code splitting per route

---

## 15. Testing & Quality Assurance

### 15.1 Visual Regression

- Use Percy or Chromatic for screenshot diffing
- Test all page layouts at 3 breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)
- Test light/dark mode variants (if dark mode is implemented)

### 15.2 Accessibility Testing

- Automated: axe-core, Lighthouse (target 95+ accessibility score)
- Manual: keyboard-only navigation, screen reader (NVDA/JAWS)
- Color contrast: use WebAIM contrast checker

### 15.3 Browser Support

- Modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- No IE11 support
- Graceful degradation for older browsers (fallback fonts, no animations)

### 15.4 User Testing

- Internal dogfooding with 5-10 Rackspace developers
- Usability testing: task completion (e.g., "Deploy a new environment")
- Feedback form embedded in prototype (feedback widget)

---

## 16. Handoff to Development

### 16.1 Design Deliverables

- **This design contract** (comprehensive spec)
- **Figma file** (optional, if visual comps are created)
- **Component library** (Storybook or similar, if built)
- **Mock data files** (JSON samples in repo)

### 16.2 Developer Documentation

- README with setup instructions
- Component usage examples (JSDoc or Storybook stories)
- API mock endpoints documentation (MSW handlers)
- Deployment timeline simulation logic (for real-time demo)

### 16.3 Future Production Considerations

When transitioning from mock to production:

1. **Replace mock data** with real API calls (React Query hooks)
2. **WebSocket integration** for live logs and deployment updates
3. **Auth integration** with Rackspace Identity (OIDC/OAuth)
4. **RBAC enforcement** on client (with server-side validation)
5. **Error handling** with retry logic and user-friendly messages
6. **Analytics** (PostHog, Mixpanel, or similar)
7. **Monitoring** (Sentry for errors, DataDog RUM for performance)

---

## 17. Success Criteria for Prototype

The front-end mock is considered successful if it:

1. **Demonstrates core user flows** (onboarding → deploy → logs → metrics)
2. **Matches brand guidelines** (colors, typography, logos used correctly)
3. **Feels modern and fast** (smooth animations, responsive)
4. **Is accessible** (keyboard nav, screen reader compatible, WCAG AA)
5. **Impresses stakeholders** (internal Rackspace teams, potential customers)
6. **Is easy to iterate on** (modular components, clean code)

**Target Audience for Prototype**:
- Rackspace leadership (for product approval)
- Developer pilot group (for usability feedback)
- Sales/marketing (for demo purposes)

**Timeline**:
- Design: 1 week (this contract + visual comps if needed)
- Development: 2-3 weeks (React prototype with mock data)
- Testing/iteration: 1 week (usability testing, bug fixes)
- **Total: ~1 month to high-fidelity prototype**

---

## 18. Next Steps

1. **Review this design contract** with product and engineering teams
2. **Create visual mockups** in Figma (optional, can code directly)
3. **Set up Vite + React project** in `/showmode/` or new repo
4. **Build core components** (AppShell, navigation, buttons, etc.)
5. **Implement page layouts** starting with Project Overview and Deployment Detail
6. **Add mock data and animations** to simulate real experience
7. **Test with internal users** and iterate based on feedback
8. **Prepare demo script** for stakeholder presentations

---

## 19. Open Questions / Design Decisions Needed

- [ ] **Dark mode**: Should we implement dark mode for the prototype? (Showmode is light-only, but Deploy could benefit from dark mode for log viewing)
- [ ] **Multi-org support**: Do we show org switcher in the prototype, or assume single org?
- [ ] **Notifications**: In-app notifications (toast/bell icon) or email-only for MVP?
- [ ] **Mobile app**: Is a mobile-optimized web app sufficient, or do we need a native app roadmap?
- [ ] **Real-time collaboration**: Should we show "User X is viewing this deployment" indicators (like Figma)?
- [ ] **CLI integration**: Should the prototype show CLI commands (e.g., `rxt deploy` output) or web-only?

---

## 20. Appendix: Design Inspirations

**Platforms to Reference** (for UX patterns):
- **Vercel**: Clean, fast, deployment-centric UI
- **Railway**: Modern aesthetic, excellent deployment timeline
- **Render**: Simple, clear status indicators
- **Netlify**: Great domain/DNS configuration flow
- **Fly.io**: Developer-friendly logs and metrics
- **Cloudflare Pages**: Strong focus on performance metrics

**Rackspace Properties** (for brand consistency):
- Rackspace.com (header/footer, color palette)
- Rackspace Cloud Control Panel (for enterprise customers, reference sparingly)

---

## Conclusion

This design contract serves as the single source of truth for building the RXT Deploy front-end mock. It prioritizes **developer experience**, **Rackspace brand fidelity**, and **production-readiness**, ensuring the prototype can evolve into the real product with minimal redesign.

**Key Takeaways**:
- Modern, Vercel-like UX with Rackspace red branding
- Component-first architecture (shadcn/ui patterns)
- Comprehensive page layouts for all core flows
- Mock data strategy for realistic demo
- Accessibility and performance baked in from day one

Let's build something developers will love. 🚀
