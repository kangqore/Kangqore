const fs = require('fs');
const path = require('path');

// Import content data
const contentData = require('./src/data/contentData.js');

const { blogsData, caseStudiesData, whitePapersData, eventsData, brochuresData } = contentData;

// Helper to convert slug to PascalCase
function slugToPascalCase(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Generate Blog Detail Page
function generateBlogPage(blog) {
  const componentName = slugToPascalCase(blog.slug);
  
  return `import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';

const ${componentName} = () => {
  // ============================================
  // BLOG POST CONTENT (Fully Editable)
  // ============================================
  
  const blog = {
    id: '${blog.id}',
    title: '${blog.title}',
    excerpt: '${blog.excerpt}',
    content: \`${blog.content}\`,
    author: '${blog.author}',
    date: '${blog.date}',
    category: '${blog.category}',
    readTime: '${blog.readTime}',
    tags: ${JSON.stringify(blog.tags)},
    image: '${blog.image}'
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{blog.category}</span>
            <span className="flex items-center gap-1 text-sm"><Calendar className="w-4 h-4" />{blog.date}</span>
            <span className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" />{blog.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
          <p className="text-xl text-blue-100 mb-6">{blog.excerpt}</p>
          
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="font-medium">{blog.author}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p>{blog.content}</p>
            {/* Add your full article content here */}
            <p className="mt-4 text-gray-600">Full article content goes here. Edit this file to add your complete blog post content.</p>
          </div>
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">Tags:</span>
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ${componentName};
`;
}

// Generate Case Study Detail Page
function generateCaseStudyPage(study) {
  const componentName = slugToPascalCase(study.slug);
  
  return `import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const ${componentName} = () => {
  // ============================================
  // CASE STUDY CONTENT (Fully Editable)
  // ============================================
  
  const caseStudy = {
    id: '${study.id}',
    title: '${study.title}',
    industry: '${study.industry}',
    result: '${study.result}',
    description: '${study.description}',
    challenge: '${study.challenge}',
    solution: '${study.solution}',
    outcome: '${study.outcome}',
    client: '${study.client}',
    duration: '${study.duration}',
    technologies: ${JSON.stringify(study.technologies)},
    image: '${study.image}'
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-5 h-5" />
            <span className="font-medium">{caseStudy.industry}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
          <p className="text-xl text-blue-100 mb-6">{caseStudy.description}</p>
          
          <div className="flex items-center gap-3 text-2xl font-bold">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <span>{caseStudy.result}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
                <p className="text-gray-600 text-lg">{caseStudy.challenge}</p>
              </div>
              
              {/* Solution */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
                <p className="text-gray-600 text-lg">{caseStudy.solution}</p>
              </div>
              
              {/* Outcome */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Achieved</h2>
                <p className="text-gray-600 text-lg">{caseStudy.outcome}</p>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium text-gray-900">{caseStudy.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{caseStudy.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium text-gray-900">{caseStudy.industry}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
`;
}

// Generate White Paper Detail Page
function generateWhitePaperPage(paper) {
  const componentName = slugToPascalCase(paper.slug);
  
  return `import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, BookOpen, Calendar, Users } from 'lucide-react';

const ${componentName} = () => {
  // ============================================
  // WHITE PAPER CONTENT (Fully Editable)
  // ============================================
  
  const whitePaper = {
    id: '${paper.id}',
    title: '${paper.title}',
    description: '${paper.description}',
    date: '${paper.date}',
    downloads: '${paper.downloads}',
    pages: ${paper.pages},
    fileUrl: '${paper.fileUrl}',
    topics: ${JSON.stringify(paper.topics)},
    authors: ${JSON.stringify(paper.authors)}
  };

  const handleDownload = () => {
    // Implement actual download logic here
    window.open(whitePaper.fileUrl, '_blank');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/white-paper" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to White Papers
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-6 h-6" />
            <span className="text-sm font-medium">{whitePaper.pages} Pages</span>
            <span className="text-sm">•</span>
            <span className="text-sm">{whitePaper.downloads} Downloads</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{whitePaper.title}</h1>
          <p className="text-xl text-blue-100 mb-6">{whitePaper.description}</p>
          
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Download className="w-5 h-5" /> Download White Paper
          </button>
        </div>
      </section>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Inside</h2>
              <ul className="space-y-3">
                {whitePaper.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{idx + 1}</span>
                    </div>
                    <span className="text-gray-700 text-lg">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {whitePaper.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    {whitePaper.pages} pages
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Authors
                </h3>
                <ul className="space-y-2">
                  {whitePaper.authors.map((author, idx) => (
                    <li key={idx} className="text-gray-700">{author}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
`;
}

// Generate Event Detail Page
function generateEventPage(event) {
  const componentName = slugToPascalCase(event.slug);
  
  return `import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Video, Users, Clock } from 'lucide-react';

const ${componentName} = () => {
  // ============================================
  // EVENT CONTENT (Fully Editable)
  // ============================================
  
  const event = {
    id: '${event.id}',
    title: '${event.title}',
    date: '${event.date}',
    location: '${event.location}',
    type: '${event.type}',
    format: '${event.format}',
    description: '${event.description || ''}',
    agenda: ${JSON.stringify(event.agenda || [])},
    speakers: ${JSON.stringify(event.speakers || [])},
    registrationUrl: '${event.registrationUrl || '#'}',
    status: '${event.status}'
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{event.type}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium flex items-center gap-1">
              {event.format === 'Online' ? <Video className="w-3 h-3" /> : <Users className="w-3 h-3" />}
              {event.format}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
          <p className="text-xl text-blue-100 mb-6">{event.description}</p>
          
          <div className="flex flex-wrap gap-4 text-lg mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
          
          {event.status === 'upcoming' && (
            <a
              href={event.registrationUrl}
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Register Now
            </a>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {event.agenda && event.agenda.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Agenda</h2>
                  <ul className="space-y-3">
                    {event.agenda.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm font-bold">{idx + 1}</span>
                        </div>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {event.speakers && event.speakers.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Speakers</h3>
                  <ul className="space-y-2">
                    {event.speakers.map((speaker, idx) => (
                      <li key={idx} className="text-gray-700">{speaker}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};
`;
}

// Main generation function
function generateAllPages() {
  let totalCreated = 0;
  
  console.log('\n' + '='.repeat(70));
  console.log('GENERATING CONTENT PAGES');
  console.log('='.repeat(70) + '\n');

  // Generate Blog Pages
  const blogsDir = path.join(__dirname, 'src', 'pages', 'blogs');
  if (!fs.existsSync(blogsDir)) {
    fs.mkdirSync(blogsDir, { recursive: true });
  }
  
  console.log('BLOGS:');
  blogsData.forEach(blog => {
    const componentName = slugToPascalCase(blog.slug);
    const fileName = `${componentName}.jsx`;
    const filePath = path.join(blogsDir, fileName);
    const content = generateBlogPage(blog);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Created: blogs/${fileName}`);
    totalCreated++;
  });
  
  // Generate Case Study Pages
  const caseStudiesDir = path.join(__dirname, 'src', 'pages', 'case-studies');
  if (!fs.existsSync(caseStudiesDir)) {
    fs.mkdirSync(caseStudiesDir, { recursive: true });
  }
  
  console.log('\nCASE STUDIES:');
  caseStudiesData.forEach(study => {
    const componentName = slugToPascalCase(study.slug);
    const fileName = `${componentName}.jsx`;
    const filePath = path.join(caseStudiesDir, fileName);
    const content = generateCaseStudyPage(study);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Created: case-studies/${fileName}`);
    totalCreated++;
  });
  
  // Generate White Paper Pages
  const whitePapersDir = path.join(__dirname, 'src', 'pages', 'white-papers');
  if (!fs.existsSync(whitePapersDir)) {
    fs.mkdirSync(whitePapersDir, { recursive: true });
  }
  
  console.log('\nWHITE PAPERS:');
  whitePapersData.forEach(paper => {
    const componentName = slugToPascalCase(paper.slug);
    const fileName = `${componentName}.jsx`;
    const filePath = path.join(whitePapersDir, fileName);
    const content = generateWhitePaperPage(paper);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Created: white-papers/${fileName}`);
    totalCreated++;
  });
  
  // Generate Event Pages
  const eventsDir = path.join(__dirname, 'src', 'pages', 'events');
  if (!fs.existsSync(eventsDir)) {
    fs.mkdirSync(eventsDir, { recursive: true });
  }
  
  console.log('\nEVENTS:');
  eventsData.forEach(event => {
    const componentName = slugToPascalCase(event.slug);
    const fileName = `${componentName}.jsx`;
    const filePath = path.join(eventsDir, fileName);
    const content = generateEventPage(event);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Created: events/${fileName}`);
    totalCreated++;
  });
  
  console.log('\n' + '='.repeat(70));
  console.log(`GENERATION COMPLETE!`);
  console.log(`Total pages created: ${totalCreated}`);
  console.log(`  - Blogs: ${blogsData.length}`);
  console.log(`  - Case Studies: ${caseStudiesData.length}`);
  console.log(`  - White Papers: ${whitePapersData.length}`);
  console.log(`  - Events: ${eventsData.length}`);
  console.log('='.repeat(70) + '\n');
}

// Run generator
try {
  generateAllPages();
  console.log('✓ All content pages generated successfully!\n');
  process.exit(0);
} catch (error) {
  console.error('✗ Error generating pages:', error);
  process.exit(1);
}
