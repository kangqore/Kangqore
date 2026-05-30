import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Clock, Globe, ArrowRight, Sparkles, MessageSquare, Calendar, Share2, Linkedin, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
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
    city: '',
    inquiryType: '',
    source: '',
    message: '',
    consent: false
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
        city: '',
        inquiryType: '',
        source: '',
        message: '',
        consent: false
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
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
      
      {/* Hero Section matching HomePage */}
      <section className="relative w-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#0a1228] mt-2 mx-auto" style={{ maxWidth: 'calc(100% - 1rem)' }}>
        <div className="relative min-h-[calc(100vh-1rem)] overflow-hidden">
          {/* Background Layers */}
          <div className="absolute inset-0 z-0 bg-[#0a1228]">
            <img 
              src="/images/basketball_contact.png" 
              alt="Contact Background" 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>

          {/* Content Layer */}
          <div className="relative z-[2] min-h-[calc(100vh-1rem)] flex flex-col justify-center">
            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="max-w-4xl flex flex-col h-full gap-10 mt-20">
                
                <div className="space-y-10 flex-shrink-0">
                  <span className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase bg-white/10 text-white border border-white/20 backdrop-blur-md">
                    Contact Us
                  </span>
                  
                  <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white animate-fade-in">
                    Let's transform your<br />
                    business
                    <span className="bg-brand-gradient bg-clip-text text-transparent"> together</span>
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-[1.8] max-w-2xl animate-fade-in font-medium">
                    We’re here to help! Tell us what you’re looking for and we’ll get you connected to the right people.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 animate-fade-in mt-5">
                  <button
                    onClick={() => {
                      setActiveTab('meeting');
                      document.getElementById('contact-options').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/70 backdrop-blur-xl text-gray-900 shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <span className="relative z-10 text-gray-900 font-bold tracking-wide text-[13px]">
                      Book a Meeting
                    </span>
                    <div className="relative z-10 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-blue shadow-md">
                      <ArrowRight className="w-4 h-4 text-white transition-all duration-500 group-hover:translate-x-0.5" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('message');
                      document.getElementById('contact-options').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group inline-flex items-center gap-2 px-4 py-2 hover:opacity-80 transition-opacity duration-300"
                  >
                    <span className="text-[13px] font-bold text-white/90 tracking-wide uppercase">
                      Send a Message
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    ? 'bg-brand-gradient text-white shadow-md shadow-brand-blue/20'
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
                    ? 'bg-brand-gradient text-white shadow-md shadow-brand-blue/20'
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
              <div className="max-w-6xl mx-auto animate-fade-in flex flex-col md:flex-row gap-12 items-stretch">
                {/* Form Left Side */}
                <div className="md:w-5/12 flex flex-col gap-6">
                  <h2 className="text-6xl font-bold text-gray-900 dark:text-white">
                    Get in <span className="bg-brand-gradient bg-clip-text text-transparent">Touch</span>
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>

                  {/* Email Box */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-blue/20">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Email Us</h4>
                      <p className="text-sm text-gray-500 mb-1">Our team is here to help</p>
                      <a href="mailto:business@kangqore.com" className="text-sm text-transparent bg-clip-text bg-brand-gradient font-bold hover:opacity-80">business@kangqore.com</a>
                    </div>
                  </div>

                  {/* Call Box */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-blue/20">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Call Us</h4>
                      <p className="text-sm text-gray-500 mb-1">Mon-Sat from 9AM to 9PM</p>
                      <a href="tel:+917782010696" className="text-sm text-transparent bg-clip-text bg-brand-gradient font-bold hover:opacity-80">+91 7782010696</a>
                    </div>
                  </div>

                  {/* Follow Us Box */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-blue/20">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Follow Us</h4>
                      <p className="text-sm text-gray-500 mb-4">Connect with us on social media</p>
                      <div className="flex gap-3">
                        <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-blue-50 dark:hover:bg-brand-blue/10 transition-all">
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-all">
                          {/* Custom X Logo SVG */}
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10 transition-all">
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#E4405F] hover:border-[#E4405F]/30 hover:bg-[#E4405F]/10 transition-all">
                          <Instagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#FF0000] hover:border-[#FF0000]/30 hover:bg-[#FF0000]/10 transition-all">
                          <Youtube className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#FF4500] hover:border-[#FF4500]/30 hover:bg-[#FF4500]/10 transition-all">
                          {/* Custom Reddit Logo SVG */}
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.275-1.84.734-1.93-1.4-4.665-2.288-7.669-2.396l1.637-7.753 5.4 1.157c.01.815.688 1.472 1.517 1.472 1.458 0 2.644-1.19 2.644-2.655C23.032 1.192 21.845 0 20.388 0c-.98 0-1.83.541-2.296 1.332l-5.91-1.267c-.244-.052-.486.082-.556.32l-1.776 8.411c-3.13.064-5.98.966-7.98 2.41-.482-.47-.1142-.76-.1866-.76C.1192 10.446 0 11.634 0 13.093c0 .99.553 1.848 1.353 2.316-.036.216-.057.436-.057.66 0 4.102 4.78 7.424 10.669 7.424 5.889 0 10.668-3.322 10.668-7.424 0-.214-.02-.424-.052-.63.844-.45 1.419-1.338 1.419-2.36M12.012 21.11c-3.663 0-6.684-2.261-6.684-5.048 0-2.785 3.021-5.045 6.684-5.045 3.664 0 6.685 2.26 6.685 5.045 0 2.787-3.021 5.048-6.685 5.048" />
                            <path d="M9.13 15.602c-.997 0-1.808.807-1.808 1.805 0 .999.811 1.807 1.808 1.807 1.002 0 1.811-.808 1.811-1.807 0-.998-.809-1.805-1.811-1.805M14.887 15.602c-.999 0-1.81.807-1.81 1.805 0 .999.811 1.807 1.81 1.807.997 0 1.808-.808 1.808-1.807 0-.998-.811-1.805-1.808-1.805" />
                            <path d="M12.014 20.301c-1.83 0-3.321-.734-3.411-.784-.306-.168-.415-.55-.246-.856.168-.306.551-.416.856-.246.035.02 1.258.643 2.801.643 1.54 0 2.76-.621 2.795-.641.306-.17.688-.06.858.246.168.306.059.688-.247.856-.09.05-1.581.782-3.406.782" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* We're here to help Box */}
                  <div className="bg-brand-gradient text-white rounded-2xl p-8 mt-auto shadow-xl shadow-brand-blue/20">
                    <h4 className="text-xl font-bold mb-3">We're here to help</h4>
                    <p className="text-sm text-blue-50 leading-relaxed">
                      Whether you're looking to transform your business with AI, modernize your technology, or explore partnership opportunities, our team of experts is ready to guide you.
                    </p>
                  </div>
                </div>

                {/* Form Right Side */}
                <div className="md:w-7/12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name*</label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"
                          placeholder="Mahesh Kumar"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address*</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"
                          placeholder="business@kangqore.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Organization*</label>
                        <input
                          required
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"
                          placeholder="Kangqore"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Contact Number*</label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"
                          placeholder="+91 7782010696"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Region*</label>
                        <select
                          required
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none appearance-none"
                        >
                          <option value="">Select Region</option>
                          {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">City*</label>
                        <input
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none"
                          placeholder="Bengaluru, India"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Inquiry Type*</label>
                        <select
                          required
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none appearance-none"
                        >
                          <option value="">Select Inquiry Type</option>
                          {inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">How Did You Hear About Us?*</label>
                        <select
                          required
                          name="source"
                          value={formData.source}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none appearance-none"
                        >
                          <option value="">Select Source</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Google Search">Google Search</option>
                          <option value="Referral">Referral</option>
                          <option value="Event">Event</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                      <textarea
                        required
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-1 w-4 h-4 text-brand-blue bg-gray-100 border-gray-300 rounded focus:ring-brand-blue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      />
                      <label htmlFor="consent" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed cursor-pointer">
                        I would like Kangqore to contact me based on the information provided above. I agree to the processing of my personal data as described in the Privacy Notice.
                      </label>
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-4 bg-brand-gradient text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-brand-blue/20"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* I'm Looking For Section */}
      <section className="py-24 bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              I'm Looking For
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Please select your area of interest below. A Kangqore representative will contact you shortly after receiving your request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 max-w-6xl mx-auto">
            {[
              { label: 'Request for Services', link: '#contact-options' },
              { label: 'Technology and Market Analyst Queries', link: '#contact-options' },
              { label: 'eQORE-related Queries', link: '#contact-options' },
              { label: 'Financial Analysts and Investor Queries', link: '#contact-options' },
              { label: 'Media Queries', link: '#contact-options' },
              { label: 'Career-related Queries', link: '/careers' },
              { label: 'Supplier Payment Related Queries', link: '#contact-options' },
              { label: 'BPM-related Queries', link: '#contact-options' },
              { label: 'Website Feedback', link: '#contact-options' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start">
                <Link
                  to={item.link}
                  className="group inline-block"
                  onClick={(e) => {
                    if (item.link === '#contact-options') {
                      e.preventDefault();
                      setFormData(prev => ({ ...prev, inquiryType: item.label }));
                      setActiveTab('message');
                      document.getElementById('contact-options').scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="text-lg md:text-xl font-bold text-[#1a233a] dark:text-white border-b-2 border-[#1a233a] dark:border-white pb-1 group-hover:text-brand-blue group-hover:border-brand-blue transition-colors duration-300">
                    {item.label}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
