const fs = require('fs');
const path = require('path');

// Import content data
const contentData = require('./src/data/contentData.js');
const { blogsData, caseStudiesData, whitePapersData, eventsData } = contentData;

// Helper to convert slug to PascalCase
function slugToPascalCase(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Generate imports
const blogImports = blogsData.map(blog => {
  const name = slugToPascalCase(blog.slug);
  return `import ${name} from './pages/blogs/${name}';`;
}).join('\n');

const caseStudyImports = caseStudiesData.map(study => {
  const name = slugToPascalCase(study.slug);
  return `import ${name} from './pages/case-studies/${name}';`;
}).join('\n');

const whitePaperImports = whitePapersData.map(paper => {
  const name = slugToPascalCase(paper.slug);
  return `import ${name} from './pages/white-papers/${name}';`;
}).join('\n');

const eventImports = eventsData.map(event => {
  const name = slugToPascalCase(event.slug);
  return `import ${name} from './pages/events/${name}';`;
}).join('\n');

// Generate routes
const blogRoutes = blogsData.map(blog => {
  const name = slugToPascalCase(blog.slug);
  return `                <Route path="/blogs/${blog.slug}" element={<${name} />} />`;
}).join('\n');

const caseStudyRoutes = caseStudiesData.map(study => {
  const name = slugToPascalCase(study.slug);
  return `                <Route path="/case-studies/${study.slug}" element={<${name} />} />`;
}).join('\n');

const whitePaperRoutes = whitePapersData.map(paper => {
  const name = slugToPascalCase(paper.slug);
  return `                <Route path="/white-papers/${paper.slug}" element={<${name} />} />`;
}).join('\n');

const eventRoutes = eventsData.map(event => {
  const name = slugToPascalCase(event.slug);
  return `                <Route path="/events/${event.slug}" element={<${name} />} />`;
}).join('\n');

console.log('\n' + '='.repeat(70));
console.log('IMPORTS TO ADD TO APP.JS');
console.log('='.repeat(70) + '\n');
console.log('// Blog pages');
console.log(blogImports);
console.log('\n// Case Study pages');
console.log(caseStudyImports);
console.log('\n// White Paper pages');
console.log(whitePaperImports);
console.log('\n// Event pages');
console.log(eventImports);

console.log('\n\n' + '='.repeat(70));
console.log('ROUTES TO ADD TO APP.JS');
console.log('='.repeat(70) + '\n');
console.log('                {/* Blog Detail Pages */}');
console.log(blogRoutes);
console.log('\n                {/* Case Study Detail Pages */}');
console.log(caseStudyRoutes);
console.log('\n                {/* White Paper Detail Pages */}');
console.log(whitePaperRoutes);
console.log('\n                {/* Event Detail Pages */}');
console.log(eventRoutes);
console.log('\n');
