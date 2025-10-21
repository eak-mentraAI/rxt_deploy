# RXT Deploy Frontend Architecture v2.0
## Platform-Agnostic Design

**Version:** 2.0  
**Date:** October 2025  
**Focus:** Multi-platform deployment experience (SDDC Flex + RXT SPOT)

---

## Architecture Philosophy

The frontend is **platform-agnostic** by design. Users deploy applications without needing to understand whether they're running on VMs (SDDC Flex) or containers (RXT SPOT). The UI abstracts infrastructure differences while providing visibility into platform-specific details when needed.

### Core Principles

1. **Unified Deployment Experience** - Same workflow regardless of platform
2. **Progressive Disclosure** - Hide complexity by default, expose details on demand
3. **Platform Transparency** - Show which platform is running the workload
4. **Portability First** - Enable easy migration between platforms
5. **Escape Hatches** - Allow power users to access platform-specific features

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | React 19 | Modern hooks, concurrent rendering |
| **Build Tool** | Vite | Fast HMR, optimized builds |
| **Styling** | Tailwind CSS v4 | Utility-first, CSS-based config |
| **Animations** | Framer Motion | Smooth transitions, gestures |
| **Routing** | React Router v6 | Client-side navigation |
| **State Management** | Zustand + React Query | Client state + server state |
| **Data Visualization** | Recharts | Metrics/usage charts |
| **Icons** | Lucide React | Consistent, customizable |
| **Type Safety** | TypeScript (future) | Gradual adoption |

---

## Information Architecture

### Route Structure

```
/auth/*                           SSO callback, login
/onboarding                       First-time setup wizard
/orgs/:orgId                      Organization dashboard
/orgs/:orgId/projects             Project list

/projects/:projectId              Project overview
  /overview                       Dashboard with cross-platform metrics
  /environments                   Environment list (all platforms)
  /environments/:envId
    /overview                     Environment dashboard
    /deployments                  Deployment history
    /deployments/:deployId        Live deployment detail
    /logs                         Unified log viewer
    /metrics                      Performance metrics
    /domains                      Domain & TLS management
    /networking                   Network configuration
    /secrets                      Secrets & config vars
    /settings                     Environment settings
  
  /templates                      Deployment templates
  /usage                          Cost & resource usage
  /access                         Team & RBAC
  /settings                       Project-level settings
    /platform                     Platform adapter configuration
    /placement                    Workload placement preferences
  
/platform-status                  Multi-platform health dashboard
/support                          Help & documentation
```

---

## Platform Abstraction in UI

### 1. Environment Cards

Environments display **platform badges** but with consistent actions:

```jsx
<EnvironmentCard>
  <Header>
    <Name>Production</Name>
    <PlatformBadge 
      platform="sddc-flex"  // or "rxt-spot"
      icon={<VmIcon />}      // or <ContainerIcon />
    />
    <StatusBadge status="healthy" />
  </Header>
  
  <Metrics>
    <Stat label="CPU" value="45%" />
    <Stat label="Memory" value="62%" />
    <Stat label="Replicas" value="3" />  {/* VMs or Pods */}
  </Metrics>
  
  <Actions>
    <Button>Deploy</Button>
    <Button>Scale</Button>
    <Button>Logs</Button>
  </Actions>
</EnvironmentCard>
```

### 2. Deployment Detail

Shows platform-specific details in expandable sections:

```jsx
<DeploymentDetail>
  <Timeline>
    <Step name="Build" status="completed" />
    <Step name="Provision" status="in-progress">
      {/* Platform-specific details */}
      {platform === 'sddc-flex' && (
        <Details>
          <Item>Creating vApp template...</Item>
          <Item>Provisioning 3 VMs via vCenter</Item>
          <Item>Configuring NSX load balancer</Item>
        </Details>
      )}
      {platform === 'rxt-spot' && (
        <Details>
          <Item>Creating Kubernetes namespace</Item>
          <Item>Deploying pods (replicas: 3)</Item>
          <Item>Configuring Ingress controller</Item>
        </Details>
      )}
    </Step>
    <Step name="Network" status="pending" />
    <Step name="Health Check" status="pending" />
  </Timeline>
</DeploymentDetail>
```

### 3. Platform Selector (Settings)

Allow users to set platform preferences:

