import React from 'react';
import { Route } from 'react-router-dom';

// Phase D — flat canonical service route real template (replaces Phase C placeholder).
const ServicePage6 = React.lazy(() => import('../pages/ServicePageReal'));

// AI & Cognitive services
const AgenticAI = React.lazy(() => import('../pages/services/ai-cognitive/AgenticAI'));
const AICognitiveComputing = React.lazy(() => import('../pages/services/ai-cognitive/AICognitiveComputing'));
const AIGovernance = React.lazy(() => import('../pages/services/ai-cognitive/AIGovernance'));
const DataScienceAI = React.lazy(() => import('../pages/services/ai-cognitive/DataScienceAI'));
const GenAIBusinessServices = React.lazy(() => import('../pages/services/ai-cognitive/GenAIBusinessServices'));
const MLOps = React.lazy(() => import('../pages/services/ai-cognitive/MLOps'));
// Analytics
const Analytics = React.lazy(() => import('../pages/services/analytics-insights/Analytics'));
const BigData = React.lazy(() => import('../pages/services/analytics-insights/BigData'));
// Cloud Engineering
const ManagedCloudServices = React.lazy(() => import('../pages/services/cloud-engineering/ManagedCloudServices'));
const AWS = React.lazy(() => import('../pages/services/cloud-engineering/AWS'));
const MicrosoftServices = React.lazy(() => import('../pages/services/cloud-engineering/MicrosoftServices'));
const GoogleCloudServices = React.lazy(() => import('../pages/services/cloud-engineering/GoogleCloudServices'));
const CloudComputing = React.lazy(() => import('../pages/services/cloud-engineering/CloudComputing'));
// Cybersecurity
const ITSecurityServices = React.lazy(() => import('../pages/services/cybersecurity/ITSecurityServices'));
// Digital Transformation & Modernization
const ApplicationModernization = React.lazy(() => import('../pages/services/digital-transformation-modernization/ApplicationModernization'));
const DigitalTransformation = React.lazy(() => import('../pages/services/digital-transformation-modernization/DigitalTransformation'));
const LegacyModernization = React.lazy(() => import('../pages/services/digital-transformation-modernization/LegacyModernization'));
const TechnologyModernization = React.lazy(() => import('../pages/services/digital-transformation-modernization/TechnologyModernization'));
const TechnologyTransformation = React.lazy(() => import('../pages/services/digital-transformation-modernization/TechnologyTransformation'));
const DigitalBusinessTransformation = React.lazy(() => import('../pages/services/digital-transformation-modernization/DigitalBusinessTransformation'));

