import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Mail, ChevronRight, Settings } from 'lucide-react';

const CookiePolicy = () => {
  const lastUpdated = 'March 31, 2026';

  const sections = [
    {
      id: 'what-are-cookies',
      title: '1. What Are Cookies',
      content: (
        <>
          <p>Cookies are small text files placed on your device (computer, smartphone, tablet) when you visit a website. They are widely used to make websites work efficiently, provide analytics information, and enable personalization. Cookies may be set by the website you are visiting ("first-party cookies") or by third parties whose services are embedded on the site ("third-party cookies").</p>
          <p>Similar technologies such as web beacons, pixels, local storage, and session storage are also used for similar purposes. References to "cookies" in this policy include these similar technologies.</p>
        </>
      )
    },
    {
      id: 'how-we-use',
      title: '2. How We Use Cookies',
      content: (
        <>
          <p>Kangqore uses cookies on our websites and digital platforms for the following purposes:</p>
          <ul>
            <li><strong>Essential Functionality:</strong> To enable core website features, security, and access management</li>
            <li><strong>Performance & Analytics:</strong> To understand how visitors interact with our websites, identify issues, measure traffic, and improve user experience</li>
            <li><strong>Preferences:</strong> To remember your settings, language preferences, and personalization choices</li>
            <li><strong>Marketing & Advertising:</strong> To deliver relevant content and advertisements, measure campaign effectiveness, and limit ad frequency</li>
          </ul>
        </>
      )
    },
    {
      id: 'types-of-cookies',
      title: '3. Types of Cookies We Use',
      content: (
        <>
          <div className="overflow-x-auto -mx-2 mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#050505]">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Duration</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Can You Opt Out?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border border-gray-200 font-medium text-gray-900 dark:text-white">Strictly Necessary</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Enable basic site functionality, authentication, and security. The website cannot function properly without these.</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Session / Up to 1 year</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">No — Required for site operation</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-[#050505]/50">
                  <td className="px-4 py-3 border border-gray-200 font-medium text-gray-900 dark:text-white">Performance & Analytics</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Collect anonymous data about how visitors use the site — pages visited, time spent, error messages. Used to improve our site.</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Up to 2 years</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border border-gray-200 font-medium text-gray-900 dark:text-white">Functional / Preference</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Remember your choices such as language, region, login status, and display preferences for a personalized experience.</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Up to 1 year</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Yes</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-[#050505]/50">
                  <td className="px-4 py-3 border border-gray-200 font-medium text-gray-900 dark:text-white">Marketing & Targeting</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Deliver relevant ads, track ad campaign performance, and build interest profiles. May be set by Kangqore or third-party partners.</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Up to 2 years</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )
    },
    {
      id: 'specific-cookies',
      title: '4. Specific Cookies in Use',
      content: (
        <>
          <p>Below are the primary cookies and similar technologies currently in use on Kangqore websites:</p>
          <div className="overflow-x-auto -mx-2 mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#050505]">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Cookie Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border border-gray-200">Expiry</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border border-gray-200 font-mono text-xs text-gray-900 dark:text-white">_session_id</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Kangqore</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Strictly Necessary</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Session</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-[#050505]/50">
                  <td className="px-4 py-3 border border-gray-200 font-mono text-xs text-gray-900 dark:text-white">_auth_token</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Kangqore</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Strictly Necessary</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">7 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border border-gray-200 font-mono text-xs text-gray-900 dark:text-white">_ga, _gid</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Google Analytics</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Analytics</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Up to 2 years</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-[#050505]/50">
                  <td className="px-4 py-3 border border-gray-200 font-mono text-xs text-gray-900 dark:text-white">i18next</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Kangqore</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Functional</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border border-gray-200 font-mono text-xs text-gray-900 dark:text-white">cookie_consent</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Kangqore</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">Strictly Necessary</td>
                  <td className="px-4 py-3 border border-gray-200 text-gray-600 dark:text-gray-400">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">This list is updated periodically and may not reflect every cookie at all times.</p>
        </>
      )
    },
    {
      id: 'third-party-cookies',
      title: '5. Third-Party Cookies',
      content: (
        <>
          <p>Some cookies on our website are placed by third-party services that appear on our pages. We do not control these third-party cookies. Third parties that may set cookies on our website include:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Web analytics service for measuring website traffic and usage patterns. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Google Privacy Policy</a></li>
            <li><strong>Google Tag Manager:</strong> Tag management system for deploying analytics and marketing tags</li>
            <li><strong>LinkedIn Insight Tag:</strong> Conversion tracking and audience building for LinkedIn advertising. <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">LinkedIn Privacy Policy</a></li>
            <li><strong>HubSpot:</strong> Marketing automation and CRM tracking. <a href="https://legal.hubspot.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">HubSpot Privacy Policy</a></li>
          </ul>
          <p>We encourage you to review the privacy and cookie policies of these third parties.</p>
        </>
      )
    },
    {
      id: 'managing-cookies',
      title: '6. Managing Your Cookie Preferences',
      content: (
        <>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.1 Cookie Consent</h4>
          <p>When you first visit our website, you will be presented with a cookie consent banner allowing you to accept or customize your cookie preferences. You can change your preferences at any time by clicking "Cookie Settings" in the footer of our website.</p>
          
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.2 Browser Settings</h4>
          <p>Most web browsers allow you to control cookies through their settings. You can typically:</p>
          <ul>
            <li>View cookies stored on your device</li>
            <li>Delete individual or all cookies</li>
            <li>Block cookies from specific or all websites</li>
            <li>Set your browser to notify you when a cookie is placed</li>
          </ul>
          <p>Please note that blocking or deleting cookies may affect the functionality of our website.</p>

          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.3 Browser-Specific Instructions</h4>
          <ul>
            <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and Site Data</li>
            <li><strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Microsoft Edge:</strong> Settings → Cookies and Site Permissions → Cookies</li>
          </ul>

          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.4 Opt-Out of Analytics</h4>
          <p>You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Google Analytics Opt-out Browser Add-on</a>.</p>
        </>
      )
    },
    {
      id: 'do-not-track',
      title: '7. Do Not Track Signals',
      content: (
        <p>Some browsers offer a "Do Not Track" (DNT) setting that sends a signal to websites you visit requesting not to be tracked. Currently, there is no industry standard for responding to DNT signals. Kangqore does not currently respond to DNT signals but respects your cookie preferences as set through our consent mechanism.</p>
      )
    },
    {
      id: 'updates',
      title: '8. Updates to This Policy',
      content: (
        <p>We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for operational, legal, or regulatory reasons. When we make significant changes, we will update the "Last Updated" date and may provide additional notice through our website. We encourage you to review this policy periodically.</p>
      )
    },
    {
      id: 'contact',
      title: '9. Contact Us',
      content: (
        <>
          <p>If you have questions about our use of cookies, please contact:</p>
          <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Kangqore Global Pvt Ltd</p>
            <p className="text-gray-600 dark:text-gray-400">Data Protection & Privacy Office</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Bengaluru, Karnataka, India</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@kangqore.com" className="text-brand-blue hover:underline">privacy@kangqore.com</a>
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
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Cookie Policy</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <Cookie className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F]">Cookie Policy</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 font-light max-w-3xl">
            This Cookie Policy explains how Kangqore uses cookies and similar tracking technologies on our websites and digital platforms, and how you can manage your preferences.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
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
                <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-brand-blue" />
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Cookie Preferences</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage your cookie settings at any time.</p>
                  <button className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline">
                    Open Cookie Settings
                  </button>
                </div>
              </div>
            </aside>

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
              { title: 'Terms & Conditions', path: '/terms', desc: 'Our terms of service and usage' },
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

export default CookiePolicy;
