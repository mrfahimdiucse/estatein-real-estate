import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CallToAction } from '../components/layout/CallToAction';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Linkedin, 
  Facebook,
  ArrowUpRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const ContactPage = () => {
  const [submissionState, setSubmissionState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      setSubmissionState('sending');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmissionState('success');
      form.reset();
    } catch (error) {
      console.error('Contact form submit error:', error);
      setSubmissionState('error');
    } finally {
      window.setTimeout(() => setSubmissionState('idle'), 5000);
    }
  };

  const contactInfo = [
    { label: "info@estatein.com", icon: <Mail size={20} />, sub: "Email Address" },
    { label: "+1 (123) 456-7890", icon: <Phone size={20} />, sub: "Phone Number" },
    { label: "Main Headquarters", icon: <MapPin size={20} />, sub: "Location" },
    { 
      label: "Social Media", 
      icon: <Instagram size={20} />, 
      sub: "Instagram, LinkedIn, Facebook",
      isSocial: true 
    },
  ];

  const offices = [
    {
      type: "Main Headquarters",
      address: "123 Estatein Plaza, City Center, Metropolis",
      email: "info@estatein.com",
      phone: "+1 (123) 456-7890",
      location: "Metropolis",
      tag: "All"
    },
    {
      type: "Regional Offices",
      address: "456 Urban Avenue, Downtown District, Metropolis",
      email: "info@restatein.com",
      phone: "+1 (123) 628-7890",
      location: "Metropolis",
      tag: "Regional"
    }
  ];

  const filteredOffices = activeFilter === 'All' 
    ? offices 
    : offices.filter(office => office.tag === activeFilter);

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="px-6 lg:px-20 py-12 lg:py-24 border-b border-border-card">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-text-primary leading-tight">Get in Touch with Estatein</h1>
        <p className="text-text-secondary text-sm lg:text-base max-w-4xl leading-relaxed opacity-80">
          Welcome to Estatein's Contact Us page. We're here to assist you with any inquiries, requests, or feedback you may have. Whether you're looking to buy or sell a property, explore investment opportunities, or simply want to connect, we're just a message away. Reach out to us, and let's start a conversation.
        </p>
      </section>

      {/* Top Info Cards */}
      <section className="px-6 lg:px-20 -mt-10 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((info, i) => (
            <div key={i} className="glass-card p-8 flex flex-col items-center text-center group cursor-pointer hover:border-purple-accent/50 transition-all relative">
              <div className="absolute top-4 right-4 text-gray-600 group-hover:text-purple-accent transition-colors">
                <ArrowUpRight size={20} />
              </div>
              <div className="w-16 h-16 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-purple-accent mb-6 group-hover:bg-purple-accent group-hover:text-white transition-all">
                {info.icon}
              </div>
              {!info.isSocial ? (
                <span className="font-bold text-sm leading-tight px-4 text-text-primary">{info.label}</span>
              ) : (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-purple-accent transition-colors"><Instagram size={18} /></div>
                  <div className="w-10 h-10 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-purple-accent transition-colors"><Linkedin size={18} /></div>
                  <div className="w-10 h-10 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-purple-accent transition-colors"><Facebook size={18} /></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Let's Connect Form */}
      <section className="px-6 lg:px-20 mb-20 sm:mb-32">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-white opacity-20" />
            <div className="w-2 h-2 rounded-full bg-white opacity-40" />
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-gray-400 text-sm max-w-4xl leading-relaxed">
            We're excited to connect with you and learn more about your real estate goals. Use the form below to get in touch with Estatein. Whether you're a prospective client, partner, or simply curious about our services, we're here to answer your questions and provide the assistance you need.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-10 lg:p-16 border border-border-card">
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-text-primary">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold">First Name</label>
              <input name="firstName" required type="text" placeholder="Enter First Name" className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold">Last Name</label>
              <input name="lastName" required type="text" placeholder="Enter Last Name" className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold">Email</label>
              <input name="email" required type="email" placeholder="Enter Your Email" className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold">Phone</label>
              <input name="phone" required type="tel" placeholder="Enter Phone Number" className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold">Inquiry Type</label>
              <div className="relative">
                <select name="inquiryType" className="w-full bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none appearance-none cursor-pointer">
                  <option>Select Inquiry Type</option>
                  <option>Buy Property</option>
                  <option>Sell Property</option>
                  <option>Investment Advice</option>
                  <option>Property Management</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold">How Did You Hear About Us?</label>
              <div className="relative">
                <select name="source" className="w-full bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none appearance-none cursor-pointer">
                  <option>Select</option>
                  <option>Social Media</option>
                  <option>Google Search</option>
                  <option>Friend Referral</option>
                  <option>Advertisement</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4">
              <label className="text-sm font-bold">Message</label>
              <textarea name="message" required placeholder="Enter your Message here.." rows={5} className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none resize-none"></textarea>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
               <div className="flex items-center gap-3">
                  <input required type="checkbox" id="terms-contact" className="w-5 h-5 rounded border-border-card bg-bg-button accent-purple-accent cursor-pointer" />
                  <label htmlFor="terms-contact" className="text-sm text-text-secondary cursor-pointer">I agree with <a href="#" className="underline text-text-primary">Terms of Use</a> and <a href="#" className="underline text-text-primary">Privacy Policy</a></label>
               </div>
               <button type="submit" className="btn-primary px-10 py-4 w-full md:w-auto text-sm font-bold shadow-lg shadow-purple-accent/20">Send Your Message</button>
            </div>
          </form>

          <AnimatePresence>
            {submissionState === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-8 p-5 bg-green-500/10 border border-green-500/50 rounded-2xl text-green-500 text-center font-bold flex items-center justify-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Message sent successfully! We'll get back to you soon.
              </motion.div>
            )}

            {submissionState === 'error' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-8 p-5 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-center font-bold flex items-center justify-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Something went wrong. Please try again later.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Office Locations */}
      <section className="px-6 lg:px-20 mb-32">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-white opacity-20" />
            <div className="w-2 h-2 rounded-full bg-white opacity-40" />
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Discover Our Office Locations</h2>
          <p className="text-gray-400 text-sm max-w-4xl leading-relaxed">
            Estatein is here to serve you across multiple locations. Whether you're looking for a new home, a strategic investment, or expert real estate advice, our offices are conveniently located to serve your needs.
          </p>
        </div>

        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {['All', 'Regional', 'International'].map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-xl text-sm font-medium border border-border-card transition-all whitespace-nowrap ${activeFilter === filter ? 'bg-bg-button text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {filteredOffices.map((office, i) => (
            <div key={i} className="glass-card p-10 flex flex-col hover:border-purple-accent/30 transition-all group">
              <span className="text-sm font-medium text-gray-400 mb-2">{office.type}</span>
              <h3 className="text-2xl font-bold mb-6">{office.address}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Our main headquarters serve as the heart of Estatein. Located in the bustling city center, this is where our core team of experts operates, driving the excellence and innovation that define us.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-10">
                <div className="flex items-center gap-2 px-6 py-3 bg-bg-button border border-border-card rounded-full text-sm text-text-secondary">
                  <Mail size={16} /> {office.email}
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-bg-button border border-border-card rounded-full text-sm text-text-secondary">
                  <Phone size={16} /> {office.phone}
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-bg-button border border-border-card rounded-full text-sm text-text-secondary">
                  <MapPin size={16} /> {office.location}
                </div>
              </div>

              <button className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 group/btn">
                Get Direction <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Estatein's World */}
      <section className="px-6 lg:px-20 mb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#1A1A1A] border border-card-border relative group">
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" alt="Office 1" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#1A1A1A] border border-card-border relative group">
                  <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800" alt="Office 2" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#1A1A1A] border border-card-border relative group">
                   <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team 1" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#1A1A1A] border border-card-border relative group">
                   <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Team 2" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
              </div>
              
              {/* Decorative text */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-accent/10 blur-[80px] -z-10 rounded-full" />
           </div>

           <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-white opacity-20" />
                <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Explore Estatein's World</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Step inside the world of Estatein, where professionalism meets warmth, and expertise meets passion. Our gallery offers a glimpse into our team and workspaces, inviting you to get to know us better.
              </p>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction />
    </div>
  );
};
