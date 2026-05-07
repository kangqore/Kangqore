import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, Users, BookOpen, Handshake,
  ArrowRight, Lock, ExternalLink
} from 'lucide-react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

const CommunitiesPage = () => {
  // Knowledge Pillars - How the Community Works
  const knowledgePillars = [
    {
      icon: Lightbulb,
      title: 'Thought Leadership',
      bullets: [
        'Founder POVs',
        'Enterprise insights',
        'AI, cloud, governance thinking'
      ],
      cta: 'Read Insights',
      link: '/insights'
    },
    {
      icon: Users,
      title: 'Executive Briefings',
      bullets: [
        'Private CXO sessions',
        'Invite-only roundtables',
        'Strategic discussions'
      ],
      cta: 'Request Invitation',
      link: '/contact'
    },
    {
      icon: BookOpen,
      title: 'Engineering Playbooks',
      bullets: [
        'Reference architectures',
        'Frameworks',
        'Governance models'
      ],
      cta: 'View Playbooks',
      link: 'https://github.com/kangqore'
    },
    {
      icon: Handshake,
      title: 'Partner Exchange',
      bullets: [
        'Alliance knowledge',
        'Co-delivery standards',
        'Execution practices'
      ],
      cta: 'Learn More',
      link: '/contact'
    }
  ];

  // Platform Cards with official SVG brand logos - All buttons unified to brand blue
  const buttonStyle = 'bg-[#0A66C2] hover:bg-[#004182]'; // Unified blue button style
  
  const platforms = [
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      name: 'LinkedIn',
      description: 'Our official voice for enterprise leadership, insights, and organizational updates.',
      cta: 'Connect on LinkedIn',
      link: 'https://linkedin.com/company/kangqore',
      iconBg: 'bg-[#0A66C2]'
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      name: 'X (Twitter)',
      description: 'Real-time thinking on AI, systems, and enterprise execution.',
      cta: 'Follow Our Thinking',
      link: 'https://twitter.com/kangqore',
      iconBg: 'bg-black'
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
      name: 'GitHub',
      description: 'Engineering playbooks, reference architectures, and execution frameworks.',
      cta: 'Explore Repositories',
      link: 'https://github.com/kangqore',
      iconBg: 'bg-[#181717]'
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      name: 'WhatsApp',
      description: 'One-way channel for leadership updates and executive announcements. Direct updates from our team.',
      cta: 'Subscribe',
      link: '#',
      iconBg: 'bg-[#25D366]'
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
        </svg>
      ),
      name: 'Instagram',
      description: 'Behind-the-scenes glimpses, team moments, and visual stories from Kangqore.',
      cta: 'Follow Us',
      link: 'https://instagram.com/kangqore',
      iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045]'
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      name: 'Facebook',
      description: 'Community updates, events, and enterprise discussions.',
      cta: 'Like Our Page',
      link: 'https://facebook.com/kangqore',
      iconBg: 'bg-[#1877F2]'
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      name: 'Reddit',
      description: 'Join discussions on enterprise tech, AI, and digital transformation.',
      cta: 'Join Community',
      link: 'https://reddit.com/r/kangqore',
      iconBg: 'bg-[#FF4500]'
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
        </svg>
      ),
      name: 'Newsletter',
      description: 'Monthly digest of insights, updates, and exclusive enterprise content delivered to your inbox.',
      cta: 'Subscribe Now',
      link: '/contact',
      iconBg: 'bg-gray-700'
    }
  ];

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title={coreSEO.communities.title}
        description={coreSEO.communities.description}
        keywords={coreSEO.communities.keywords}
        url={coreSEO.communities.url}
      />
      <PageHero
        badge="Community"
        title="The Kangqore Knowledge"
        titleHighlight="Network"
        description="A curated ecosystem for enterprise leaders, technologists, and partners shaping resilient digital systems through shared knowledge and insights."
        primaryButton={{ text: 'Explore Insights', link: '/insights' }}
        secondaryButton={{ text: 'Executive Briefings', link: '/contact' }}
        stats={[
          { value: '10K+', label: 'Community Members', color: 'text-cyan-400' },
          { value: '50+', label: 'Events Annually', color: 'text-blue-400' },
          { value: '100+', label: 'Resources', color: 'text-emerald-400' },
          { value: 'Global', label: 'Network', color: 'text-purple-400' },
        ]}
      />

      {/* How the Community Works - Knowledge Pillars */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How the Kangqore Community Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Our community is distributed by design. Each platform plays a focused role—ensuring clarity, authority, and signal over noise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {knowledgePillars.map((pillar, index) => {
              const IconComponent = pillar.icon;
              const isExternal = pillar.link.startsWith('http');
              return (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                    <IconComponent className="w-7 h-7 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{pillar.title}</h3>
                  <ul className="space-y-2 mb-6">
                    {pillar.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  {isExternal ? (
                    <a 
                      href={pillar.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:text-brand-blue transition-colors group/link"
                    >
                      {pillar.cta}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link 
                      to={pillar.link}
                      className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:text-brand-blue transition-colors group/link"
                    >
                      {pillar.cta}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Presence Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Where We Share Our Thinking
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Kangqore publishes insights and frameworks across a focused set of platforms, each designed for a specific purpose.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {platforms.map((platform, index) => {
              const IconComponent = platform.icon;
              return (
                <a
                  key={index}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group min-h-[180px] flex"
                >
                  <div className="flex items-start gap-5 w-full">
                    <div className={`w-14 h-14 ${platform.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        {platform.name}
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed flex-grow">
                        {platform.description}
                      </p>
                      <span className={`inline-flex items-center gap-2 ${buttonStyle} text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors w-fit`}>
                        {platform.cta}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Private Collaboration Notice */}
      <section className="py-12 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-8 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Private Collaboration Spaces</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Partner collaboration, internal engineering forums, and co-delivery workspaces are available through secure access and are not publicly listed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-28 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Engage With Kangqore
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              Explore insights, access enterprise perspectives, or connect with our team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/insights" 
                className="inline-flex items-center gap-2 bg-white dark:bg-black text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Insights
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-colors"
              >
                Contact Kangqore
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunitiesPage;
