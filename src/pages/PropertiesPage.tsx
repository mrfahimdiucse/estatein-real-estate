import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CallToAction } from '../components/layout/CallToAction';
import { 
  Search, 
  MapPin, 
  Building2, 
  Wallet, 
  Ruler, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
  BedDouble,
  Bath
} from 'lucide-react';
import { Property } from '../types';
import { propertyService } from '../services/api';

export const PropertiesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 9;

  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceRange: '',
    size: '',
    buildYear: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: 'Select Location',
    propertyType: 'Select Property Type',
    bathrooms: 'Select no. of Bathrooms',
    bedrooms: 'Select no. of Bedrooms',
    budget: 'Select Budget',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormStatus('sending');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({
          firstName: '', lastName: '', email: '', phone: '',
          location: 'Select Location', propertyType: 'Select Property Type',
          bathrooms: 'Select no. of Bathrooms', bedrooms: 'Select no. of Bedrooms',
          budget: 'Select Budget', message: ''
        });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setFormStatus('error');
    }
  };

  const fetchProperties = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: any = {
        page,
        limit,
        search: searchTerm,
        type: filters.type,
        location: filters.location,
      };

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        if (min) queryParams.minPrice = min;
        if (max) queryParams.maxPrice = max;
      }

      const data = await propertyService.getAll(queryParams);
      
      if (data && data.properties) {
        setDbProperties(data.properties);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
        setTotalCount(data.totalCount || 0);
      } else if (Array.isArray(data)) {
        setDbProperties(data);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalCount(data.length);
      }
    } catch (err: any) {
      console.warn('API Fetch failed, focusing on displayed content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const propertiesToDisplay = dbProperties;
  const isUsingFallback = false;

  // We now rely on server-side filtering for high performance
  const filteredProperties = propertiesToDisplay;

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="px-6 lg:px-20 py-12 lg:py-24 border-b border-border-card bg-gradient-to-b from-bg-button to-bg-main">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Find Your Dream Property</h1>
          <p className="text-text-secondary text-sm lg:text-base leading-relaxed opacity-80">
            Welcome to Estatein, where your dream property awaits in every corner of our beautiful world. Explore our curated selection of properties, each offering a unique story and a chance to redefine your life.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="px-6 lg:px-20 -mt-10 mb-24">
        <div className="glass-card p-4 shadow-2xl relative z-10">
            <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search For A Property" 
                className="w-full bg-bg-button border border-border-card rounded-xl py-5 pl-6 pr-40 focus:outline-none focus:border-purple-accent transition-all text-sm text-text-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-3 bg-purple-accent text-white px-3 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-accent/90 transition-colors">
                <Search size={16} />
                <span className="hidden sm:inline font-medium text-white">Find</span>
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-bg-main p-3 rounded-xl border border-border-card">
              <div className="relative group">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <select 
                  name="location"
                  onChange={handleFilterChange}
                  className="w-full bg-bg-card border border-border-card rounded-lg py-3.5 pl-11 pr-4 text-xs font-medium text-text-primary focus:outline-none focus:border-purple-accent appearance-none cursor-pointer"
                >
                  <option value="">Location</option>
                  <option value="New York">New York</option>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  <option value="Florida">Florida</option>
                </select>
              </div>

              <div className="relative group">
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <select 
                  name="type"
                  onChange={handleFilterChange}
                  className="w-full bg-bg-card border border-border-card rounded-lg py-3.5 pl-11 pr-4 text-xs font-medium text-text-primary focus:outline-none focus:border-purple-accent appearance-none cursor-pointer"
                >
                  <option value="">Property Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Studio">Studio</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="relative group">
                <Wallet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <select 
                  name="priceRange"
                  onChange={handleFilterChange}
                  className="w-full bg-bg-card border border-border-card rounded-lg py-3.5 pl-11 pr-4 text-xs font-medium text-text-primary focus:outline-none focus:border-purple-accent appearance-none cursor-pointer"
                >
                  <option value="">Pricing Range</option>
                  <option value="0-500000">$0 - $500k</option>
                  <option value="500000-1000000">$500k - $1M</option>
                  <option value="1000000-2000000">$1M - $2M</option>
                  <option value="2000000">$2M+</option>
                </select>
              </div>

              <div className="relative group">
                <Ruler size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <select className="w-full bg-bg-card border border-border-card rounded-lg py-3.5 pl-11 pr-4 text-xs font-medium text-text-primary focus:outline-none focus:border-purple-accent appearance-none cursor-pointer">
                  <option value="">Property Size</option>
                  <option value="S">Small (&lt; 1k sqft)</option>
                  <option value="M">Medium (1k-3k sqft)</option>
                  <option value="L">Large (&gt; 3k sqft)</option>
                </select>
              </div>

              <div className="relative group col-span-2 lg:col-span-1">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <select className="w-full bg-bg-card border border-border-card rounded-lg py-3.5 pl-11 pr-4 text-xs font-medium text-text-primary focus:outline-none focus:border-purple-accent appearance-none cursor-pointer">
                  <option value="">Build Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="legacy">Before 2020</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover a World of Possibilities (Property Grid) */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="mb-12">
          <div className="flex items-center gap-1 mb-4 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Discover a World of Possibilities</h2>
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            Our portfolio of properties is as diverse as your dreams. Explore the following categories to find the perfect property that resonates with your vision of home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbProperties.length === 0 && !loading && (
            <div className="col-span-full mb-8 bg-bg-card border border-border-card rounded-2xl p-12 flex flex-col items-center text-center">
               <Building2 className="text-purple-accent mb-4 opacity-50" size={48} />
               <h3 className="text-xl font-bold mb-2">No Properties Listed</h3>
               <p className="text-gray-400 max-w-lg">
                 We couldn't find any properties matching your criteria at the moment. Please check back later.
               </p>
            </div>
          )}
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop) => (
              <motion.div 
                key={prop.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 flex flex-col h-full group"
              >
                <div className="rounded-xl overflow-hidden mb-6 aspect-[16/10] bg-bg-main relative">
                  <img 
                    src={prop.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
                    alt={prop.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
                    }}
                  />
                  {prop.tagline && (
                    <div className="absolute bottom-4 left-4 right-4 bg-bg-main/80 backdrop-blur-md border border-border-card rounded-full px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-text-primary">
                      {prop.tagline}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{prop.title}</h3>
                <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                  {prop.description.length > 100 ? prop.description.substring(0, 100) + '...' : prop.description}
                  <button className="text-white hover:underline ml-1 font-medium">Read More</button>
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                   <div className="bg-bg-main border border-border-card px-3 py-2 rounded-full flex items-center gap-2 text-[11px] font-medium text-text-secondary">
                    <BedDouble size={14} className="text-purple-accent" /> {prop.beds}-Bedroom
                  </div>
                  <div className="bg-bg-main border border-border-card px-3 py-2 rounded-full flex items-center gap-2 text-[11px] font-medium text-text-secondary">
                    <Bath size={14} className="text-purple-accent" /> {prop.baths}-Bathroom
                  </div>
                  <div className="bg-bg-main border border-border-card px-3 py-2 rounded-full flex items-center gap-2 text-[11px] font-medium text-text-secondary">
                    <Building2 size={14} className="text-purple-accent" /> {prop.type}
                  </div>
                </div>

              <div className="flex items-center justify-between border-t border-border-card pt-6">
                <div className="flex flex-col">
                  <span className="text-text-secondary text-[10px] uppercase tracking-wider font-semibold mb-1">Price</span>
                  <span className="text-xl font-bold text-text-primary">${prop.price.toLocaleString()}</span>
                </div>
                   <button 
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="btn-primary px-4 py-3 text-[10px] font-bold"
                   >
                     View Details
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass-card">
              <p className="text-gray-400">No properties found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setFilters({location: '', type: '', priceRange: '', size: '', buildYear: ''})}}
                className="text-purple-accent hover:underline mt-4 text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-10 pt-8 border-t border-card-border">
          <p className="text-sm font-medium text-gray-500 italic">
            Page {currentPage} <span className="opacity-50">of {totalPages} ({totalCount} Properties)</span>
          </p>
          <div className="flex gap-2">
             <button 
              disabled={currentPage <= 1 || loading}
              onClick={() => fetchProperties(currentPage - 1)}
              className="w-12 h-12 glass-card flex items-center justify-center hover:bg-purple-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
             >
              <ChevronLeft />
             </button>
             <button 
              disabled={currentPage >= totalPages || loading}
              onClick={() => fetchProperties(currentPage + 1)}
              className="w-12 h-12 glass-card flex items-center justify-center hover:bg-purple-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
             >
              <ChevronRight />
             </button>
          </div>
        </div>
      </section>

      {/* Let's Make It Happen (Contact Form) */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="mb-12">
          <div className="flex items-center gap-1 mb-4 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Let's Make it Happen</h2>
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            Ready to take the first step toward your dream property? Fill out the form below, and our real estate wizards will work their magic to find your perfect match. Don't wait; let's embark on this exciting journey together.
          </p>
        </div>

        <div className="glass-card p-8 lg:p-14">
          <form onSubmit={handleContactSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">First Name</label>
              <input 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                type="text" 
                placeholder="Enter First Name" 
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" 
              />
            </div>
            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">Last Name</label>
              <input 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                type="text" 
                placeholder="Enter Last Name" 
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" 
              />
            </div>
            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">Email</label>
              <input 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                type="email" 
                placeholder="Enter Your Email" 
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" 
              />
            </div>
            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">Phone</label>
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel" 
                placeholder="Enter Phone Number" 
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" 
              />
            </div>

            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">Preferred Location</label>
              <select 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none appearance-none cursor-pointer"
              >
                <option>Select Location</option>
                <option>California</option>
                <option>New York</option>
                <option>Texas</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">Property Type</label>
              <select 
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none appearance-none cursor-pointer"
              >
                <option>Select Property Type</option>
                <option>Villa</option>
                <option>Apartment</option>
                <option>Cottage</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">No. of Bathrooms</label>
              <select 
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none appearance-none cursor-pointer"
              >
                <option>Select no. of Bathrooms</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-1">
              <label className="text-sm font-bold">No. of Bedrooms</label>
              <select 
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none appearance-none cursor-pointer"
              >
                <option>Select no. of Bedrooms</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-2">
              <label className="text-sm font-bold">Budget</label>
              <select 
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none appearance-none cursor-pointer"
              >
                <option>Select Budget</option>
                <option>&lt; $500k</option>
                <option>$500k - $1M</option>
                <option>&gt; $1M</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-2">
              <label className="text-sm font-bold">Additional Message (Optional)</label>
              <input 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                type="text" 
                placeholder="Enter any specific requirements" 
                className="bg-bg-button border border-border-card rounded-xl p-4 text-sm text-text-primary focus:border-purple-accent outline-none" 
              />
            </div>

            <div className="lg:col-span-4 flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
               <div className="flex items-center gap-3">
                  <input type="checkbox" id="terms" required className="w-5 h-5 rounded border-border-card bg-bg-button accent-purple-accent cursor-pointer" />
                  <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer">I agree with <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy Policy</a></label>
               </div>
               <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                 <button 
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="btn-primary px-6 py-4 w-auto text-sm disabled:opacity-50"
                 >
                   {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                 </button>
                 {formStatus === 'success' && <p className="text-green-500 text-xs font-bold">Message sent successfully!</p>}
                 {formStatus === 'error' && <p className="text-red-500 text-xs font-bold">Failed to send message. Try again.</p>}
               </div>
            </div>
          </form>
        </div>
      </section>

      {/* Start Real Estate Journey CTA */}
      <CallToAction />
    </div>
  );
};