// Technology Transformation Pillar Details
const TechnologyLedGrowthStrategy = React.lazy(() => import('../pages/services/digital-transformation-modernization/details/TechnologyLedGrowthStrategy'));
const TechValueOptimization = React.lazy(() => import('../pages/services/digital-transformation-modernization/details/TechValueOptimization'));
const DigitalCoreArchitecture = React.lazy(() => import('../pages/services/digital-transformation-modernization/details/DigitalCoreArchitecture'));
const OperatingModelReinvention = React.lazy(() => import('../pages/services/digital-transformation-modernization/details/OperatingModelReinvention'));
const TransformationGovernance = React.lazy(() => import('../pages/services/digital-transformation-modernization/details/TransformationGovernance'));
const CloudPlatformModernization = React.lazy(() => import('../pages/services/digital-transformation-modernization/details/CloudPlatformModernization'));
const AIStrategyEmbedding = React.lazy(() => import('../pages/services/digital-transformation-modernization/details/AIStrategyEmbedding'));
// Automation
const DigitalProcessAutomation = React.lazy(() => import('../pages/services/automation/DigitalProcessAutomation'));
const RoboticProcessAutomation = React.lazy(() => import('../pages/services/automation/RoboticProcessAutomation'));
const BusinessProcessManagement = React.lazy(() => import('../pages/services/automation/BusinessProcessManagement'));
const IntelligentAutomation = React.lazy(() => import('../pages/services/automation/IntelligentAutomation'));
// Product Engineering
const EmbeddedDesignSystems = React.lazy(() => import('../pages/services/product-engineering/EmbeddedDesignSystems'));
const EngineeringFoundry = React.lazy(() => import('../pages/services/product-engineering/EngineeringFoundry'));
const EngineeringRDServices = React.lazy(() => import('../pages/services/product-engineering/EngineeringRDServices'));
const ProductDigitalEngineering = React.lazy(() => import('../pages/services/product-engineering/ProductDigitalEngineering'));
const QualityEngineeringAssurance = React.lazy(() => import('../pages/services/product-engineering/QualityEngineeringAssurance'));
const DevopsAsAService = React.lazy(() => import('../pages/services/product-engineering/DevopsAsAService'));
// Infrastructure
const ManagedInfrastructureServices = React.lazy(() => import('../pages/services/infrastructure-networks-operations/ManagedInfrastructureServices'));
const ModernizationInfrastructure = React.lazy(() => import('../pages/services/infrastructure-networks-operations/ModernizationInfrastructure'));
const ManagedServicesInfra = React.lazy(() => import('../pages/services/infrastructure-networks-operations/ManagedServices'));
const SupportMaintenance = React.lazy(() => import('../pages/services/infrastructure-networks-operations/SupportMaintenance'));
const OperationTechnology = React.lazy(() => import('../pages/services/infrastructure-networks-operations/OperationTechnology'));
// Consulting & Advisory
const TechnologyConsulting = React.lazy(() => import('../pages/services/consulting-advisory/TechnologyConsulting'));
const StrategyConsulting = React.lazy(() => import('../pages/services/consulting-advisory/StrategyConsulting'));
const DiscoverFrameWorkshops = React.lazy(() => import('../pages/services/consulting-advisory/DiscoverFrameWorkshops'));
// Product Software Platform
const MVPAcceleration = React.lazy(() => import('../pages/services/digital-engineering/MVPAcceleration'));
const ProductStrategyExperienceDesign = React.lazy(() => import('../pages/services/digital-engineering/ProductStrategyExperienceDesign'));
const SoftwareDevelopment = React.lazy(() => import('../pages/services/digital-engineering/SoftwareDevelopment'));
const APIMicroservicesEngineering = React.lazy(() => import('../pages/services/digital-engineering/APIMicroservicesEngineering'));
// Enterprise Applications
const EnterprisePlatformIntegration = React.lazy(() => import('../pages/services/enterprise-applications/EnterprisePlatformIntegration'));
const Pimcore = React.lazy(() => import('../pages/services/enterprise-applications/Pimcore'));
const Salesforce = React.lazy(() => import('../pages/services/enterprise-applications/Salesforce'));
const Servicenow = React.lazy(() => import('../pages/services/enterprise-applications/Servicenow'));
// Emerging Technologies
const Blockchain = React.lazy(() => import('../pages/services/emerging-technologies/Blockchain'));
const InternetOfThings = React.lazy(() => import('../pages/services/emerging-technologies/InternetOfThings'));
// Business Operations
const FinanceRiskManagement = React.lazy(() => import('../pages/services/business-operations/FinanceRiskManagement'));
const GlobalCapabilityCenters = React.lazy(() => import('../pages/services/business-operations/GlobalCapabilityCenters'));
const TalentOrganization = React.lazy(() => import('../pages/services/business-operations/TalentOrganization'));
const SupplyChain = React.lazy(() => import('../pages/services/business-operations/SupplyChain'));
const UnifiedServicesManagement = React.lazy(() => import('../pages/services/business-operations/UnifiedServicesManagement'));

// Digital Marketing
const SEOOrganicGrowthStrategy = React.lazy(() => import('../pages/services/digital-marketing/SEOOrganicGrowthStrategy'));
const SocialMediaManagement = React.lazy(() => import('../pages/services/digital-marketing/SocialMediaManagement'));
const PerformanceMarketing = React.lazy(() => import('../pages/services/digital-marketing/PerformanceMarketing'));
const CDPStrategy = React.lazy(() => import('../pages/services/digital-marketing/CDPStrategy'));
const MarketingAIReadiness = React.lazy(() => import('../pages/services/digital-marketing/MarketingAIReadiness'));

// Conversion Engineering
const ConversionRateOptimization = React.lazy(() => import('../pages/services/conversion-engineering/ConversionRateOptimization'));
const CampaignPlanning = React.lazy(() => import('../pages/services/conversion-engineering/CampaignPlanning'));
const GrowthFunnelsConversion = React.lazy(() => import('../pages/services/conversion-engineering/GrowthFunnelsConversion'));

// Other Services
const PostDeliverySupport = React.lazy(() => import('../pages/services/other/PostDeliverySupport'));




/**
 * Service Routes - All 77 service pages
 */
