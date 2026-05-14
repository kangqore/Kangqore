import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Clock, Globe, ArrowRight, Sparkles, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import BookingWidget from '../components/scheduling/BookingWidget';
import ServiceSelector from '../components/common/ServiceSelector';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

const ContactUs = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('meeting'); // 'meeting' or 'message'
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
        interestedServices: [],
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
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO 
        title={coreSEO.contact.title}
        description={coreSEO.contact.description}
        keywords={coreSEO.contact.keywords}
        url={coreSEO.contact.url}
      />
      
      {/* Hero Section */}
      <PageHero
        badge="Contact Us"
        title="Let's transform your business"
        titleHighlight="together"
        description="Connect with our global team of experts. Whether you're looking for specialized consulting or general support, we're here to help."
        primaryButton={{ text: 'Book a Meeting', link: '#contact-options' }}
        secondaryButton={{ text: 'View Offices', link: '#offices' }}
        stats={[
          { value: '24/7', label: 'Global Support', color: 'text-cyan-400' },
          { value: '< 24h', label: 'Response Time', color: 'text-blue-400' },
          { value: '40+', label: 'Countries', color: 'text-emerald-400' },
          { value: '98%', label: 'Satisfaction Rate', color: 'text-purple-400' },
        ]}
      />

      {/* Main Interaction Area */}
      <section id="contact-options" className="py-20 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Option Toggle */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => setActiveTab('meeting')}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'meeting'
                    ? 'bg-white dark:bg-gray-900 text-brand-blue shadow-md'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Schedule a Meeting
              </button>
              <button
                onClick={() => setActiveTab('message')}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'message'
                    ? 'bg-white dark:bg-gray-900 text-brand-blue shadow-md'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Send a Message
              </button>
            </div>
          </div>

          <div className="transition-all duration-500">
            {activeTab === 'meeting' ? (
              <div className="animate-fade-in">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Book a Discovery Session</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto">
                    Choose a time that works for you. Our experts will join you for a 30-minute session to discuss your business challenges.
                  </p>
                </div>
                <BookingWidget eventTypeSlug="discovery-call" />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                  {/* Form Left Side */}
                  <div className="md:w-1/3 bg-gray-50 dark:bg-black/20 p-8 md:p-12 border-r border-gray-100 dark:border-gray-800">
                    <div className="space-y-8">
                      <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Direct Inquiry</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Prefer to reach out via email? Fill out this form and our regional team will get back to you within 24 hours.
                      </p>
                      
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-brand-blue" />
                          <span className="text-sm font-medium">inquiry@kangqore.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-brand-blue" />
                          <span className="text-sm font-medium">+1 (800) 123-4567</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Right Side */}
                  <div className="flex-1 p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Organization</label>
                          <input
                            required
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Region</label>
                          <select
                            required
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none appearance-none"
                          >
                            <option value="">Select Region</option>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Interested Services</label>
                        <ServiceSelector 
                          selectedServices={formData.interestedServices}
                          onChange={(services) => setFormData(prev => ({ ...prev, interestedServices: services }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                        <textarea
                          required
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none resize-none"
                          placeholder="Tell us about your project or inquiry..."
                        />
                      </div>

                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-5 bg-brand-gradient text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-brand-blue/20"
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="w-6 h-6" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Global Presence / Offices */}
      <section id="offices" className="py-24 bg-gray-50 dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Globe className="w-3 h-3" />
                Global Presence
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Global Offices</h2>
              <p className="text-gray-500 mt-4 leading-relaxed">
                Strategically located in major global hubs to provide seamless support and expertise across every time zone.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-brand-blue/30 transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-black rounded-2xl flex items-center justify-center group-hover:bg-brand-gradient transition-all duration-500">
                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{office.city}</h3>
                    <p className="text-sm text-gray-400">{office.country}</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                  <p>{office.address}</p>
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-blue" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-blue" />
                      <span className="truncate">{office.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 dark:bg-gray-800 p-12 md:p-20 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to start your journey?</h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                Join hundreds of global enterprises that have transformed their digital presence with Kangqore's expertise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setActiveTab('meeting');
                    document.getElementById('contact-options').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-10 py-4 bg-brand-gradient text-white font-bold rounded-2xl hover:scale-[1.03] transition-all shadow-xl shadow-brand-blue/20"
                >
                  Book Your Session
                </button>
                <Link
                  to="/careers"
                  className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                >
                  Join Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
