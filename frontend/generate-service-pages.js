const fs = require('fs');
const path = require('path');
const { departmentData } = require('./src/data/departmentData.js');

// Function to convert slug to PascalCase for component names
function slugToPascalCase(slug) {
  // Special cases for acronyms and specific naming
  const specialCases = {
    'ai': 'AI',
    'mlops': 'MLOps',
    'api': 'API',
    'aws': 'AWS',
    'it': 'IT',
    'ot': 'OT',
    'genai': 'GenAI',
    'rd': 'RD',
    'esg': 'ESG',
    'ecm': 'ECM',
    'sdn': 'SDN',
    'nfv': 'NFV',
    'ooh': 'OOH',
    'mvp': 'MVP',
    'daas': 'DaaS',
    'coe': 'CoE'
  };
  
  return slug
    .split('-')
    .map(word => {
      const lower = word.toLowerCase();
      return specialCases[lower] || (word.charAt(0).toUpperCase() + word.slice(1));
    })
    .join('');
}

// Function to generate service page content with comprehensive inline data
function generateServicePageContent(service, department) {
  const componentName = slugToPascalCase(service.slug);
  const serviceLower = service.name.toLowerCase();
  
  // Format keyFeatures array
  const keyFeaturesStr = service.keyFeatures 
    ? service.keyFeatures.map(f => `'${f}'`).join(',\n      ')
    : '';
  
  return `import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const ${componentName} = () => {
  // ============================================
  // SERVICE INFORMATION
  // Edit below to customize this service page
  // ============================================
  
  const service = {
    name: '${service.name}',
    slug: '${service.slug}',
    shortDescription: '${service.shortDescription}',
    fullDescription: '${service.fullDescription}',
    image: '${service.image}',
    keyFeatures: [
      ${keyFeaturesStr}
    ]
  };
  
  const department = {
    name: '${department.name}',
    slug: '${department.slug}',
    description: 'Transform your business with cutting-edge ${department.name.toLowerCase()} solutions.'
  };

  // ============================================
  // CUSTOM CONTENT SECTIONS
  // Add or modify content below as needed
  // ============================================

  // Additional service details (optional)
  const additionalInfo = {
    overview: \`With deep expertise in ${department.name.toLowerCase()}, we deliver ${serviceLower} solutions that drive measurable business outcomes. Our approach combines industry best practices with cutting-edge technology to ensure your success.\`,
    
    // You can add custom benefits here
    benefits: [
      'Accelerated time to value',
      'Reduced operational costs',
      'Improved efficiency and productivity',
      'Scalable solutions that grow with your business'
    ],
    
    // Add specific use cases or success stories
    useCases: [
      'Enterprise-scale implementations',
      'Digital transformation initiatives',
      'Legacy system modernization',
      'Cloud migration and optimization'
    ]
  };

  // Technologies and tools (customize as needed)
  const technologies = [
    'AWS',
    'Azure',
    'Google Cloud',
    'Kubernetes',
    'Docker',
    'Python',
    'React',
    'Node.js',
    'TensorFlow',
    'MongoDB'
  ];

  // ============================================
  // OUR CAPABILITIES (Fully Editable)
  // Customize the three capability categories below
  // ============================================
  
  const capabilities = [
    {
      title: 'Strategy & Planning',
      items: [
        { 
          heading: 'Assessment & Discovery', 
          description: \`Comprehensive analysis of your current state and ${serviceLower} requirements to identify opportunities.\` 
        },
        { 
          heading: 'Roadmap Development', 
          description: \`Create a detailed implementation roadmap aligned with your business objectives and timelines.\` 
        },
        { 
          heading: 'Architecture Design', 
          description: \`Design scalable and robust ${serviceLower} architecture tailored to your needs.\` 
        },
        { 
          heading: 'Business Case Development', 
          description: \`Build compelling business cases with ROI projections and success metrics.\` 
        }
      ]
    },
    {
      title: 'Implementation & Delivery',
      items: [
        { 
          heading: 'Agile Development', 
          description: \`Iterative development approach ensuring flexibility and rapid delivery of ${serviceLower} solutions.\` 
        },
        { 
          heading: 'Integration Services', 
          description: \`Seamless integration with existing systems, APIs, and third-party platforms.\` 
        },
        { 
          heading: 'Quality Assurance', 
          description: \`Rigorous testing protocols ensuring reliability, performance, and security standards.\` 
        },
        { 
          heading: 'Change Management', 
          description: \`Comprehensive change management and user adoption programs for successful transitions.\` 
        }
      ]
    },
    {
      title: 'Operations & Optimization',
      items: [
        { 
          heading: 'Managed Services', 
          description: \`24/7 monitoring, maintenance, and support to ensure optimal ${serviceLower} performance.\` 
        },
        { 
          heading: 'Performance Optimization', 
          description: \`Continuous performance tuning and optimization to maximize efficiency and value.\` 
        },
        { 
          heading: 'Analytics & Insights', 
          description: \`Data-driven insights and reporting to track KPIs and identify improvement opportunities.\` 
        },
        { 
          heading: 'Continuous Innovation', 
          description: \`Stay ahead with latest ${serviceLower} trends, updates, and innovation initiatives.\` 
        }
      ]
    }
  ];

  // Custom FAQs for this service
  const customFAQs = [
    {
      question: \`What is ${service.name} and how can it benefit my organization?\`,
      answer: \`${service.name} helps organizations ${service.shortDescription.toLowerCase()}. By implementing ${serviceLower}, you can improve efficiency, reduce costs, and gain competitive advantage.\`
    },
    {
      question: \`How long does a typical ${serviceLower} project take?\`,
      answer: \`Project duration varies based on scope and complexity. A typical engagement ranges from 8-16 weeks for initial implementation, with ongoing optimization. We work with you to define realistic timelines aligned with your business priorities.\`
    },
    {
      question: \`What industries do you serve for ${serviceLower}?\`,
      answer: \`We serve clients across all major industries including Banking, Healthcare, Retail, Manufacturing, Technology, and more. Our industry-specific expertise ensures solutions are tailored to your sector's unique requirements.\`
    },
    {
      question: 'How do you ensure successful delivery?',
      answer: 'We follow a proven methodology combining agile practices, quality assurance, and change management. Regular checkpoints, transparent communication, and dedicated project management ensure successful outcomes.'
    },
    {
      question: 'What post-implementation support do you offer?',
      answer: 'We provide comprehensive support including 24/7 technical assistance, regular health checks, optimization recommendations, and training. Our team remains engaged to ensure you maximize value from your investment.'
    }
  ];

  // ============================================
  // WHY KANGQORE (Fully Editable)
  // Customize the reasons to choose Kangqore
  // ============================================
  
  const whyKangqore = [
    { 
      title: 'Proven Expertise', 
      description: \`Years of experience delivering successful ${serviceLower} projects across industries.\` 
    },
    { 
      title: 'Tailored Solutions', 
      description: 'Customized approaches that address your unique business challenges and goals.' 
    },
    { 
      title: 'Dedicated Team', 
      description: 'Access to certified professionals with deep domain expertise.' 
    },
    { 
      title: 'Innovation Focus', 
      description: 'Leveraging latest technologies and best practices for optimal results.' 
    },
    { 
      title: 'Global Delivery', 
      description: 'Scalable delivery model with resources across multiple geographies.' 
    },
    { 
      title: 'Quality Assurance', 
      description: 'Rigorous quality standards and proven methodologies ensure success.' 
    }
  ];

  // ============================================
  // INDUSTRY EXPERTISE (Fully Editable)
  // Customize the industries you serve
  // ============================================
  
  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Manufacturing' },
    { name: 'Technology' },
    { name: 'Professional Services' },
    { name: 'Telecommunications' },
    { name: 'Energy & Utilities' },
    { name: 'Education' },
    { name: 'Government' },
    { name: 'Transportation & Logistics' },
    { name: 'Media & Entertainment' }
  ];

  // Combine all data for the template
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      additionalInfo,
      customFAQs,
      whyKangqore,
      industries
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default ${componentName};
`;
}

