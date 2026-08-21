import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Cpu, Users, Shield, CheckCircle, Linkedin } from 'lucide-react';
import PageHero from '../components/PageHero';
import SecondaryButton from '../components/ui/SecondaryButton';

const Leadership = () => {
  const leaders = [
    {
      name: 'C.O.D.E.',
      role: 'Founder & Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop',
      bio: [
        'C.O.D.E. founded Kangqore with a clear vision: to bridge the gap between advanced technology potential and real-world business impact. With a strong background in software engineering, digital systems, and enterprise architecture, he leads Kangqore\'s long-term strategy, innovation roadmap, and global growth initiatives.',
        'As CEO, Mahesh focuses on building scalable engineering systems, nurturing a high-performance culture, and positioning Kangqore as a trusted technology partner for enterprises navigating AI-led transformation.',
        'His leadership philosophy centers on engineering discipline, ethical innovation, and outcome-driven execution.'
      ]
    },
    {
      name: 'Dinesh Kumar',
      role: 'Co-Founder & Chief Financial Officer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop',
      bio: [
        'Dinesh Kumar oversees Kangqore\'s financial strategy, governance, and operational sustainability. As Co-Founder and CFO, he plays a critical role in ensuring financial discipline, risk management, and scalable growth across all business units.',
        'With a strong focus on compliance, capital efficiency, and long-term value creation, Dinesh enables Kangqore to scale responsibly while maintaining transparency and control across operations.',
        'His approach blends financial rigor with strategic enablement, supporting Kangqore\'s ambition to grow as a resilient global enterprise.'
      ]
    }
  ];

  const principles = [
    {
      icon: Target,
      title: 'Vision with execution',
      description: 'We translate strategy into systems, roadmaps, and measurable outcomes.'
    },
    {
      icon: Cpu,
      title: 'Engineering-first mindset',
      description: 'Decisions are grounded in architecture, data, security, and long-term scalability.'
    },
    {
      icon: Users,
      title: 'Ownership and accountability',
      description: 'Every initiative has clear ownership, responsibility, and success metrics.'
    },
    {
      icon: Shield,
      title: 'Trust and transparency',
      description: 'We build credibility with clients, partners, and teams through honesty and consistency.'
    }
  ];

  const governancePoints = [
    'Strong governance and compliance',
    'High standards of quality and security',
    'Sustainable growth across industries and geographies',
    'Continuous investment in people, platforms, and innovation'
  ];

  return (
    <div className="bg-white dark:bg-black" data-testid="leadership-page">
      {/* Hero Section */}
      <PageHero
        badge="Leadership"
        title="Leadership That"
        titleHighlight="Engineers Impact"
        description="Kangqore is led by technologists and business leaders who combine deep engineering expertise with strategic foresight. Our leadership team is committed to building intelligent systems, delivering measurable outcomes, and shaping future-ready digital enterprises."
        primaryButton={{ text: 'Get in Touch', link: '/contact' }}
        secondaryButton={{ text: 'About Kangqore', link: '/about-us' }}
        stats={[
          { value: 'Founder', label: 'Led', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '50+', label: 'Projects', color: 'text-blue-400' },
          { value: 'Engineering', label: 'First', color: 'text-emerald-400' },
          { value: 'Global', label: 'Impact', color: 'text-purple-400' },
        ]}
      />

      {/* Leadership Team Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4">Meet Our Leaders</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Our Leadership Team
            </h2>
          </div>

          {/* Leaders Grid */}
          <div className="space-y-20">
            {leaders.map((leader, index) => (
              <div 
                key={index}
                className={`grid lg:grid-cols-12 gap-12 lg:gap-16 items-start ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image Column */}
                <div className={`lg:col-span-4 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-brand-gradient rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
                    <div className="relative">
                      <img 
                        src={leader.image}
                        alt={leader.name}
                        className="w-full aspect-square object-cover rounded-2xl shadow-xl"
                      />
                      <div className="absolute bottom-4 right-4">
                        <a 
                          href="#" 
                          className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-lg hover:bg-blue-50 transition-colors inline-flex"
                          aria-label={`${leader.name} LinkedIn`}
                        >
                          <Linkedin className="w-5 h-5 text-brand-blue" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="lg:max-w-2xl">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-xl text-brand-blue font-medium mb-8">
                      {leader.role}
                    </p>
                    <div className="space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {leader.bio.map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Lead Section */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4">Our Principles</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                How We Lead
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Kangqore&apos;s leadership operates on a shared set of principles that guide every decision, initiative, and partnership.
              </p>
            </div>

            {/* Right Column - Principles */}
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-8">
                {principles.map((principle, index) => {
                  const IconComponent = principle.icon;
                  return (
                    <div key={index} className="group">
                      <div className="w-14 h-14 bg-brand-gradient rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governance & Direction Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div>
              <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4">Governance</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Governance & Direction
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                The leadership team works closely with senior engineering, delivery, and operations leaders to ensure:
              </p>
              <div className="space-y-4">
                {governancePoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-gradient rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{point}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-8">
                Our leaders are deeply involved in client engagement, solution design, and delivery oversight, ensuring Kangqore remains hands-on, accountable, and outcome-focused.
              </p>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Leadership meeting"
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Looking Ahead Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
      </div>
        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent font-semibold text-sm uppercase tracking-wider mb-4">The Future</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            Looking Ahead
          </h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed mb-12">
            <p>
              Kangqore&apos;s leadership is focused on building a future-ready organization—one that helps enterprises navigate complexity, adopt emerging technologies responsibly, and engineer lasting impact.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-white">
              We don&apos;t just lead teams.<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                We lead transformation.
              </span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <SecondaryButton 
              text="About Kangqore" 
              link="/about-us" 
              theme="glass"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
