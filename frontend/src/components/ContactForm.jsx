import React, { useState } from 'react';
import { Mail, Phone, Send, Linkedin, Twitter, Facebook, Instagram, Share2, Youtube } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    region: '',
    city: '',
    inquiryType: '',
    howDidYouHear: '',
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
    'Synapse'
  ];
  const referralSources = [
    'Google Search',
    'Social Media (LinkedIn, Twitter, etc.)',
    'Referral from a colleague',
    'Industry event or conference',
    'Online advertisement',
    'News article or blog',
    'Existing client',
    'Other'
  ];

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
        throw new Error(data.message || 'Failed to send message');
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
        city: '',
        inquiryType: '',
        howDidYouHear: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
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
    <section className="py-28 md:py-36 lg:py-44 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                Get in{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  Touch
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Our team is here to help</p>
                    <a href="mailto:business@kangqore.com" className="text-brand-blue hover:text-cyan-500 font-medium transition-colors">
                      business@kangqore.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Call Us</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Mon-Sat from 9AM to 9PM</p>
                    <a href="tel:+91 7782010696" className="text-brand-blue hover:text-cyan-500 font-medium transition-colors">
                      +91 7782010696
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Follow Us</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Connect with us on social media</p>
                  </div>
                </div>
                <div className="flex gap-3 ml-16 flex-wrap mt-2">
                  {/* LinkedIn */}
                  <a 
                    href="https://www.linkedin.com/company/kangqore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-gradient hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_rgba(37,100,234,0.2)] hover:-translate-y-1"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </a>

                  {/* X (Twitter) */}
                  <a 
                    href="https://x.com/kangqore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-gradient hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_rgba(37,100,234,0.2)] hover:-translate-y-1"
                    aria-label="X (formerly Twitter)"
                  >
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a 
                    href="https://www.facebook.com/kangqore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-gradient hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_rgba(37,100,234,0.2)] hover:-translate-y-1"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </a>

                  {/* Instagram */}
                  <a 
                    href="https://www.instagram.com/kangqore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-gradient hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_rgba(37,100,234,0.2)] hover:-translate-y-1"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </a>

                  {/* YouTube */}
                  <a 
                    href="https://www.youtube.com/@kangqore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-gradient hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_rgba(37,100,234,0.2)] hover:-translate-y-1"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </a>

                  {/* Reddit */}
                  <a 
                    href="https://www.reddit.com/r/kangqore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg flex items-center justify-center hover:bg-brand-gradient hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-[0_8px_16px_rgba(37,100,234,0.2)] hover:-translate-y-1"
                    aria-label="Reddit"
                  >
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-brand-gradient rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">We&apos;re here to help</h3>
              <p className="text-white/90 leading-relaxed">
                Whether you&apos;re looking to transform your business with AI, modernize your technology, or explore partnership opportunities, our team of experts is ready to guide you.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-2xl p-8 lg:p-10">
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
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Bengaluru, India"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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

                <div>
                  <label htmlFor="howDidYouHear" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    How Did You Hear About Us?*
                  </label>
                  <select
                    id="howDidYouHear"
                    name="howDidYouHear"
                    required
                    value={formData.howDidYouHear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Source</option>
                    {referralSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
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
        </div>
      </div>
    </section>
  );
};

export default ContactForm;