import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, Building, MessageSquare, Check } from 'lucide-react';
import ServiceSelector from './common/ServiceSelector';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useToast } from '../hooks/use-toast';

const ScheduleConsultation = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    topic: '',
    services: [],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const dates = generateDates();

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        description: "Choose your preferred consultation slot",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = `${selectedDate.toDateString()} at ${selectedTime}`;
      
      const payload = {
        ...formData,
        preferredDate: formattedDate,
        service: 'Executive Consultation' // Default service context
      };

      const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${API_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule consultation');
      }

      toast({
        title: "Consultation Scheduled!",
        description: `We'll see you on ${formatDate(selectedDate).month} ${formatDate(selectedDate).date} at ${selectedTime}`,
      });

      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      console.error('Consultation schedule error:', error);
      toast({
        title: "Booking Failed",
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
        <div 
          ref={sectionRef}
          className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gradient rounded-2xl mb-6 animate-float">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Schedule Your{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Consultation
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A focused conversation with Kangqore’s senior leaders to assess risks, opportunities, and next steps across technology, operations, and AI.
            </p>
          </div>

          {/* Booking Interface */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Date Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-brand-blue" />
                  Select Date
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {dates.map((date, index) => {
                    const formatted = formatDate(date);
                    const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                          isSelected
                            ? 'border-brand-blue bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg scale-102'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                            isSelected 
                              ? 'bg-brand-gradient text-white shadow-md' 
                              : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            <span className="text-xs font-medium uppercase">{formatted.day}</span>
                            <span className="text-xl font-bold">{formatted.date}</span>
                          </div>
                          <div className="text-left">
                            <p className={`font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900 dark:text-white'}`}>
                              {formatted.month} {formatted.date}
                            </p>
                            <p className="text-sm text-gray-500">Available slots</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time & Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Time Selection */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-blue" />
                  Select Time {selectedDate && `- ${formatDate(selectedDate).month} ${formatDate(selectedDate).date}`}
                </h3>
                {!selectedDate ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border-2 border-dashed border-gray-300">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Please select a date first</p>
                    <p className="text-sm text-gray-400 mt-1">Choose a date from the left panel</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-4 scroll-smooth custom-scrollbar-horizontal" style={{ scrollbarWidth: 'thin' }}>
                      {timeSlots.map((time, index) => {
                        const isSelected = selectedTime === time;
                        
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`flex-shrink-0 w-32 p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                              isSelected
                                ? 'border-brand-blue bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-brand-gradient text-white shadow-md' 
                                  : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white'
                              }`}>
                                <Clock className="w-6 h-6" />
                              </div>
                              <div className="text-center">
                                <p className={`font-bold text-base ${isSelected ? 'text-blue-900' : 'text-gray-900 dark:text-white'}`}>
                                  {time}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">30 min</p>
                              </div>
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-gradient rounded-full flex items-center justify-center shadow-md">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-gray-400">← Scroll to see more time slots →</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-blue" />
                  Your Information
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Kangqore"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="+91 7782010696"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Topic / Subject
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. AI Integration, Strategic Partnership"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Services of Interest
                    </label>
                    <ServiceSelector 
                      selectedServices={formData.services || []}
                      onChange={(services) => setFormData(prev => ({ ...prev, services }))}
                      label=""
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      What would you like to discuss?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Describe your business challenge or project requirements..."
                    ></textarea>
                  </div>

                  {/* Selected Date and Time Display */}
                  {(selectedDate || selectedTime) && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Time:</p>
                      <div className="flex items-center gap-4 text-blue-900">
                        {selectedDate && (
                          <span className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(selectedDate).month} {formatDate(selectedDate).date}, {selectedDate.getFullYear()}
                          </span>
                        )}
                        {selectedTime && (
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {selectedTime}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-brand-gradient text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Request Executive Assessment'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16 lg:mt-20 grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Free Consultation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">No cost, no obligation - just expert advice</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Expert Guidance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with industry specialists</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Personalized Solutions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tailored strategies for your business</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleConsultation;