export const serviceRoutes = [
  // Phase D — flat canonical service route with real template (replaces Phase C placeholder).
  // React Router 6/7 picks the MORE SPECIFIC path automatically, so the 2-segment
  // legacy routes below still win for /services/<dept>/<slug> URLs. The flat
  // /services/:slug route catches the new 1-segment canonical URLs.
  <Route key="service-flat" path="/services/:slug" element={<ServicePage6 />} />,

  // AI & Cognitive (6)
  <Route key="agentic-ai" path="/services/ai-cognitive/agentic-ai" element={<AgenticAI />} />,
  <Route key="ai-cognitive-computing" path="/services/ai-cognitive/ai-cognitive-computing" element={<AICognitiveComputing />} />,
  <Route key="ai-governance" path="/services/ai-cognitive/ai-governance" element={<AIGovernance />} />,
  <Route key="data-science-ai" path="/services/ai-cognitive/data-science-ai" element={<DataScienceAI />} />,
  <Route key="genai-business" path="/services/ai-cognitive/genai-business-services" element={<GenAIBusinessServices />} />,
  <Route key="mlops" path="/services/ai-cognitive/mlops" element={<MLOps />} />,
  
  // Analytics & Insights (2)
  <Route key="analytics" path="/services/analytics-insights/analytics" element={<Analytics />} />,
  <Route key="big-data" path="/services/analytics-insights/big-data" element={<BigData />} />,
  
  // Cloud Engineering (5)
  <Route key="managed-cloud" path="/services/cloud-engineering/managed-cloud-services" element={<ManagedCloudServices />} />,
  <Route key="aws" path="/services/cloud-engineering/aws" element={<AWS />} />,
  <Route key="microsoft" path="/services/cloud-engineering/microsoft-services" element={<MicrosoftServices />} />,
  <Route key="google-cloud" path="/services/cloud-engineering/google-cloud-services" element={<GoogleCloudServices />} />,
  <Route key="cloud-computing" path="/services/cloud-engineering/cloud-computing" element={<CloudComputing />} />,
  
  // Cybersecurity (1)
  <Route key="it-security" path="/services/cybersecurity/it-security-services" element={<ITSecurityServices />} />,
  
  // Digital Transformation (6)
  <Route key="app-modernization" path="/services/digital-transformation-modernization/application-modernization" element={<ApplicationModernization />} />,
  <Route key="digital-transformation" path="/services/digital-transformation-modernization/digital-transformation" element={<DigitalTransformation />} />,
  <Route key="legacy-modernization" path="/services/digital-transformation-modernization/legacy-modernization" element={<LegacyModernization />} />,
  <Route key="tech-modernization" path="/services/digital-transformation-modernization/technology-modernization" element={<TechnologyModernization />} />,
  <Route key="tech-transformation" path="/services/digital-transformation-modernization/technology-transformation" element={<TechnologyTransformation />} />,
  <Route key="digital-business" path="/services/digital-transformation-modernization/digital-business-transformation" element={<DigitalBusinessTransformation />} />,
  
  // Technology Transformation Details
  <Route key="tt-growth" path="/services/digital-transformation-modernization/technology-transformation/growth-strategy" element={<TechnologyLedGrowthStrategy />} />,
  <Route key="tt-value" path="/services/digital-transformation-modernization/technology-transformation/value-optimization" element={<TechValueOptimization />} />,
  <Route key="tt-core" path="/services/digital-transformation-modernization/technology-transformation/digital-core" element={<DigitalCoreArchitecture />} />,
  <Route key="tt-ops" path="/services/digital-transformation-modernization/technology-transformation/operating-model" element={<OperatingModelReinvention />} />,
  <Route key="tt-gov" path="/services/digital-transformation-modernization/technology-transformation/governance" element={<TransformationGovernance />} />,
  <Route key="tt-cloud" path="/services/digital-transformation-modernization/technology-transformation/cloud-platform" element={<CloudPlatformModernization />} />,
  <Route key="tt-ai" path="/services/digital-transformation-modernization/technology-transformation/ai-strategy" element={<AIStrategyEmbedding />} />,
  
  // Automation (5)
  <Route key="digital-process" path="/services/automation/digital-process-automation" element={<DigitalProcessAutomation />} />,
  <Route key="rpa" path="/services/automation/robotic-process-automation" element={<RoboticProcessAutomation />} />,
  <Route key="bpm" path="/services/automation/business-process-management" element={<BusinessProcessManagement />} />,
  <Route key="intelligent-automation" path="/services/automation/intelligent-automation" element={<IntelligentAutomation />} />,
  
  // Product Engineering (7)
  <Route key="embedded-design" path="/services/product-engineering/embedded-design-systems" element={<EmbeddedDesignSystems />} />,
  <Route key="engineering-foundry" path="/services/product-engineering/engineering-foundry" element={<EngineeringFoundry />} />,
  <Route key="engineering-rd" path="/services/product-engineering/engineering-rd-services" element={<EngineeringRDServices />} />,
  <Route key="product-digital" path="/services/product-engineering/product-digital-engineering" element={<ProductDigitalEngineering />} />,

  <Route key="quality-engineering" path="/services/product-engineering/quality-engineering-assurance" element={<QualityEngineeringAssurance />} />,
  <Route key="devops" path="/services/product-engineering/devops-as-a-service" element={<DevopsAsAService />} />,
  
  // Infrastructure (5)
  <Route key="managed-infra" path="/services/infrastructure-networks-operations/managed-infrastructure-services" element={<ManagedInfrastructureServices />} />,
  <Route key="modernization-infra" path="/services/infrastructure-networks-operations/modernization-infrastructure" element={<ModernizationInfrastructure />} />,
  <Route key="managed-services" path="/services/infrastructure-networks-operations/managed-services" element={<ManagedServicesInfra />} />,
  <Route key="support-maintenance" path="/services/infrastructure-networks-operations/support-maintenance" element={<SupportMaintenance />} />,
  <Route key="operation-tech" path="/services/infrastructure-networks-operations/operation-technology" element={<OperationTechnology />} />,
  
  // Consulting & Advisory (3)
  <Route key="tech-consulting" path="/services/consulting-advisory/technology-consulting" element={<TechnologyConsulting />} />,
  <Route key="strategy-consulting" path="/services/consulting-advisory/strategy-consulting" element={<StrategyConsulting />} />,
  <Route key="discover-frame" path="/services/consulting-advisory/discover-frame-workshops" element={<DiscoverFrameWorkshops />} />,
  
  // Product Software Platform (5)
  <Route key="mvp-acceleration" path="/services/digital-engineering/mvp-acceleration" element={<MVPAcceleration />} />,
  <Route key="product-strategy" path="/services/digital-engineering/product-strategy-experience-design" element={<ProductStrategyExperienceDesign />} />,
  <Route key="software-development" path="/services/digital-engineering/software-development" element={<SoftwareDevelopment />} />,
  <Route key="api-microservices" path="/services/digital-engineering/api-microservices-engineering" element={<APIMicroservicesEngineering />} />,
  
  // Enterprise Applications (6)
  <Route key="enterprise-integration" path="/services/enterprise-applications/enterprise-platform-integration" element={<EnterprisePlatformIntegration />} />,
  <Route key="pimcore" path="/services/enterprise-applications/pimcore" element={<Pimcore />} />,
  <Route key="salesforce" path="/services/enterprise-applications/salesforce" element={<Salesforce />} />,
  <Route key="servicenow" path="/services/enterprise-applications/servicenow" element={<Servicenow />} />,

  
  // Emerging Technologies (3)
  <Route key="blockchain" path="/services/emerging-technologies/blockchain" element={<Blockchain />} />,

  <Route key="iot" path="/services/emerging-technologies/internet-of-things" element={<InternetOfThings />} />,
  
  // Business Operations (5)
  <Route key="finance-risk" path="/services/business-operations/finance-risk-management" element={<FinanceRiskManagement />} />,
  <Route key="gcc" path="/services/business-operations/global-capability-centers" element={<GlobalCapabilityCenters />} />,
  <Route key="talent-org" path="/services/business-operations/talent-organization" element={<TalentOrganization />} />,
  <Route key="supply-chain" path="/services/business-operations/supply-chain" element={<SupplyChain />} />,
  <Route key="unified-services" path="/services/business-operations/unified-services-management" element={<UnifiedServicesManagement />} />,
  

  
  // Digital Marketing (5)
  <Route key="seo-organic" path="/services/digital-marketing/seo-organic-growth-strategy" element={<SEOOrganicGrowthStrategy />} />,
  <Route key="social-media" path="/services/digital-marketing/social-media-management" element={<SocialMediaManagement />} />,
  <Route key="performance-marketing" path="/services/digital-marketing/performance-marketing" element={<PerformanceMarketing />} />,
  <Route key="cdp-strategy" path="/services/digital-marketing/cdp-strategy" element={<CDPStrategy />} />,
  <Route key="marketing-ai" path="/services/digital-marketing/marketing-ai-readiness" element={<MarketingAIReadiness />} />,

  // Conversion Engineering (3)
  <Route key="conversion-rate" path="/services/conversion-engineering/conversion-rate-optimization" element={<ConversionRateOptimization />} />,
  <Route key="campaign-planning" path="/services/conversion-engineering/campaign-planning" element={<CampaignPlanning />} />,
  <Route key="growth-funnels" path="/services/conversion-engineering/growth-funnels-conversion-engineering" element={<GrowthFunnelsConversion />} />,
  
  // Other Services
  <Route key="post-delivery-support" path="/services/post-delivery-support" element={<PostDeliverySupport />} />
];

export default serviceRoutes;
