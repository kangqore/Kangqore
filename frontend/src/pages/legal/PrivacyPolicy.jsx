import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Mail, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = 'March 31, 2026';

  const sections = [
    {
      id: 'overview',
      title: '1. Overview',
      content: (
        <>
          <p>Kangqore Global Pvt Ltd ("Kangqore", "we", "our", or "us") is committed to protecting the privacy and security of personal information. This Privacy Statement describes how we collect, use, disclose, transfer, and otherwise process personal information in connection with our services, websites, mobile applications, and other digital platforms (collectively, the "Services").</p>
          <p>This Privacy Statement applies to personal information collected by Kangqore as a data controller. When we process personal information on behalf of our clients as a data processor, we process such information in accordance with the instructions and agreements with those clients.</p>
          <p>Kangqore Global Pvt Ltd is a company incorporated under the laws of India, with its registered office in Bengaluru, Karnataka, India.</p>
        </>
      )
    },
    {
      id: 'information-we-collect',
      title: '2. Information We Collect',
      content: (
        <>
          <p>We collect personal information in the following ways:</p>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.1 Information You Provide Directly</h4>
          <ul>
            <li>Contact information (name, email address, phone number, postal address)</li>
            <li>Professional information (job title, company name, industry, role)</li>
            <li>Account credentials (username, password)</li>
            <li>Communication preferences and subscription choices</li>
            <li>Information submitted through contact forms, event registrations, or service inquiries</li>
            <li>Application materials for employment (resume, cover letter, qualifications, references)</li>
            <li>Feedback, survey responses, and correspondence</li>
          </ul>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.2 Information Collected Automatically</h4>
          <ul>
            <li>Device and browser information (type, version, operating system)</li>
            <li>IP address and approximate geographic location</li>
            <li>Website usage data (pages viewed, time spent, navigation paths)</li>
            <li>Referral source and search terms</li>
            <li>Cookie data and similar tracking technologies (see our <Link to="/cookies" className="text-brand-blue hover:underline">Cookie Policy</Link>)</li>
          </ul>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.3 Information from Third Parties</h4>
          <ul>
            <li>Publicly available business information from professional networking platforms</li>
            <li>Information provided by our clients in connection with service delivery</li>
            <li>Information from analytics and advertising partners</li>
          </ul>
        </>
      )
    },
    {
      id: 'how-we-use',
      title: '3. How We Use Your Information',
      content: (
        <>
          <p>We process personal information for the following purposes:</p>
          <ul>
            <li><strong>Service Delivery:</strong> To provide, maintain, and improve our products, platforms, and consulting services</li>
            <li><strong>Communication:</strong> To respond to inquiries, provide customer support, and send service-related communications</li>
            <li><strong>Marketing:</strong> To send newsletters, event invitations, thought leadership content, and promotional materials (with your consent where required)</li>
            <li><strong>Recruitment:</strong> To evaluate job applications, conduct interviews, and manage the hiring process</li>
            <li><strong>Analytics:</strong> To understand how our Services are used, identify trends, and improve user experience</li>
            <li><strong>Security:</strong> To detect, prevent, and respond to security incidents, fraud, and abuse</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and enforceable government requests</li>
            <li><strong>Business Operations:</strong> To manage our business, including financial reporting, audits, and internal operations</li>
          </ul>
        </>
      )
    },
    {
      id: 'legal-basis',
      title: '4. Legal Basis for Processing',
      content: (
        <>
          <p>Where applicable law requires a legal basis for processing personal information, we rely on the following:</p>
          <ul>
            <li><strong>Contractual Necessity:</strong> Processing necessary for the performance of a contract with you or to take steps at your request before entering into a contract</li>
            <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate business interests, such as improving our services, marketing, and ensuring network security, provided these interests do not override your rights</li>
            <li><strong>Consent:</strong> Processing based on your specific, informed consent, which you may withdraw at any time</li>
            <li><strong>Legal Obligation:</strong> Processing necessary to comply with legal obligations to which Kangqore is subject</li>
          </ul>
        </>
      )
    },
    {
      id: 'data-sharing',
      title: '5. Data Sharing & Disclosure',
      content: (
        <>
          <p>We do not sell personal information. We may share personal information with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third-party vendors who assist in delivering our services (e.g., cloud hosting, analytics, payment processing). These providers are contractually obligated to protect your information</li>
            <li><strong>Business Partners:</strong> Technology and consulting partners with whom we collaborate to deliver integrated solutions</li>
            <li><strong>Legal Authorities:</strong> Government bodies or regulators when required by law, legal process, or to protect our rights, safety, or property</li>
            <li><strong>Corporate Transactions:</strong> In connection with a merger, acquisition, reorganization, or sale of assets, subject to applicable data protection requirements</li>
            <li><strong>With Your Consent:</strong> With third parties when you have provided your explicit consent</li>
          </ul>
        </>
      )
    },
    {
      id: 'international-transfers',
      title: '6. International Data Transfers',
      content: (
        <>
          <p>Kangqore operates primarily from India and may transfer personal information to other jurisdictions where our service providers, partners, or affiliates are located. When we transfer personal information across borders, we implement appropriate safeguards, which may include:</p>
          <ul>
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Adequacy decisions by relevant data protection authorities</li>
            <li>Binding corporate rules and contractual obligations</li>
            <li>Compliance with the Digital Personal Data Protection Act, 2023 (India) and its associated rules</li>
          </ul>
        </>
      )
    },
    {
      id: 'data-security',
      title: '7. Data Security',
      content: (
        <>
          <p>We implement robust technical and organizational measures to protect personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
          <ul>
            <li>Encryption of data in transit (TLS/SSL) and at rest</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Regular security assessments, vulnerability scanning, and penetration testing</li>
            <li>Employee training on data protection and security practices</li>
            <li>Incident response and breach notification procedures</li>
            <li>Physical security controls at our facilities</li>
          </ul>
          <p>While we strive to protect personal information, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security.</p>
        </>
      )
    },
    {
      id: 'data-retention',
      title: '8. Data Retention',
      content: (
        <>
          <p>We retain personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. Retention periods are determined based on:</p>
          <ul>
            <li>The nature and sensitivity of the personal information</li>
            <li>The purpose for which the information was collected</li>
            <li>Applicable legal and regulatory requirements</li>
            <li>The potential risk of harm from unauthorized use or disclosure</li>
          </ul>
          <p>When personal information is no longer required, we securely delete or anonymize it in accordance with our data retention policies.</p>
        </>
      )
    },
    {
      id: 'your-rights',
      title: '9. Your Rights',
      content: (
        <>
          <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Right of Access:</strong> Request access to the personal information we hold about you</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete personal information</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal information, subject to legal obligations</li>
            <li><strong>Right to Restrict Processing:</strong> Request that we limit the processing of your personal information</li>
            <li><strong>Right to Data Portability:</strong> Request a copy of your personal information in a structured, machine-readable format</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
            <li><strong>Right to Lodge a Complaint:</strong> File a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below. We will respond to your request within the timeframe required by applicable law.</p>
        </>
      )
    },
    {
      id: 'children',
      title: '10. Children\'s Privacy',
      content: (
        <p>Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected personal information from a child, please contact us immediately, and we will take appropriate steps to delete such information.</p>
      )
    },
    {
      id: 'third-party-links',
      title: '11. Third-Party Links',
      content: (
        <p>Our Services may contain links to third-party websites, applications, or services that are not operated or controlled by Kangqore. This Privacy Statement does not apply to such third-party services. We encourage you to review the privacy policies of any third-party services you interact with. Kangqore is not responsible for the content, privacy practices, or policies of third-party services.</p>
      )
    },
    {
      id: 'changes',
      title: '12. Changes to This Privacy Statement',
      content: (
        <p>We may update this Privacy Statement from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes, we will notify you by updating the "Last Updated" date at the top of this page and, where required, provide additional notice (such as a banner on our website or email notification). We encourage you to review this Privacy Statement periodically.</p>
      )
    },
    {
      id: 'contact',
      title: '13. Contact Us',
      content: (
        <>
          <p>If you have questions, concerns, or requests regarding this Privacy Statement or our data practices, please contact us:</p>
          <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Kangqore Global Pvt Ltd</p>
            <p className="text-gray-600 dark:text-gray-400">Data Protection & Privacy Office</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Bengaluru, Karnataka, India</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@kangqore.com" className="text-brand-blue hover:underline">privacy@kangqore.com</a>
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
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Privacy Statement</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F]">Privacy Statement</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 font-light max-w-3xl">
            At Kangqore, we are committed to safeguarding the privacy of our clients, employees, partners, and all individuals whose personal information we process. This statement explains how we handle your data.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Table of Contents - Sticky Sidebar */}
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Questions?</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Contact our privacy team for any data protection inquiries.</p>
                  <a href="mailto:privacy@kangqore.com" className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline">
                    <Mail className="w-4 h-4" /> privacy@kangqore.com
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

      {/* Related Legal Pages */}
      <section className="py-16 bg-gray-50 dark:bg-black dark:border-gray-700 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Policies</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Terms & Conditions', path: '/terms', desc: 'Our terms of service and usage' },
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

export default PrivacyPolicy;