```jsx
<PlatformSettings>
  <RadioGroup value={platformPreference}>
    <Option value="auto">
      <Icon><Sparkles /></Icon>
      <Label>Automatic</Label>
      <Description>
        Let RXT Deploy choose the best platform based on your workload
      </Description>
    </Option>
    
    <Option value="vm">
      <Icon><Server /></Icon>
      <Label>SDDC Flex (VMs)</Label>
      <Description>
        VMware Cloud Foundation - ideal for stateful apps and compliance
      </Description>
    </Option>
    
    <Option value="container">
      <Icon><Container /></Icon>
      <Label>RXT SPOT (Kubernetes)</Label>
      <Description>
        Container platform - ideal for cloud-native microservices
      </Description>
    </Option>
  </RadioGroup>
  
  {platformPreference === 'auto' && (
    <PlacementHints>
      <Checkbox>Require PCI-DSS compliance</Checkbox>
      <Checkbox>Need persistent storage</Checkbox>
      <Checkbox>Expect aggressive scaling</Checkbox>
    </PlacementHints>
  )}
</PlatformSettings>
```

---

## Key Pages & Features

### 1. Project Overview

**Multi-Platform Dashboard**

Shows aggregated metrics across all platforms:

```jsx
<ProjectOverview>
  <Header>
    <ProjectName />
    <PlatformDistribution>
      {/* Visual breakdown */}
      <Stat label="SDDC Flex" value="2 envs" />
      <Stat label="RXT SPOT" value="3 envs" />
    </PlatformDistribution>
  </Header>
  
  <EnvironmentGrid>
    {environments.map(env => (
      <EnvironmentCard 
        key={env.id}
        platform={env.platform}  // sddc-flex | rxt-spot
        {...env}
      />
    ))}
  </EnvironmentGrid>
  
  <RecentDeployments />
  <CrossPlatformMetrics />
  <CostBreakdown />
</ProjectOverview>
```

### 2. Environment Detail

**Unified View with Platform Context**

```jsx
<EnvironmentDetail>
  <Tabs>
    <Tab name="Overview">
      <PlatformInfo>
        <Badge>Running on {platform.name}</Badge>
        <MigrationButton>
          Migrate to {otherPlatform.name}
        </MigrationButton>
      </PlatformInfo>
      
      <Resources>
        {/* Abstracted view */}
        <Stat label="Compute Units" value="4 vCPU" />
        <Stat label="Memory" value="8 GB" />
        <Stat label="Instances" value="3" />
      </Resources>
      
      <PlatformDetails collapsible>
        {/* Platform-specific info */}
        {platform === 'sddc-flex' && (
          <>
            <Detail label="vCenter Cluster" value="cluster-01" />
            <Detail label="NSX Edge" value="edge-gw-01" />
            <Detail label="vApp" value="my-api-prod" />
          </>
        )}
        {platform === 'rxt-spot' && (
          <>
            <Detail label="Namespace" value="my-api-prod" />
            <Detail label="Deployment" value="my-api-prod-deploy" />
            <Detail label="Ingress Class" value="nginx" />
          </>
        )}
      </PlatformDetails>
    </Tab>
    
    <Tab name="Deployments">
      <DeploymentHistory platform={platform} />
    </Tab>
    
    <Tab name="Logs">
      <UnifiedLogViewer>
        {/* Same log viewer regardless of platform */}
        {/* Backend normalizes VM logs vs K8s logs */}
      </UnifiedLogViewer>
    </Tab>
    
    <Tab name="Metrics">
      <MetricsCharts>
        {/* Platform-agnostic metrics */}
        <Chart title="Request Latency" />
        <Chart title="Error Rate" />
        <Chart title="CPU Utilization" />
      </MetricsCharts>
    </Tab>
  </Tabs>
</EnvironmentDetail>
```

### 3. Deployment Detail

**Platform-Aware Timeline**

```jsx
<DeploymentDetail>
  <Header>
    <CommitInfo />
    <PlatformBadge platform={deployment.platform} />
    <StatusBadge status={deployment.status} />
  </Header>
  
  <Timeline>
    {/* Universal steps */}
    <Step name="Build" icon={<Hammer />}>
      <Logs>
        {/* Docker build logs - same for both platforms */}
      </Logs>
    </Step>
    
    {/* Platform-divergent steps */}
    <Step name="Provision" icon={<Zap />}>
      <PlatformSpecificLogs platform={platform}>
        {platform === 'sddc-flex' && (
          <VmProvisioningLogs />
        )}
        {platform === 'rxt-spot' && (
          <K8sDeploymentLogs />
        )}
      </PlatformSpecificLogs>
    </Step>
    
    <Step name="Network" icon={<Network />}>
      {/* Abstracted view of network setup */}
    </Step>
    
    <Step name="Health Check" icon={<Heart />}>
      {/* Same health checks regardless of platform */}
    </Step>
    
    <Step name="Live" icon={<CheckCircle />}>
      <SuccessMessage>
        Deployed to {deployment.url}
      </SuccessMessage>
    </Step>
  </Timeline>
  
  <Actions>
    <Button variant="primary">Promote to Staging</Button>
    <Button>Rollback</Button>
    <Button>Re-deploy</Button>
    {canMigratePlatform && (
      <Button>Migrate to {otherPlatform.name}</Button>
    )}
  </Actions>
</DeploymentDetail>
```

