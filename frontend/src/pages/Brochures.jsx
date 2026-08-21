import React from 'react';
import { Download, FileText, Eye } from 'lucide-react';
import PageHero from '../components/PageHero';

const Brochures = () => {
  const brochures = [
    {
      id: 'company-overview',
      slug: 'company-overview',
      title: 'Company Overview',
      description: 'Complete overview of Kangqore services and capabilities.',
      pages: 24,
      fileUrl: '/assets/brochures/kangqore-company-overview.pdf',
      fileSize: '8.5 MB',
      lastUpdated: 'Dec 2024',
      category: 'Company'
    },
    {
      id: 'ai-ml-solutions',
      slug: 'ai-ml-solutions',
      title: 'AI & Machine Learning Solutions',
      description: 'Our comprehensive AI service offerings and capabilities.',
      pages: 16,
      fileUrl: '/assets/brochures/ai-ml-solutions.pdf',
      fileSize: '5.2 MB',
      lastUpdated: 'Dec 2024',
      category: 'Services'
    },
    {
      id: 'cloud-transformation-guide',
      slug: 'cloud-transformation-guide',
      title: 'Cloud Transformation Guide',
      description: 'End-to-end cloud migration and management services.',
      pages: 20,
      fileUrl: '/assets/brochures/cloud-transformation.pdf',
      fileSize: '6.8 MB',
      lastUpdated: 'Nov 2024',
      category: 'Services'
    },
    {
      id: 'cybersecurity-services',
      slug: 'cybersecurity-services',
      title: 'Cybersecurity Services',
      description: 'Enterprise security solutions and assessments.',
      pages: 12,
      fileUrl: '/assets/brochures/cybersecurity-services.pdf',
      fileSize: '4.3 MB',
      lastUpdated: 'Nov 2024',
      category: 'Services'
    },
    {
      id: 'digital-transformation-playbook',
      slug: 'digital-transformation-playbook',
      title: 'Digital Transformation Playbook',
      description: 'Strategic guide for digital initiatives and implementation.',
      pages: 32,
      fileUrl: '/assets/brochures/digital-transformation-playbook.pdf',
      fileSize: '10.2 MB',
      lastUpdated: 'Oct 2024',
      category: 'Strategy'
    },
    {
      id: 'industry-solutions',
      slug: 'industry-solutions',
      title: 'Industry Solutions',
      description: 'Tailored solutions for key industries and verticals.',
      pages: 28,
      fileUrl: '/assets/brochures/industry-solutions.pdf',
      fileSize: '9.1 MB',
      lastUpdated: 'Oct 2024',
      category: 'Industry'
    }
  ];

  const handleDownload = (brochure) => {
    const link = document.createElement('a');
    link.href = brochure.fileUrl;
    link.download = `${brochure.slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Downloaded: ${brochure.title}`);
  };

  const handlePreview = (brochure) => {
    window.open(brochure.fileUrl, '_blank');
  };

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        badge="Resources"
        title="Download our latest brochures"
        titleHighlight="and service catalogs"
        description="Access comprehensive brochures covering our services, solutions, and industry expertise. Download PDF resources to learn more."
        primaryButton={{ text: 'Request Custom Brochure', link: '/contact' }}
        secondaryButton={{ text: 'View All Downloads', link: '#downloads' }}
        stats={[
          { value: '20+', label: 'Brochures', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '15+', label: 'Service Guides', color: 'text-blue-400' },
          { value: '10+', label: 'Case Studies', color: 'text-emerald-400' },
          { value: 'Free', label: 'All Resources', color: 'text-purple-400' },
        ]}
      />

      <section id="downloads" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brochures.map((brochure) => (
              <div key={brochure.id} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mb-6 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-brand-blue" />
                </div>
                <div className="mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-brand-blue text-xs font-semibold rounded-full">
                    {brochure.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{brochure.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{brochure.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span>{brochure.pages} pages • PDF</span>
                  <span>{brochure.fileSize}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleDownload(brochure)}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-gradient text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button 
                    onClick={() => handlePreview(brochure)}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">Last updated: {brochure.lastUpdated}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brochures;
