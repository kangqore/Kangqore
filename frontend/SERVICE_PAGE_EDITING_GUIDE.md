# Service Page Editing Guide

## Overview
Each of the 77 service pages is now a self-contained file with all its data. You can easily customize any service page by editing its corresponding file.

## File Location
```
/app/frontend/src/pages/services/{department-slug}/{ServiceName}.jsx
```

## What You Can Edit in Each File

### 1. Basic Service Information (Lines 10-23)
```javascript
const service = {
  name: 'Agentic AI',                    // Change service name
  slug: 'agentic-ai',                    // URL slug (keep consistent)
  shortDescription: '...',               // Brief description
  fullDescription: '...',                // Detailed description
  image: 'https://...',                  // Service image URL
  keyFeatures: [                         // List of key features
    'Feature 1',
    'Feature 2',
    // Add or remove features
  ]
};
```

### 2. Department Information (Lines 25-29)
```javascript
const department = {
  name: 'AI & Cognitive',                // Department name
  slug: 'ai-cognitive',                  // Department slug
  description: 'Transform your...'      // Department description
};
```

### 3. Additional Service Details (Lines 37-55)
```javascript
const additionalInfo = {
  overview: `Custom overview text...`,   // Detailed overview
  
  benefits: [                            // Service benefits
    'Benefit 1',
    'Benefit 2',
    // Add custom benefits
  ],
  
  useCases: [                            // Real-world use cases
    'Use case 1',
    'Use case 2',
    // Add specific use cases
  ]
};
```

### 4. Technologies List (Lines 57-69)
```javascript
const technologies = [
  'AWS',
  'Azure',
  'Python',
  // Add or remove technologies
  // These appear at the bottom of the page
];
```

### 5. Custom FAQs (Lines 71-93)
```javascript
const customFAQs = [
  {
    question: `What is ${service.name}?`,
    answer: `Detailed answer...`
  },
  // Add more Q&A pairs
  {
    question: 'Your custom question?',
    answer: 'Your custom answer'
  }
];
```

## Example: Customizing a Service Page

Let's say you want to customize the **Agentic AI** page:

### Step 1: Open the file
```bash
/app/frontend/src/pages/services/ai-cognitive/AgenticAI.jsx
```

### Step 2: Update the description
```javascript
fullDescription: 'Deploy cutting-edge autonomous AI agents with advanced reasoning capabilities, specifically designed for enterprise-scale automation and decision-making.',
```

### Step 3: Add custom benefits
```javascript
benefits: [
  'Reduce manual decision-making by 80%',
  'Automated complex workflows',
  '24/7 autonomous operation',
  'Seamless human-AI collaboration'
],
```

### Step 4: Update technologies
```javascript
const technologies = [
  'GPT-5',
  'Claude Sonnet 4',
  'LangChain',
  'AutoGPT',
  'Python',
  'FastAPI',
  'Docker',
  'Kubernetes',
  'AWS',
  'MongoDB'
];
```

### Step 5: Add custom FAQs
```javascript
{
  question: 'Can Agentic AI integrate with our existing systems?',
  answer: 'Yes! Our Agentic AI solutions are designed with enterprise integration in mind. We support REST APIs, webhooks, database connections, and can integrate with your CRM, ERP, and other business systems.'
}
```

## Tips for Editing

1. **Keep the slug consistent** - Don't change the `slug` field unless you also update the routes in App.js
2. **Use proper quotes** - Use backticks (`) for multi-line text
3. **Test after editing** - Save the file and the page will hot-reload automatically
4. **Follow the existing format** - Keep the structure consistent for maintainability
5. **Add comments** - Document your custom changes with comments

## Quick Reference: All 77 Service Files

### AI & Cognitive (6 files)
- AgenticAI.jsx
- AICognitiveComputing.jsx
- AIGovernance.jsx
- DataScienceAI.jsx
- GenAIBusinessServices.jsx
- MLOps.jsx

### Analytics & Insights (2 files)
- Analytics.jsx
- BigData.jsx

### Cloud Engineering (5 files)
- ManagedCloudServices.jsx
- AWS.jsx
- MicrosoftServices.jsx
- GoogleCloudServices.jsx
- CloudComputing.jsx

### Cybersecurity (1 file)
- ITSecurityServices.jsx

### Digital Transformation & Modernization (6 files)
- ApplicationModernization.jsx
- DigitalTransformation.jsx
- LegacyModernization.jsx
- TechnologyModernization.jsx
- TechnologyTransformation.jsx
- DigitalBusinessTransformation.jsx

### Automation (5 files)
- DigitalProcessAutomation.jsx
- RoboticProcessAutomation.jsx
- AutomationTesting.jsx
- BusinessProcessManagement.jsx
- IntelligentAutomation.jsx

### Product Engineering (7 files)
- EmbeddedDesignSystems.jsx
- EngineeringFoundry.jsx
- EngineeringRDServices.jsx
- ProductDigitalEngineering.jsx
- SoftwareProductEngineering.jsx
- QualityEngineeringAssurance.jsx
- DevopsAsAService.jsx

### Infrastructure, Networks & Operations (6 files)
- InfrastructureCapitalProjects.jsx
- ManagedInfrastructureServices.jsx
- ModernizationInfrastructure.jsx
- ManagedServices.jsx
- SupportMaintenance.jsx
- OperationTechnology.jsx

### Consulting & Advisory Services (3 files)
- TechnologyConsulting.jsx
- StrategyConsulting.jsx
- DiscoverFrameWorkshops.jsx

### Product, Software & Platform Engineering (5 files)
- MVPAcceleration.jsx
- ProductStrategyExperienceDesign.jsx
- SoftwareTesting.jsx
- SoftwareDevelopment.jsx
- APIMicroservicesEngineering.jsx

### Enterprise Applications (6 files)
- EnterprisePlatformIntegration.jsx
- Pimcore.jsx
- Salesforce.jsx
- Servicenow.jsx
- EnterpriseMobility.jsx
- ECMSolutions.jsx

### Emerging Technologies (3 files)
- Blockchain.jsx
- SDNNFV.jsx
- InternetOfThings.jsx

### Business Operations (5 files)
- FinanceRiskManagement.jsx
- GlobalCapabilityCenters.jsx
- TalentOrganization.jsx
- SupplyChain.jsx
- UnifiedServicesManagement.jsx

### Sustainability (5 files)
- ESGDataManagementReporting.jsx
- CarbonAccountingManagement.jsx
- SustainabilityFinanceCoE.jsx
- GreenDataCentre.jsx
- StrategicESGAdvisory.jsx

### Marketing (12 files)
- SocialMediaManagement.jsx
- ContentCopywriting.jsx
- GraphicDesign.jsx
- VideoEditingAnimation.jsx
- FilmProduction.jsx
- CampaignPlanning.jsx
- ReputationManagement.jsx
- PrintOOHAdvertising.jsx
- BrandLaunchRebranding.jsx
- PerformanceMarketing.jsx
- GrowthFunnelsConversion.jsx
- MarketingAnalyticsIntelligence.jsx

## Need Help?

Each service page file has clear comments marking the editable sections. Look for:
```javascript
// ============================================
// SERVICE INFORMATION
// Edit below to customize this service page
// ============================================
```

Happy editing! 🎉
