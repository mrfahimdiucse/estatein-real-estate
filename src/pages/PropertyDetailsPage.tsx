import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CallToAction } from '../components/layout/CallToAction';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Ruler, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Calendar,
  Star
} from 'lucide-react';
import { Property } from '../types';
import { propertyService } from '../services/api';

export const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const dbProp = await propertyService.getById(id);
        if (dbProp) {
          setProperty(dbProp);
        } else {
          navigate('/properties');
        }
      } catch (error) {
        console.error('Failed to fetch property details:', error);
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    getProperty();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      inquiryType: `Inquiry - ${property.title}`,
      source: `Property Details Page`,
      message: `${formData.get('message')}\n\nProperty: ${property.title}, ${property.location}`
    };

    try {
      setFormState('sending');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send inquiry');
      }

      setFormState('success');
      form.reset();
      window.setTimeout(() => setFormState('idle'), 5000);
    } catch (error) {
      console.error('Inquiry form submit error:', error);
      setFormState('error');
      window.setTimeout(() => setFormState('idle'), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const gallery = Array.isArray(property.gallery) ? property.gallery : [];
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  return (
    <div className="pb-24">
      {/* Property Header */}
      <section className="px-6 lg:px-20 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-6">
               <button 
                onClick={() => navigate('/properties')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-button border border-border-card text-text-secondary hover:text-text-primary transition-colors"
                title="Back to Listings"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-3xl lg:text-4xl font-bold">{property.title}</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-medium">
              <MapPin size={18} className="text-purple-accent" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="flex flex-col md:items-end">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Price</span>
            <span className="text-3xl font-bold text-white">${property.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="glass-card p-4 lg:p-10 mb-20 overflow-hidden">
          {/* Thumbnails Row - Scrollable on mobile */}
          <div className="flex sm:grid sm:grid-cols-9 gap-3 mb-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {gallery.concat(gallery).slice(0, 9).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImageIndex(idx % gallery.length)}
                className={`rounded-xl overflow-hidden aspect-square cursor-pointer transition-all border-2 flex-shrink-0 w-16 sm:w-auto ${activeImageIndex === idx % gallery.length ? 'border-purple-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img 
                  src={img || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Hero Split Images - Single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-bg-main shadow-lg text-text-primary">
              <img 
                src={gallery[activeImageIndex] || property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
                alt={property.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-bg-main hidden md:block shadow-lg text-text-primary">
              <img 
                src={gallery[(activeImageIndex + 1) % gallery.length] || property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
                alt={property.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </div>
          </div>

          {/* Gallery Controls */}
          {gallery.length > 0 && (
            <div className="flex items-center justify-center gap-4 py-4 px-6 bg-bg-main border border-border-card rounded-full w-fit mx-auto">
               <button 
                 onClick={() => setActiveImageIndex(prev => (prev - 1 + gallery.length) % gallery.length)}
                 className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-button border border-border-card hover:bg-border-card transition-colors text-text-secondary"
               >
                 <ChevronLeft size={20}/>
               </button>
               <div className="flex gap-1.5 px-4">
                 {gallery.map((_, idx) => (
                   <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === idx ? 'bg-purple-accent w-10' : 'bg-gray-800 w-3'}`}
                   />
                 ))}
               </div>
               <button 
                 onClick={() => setActiveImageIndex(prev => (prev + 1) % gallery.length)}
                 className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-button border border-border-card hover:bg-border-card transition-colors text-text-secondary"
               >
                 <ChevronRight size={20}/>
               </button>
            </div>
          )}
        </div>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Description Section */}
          <div className="glass-card p-8 lg:p-12">
            <h2 className="text-2xl font-bold mb-6">Description</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              {property.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border-card border border-border-card rounded-2xl overflow-hidden">
              <div className="bg-bg-button p-6 lg:p-8 flex flex-col gap-2 text-text-primary">
                <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase font-bold mb-1">
                  <BedDouble size={18} /> Bedrooms
                </div>
                <span className="text-2xl lg:text-3xl font-bold">{String(property.beds).padStart(2, '0')}</span>
              </div>
              <div className="bg-bg-button p-6 lg:p-8 flex flex-col gap-2 text-text-primary">
                <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase font-bold mb-1">
                  <Bath size={18} /> Bathrooms
                </div>
                <span className="text-2xl lg:text-3xl font-bold">{String(property.baths).padStart(2, '0')}</span>
              </div>
              <div className="bg-bg-button p-6 lg:p-8 flex flex-col gap-2 text-text-primary">
                <div className="flex items-center gap-2 text-text-secondary text-[10px] uppercase font-bold mb-1">
                  <Ruler size={18} /> Area
                </div>
                <span className="text-base lg:text-lg font-bold whitespace-nowrap">{property.area}</span>
              </div>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="glass-card p-8 lg:p-12">
            <h2 className="text-2xl font-bold mb-6">Key Features and Amenities</h2>
            <ul className="grid gap-4">
              {amenities.map((amenity, idx) => (
                <li key={idx} className="flex items-center gap-4 p-5 rounded-2xl border border-border-card bg-bg-button group hover:border-purple-accent/50 transition-all text-text-primary">
                  <div className="w-12 h-12 rounded-xl bg-purple-accent/10 flex items-center justify-center text-purple-accent group-hover:bg-purple-accent group-hover:text-white transition-all transform group-hover:rotate-12">
                    <Zap size={22} />
                  </div>
                  <span className="text-text-secondary text-sm font-medium group-hover:text-text-primary">{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="px-6 lg:px-20 mb-32">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
             <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-white opacity-20" />
                  <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <h2 className="text-5xl font-bold mb-6 leading-[1.1]">Inquire About{"\n"}{property.title}</h2>
                <p className="text-gray-400 text-base leading-relaxed opacity-80">
                  Interested in this property? Fill out the form below, and our real estate experts will get back to you with more details, including scheduling a viewing and answering any questions you may have.
                </p>
             </div>
          </div>

          <div className="lg:col-span-2 glass-card p-10 lg:p-16">
            <form onSubmit={handleFormSubmit} className="grid md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wide">First Name</label>
                <input name="firstName" required type="text" placeholder="Enter First Name" className="bg-bg-button border border-border-card rounded-xl p-5 text-sm text-text-primary focus:border-purple-accent outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wide">Last Name</label>
                <input name="lastName" required type="text" placeholder="Enter Last Name" className="bg-bg-button border border-border-card rounded-xl p-5 text-sm text-text-primary focus:border-purple-accent outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wide">Email</label>
                <input name="email" required type="email" placeholder="Enter Your Email" className="bg-bg-button border border-border-card rounded-xl p-5 text-sm text-text-primary focus:border-purple-accent outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wide">Phone</label>
                <input name="phone" required type="tel" placeholder="Enter Phone Number" className="bg-bg-button border border-border-card rounded-xl p-5 text-sm text-text-primary focus:border-purple-accent outline-none transition-all" />
              </div>

              <div className="flex flex-col gap-4 md:col-span-2">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wide">Selected Property</label>
                <div className="relative">
                  <input readOnly value={`${property.title}, ${property.location}`} className="w-full bg-bg-button border border-border-card rounded-xl py-5 pl-7 pr-14 text-sm text-text-secondary outline-none" />
                  <MapPin size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary" />
                </div>
              </div>

              <div className="flex flex-col gap-4 md:col-span-2">
                <label className="text-sm font-bold text-text-primary uppercase tracking-wide">Message</label>
                <textarea name="message" required placeholder="Enter your Message here.." rows={5} className="bg-bg-button border border-border-card rounded-xl p-5 text-sm text-text-primary focus:border-purple-accent outline-none resize-none transition-all"></textarea>
              </div>

              <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-8 mt-6">
                 <div className="flex items-center gap-4">
                    <input required type="checkbox" id="terms-final" className="w-6 h-6 rounded border-border-card bg-bg-button accent-purple-accent cursor-pointer" />
                    <label htmlFor="terms-final" className="text-sm text-text-secondary cursor-pointer">I agree with <a href="#" className="text-text-primary underline underline-offset-4 decoration-purple-accent/40">Terms of Use</a> and <a href="#" className="text-text-primary underline underline-offset-4 decoration-purple-accent/40">Privacy Policy</a></label>
                 </div>
                 <button type="submit" disabled={formState === 'sending'} className="btn-primary px-12 py-5 w-full md:w-auto text-base font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                   {formState === 'sending' ? 'Sending...' : 'Send Your Message'}
                 </button>
              </div>
            </form>
            
            <AnimatePresence>
              {formState === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-8 p-5 bg-green-500/10 border border-green-500/50 rounded-2xl text-green-500 text-center font-bold flex items-center justify-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Success! Your inquiry has been sent to our team.
                </motion.div>
              )}

              {formState === 'error' && (
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
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 lg:px-20 mb-32">
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-2 h-2 rounded-full bg-white opacity-20" />
             <div className="w-2 h-2 rounded-full bg-white opacity-40" />
             <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <h2 className="text-5xl font-bold mb-6">Comprehensive Pricing Details</h2>
          <p className="text-gray-400 text-base max-w-4xl leading-relaxed opacity-80">
            At Estatein, transparency is key. We want you to have a clear understanding of all costs associated with your property investment. Below, we break down the pricing for {property.title} to help you make an informed decision.
          </p>
        </div>

        <div className="bg-bg-main rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-20 border border-border-card relative overflow-hidden">
          <div className="bg-bg-card rounded-2xl p-6 lg:p-8 border border-border-card mb-12 lg:mb-20 flex flex-col md:flex-row items-center gap-6 lg:gap-10">
            <span className="font-bold text-xl lg:text-3xl px-6 py-3 lg:px-8 lg:py-4 bg-bg-main rounded-2xl border border-border-card shadow-2xl text-text-primary">Note</span>
            <div className="w-px h-16 bg-border-card hidden md:block" />
            <p className="text-text-secondary text-base lg:text-lg font-medium opacity-90 text-center md:text-left">The figures provided above are estimates and may vary depending on the property, location, and individual circumstances.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-3 text-center lg:text-left">
               <span className="text-text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Listing Price</span>
               <span className="text-4xl lg:text-6xl font-black tracking-tight text-text-primary">${property.price.toLocaleString()}</span>
            </div>

            <div className="lg:col-span-9 space-y-16 lg:space-y-24">
              {/* Additional Fees */}
              <div className="border-t border-border-card pt-10 lg:pt-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 lg:mb-10 gap-4">
                  <h3 className="text-2xl lg:text-3xl font-bold text-text-primary">Additional Fees</h3>
                  <button className="bg-bg-button border border-border-card px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-bold text-text-primary hover:bg-border-card transition-all w-fit">Learn More</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 lg:gap-10">
                  <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                    <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Property Transfer Tax</span>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <span className="text-2xl lg:text-4xl font-bold text-text-primary">$25,000</span>
                      <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium">Based on sale price</span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                    <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Legal Fees</span>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                       <span className="text-2xl lg:text-4xl font-bold text-text-primary">$3,000</span>
                       <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium">Title transfer services</span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                    <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Home Inspection</span>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <span className="text-2xl lg:text-4xl font-bold text-text-primary">$500</span>
                      <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium">Due diligence check</span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                    <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Property Insurance</span>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <span className="text-2xl lg:text-4xl font-bold text-text-primary">$1,200</span>
                      <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium">Annual comprehensive</span>
                    </div>
                  </div>
                </div>
                {/* Mortgage Fees Box */}
                <div className="mt-6 lg:mt-10 p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                   <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Mortgage Fees</span>
                   <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <span className="text-2xl lg:text-4xl font-bold text-text-primary">Varies</span>
                    <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium">If applicable, consult your lender</span>
                  </div>
                </div>
              </div>

              {/* Monthly Costs */}
              <div className="border-t border-border-card pt-10 lg:pt-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 lg:mb-10 gap-4">
                  <h3 className="text-2xl lg:text-3xl font-bold text-text-primary">Monthly Costs</h3>
                  <button className="bg-bg-button border border-border-card px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-bold text-text-primary hover:bg-border-card transition-all w-fit">Learn More</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 lg:gap-10">
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Property Taxes</span>
                      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$1,250</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium">Approximate monthly tax</span>
                      </div>
                   </div>
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">HOA Fee</span>
                      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$300</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium">Monthly area maintenance</span>
                      </div>
                   </div>
                </div>
              </div>

               {/* Total Initial Costs */}
               <div className="border-t border-card-border pt-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                  <h3 className="text-2xl sm:text-3xl font-bold">Total Initial Costs</h3>
                  <button className="btn-secondary px-8 py-4 text-sm font-bold w-fit">Learn More</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 lg:gap-10">
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Listing Price</span>
                      <span className="text-2xl lg:text-4xl font-bold text-text-primary">${property.price.toLocaleString()}</span>
                   </div>
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Additional Fees</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$29,700</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium w-fit">Aggregated fees</span>
                      </div>
                   </div>
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Down Payment</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$250,000</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium w-fit">20% of sale price</span>
                      </div>
                   </div>
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Mortgage Amount</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$1,000,000</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium w-fit">Financing</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Monthly Expenses */}
              <div className="border-t border-border-card pt-12">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-bold text-text-primary">Monthly Expenses</h3>
                  <button className="bg-bg-button border border-border-card px-8 py-4 rounded-2xl text-sm font-bold text-text-primary hover:bg-border-card transition-all">Learn More</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 lg:gap-10">
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Property Taxes</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$1,250</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium w-fit">Local town rate</span>
                      </div>
                   </div>
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">HOA Fee</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$300</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium w-fit">Community care</span>
                      </div>
                   </div>
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Mortgage Payment</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6">
                        <span className="text-2xl lg:text-3xl font-bold text-text-primary">Varies</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium w-fit">Based on terms</span>
                      </div>
                   </div>
                   <div className="p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-border-card bg-bg-card hover:bg-bg-button transition-colors">
                      <span className="text-text-secondary text-sm lg:text-base font-medium block mb-4 lg:mb-6">Property Insurance</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6">
                        <span className="text-2xl lg:text-4xl font-bold text-text-primary">$100</span>
                        <span className="bg-bg-button text-[10px] lg:text-xs text-text-secondary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-border-card font-medium w-fit">Approx. monthly</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-1 mb-4 opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-text-primary" />
               <div className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-text-primary">Frequently Asked Questions</h2>
            <p className="text-text-secondary text-sm">
              Find answers to common questions about Estatein's services, property listings, and the real estate process. We're here to provide clarity and assist you every step of the way.
            </p>
          </div>
          <button className="bg-bg-button border border-border-card px-8 py-4 rounded-xl text-sm font-bold text-text-primary hover:bg-border-card transition-colors">View All FAQ's</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { q: "How do I search for properties on Estatein?", a: "Learn how to use our user-friendly search tools to find properties that match your criteria." },
            { q: "What documents do I need to sell my property through Estatein?", a: "Find out about the necessary documentation for listing your property with us." },
            { q: "How can I contact an Estatein agent?", a: "Discover the different ways you can get in touch with our experienced agents." }
          ].map((faq, i) => (
            <div key={i} className="glass-card p-10 flex flex-col">
              <h3 className="text-xl font-bold mb-4 text-text-primary">{faq.q}</h3>
              <p className="text-text-secondary text-sm mb-10 leading-relaxed">{faq.a}</p>
              <button className="bg-bg-button border border-border-card px-6 py-3 rounded-lg text-xs font-medium text-text-primary mt-auto hover:bg-purple-accent hover:text-white transition-colors w-fit">Read More</button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-card-border">
          <p className="text-sm font-medium text-gray-500 italic">01 <span className="opacity-50">of 10</span></p>
          <div className="flex gap-2">
             <button className="w-12 h-12 glass-card flex items-center justify-center hover:bg-purple-accent transition-colors"><ChevronLeft /></button>
             <button className="w-12 h-12 glass-card flex items-center justify-center hover:bg-purple-accent transition-colors"><ChevronRight /></button>
          </div>
        </div>
      </section>

      {/* Start CTA Section */}
      <CallToAction />
    </div>
  );
};
