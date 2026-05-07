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

// Generate imports
function generateImports() {
  const imports = [];
  
  departmentData.forEach(department => {
    department.services.forEach(service => {
      const componentName = slugToPascalCase(service.slug);
      const importPath = `./pages/services/${department.slug}/${componentName}`;
      imports.push(`import ${componentName} from '${importPath}';`);
    });
  });
  
  return imports.join('\n');
}

// Generate routes
function generateRoutes() {
  const routes = [];
  
  departmentData.forEach(department => {
    department.services.forEach(service => {
      const componentName = slugToPascalCase(service.slug);
      const routePath = `/services/${department.slug}/${service.slug}`;
      routes.push(`                <Route path="${routePath}" element={<${componentName} />} />`);
    });
  });
  
  return routes.join('\n');
}

console.log('═══════════════════════════════════════');
console.log('IMPORTS FOR APP.JS');
console.log('═══════════════════════════════════════\n');
console.log(generateImports());
console.log('\n\n═══════════════════════════════════════');
console.log('ROUTES FOR APP.JS');
console.log('═══════════════════════════════════════\n');
console.log(generateRoutes());
console.log('\n');
