import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, ChevronRight } from 'lucide-react';

const TermsAndConditions = () => {
  const lastUpdated = 'March 31, 2026';

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: (
        <>
          <p>By accessing or using any website, platform, application, or service operated by Kangqore Global Pvt Ltd ("Kangqore", "Company", "we", "our", or "us"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not access or use our Services.</p>
          <p>These Terms constitute a legally binding agreement between you and Kangqore. We reserve the right to modify these Terms at any time. Continued use of our Services following any modifications constitutes acceptance of the revised Terms.</p>
        </>
      )
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      content: (
        <ul>
          <li><strong>"Services"</strong> refers to all products, platforms, websites, applications, consulting, engineering, managed services, and other offerings provided by Kangqore</li>
          <li><strong>"User", "you", "your"</strong> refers to any individual or entity accessing or using our Services</li>
          <li><strong>"Content"</strong> refers to all text, images, graphics, software, data, documentation, and other materials available through our Services</li>
          <li><strong>"Client"</strong> refers to any individual or organization that has entered into a service agreement or statement of work with Kangqore</li>
          <li><strong>"Confidential Information"</strong> refers to any non-public information disclosed by either party to the other in connection with the Services</li>
        </ul>
      )
    },
    {
      id: 'services-description',
      title: '3. Description of Services',
      content: (
        <>
          <p>Kangqore provides a range of technology and consulting services including, but not limited to:</p>
          <ul>
            <li>AI & Cognitive Computing solutions, including Agentic AI, MLOps, and AI Governance</li>
            <li>Cloud Engineering across AWS, Azure, and Google Cloud platforms</li>
            <li>Digital Engineering, Software Development, and Product Engineering</li>
            <li>Cybersecurity assessment, implementation, and managed security services</li>
            <li>Digital Transformation, Application Modernization, and Legacy Migration</li>
            <li>Automation (RPA, DPA, Intelligent Automation)</li>
            <li>Data & Analytics, Business Intelligence, and Big Data solutions</li>
            <li>Strategy Consulting and Technology Advisory</li>
            <li>Managed IT Services and Infrastructure Operations</li>
          </ul>
          <p>Specific service terms, scope, deliverables, and obligations are defined in individual Statements of Work (SOW), Master Service Agreements (MSA), or other written contracts executed between Kangqore and its clients.</p>
        </>
      )
    },
    {
      id: 'use-of-website',
      title: '4. Use of Website & Digital Platforms',
      content: (
        <>
          <p>When accessing our website and digital platforms, you agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information when creating accounts or submitting forms</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Not attempt to gain unauthorized access to any part of our Services, systems, or networks</li>
            <li>Not use our Services for any unlawful purpose or in violation of any applicable laws</li>
            <li>Not interfere with or disrupt our Services or servers</li>
            <li>Not scrape, crawl, or use automated tools to extract data from our websites without prior written consent</li>
            <li>Not transmit any viruses, malware, or other harmful code</li>
            <li>Not impersonate any person or entity</li>
          </ul>
          <p>We reserve the right to suspend or terminate access to any user who violates these Terms or engages in activities that may harm Kangqore, our clients, or other users.</p>
        </>
      )
    },
    {
      id: 'intellectual-property',
      title: '5. Intellectual Property Rights',
      content: (
        <>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.1 Kangqore's Intellectual Property</h4>
          <p>All content, materials, software, tools, methodologies, frameworks, trademarks, service marks, logos, and trade names displayed on or through our Services are the exclusive property of Kangqore or its licensors. This includes but is not limited to:</p>
          <ul>
            <li>The Kangqore name, logo, and brand identity</li>
            <li>Website design, layout, and user interface elements</li>
            <li>Proprietary tools, frameworks, and accelerators</li>
            <li>Thought leadership content, whitepapers, case studies, and research</li>
            <li>Software code, algorithms, and documentation</li>
          </ul>
          <p>No content from our Services may be copied, reproduced, distributed, republished, downloaded, displayed, posted, or transmitted in any form without prior written permission from Kangqore.</p>

          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.2 Client Intellectual Property</h4>
          <p>Kangqore respects the intellectual property rights of its clients. Ownership of deliverables, code, and other work product created during client engagements is governed by the applicable MSA or SOW. Unless otherwise agreed in writing, Kangqore retains ownership of its pre-existing intellectual property, tools, and methodologies.</p>
        </>
      )
    },
    {
      id: 'confidentiality',
      title: '6. Confidentiality',
      content: (
        <>
          <p>Kangqore maintains strict confidentiality obligations with respect to all client information. We:</p>
          <ul>
            <li>Do not disclose confidential client information to third parties without authorization</li>
            <li>Implement industry-standard security measures to protect confidential information</li>
            <li>Require all employees and contractors to execute non-disclosure agreements (NDAs)</li>
            <li>Apply access controls based on the principle of least privilege</li>
            <li>Maintain information security policies aligned with ISO 27001 standards</li>
          </ul>
          <p>Confidentiality obligations survive the termination of any service engagement, unless the information becomes publicly available through no fault of Kangqore.</p>
        </>
      )
    },
    {
      id: 'service-level',
      title: '7. Service Level Commitments',
      content: (
        <>
          <p>For managed services and ongoing engagements, service level agreements (SLAs) are defined in individual SOWs or service contracts. These typically include:</p>
          <ul>
            <li>Availability and uptime commitments</li>
            <li>Response and resolution time targets</li>
            <li>Escalation procedures and governance frameworks</li>
            <li>Performance metrics and reporting cadence</li>
            <li>Change management and incident management processes</li>
          </ul>
          <p>SLA targets, remedies, and exclusions are specific to each engagement and are not governed by these general Terms.</p>
        </>
      )
    },
    {
      id: 'warranties-disclaimers',
      title: '8. Warranties & Disclaimers',
      content: (
        <>
          <p>Our website and publicly available content are provided on an "AS IS" and "AS AVAILABLE" basis. To the fullest extent permitted by applicable law, Kangqore disclaims all warranties, express or implied, including but not limited to:</p>
          <ul>
            <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
            <li>Warranties that our Services will be uninterrupted, error-free, or completely secure</li>
            <li>Warranties regarding the accuracy, completeness, or reliability of any content</li>
          </ul>
          <p>For contracted services, warranties are defined in the applicable MSA, SOW, or service agreement.</p>
        </>
      )
    },
    {
      id: 'limitation-of-liability',
      title: '9. Limitation of Liability',
      content: (
        <>
          <p>To the maximum extent permitted by applicable law:</p>
          <ul>
            <li>Kangqore shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services or website</li>
            <li>Kangqore's total aggregate liability for any claims arising from the use of our public website shall not exceed the amount of INR 10,000 (Indian Rupees Ten Thousand)</li>
            <li>For contracted services, liability limitations are governed by the applicable service agreement</li>
          </ul>
          <p>These limitations apply regardless of the theory of liability, including breach of contract, tort (including negligence), strict liability, or any other legal theory.</p>
        </>
      )
    },
    {
      id: 'indemnification',
      title: '10. Indemnification',
      content: (
        <p>You agree to indemnify, defend, and hold harmless Kangqore, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorney's fees) arising from or related to your violation of these Terms, your use of our Services, or your violation of any rights of a third party.</p>
      )
    },
    {
      id: 'force-majeure',
      title: '11. Force Majeure',
      content: (
        <p>Kangqore shall not be liable for any failure or delay in performing its obligations under these Terms if such failure or delay results from circumstances beyond our reasonable control, including but not limited to natural disasters, acts of government, pandemics, epidemics, war, terrorism, civil unrest, labor disputes, malicious cyber-attacks, utility failures, or interruptions in third-party services.</p>
      )
    },
    {
      id: 'governing-law',
      title: '12. Governing Law & Dispute Resolution',
      content: (
        <>
          <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.</p>
          <p>Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India, unless otherwise agreed in a specific service contract.</p>
          <p>For client engagements, dispute resolution mechanisms (including mediation and arbitration) are governed by the applicable MSA or service agreement.</p>
        </>
      )
    },
    {
      id: 'severability',
      title: '13. Severability',
      content: (
        <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent.</p>
      )
    },
    {
      id: 'entire-agreement',
      title: '14. Entire Agreement',
      content: (
        <p>These Terms, together with our Privacy Statement and Cookie Policy, constitute the entire agreement between you and Kangqore regarding the use of our public website and digital platforms. For contracted services, these Terms are supplemented by the applicable MSA, SOW, or service agreement, which shall prevail in the event of any conflict.</p>
      )
    },
    {
      id: 'contact',
      title: '15. Contact Information',
      content: (
        <>
          <p>For questions about these Terms, please contact:</p>
          <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Kangqore Global Pvt Ltd</p>
            <p className="text-gray-600 dark:text-gray-400">Legal Department</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Bengaluru, Karnataka, India</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@kangqore.com" className="text-brand-blue hover:underline">legal@kangqore.com</a>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              <strong>General Inquiries:</strong>{' '}
              <a href="mailto:inquiry@kangqore.com" className="text-brand-blue hover:underline">inquiry@kangqore.com</a>
            </p>
          </div>
        </>
      )
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
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Terms & Conditions</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F]">Terms & Conditions</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 font-light max-w-3xl">
            Please read these terms carefully before using our services. These terms govern your access to and use of Kangqore's websites, platforms, and services.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Table of Contents */}
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <div className="lg:sticky lg:top-28">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">On This Page</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-500 hover:text-brand-blue hover:translate-x-1 transition-all duration-200 py-1.5 border-l-2 border-transparent hover:border-brand-blue pl-3"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Legal Questions?</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Our legal team is available for clarifications.</p>
                  <a href="mailto:legal@kangqore.com" className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline">
                    <Mail className="w-4 h-4" /> legal@kangqore.com
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-9 order-1 lg:order-2">
              <div className="prose prose-lg max-w-none">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="mb-12 scroll-mt-28">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{section.title}</h2>
                    <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mt-3 [&_li]:text-gray-600 dark:text-gray-400 [&_li]:leading-relaxed [&_strong]:text-gray-800 dark:text-gray-50">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </article>
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
              { title: 'Cookie Policy', path: '/cookies', desc: 'How we use cookies and tracking' },
              { title: 'Accessibility', path: '/accessibility', desc: 'Our commitment to accessibility' },
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

export default TermsAndConditions;