### 4. Networking Page

**Platform-Abstracted Network Config**

```jsx
<NetworkingPage>
  <Topology>
    {/* Visual diagram works for both platforms */}
    <LoadBalancer />
    <Instances count={replicas} platform={platform} />
    <Database />
    <Cache />
  </Topology>
  
  <Configuration>
    <Section title="Load Balancing">
      {/* Unified config that maps to NSX LB or K8s Service */}
      <Field label="Algorithm" value="round-robin" />
      <Field label="Health Check Path" value="/health" />
      <Field label="Timeout" value="30s" />
    </Section>
    
    <Section title="Domains & TLS">
      {/* Same for both platforms */}
      <DomainList />
      <TlsCertificates />
    </Section>
    
    <Section title="Firewall Rules">
      {/* Maps to NSX DFW or K8s NetworkPolicy */}
      <RulesList />
    </Section>
    
    {/* Platform-specific advanced settings */}
    <AdvancedSettings collapsible platform={platform}>
      {platform === 'sddc-flex' && (
        <NsxAdvancedSettings />
      )}
      {platform === 'rxt-spot' && (
        <K8sIngressSettings />
      )}
    </AdvancedSettings>
  </Configuration>
</NetworkingPage>
```

### 5. Templates Page

**Platform-Aware Templates**

```jsx
<TemplatesPage>
  <Filter>
    <PlatformFilter>
      <Option value="all">All Platforms</Option>
      <Option value="vm">VM-optimized</Option>
      <Option value="container">Container-native</Option>
      <Option value="portable">Fully Portable</Option>
    </PlatformFilter>
  </Filter>
  
  <TemplateGrid>
    {templates.map(template => (
      <TemplateCard key={template.id}>
        <Icon>{template.icon}</Icon>
        <Name>{template.name}</Name>
        <Description>{template.description}</Description>
        
        <PlatformCompatibility>
          {template.platforms.map(platform => (
            <Badge key={platform}>
              {platform === 'vm' && <VmIcon />}
              {platform === 'container' && <ContainerIcon />}
            </Badge>
          ))}
        </PlatformCompatibility>
        
        <Metadata>
          <Stat label="Deployments" value={template.usage} />
          <Stat label="Build Time" value={template.buildTime} />
        </Metadata>
        
        <Button>Use Template</Button>
      </TemplateCard>
    ))}
  </TemplateGrid>
</TemplatesPage>
```

### 6. Usage & Billing

**Cross-Platform Cost Dashboard**

```jsx
<UsagePage>
  <Summary>
    <TotalCost period="monthly" />
    <CostBreakdown>
      <Segment 
        label="SDDC Flex" 
        value={costs.sddc}
        color="blue"
      />
      <Segment 
        label="RXT SPOT" 
        value={costs.spot}
        color="green"
      />
    </CostBreakdown>
  </Summary>
  
  <Charts>
    <CostTrendChart>
      {/* Shows both platforms over time */}
      <Series name="SDDC Flex (VMs)" data={sddcData} />
      <Series name="RXT SPOT (K8s)" data={spotData} />
    </CostTrendChart>
    
    <ResourceUsageChart>
      <Series name="CPU Hours" />
      <Series name="Memory Hours" />
      <Series name="Storage GB-Hours" />
    </ResourceUsageChart>
  </Charts>
  
  <EnvironmentBreakdown>
    <Table>
      <Row>
        <Cell>Production</Cell>
        <Cell><PlatformBadge platform="sddc-flex" /></Cell>
        <Cell>$423.50</Cell>
      </Row>
      <Row>
        <Cell>Staging</Cell>
        <Cell><PlatformBadge platform="rxt-spot" /></Cell>
        <Cell>$87.20</Cell>
      </Row>
    </Table>
  </EnvironmentBreakdown>
  
  <Optimization>
    <Recommendations>
      <Recommendation>
        <Icon><Lightbulb /></Icon>
        <Message>
          Migrate "staging" to SDDC Flex for 15% cost savings
        </Message>
        <Button>Review Migration</Button>
      </Recommendation>
    </Recommendations>
  </Optimization>
</UsagePage>
```

### 7. Platform Status Page

**New:** Global platform health dashboard

