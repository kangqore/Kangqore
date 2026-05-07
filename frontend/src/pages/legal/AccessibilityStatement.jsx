import React from 'react';
import { Link } from 'react-router-dom';
import { Accessibility as AccessibilityIcon, Mail, ChevronRight, Check, Eye, Keyboard, Monitor, MessageSquare } from 'lucide-react';

const AccessibilityStatement = () => {
  const lastUpdated = 'March 31, 2026';

  const commitments = [
    {
      icon: Eye,
      title: 'Perceivable',
      description: 'Information and user interface components are presented in ways that all users can perceive.',
      items: [
        'Text alternatives provided for non-text content (images, icons, charts)',
        'Captions and audio descriptions for multimedia content',
        'Content adaptable to different presentations without loss of meaning',
        'Sufficient color contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text)',
        'Content does not rely solely on color to convey information',
        'Text resizable up to 200% without loss of content or functionality'
      ]
    },
    {
      icon: Keyboard,
      title: 'Operable',
      description: 'User interface components and navigation are operable by all users.',
      items: [
        'All interactive elements accessible via keyboard navigation',
        'Visible focus indicators for keyboard users',
        'No content that flashes more than three times per second',
        'Skip navigation links to bypass repetitive content',
        'Descriptive page titles and organized heading hierarchy',
        'Multiple ways to find pages (navigation, search, sitemap)',
        'Sufficient time to read and interact with content'
      ]
    },
    {
      icon: Monitor,
      title: 'Understandable',
      description: 'Information and user interface operation are understandable to all users.',
      items: [
        'Clear and readable text with appropriate language identification',
        'Consistent navigation and interactive patterns across the website',
        'Meaningful labels and instructions for forms and interactive elements',
        'Input assistance with clear error identification and suggestions',
        'Predictable page behavior without unexpected changes in context',
        'Glossary and explanations for technical terms and abbreviations'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Robust',
      description: 'Content is robust enough to be interpreted by a wide variety of assistive technologies.',
      items: [
        'Valid and semantic HTML markup',
        'ARIA landmarks, roles, and properties used where appropriate',
        'Compatible with screen readers (JAWS, NVDA, VoiceOver, TalkBack)',
        'Compatible with screen magnification software',
        'Compatible with speech recognition software',
        'Status messages programmatically communicated to assistive technologies'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#F5F5F7] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.4]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-1.5 text-xs font-medium mb-6 text-gray-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gray-700 dark:text-gray-300 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Accessibility Statement</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <AccessibilityIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F]">Accessibility</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 font-light max-w-3xl">
            Kangqore is committed to ensuring digital accessibility for people with diverse abilities. We continually improve the user experience for everyone and strive to conform to established accessibility standards.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Our Commitment</h2>
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                At Kangqore, we believe technology should be accessible to everyone. As an engineering-first organization, we are committed to creating inclusive digital experiences that remove barriers and enable all users to access, navigate, and interact with our websites, platforms, and services effectively.
              </p>
              <p>
                We strive to conform to the <strong className="text-gray-900 dark:text-white">Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards published by the World Wide Web Consortium (W3C). These guidelines provide the foundation for making web content more accessible to people with disabilities, including those with visual, auditory, motor, cognitive, and neurological impairments.
              </p>
              <p>
                Our accessibility efforts are guided by the principles of the <strong className="text-gray-900 dark:text-white">Rights of Persons with Disabilities Act, 2016 (India)</strong> and align with international standards including the <strong className="text-gray-900 dark:text-white">Americans with Disabilities Act (ADA)</strong>, the <strong className="text-gray-900 dark:text-white">European Accessibility Act (EAA)</strong>, and <strong className="text-gray-900 dark:text-white">EN 301 549</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WCAG Principles */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Accessibility Principles</h2>
            <p className="text-lg text-gray-500 max-w-3xl">We follow the four core principles of WCAG to ensure our digital experiences are accessible to all users.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {commitments.map((commitment, index) => {
              const IconComponent = commitment.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{commitment.title}</h3>
                      <p className="text-sm text-gray-500">{commitment.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {commitment.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Measures & Testing */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Measures We Take</h2>
              <ul className="space-y-4">
                {[
                  'Accessibility is integrated into our design and development lifecycle',
                  'Regular automated accessibility audits using industry-standard tools (axe, Lighthouse, WAVE)',
                  'Manual testing with assistive technologies including screen readers and keyboard-only navigation',
                  'Periodic third-party accessibility assessments and compliance reviews',
                  'Accessibility training for our design and engineering teams',
                  'Active monitoring and remediation of accessibility issues',
                  'Inclusive design reviews as part of our quality assurance process'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-brand-blue" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Assistive Technology Compatibility</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Our website is designed to be compatible with the following assistive technologies:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'JAWS', type: 'Screen Reader (Windows)' },
                  { name: 'NVDA', type: 'Screen Reader (Windows)' },
                  { name: 'VoiceOver', type: 'Screen Reader (macOS/iOS)' },
                  { name: 'TalkBack', type: 'Screen Reader (Android)' },
                  { name: 'Dragon NaturallySpeaking', type: 'Speech Recognition' },
                  { name: 'ZoomText', type: 'Screen Magnification' },
                  { name: 'Switch Access', type: 'Alternative Input' },
                  { name: 'Browser Zoom', type: 'Magnification (200%)' }
                ].map((tech, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{tech.name}</p>
                    <p className="text-xs text-gray-500">{tech.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Known Limitations */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Known Limitations</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              While we strive for full accessibility, we acknowledge that some areas of our website may have limitations:
            </p>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-amber-400 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Some older PDF documents may not be fully accessible. We are progressively updating these to meet accessibility standards.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-amber-400 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Third-party embedded content (e.g., video players, social media feeds) may have accessibility limitations outside our direct control.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-amber-400 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Some interactive charts and data visualizations may have limited screen reader support. We provide alternative text descriptions where possible.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-amber-400 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Complex animations may not meet all motion sensitivity requirements. We continue to improve reduced-motion support.</span>
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-6">We actively work to identify and resolve these limitations. If you encounter any barriers, please contact us.</p>
          </div>
        </div>
      </section>

      {/* Feedback & Contact */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Feedback & Contact</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Your feedback is essential to improving accessibility. If you encounter any accessibility barriers on our website, or if you need information in an alternative format, please contact us:
              </p>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100 space-y-3">
                <p className="font-semibold text-gray-900 dark:text-white">Kangqore Global Pvt Ltd</p>
                <p className="text-gray-600 dark:text-gray-400">Accessibility & Inclusion Team</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Bengaluru, Karnataka, India</p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:accessibility@kangqore.com" className="text-brand-blue hover:underline">accessibility@kangqore.com</a>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>General Inquiries:</strong>{' '}
                  <a href="mailto:inquiry@kangqore.com" className="text-brand-blue hover:underline">inquiry@kangqore.com</a>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We aim to respond to accessibility feedback within 5 business days and will make every reasonable effort to address the issue promptly.
              </p>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Accessibility Tips</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Here are some tips for navigating our website:</p>
              <div className="space-y-4">
                {[
                  { label: 'Keyboard Navigation', desc: 'Use Tab to move forward, Shift+Tab to move backward, Enter to activate links and buttons, and Escape to close dialogs.' },
                  { label: 'Skip to Content', desc: 'Press Tab at the top of any page to reveal the "Skip to Content" link, allowing you to bypass navigation.' },
                  { label: 'Text Resize', desc: 'Use Ctrl/Cmd + "+" to zoom in, Ctrl/Cmd + "-" to zoom out, and Ctrl/Cmd + "0" to reset to default size.' },
                  { label: 'High Contrast', desc: 'Enable high contrast mode in your operating system or browser settings for enhanced visibility.' },
                  { label: 'Reduced Motion', desc: 'Enable "Reduce Motion" in your system accessibility settings to minimize animations.' }
                ].map((tip, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{tip.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-gray-50 dark:bg-black dark:border-gray-700 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Policies</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Privacy Statement', path: '/privacy', desc: 'How we collect and protect data' },
              { title: 'Terms & Conditions', path: '/terms', desc: 'Our terms of service and usage' },
              { title: 'Cookie Policy', path: '/cookies', desc: 'How we use cookies and tracking' },
              { title: 'Sitemap', path: '/sitemap', desc: 'Complete site navigation' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-brand-blue/20 transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                <span className="text-sm font-medium text-brand-blue flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccessibilityStatement;
