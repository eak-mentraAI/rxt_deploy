# RXT Deploy - Frontend

A modern, developer-friendly PaaS platform interface for Rackspace SDDC Flex infrastructure. Built with React, Vite, and Tailwind CSS.

## Overview

RXT Deploy provides an intuitive web interface for deploying and managing applications on Rackspace infrastructure. Think Vercel or Railway, but built on Rackspace's enterprise-grade SDDC Flex platform.

## Features

### Core Functionality
- **Project Overview Dashboard** - Monitor all deployments, environments, and metrics at a glance
- **Environment Management** - Manage production, staging, and development environments
- **Deployment Pipeline** - Track deployment progress with live status updates and logs
- **Real-time Logs** - Live tail logs with search and filtering
- **Performance Metrics** - Monitor latency, throughput, and error rates with SLO tracking
- **Custom Domains** - Manage domains with automatic TLS certificate provisioning

### Advanced Features
- **Project Switcher** - Quick navigation between multiple projects
- **Templates & Blueprints** - Pre-configured deployment templates (Next.js, Node, Python, etc.)
- **Network Topology** - Visual network architecture with interactive diagrams
- **Secrets Management** - Encrypted environment variables and API keys
- **Usage & Billing** - Track resource consumption and costs
- **Team & Access Control** - Role-based access control (Owner, Admin, Developer, Viewer)
- **Onboarding Wizard** - Guided setup for new projects

## Tech Stack

- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS with CSS-based configuration
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization for metrics and usage
- **Lucide React** - Beautiful, consistent icons

## Brand Design

### Colors
- **Primary Red**: `#E01F27` (rxt-red-primary)
- **Dark Red**: `#C91A21` (rxt-red-dark)
- **Light Red**: `#FF4449` (rxt-red-light)
- **Neutrals**: Slate palette (50-900)

### Status Colors
- **Healthy/Success**: Green
- **Deploying/Warning**: Yellow (with animated pulse)
- **Error/Failed**: Red
- **Paused**: Gray

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

The app will be available at \`http://localhost:5173\`

## Project Structure

\`\`\`
frontend/
├── public/
│   ├── assets/
│   │   └── logos/          # RXT brand logos
│   └── mock-data/          # Mock JSON data for development
├── src/
│   ├── components/
│   │   ├── layout/         # AppShell, Header, Navigation
│   │   ├── ui/             # Reusable UI components
│   │   ├── data-display/   # StatusBadge, etc.
│   │   └── onboarding/     # Onboarding wizard
│   ├── pages/              # Page components
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind config
└── package.json
\`\`\`

## Key Pages

- **Project Overview** (`/`) - Central dashboard
- **Environments** (`/environments`) - Environment management
- **Deployments** (`/deployments`) - Deployment history and tracking
- **Logs** (`/logs`) - Real-time log viewer
- **Metrics** (`/metrics`) - Performance monitoring
- **Domains** (`/domains`) - Domain and TLS management
- **Templates** (`/templates`) - Deployment templates
- **Usage** (`/usage`) - Resource usage and billing
- **Networking** (`/networking`) - Network topology
- **Secrets** (`/secrets`) - Secrets management
- **Settings** (`/settings`) - Project and team settings

## Development

The application uses mock JSON data from `/public/mock-data/` for development. In production, these would connect to the RXT Deploy API.

## License

Proprietary - Rackspace Technology

---

Built with ❤️ by the RXT Deploy team at Rackspace Technology