```jsx
<PlatformStatusPage>
  <Header>
    <Title>Platform Status</Title>
    <LastUpdated>2 minutes ago</LastUpdated>
  </Header>
  
  <PlatformCards>
    <PlatformCard>
      <Name>SDDC Flex</Name>
      <Status status="operational" />
      <Metrics>
        <Stat label="Capacity" value="67% utilized" />
        <Stat label="Active VMs" value="1,247" />
        <Stat label="Avg Provision Time" value="3m 24s" />
      </Metrics>
      <Incidents>
        <NoIncidents />
      </Incidents>
    </PlatformCard>
    
    <PlatformCard>
      <Name>RXT SPOT</Name>
      <Status status="operational" />
      <Metrics>
        <Stat label="Capacity" value="42% utilized" />
        <Stat label="Active Pods" value="3,892" />
        <Stat label="Avg Provision Time" value="47s" />
      </Metrics>
      <Incidents>
        <NoIncidents />
      </Incidents>
    </PlatformCard>
  </PlatformCards>
  
  <RecentIncidents>
    {/* Historical platform incidents */}
  </RecentIncidents>
</PlatformStatusPage>
```

---

## Component Library

### Platform-Aware Components

#### `<PlatformBadge>`
```jsx
<PlatformBadge 
  platform="sddc-flex"  // or "rxt-spot"
  size="sm"
  showIcon={true}
/>
```

#### `<PlatformSelector>`
```jsx
<PlatformSelector
  value={platform}
  onChange={setPlatform}
  options={['auto', 'vm', 'container']}
  showRecommendation={true}
/>
```

#### `<MigrationWizard>`
```jsx
<MigrationWizard
  environment={env}
  fromPlatform="sddc-flex"
  toPlatform="rxt-spot"
  onComplete={handleMigration}
/>
```

#### `<UnifiedMetricChart>`
```jsx
<UnifiedMetricChart
  metric="cpu_usage"
  environments={[env1, env2]}  // Can be different platforms
  groupBy="platform"
/>
```

---

## State Management

### Server State (React Query)

```typescript
// Unified queries work across platforms
const { data: environments } = useQuery({
  queryKey: ['environments', projectId],
  queryFn: fetchEnvironments
});

// Platform-specific data automatically included
environment = {
  id: 'env-123',
  name: 'production',
  platform: 'sddc-flex',  // or 'rxt-spot'
  platformDetails: {
    // Platform-specific metadata
    vcenterId: 'vc-01',
    clusterId: 'cluster-01'
  },
  resources: {
    cpu: 4,
    memory: 8,
    replicas: 3
  }
}
```

### Client State (Zustand)

```typescript
interface AppState {
  // UI preferences
  selectedPlatformFilter: 'all' | 'vm' | 'container';
  showPlatformDetails: boolean;
  
  // Actions
  setSelectedPlatformFilter: (filter: string) => void;
  togglePlatformDetails: () => void;
}
```

---

## Platform-Specific Escape Hatches

For power users who need platform-specific features:

### Advanced Settings Section

```jsx
<EnvironmentSettings>
  <StandardSettings>
    {/* Cross-platform settings */}
  </StandardSettings>
  
  <AdvancedSettings>
    <Alert variant="warning">
      Platform-specific settings below may impact portability
    </Alert>
    
    {platform === 'sddc-flex' && (
      <SddcFlexAdvanced>
        <Field label="vApp Network Mode" />
        <Field label="NSX Edge Size" />
        <Field label="VM Hardware Version" />
      </SddcFlexAdvanced>
    )}
    
    {platform === 'rxt-spot' && (
      <RxtSpotAdvanced>
        <Field label="Pod Security Policy" />
        <Field label="Service Mesh" />
        <Field label="Node Affinity Rules" />
      </RxtSpotAdvanced>
    )}
  </AdvancedSettings>
</EnvironmentSettings>
```

---

## Responsive Design

### Mobile Considerations

- **Platform badges** are always visible for context
- **Platform details** collapse into expandable sections
- **Cross-platform comparisons** use vertical stacks on mobile
- **Migration flows** are wizard-based with clear steps

---

## Accessibility

- Platform differences are **not color-only** (use icons + text)
- Screen readers announce platform type on focus
- Keyboard navigation works consistently across platform views
- High contrast mode maintains platform distinction

---

## Performance Optimizations

1. **Code Splitting**: Platform-specific components lazy load
2. **Virtualization**: Large environment lists virtualized
3. **Caching**: Platform capabilities cached client-side
4. **Prefetching**: Next likely platform data prefetched

---

## Future Enhancements

### Phase 2
- AI-powered platform recommendations
- Multi-platform A/B testing
- Cost simulation before migration
- Platform capacity forecasting

### Phase 3
- Visual platform comparison tool
- Hybrid deployments (split across platforms)
- Custom platform adapters (extensibility)
- Real-time migration progress

---

**End of Frontend Architecture v2.0**