// Main function to generate all service pages
function generateAllServicePages() {
  let totalCreated = 0;
  let totalSkipped = 0;
  
  console.log('Starting service page generation...\n');

  departmentData.forEach(department => {
    // Create department directory if it doesn't exist
    const deptDir = path.join(__dirname, 'src', 'pages', 'services', department.slug);
    
    if (!fs.existsSync(deptDir)) {
      fs.mkdirSync(deptDir, { recursive: true });
      console.log(`✓ Created directory: ${department.slug}/`);
    }

    // Generate each service page
    department.services.forEach(service => {
      const componentName = slugToPascalCase(service.slug);
      const fileName = `${componentName}.jsx`;
      const filePath = path.join(deptDir, fileName);

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        console.log(`  ⊙ Skipped (exists): ${department.slug}/${fileName}`);
        totalSkipped++;
      } else {
        const content = generateServicePageContent(service, department);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✓ Created: ${department.slug}/${fileName}`);
        totalCreated++;
      }
    });
    
    console.log('');
  });

  console.log('═══════════════════════════════════════');
  console.log(`Generation Complete!`);
  console.log(`Total files created: ${totalCreated}`);
  console.log(`Total files skipped: ${totalSkipped}`);
  console.log(`Total services: ${totalCreated + totalSkipped}`);
  console.log('═══════════════════════════════════════\n');
}

// Run the generator
try {
  generateAllServicePages();
  console.log('✓ All service pages generated successfully!');
  process.exit(0);
} catch (error) {
  console.error('✗ Error generating service pages:', error);
  process.exit(1);
}
