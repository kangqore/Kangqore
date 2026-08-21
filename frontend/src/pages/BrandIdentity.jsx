import React from 'react';
import { Download, AlertCircle, Check, X, FileText, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import SecondaryButton from '../components/ui/SecondaryButton';

const BrandIdentity = () => {
  const logoVariants = [
    {
      name: 'Primary Logo',
      description: 'Symbol + Wordmark + Tagline',
      useCase: 'Introducing the brand, website headers, marketing materials',
      bgLight: true,
      image: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/mhsrvpwk_Logos.png',
      downloads: {
        png: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/mhsrvpwk_Logos.png',
        pdf1: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/669pj4f5_Logo%2BText.pdf',
        pdf2: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/76bcu2nw_Logo%2BText.pdf'
      }
    },
    {
      name: 'Wordmark Logo',
      description: 'Symbol + Wordmark (no tagline)',
      useCase: 'Corporate documents, partner materials, minimal layouts',
      bgLight: true,
      image: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/mhsrvpwk_Logos.png',
      downloads: {
        png: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/mhsrvpwk_Logos.png',
        pdf1: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/hzcb53b3_Logo%2BText.pdf',
        pdf2: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/3htb06f9_Logo%2BText.pdf'
      }
    },
    {
      name: 'Symbol Only',
      description: 'Icon only',
      useCase: 'App icons, favicons, internal platforms',
      bgLight: false,
      image: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/coi8cm5g_LogosS.png',
      downloads: {
        png: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/coi8cm5g_LogosS.png',
        jpg: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/k0k5py4a_Logo.jpg',
        pdf: 'https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/2vodaboa_Logo.pdf'
      }
    }
  ];

  const incorrectUsage = [
    'Stretch, compress, or distort the logo',
    'Change colors or apply gradients',
    'Add shadows, outlines, or effects',
    'Rotate or tilt the logo',
    'Recreate, redraw, or modify the symbol',
    'Combine the logo with other marks or icons'
  ];

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title="Brand Identity & Assets — Logo, Guidelines & Media Kit | Kangqore"
        description="Official Kangqore brand guidelines, logo system, typography standards, and downloadable media kit. Ensure consistent, professional representation of the Kangqore brand."
        keywords="Kangqore brand, logo guidelines, brand identity, media kit, press resources, brand assets"
        url="/brand-identity"
      />
      {/* Custom Hero Section with Logo */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
      </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-white dark:bg-black/10 backdrop-blur-sm rounded-full text-sm font-medium bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent mb-6">
                Brand Guidelines
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Kangqore Brand Identity
                {' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  & Assets
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                Official guidelines and assets for representing the Kangqore brand. This page provides approved logos, usage standards, legal guidance, and press resources to ensure Kangqore is represented consistently, accurately, and professionally across all platforms.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#media-kit"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Download Media Kit
                  <Download className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <SecondaryButton 
                  text="View Guidelines" 
                  link="#guidelines" 
                  theme="glass"
                />
              </div>
            </div>

            {/* Right - Logo Display */}
            <div className="flex items-center justify-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/ratv9f78_Logo.png"
                alt="Kangqore Logo"
                className="w-full h-auto max-w-md object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* The Kangqore Brand */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">The Kangqore Brand</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Kangqore is a technology and innovation company focused on engineering intelligent, secure, and scalable digital systems for a rapidly evolving world.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Our brand reflects long-term thinking, engineering discipline, and trust. Every visual and verbal expression of Kangqore is designed to communicate clarity, confidence, and credibility—without noise or exaggeration.
            </p>
            <div className="inline-block bg-brand-gradient text-white px-8 py-4 rounded-lg">
              <p className="text-sm font-semibold uppercase tracking-wider mb-1">Brand Tagline</p>
              <p className="text-2xl font-bold">We Innovate Futures!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo System */}
      <section id="guidelines" className="py-20 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Logo System</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The Kangqore logo is the primary identifier of the brand. It must always be used in its approved form and treated as a signal of trust and authenticity.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Logo Components</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">The Kangqore identity consists of:</p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-brand-blue mt-1">•</span>
                <span>The Kangqore symbol (icon)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-blue mt-1">•</span>
                <span>The Kangqore wordmark</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-blue mt-1">•</span>
                <span>The tagline (used selectively)</span>
              </li>
            </ul>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Approved Logo Variants</h3>
          
          <div className="space-y-12">
            {logoVariants.map((variant, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Logo Display */}
                  <div className={`p-12 flex items-center justify-center ${variant.bgLight ? 'bg-gray-50 dark:bg-[#050505]' : 'bg-gray-900'}`}>
                    <div className="text-center">
                      <img 
                        src={variant.image} 
                        alt={variant.name}
                        className="h-40 mx-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* Information */}
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{variant.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 italic">{variant.description}</p>
                    
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Use when:</p>
                      <p className="text-gray-600 dark:text-gray-400">{variant.useCase}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Downloads:</p>
                      <div className="flex gap-3 flex-wrap">
                        {variant.downloads.png && (
                          <a href={variant.downloads.png} download className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition">
                            <Download className="w-4 h-4" />
                            <span>PNG</span>
                          </a>
                        )}
                        {variant.downloads.jpg && (
                          <a href={variant.downloads.jpg} download className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition">
                            <Download className="w-4 h-4" />
                            <span>JPG</span>
                          </a>
                        )}
                        {variant.downloads.pdf && (
                          <a href={variant.downloads.pdf} download className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                            <Download className="w-4 h-4" />
                            <span>PDF</span>
                          </a>
                        )}
                        {variant.downloads.pdf1 && (
                          <a href={variant.downloads.pdf1} download className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                            <Download className="w-4 h-4" />
                            <span>PDF (v1)</span>
                          </a>
                        )}
                        {variant.downloads.pdf2 && (
                          <a href={variant.downloads.pdf2} download className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                            <Download className="w-4 h-4" />
                            <span>PDF (v2)</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color & Background Usage */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Color & Background Usage</h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">The Kangqore logo is strictly monochrome.</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Check className="w-6 h-6 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Approved Usage</h3>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>White logo on dark backgrounds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Black logo on light backgrounds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Use solid, neutral backgrounds only</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Ensure strong contrast at all times</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <X className="w-6 h-6 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Not Allowed</h3>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">×</span>
                  <span>Gradients</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">×</span>
                  <span>Patterns or textures</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">×</span>
                  <span>Busy imagery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">×</span>
                  <span>Low-contrast placements</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-brand-gradient text-white rounded-2xl p-8 text-center">
            <p className="text-xl font-semibold">The logo must always remain clear, legible, and dominant.</p>
          </div>
        </div>
      </section>

      {/* Clear Space & Incorrect Usage */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Clear Space & Scaling</h2>
            <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-8">
              <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>Maintain generous clear space around the logo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>Do not crowd the logo with text or visual elements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue mt-1">•</span>
                  <span>Always scale proportionally</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 mt-6 italic">The logo must never feel compressed or constrained.</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Incorrect Usage (Strictly Prohibited)</h2>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-start gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-900 dark:text-white font-semibold">Do not:</p>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {incorrectUsage.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-red-600 font-semibold mt-6">Any alteration weakens brand trust and is not permitted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography & Brand Voice */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Typography & Brand Voice</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Typography</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Kangqore uses modern, neutral, sans-serif typography that prioritizes clarity and readability.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4 font-semibold">Typography principles:</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>Clean hierarchy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>Balanced spacing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>No decorative or playful fonts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>No exaggerated styling</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 italic mt-4">When in doubt, choose clarity over expression.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Brand Voice</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Kangqore communicates with:</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>Calm confidence</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>Engineering precision</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>Global neutrality</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-blue">•</span>
                  <span>Respect and inclusivity</span>
                </li>
              </ul>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">We do not promote:</p>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>× Discrimination or division</li>
                  <li>× Polarizing language</li>
                  <li>× Cultural, political, or ideological bias</li>
                </ul>
              </div>
              <p className="text-brand-blue font-semibold mt-4">Kangqore represents responsible progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Guidelines */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Brand Usage & Legal Guidelines</h2>

          <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Brand Ownership & Rights</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The Kangqore name, logo, symbol, wordmark, tagline "We Innovate Futures!", and all associated brand assets are the exclusive intellectual property of Kangqore.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                All rights are reserved unless explicitly granted in writing. Use of Kangqore brand assets signifies acceptance of these guidelines.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Permitted Use</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Kangqore brand assets may be used only for:</p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Press and media coverage</li>
                  <li>• Partner announcements and collaborations</li>
                  <li>• Client presentations and case studies</li>
                  <li>• Academic, research, or industry references</li>
                  <li>• Recruitment and employer branding (approved use)</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <X className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Prohibited Use</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Kangqore brand assets must not be used:</p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>× To imply partnership without authorization</li>
                  <li>× In misleading or deceptive contexts</li>
                  <li>× In political, religious, or ideological campaigns</li>
                  <li>× In unlawful or unethical materials</li>
                  <li>× As part of another logo or composite mark</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No License or Transfer</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Use of Kangqore brand assets does not grant:</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Ownership rights</li>
                <li>• Trademark license</li>
                <li>• Rights to register similar names or symbols</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4 font-semibold">All goodwill remains the property of Kangqore.</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-8 border-2 border-yellow-200">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enforcement</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Kangqore reserves the right to:</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Request immediate removal of improper usage</li>
                <li>• Revoke permissions at any time</li>
                <li>• Take appropriate legal action where necessary</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Press & Media Kit */}
      <section id="media-kit" className="py-20 bg-brand-gradient text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Press & Media Kit</h2>
            <p className="text-xl text-blue-100">
              This media kit contains officially approved materials for editorial and informational use.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">About Kangqore</h3>
              <p className="text-blue-100 leading-relaxed">
                Kangqore is a technology and innovation company focused on engineering intelligent, secure, and scalable systems for enterprises and institutions. We design and deliver future-ready digital ecosystems across modern engineering, cloud, automation, AI-enabled platforms, and next-generation technologies.
              </p>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-wider mb-2">Tagline</p>
                <p className="text-2xl font-bold">We Innovate Futures!</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Company Boilerplates</h3>
              
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider mb-2">Short Boilerplate</p>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Kangqore is a technology and innovation company focused on building intelligent, secure, and scalable systems for the future.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider mb-2">Standard Boilerplate</p>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Kangqore is a value-driven technology and innovation company that helps enterprises and institutions achieve digital transformation through modern engineering and AI-enabled solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 text-gray-900 dark:text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Download Media Kit</h3>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition font-semibold">
                <Download className="w-5 h-5" />
                <span>Full Press Kit (ZIP)</span>
              </a>
              <SecondaryButton 
                text="Brand Overview PDF" 
                link="#" 
                theme="light"
                icon={FileText}
              />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Media Contact</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">For press inquiries, interviews, or official statements:</p>
              <a href="/contact" className="inline-flex items-center gap-2 text-brand-blue hover:text-blue-700 font-semibold">
                <Mail className="w-5 h-5" />
                <span>Contact Media Relations</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Note */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Final Note</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-4">
            The Kangqore brand is not decorative.
          </p>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            It is a signal of trust, engineering depth, and long-term intent.
          </p>
          <p className="text-2xl font-bold text-white">
            Use it with discipline.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BrandIdentity;
