import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe, ArrowRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import ScheduleConsultation from '../components/ScheduleConsultation';
import ServiceSelector from '../components/common/ServiceSelector';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    region: '',
    inquiryType: '',
    interestedServices: [],
    message: ''
  });

  const regions = ['North America', 'South America', 'Europe', 'Middle East', 'APAC', 'India'];
  const inquiryTypes = [
    'Alumni',
    'Career Seekers',
    'Investor Relations',
    'Media',
    'Partners',
    'Request for Services',
    'General Inquiry'
  ];

  const offices = [
    {
      city: 'New York',
      country: 'United States',
      address: '300 Park Avenue, New York, NY 10022',
      phone: '+1 (212) 555-0100',
      email: 'newyork@kangqore.com'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '1 Kingdom Street, London W2 6BD',
      phone: '+44 20 7555 0100',
      email: 'london@kangqore.com'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: '1 Raffles Place, Tower 2, Singapore 048616',
      phone: '+65 6555 0100',
      email: 'singapore@kangqore.com'
    },
    {
      city: 'Mumbai',
      country: 'India',
      address: 'Hiranandani Business Park, Mumbai 400076',
      phone: '+91 22 5555 0100',
      email: 'mumbai@kangqore.com'
    }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to send message');
      }

      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll be in touch soon.",
      });

      setFormData({
        name: '',
        email: '',
        organization: '',
        phone: '',
        region: '',
        inquiryType: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Set debug info for user to screenshot/copy
      setFormData(prev => ({
        ...prev,
        debugError: JSON.stringify({
          error: error.message,
          stack: error.stack, // Optional: might be too noisy
          apiUrl: API_URL,
          endpoint: `${API_URL}/api/contact`,
          timestamp: new Date().toISOString()
        }, null, 2)
      }));

      toast({
        title: "Failed to send message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO 
        title={coreSEO.contact.title}
        description={coreSEO.contact.description}
        keywords={coreSEO.contact.keywords}
        url={coreSEO.contact.url}
        schemas={[{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Kangqore",
          "url": "https://kangqore.com/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "Kangqore",
            "contactPoint": [{
              "@type": "ContactPoint",
              "contactType": "sales",
              "email": "inquiry@kangqore.com",
              "availableLanguage": ["English"]
            }]
          }
        }]}
      />
      {/* Hero Section */}
      <PageHero
        badge="Contact Us"
        title="Let's transform your business"
        titleHighlight="together"
        description="Have questions? We'd love to hear from you. Get in touch with our team and let's discuss how we can help transform your business."
        primaryButton={{ text: 'Schedule Consultation', link: '#consultation' }}
        secondaryButton={{ text: 'View Offices', link: '#offices' }}
        stats={[
          { value: '24/7', label: 'Global Support', color: 'text-cyan-400' },
          { value: '< 24h', label: 'Response Time', color: 'text-blue-400' },
          { value: '40+', label: 'Countries', color: 'text-emerald-400' },
          { value: '98%', label: 'Satisfaction Rate', color: 'text-purple-400' },
        ]}
      />

      {/* Quick Contact Cards */}
      <section id="consultation" className="py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Our team is here to help</p>
                  <a href="mailto:inquiry@kangqore.com" className="text-brand-blue hover:text-cyan-500 font-medium transition-colors">
                    inquiry@kangqore.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-brand-cyan rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Call Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Mon-Fri from 8am to 6pm</p>
                  <a href="tel:+1-800-123-4567" className="text-brand-blue hover:text-cyan-500 font-medium transition-colors">
                    +1 (800) 123-4567
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Business Hours</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">We're available</p>
                  <span className="text-brand-blue font-medium">
                    24/7 Global Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Send us a message</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Mahesh Kumar"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="business@kangqore.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Organization*
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Kangqore"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Contact Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="+91 7782010696"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="region" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Region*
                    </label>
                    <select
                      id="region"
                      name="region"
                      required
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Inquiry Type*
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Inquiry Type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Services of Interest
                  </label>
                  <ServiceSelector 
                    selectedServices={formData.interestedServices || []}
                    onChange={(services) => setFormData(prev => ({ ...prev, interestedServices: services }))}
                    label=""
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    className="mt-1 w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="consent" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    I would like Kangqore to contact me based on the information provided above. I agree to the processing of my personal data as described in the Privacy Notice.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-brand-gradient text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              {/* Why Contact Us */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Contact Kangqore?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-4 h-4 text-gray-900 dark:text-white" />
                    </div>
                    <span className="text-white/90">Get expert consultation on digital transformation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-4 h-4 text-gray-900 dark:text-white" />
                    </div>
                    <span className="text-white/90">Explore partnership and collaboration opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-4 h-4 text-gray-900 dark:text-white" />
                    </div>
                    <span className="text-white/90">Learn about career opportunities at Kangqore</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-4 h-4 text-gray-900 dark:text-white" />
                    </div>
                    <span className="text-white/90">Request information for media and investor relations</span>
                  </li>
                </ul>
              </div>

              {/* Response Time */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Response</h3>
                    <p className="text-gray-600 dark:text-gray-400">We typically respond within 24 hours</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Our dedicated team reviews every inquiry and ensures you receive a personalized response from the right expert.
                </p>
              </div>

              {/* Global Presence */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-brand-blue" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global Presence</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  With offices across the globe, we're always close to you. Find your nearest Kangqore office below.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['New York', 'London', 'Singapore', 'Mumbai', 'Tokyo', 'Sydney', 'Dubai', 'Frankfurt'].map((city) => (
                    <span key={city} className="px-3 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 text-sm rounded-full">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section id="offices" className="py-16 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Offices</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Find Kangqore offices around the world</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{office.city}</h3>
                    <p className="text-sm text-gray-500">{office.country}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">{office.address}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Phone:</span> {office.phone}
                  </p>
                  <a 
                    href={`mailto:${office.email}`}
                    className="text-brand-blue hover:text-cyan-500 transition-colors inline-block break-all"
                  >
                    {office.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Consultation Section */}
      <ScheduleConsultation />

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-gradient rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's discuss how Kangqore can help you modernize technology, reimagine processes, and transform experiences.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Schedule a Consultation
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
