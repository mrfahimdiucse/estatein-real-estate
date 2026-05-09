import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CallToAction } from '../components/layout/CallToAction';
import { 
  ArrowUpRight, 
  Home, 
  Building2, 
  Wallet, 
  SunMedium, 
  BedDouble, 
  Bath, 
  ChevronLeft, 
  ChevronRight, 
  Star 
} from 'lucide-react';
import { propertyService } from '../services/api';
import { Property } from '../types';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Wade Warren",
    location: "USA, California",
    rating: 5,
    title: "Exceptional Service!",
    content: "Our experience with Estatein was outstanding. Their team's dedication and professionalism made finding our dream home a breeze. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=wade"
  },
  {
    id: 2,
    name: "Emelie Thomson",
    location: "USA, Florida",
    rating: 5,
    title: "Efficient and Reliable",
    content: "Estatein provided us with top-notch service. They helped us sell our property quickly and at a great price. We couldn't be happier with the results.",
    avatar: "https://i.pravatar.cc/150?u=emelie"
  },
  {
    id: 3,
    name: "John Mans",
    location: "USA, Nevada",
    rating: 5,
    title: "Trusted Advisors",
    content: "The Estatein team guided us through the entire buying process. Their knowledge and commitment to our needs were impressive. Thank you for your support!",
    avatar: "https://i.pravatar.cc/150?u=john"
  }
];

const FAQS = [
  {
    id: 1,
    question: "How do I search for properties on Estatein?",
    answer: "Learn how to use our user-friendly search tools to find properties that match your criteria exactly."
  },
  {
    id: 2,
    question: "What documents do I need to sell my property?",
    answer: "Find out about the necessary documentation for listing your property with us safely."
  },
  {
    id: 3,
    question: "How can I contact an Estatein agent?",
    answer: "Discover the different ways you can get in touch with our experienced local agents."
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeaturedProperties = async (page = 1) => {
    try {
      setLoading(true);
      const data = await propertyService.getAll({ page, limit: 3 });
      if (data && data.properties) {
        setFeaturedProperties(data.properties);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (err) {
      console.error('Failed to fetch featured properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProperties(1);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative px-6 lg:px-20 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">
            Discover Your Dream <br className="hidden md:block" />
            Property with Estatein
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-xl leading-relaxed">
            Your journey to finding the perfect property begins here. Explore our listings to find the home that matches your dreams.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <button onClick={() => navigate('/about')} className="btn-secondary">Learn More</button>
            <button onClick={() => navigate('/properties')} className="btn-primary">Browse Properties</button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="glass-card p-4 sm:p-6 flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold mb-1">200+</span>
              <span className="text-gray-500 text-[10px] sm:text-sm font-medium">Happy Customers</span>
            </div>
            <div className="glass-card p-4 sm:p-6 flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold mb-1">10k+</span>
              <span className="text-gray-500 text-[10px] sm:text-sm font-medium">Properties For Clients</span>
            </div>
            <div className="glass-card p-4 sm:p-6 flex flex-col col-span-2 lg:col-span-1">
              <span className="text-2xl sm:text-3xl font-bold mb-1">16+</span>
              <span className="text-gray-500 text-[10px] sm:text-sm font-medium">Years of Experience</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border-card bg-gradient-to-br from-bg-card to-bg-main aspect-[4/3] flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200" 
              alt="Luxury Tower" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="px-6 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 sm:mb-24 capitalize">
        {[
          { icon: <Home size={20} />, title: "Find your dream home", path: '/properties' },
          { icon: <Wallet size={20} />, title: "Unlock property value", path: '/properties' },
          { icon: <Building2 size={20} />, title: "Effortless property management", path: '/services' },
          { icon: <SunMedium size={20} />, title: "smart investments. informed decisions", path: '/properties' }
        ].map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(item.path)}
            className="glass-card p-6 sm:p-8 flex flex-col items-center text-center group cursor-pointer hover:border-purple-accent/50 transition-colors relative"
          >
            <div className="absolute top-4 right-4 text-gray-700 group-hover:text-white transition-colors">
              <ArrowUpRight size={16} />
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-bg-main border border-border-card rounded-full flex items-center justify-center mb-4 sm:mb-6 text-purple-accent group-hover:bg-purple-accent group-hover:text-white transition-all">
              {item.icon}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white/90">{item.title}</span>
          </div>
        ))}
      </section>

      {/* Featured Properties */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-1 mb-4 opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-400 max-w-2xl leading-relaxed text-sm">
              Explore our handpicked selection of featured properties. Each listing offers a glimpse into exceptional homes and investments available through Estatein. Click 'View Details' for more information.
            </p>
          </div>
          <button onClick={() => navigate('/properties')} className="btn-secondary mt-4 md:mt-0">View All Properties</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-6 h-[450px] animate-pulse">
                <div className="w-full h-48 bg-gray-800 rounded-xl mb-6" />
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-800 rounded w-5/6" />
              </div>
            ))
          ) : (
            featuredProperties.map((prop) => (
              <div key={prop.id} className="glass-card p-6 flex flex-col h-full">
                <div className="rounded-xl overflow-hidden mb-6 aspect-[16/10] bg-bg-main shrink-0">
                  <img 
                    src={prop.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
                    alt={prop.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
                    }}
                  />
                </div>
                <h3 className="text-[20px] font-bold mb-2">{prop.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">
                  {prop.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  <div className="bg-bg-main border border-border-card px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-text-secondary">
                    <BedDouble size={14} /> {prop.beds}-Bedroom
                  </div>
                  <div className="bg-bg-main border border-border-card px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-text-secondary">
                    <Bath size={14} /> {prop.baths}-Bathroom
                  </div>
                  <div className="bg-bg-main border border-border-card px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-text-secondary">
                    <Building2 size={14} /> {prop.type}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border-card pt-6">
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-xs mb-0.5">Price</span>
                    <span className="text-xl font-bold text-text-primary">
                      ${typeof prop.price === 'number' ? prop.price.toLocaleString() : prop.price}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="btn-primary px-5 py-3 text-xs md:text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between mt-10 pt-8 border-t border-card-border">
          <p className="text-sm font-medium text-gray-500 italic">
            {currentPage < 10 ? `0${currentPage}` : currentPage} <span className="opacity-50">of {totalPages < 10 ? `0${totalPages}` : totalPages}</span>
          </p>
          <div className="flex gap-2">
             <button 
              disabled={currentPage <= 1 || loading}
              onClick={() => fetchFeaturedProperties(currentPage - 1)}
              className="w-12 h-12 glass-card flex items-center justify-center hover:bg-purple-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
             >
              <ChevronLeft />
             </button>
             <button 
              disabled={currentPage >= totalPages || loading}
              onClick={() => fetchFeaturedProperties(currentPage + 1)}
              className="w-12 h-12 glass-card flex items-center justify-center hover:bg-purple-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
             >
              <ChevronRight />
             </button>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-1 mb-4 opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-400 max-w-2xl leading-relaxed text-sm">
              Read the success stories and heartfelt testimonials from our valued clients. Discover why they chose Estatein for their real estate needs.
            </p>
          </div>
          <button onClick={() => navigate('/about')} className="btn-secondary">View All Testimonials</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="glass-card p-10">
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFB800" className="text-[#FFB800]" />)}
              </div>
              <h4 className="text-xl font-bold mb-4">{t.title}</h4>
              <p className="text-gray-400 mb-10 leading-relaxed text-sm">"{t.content}"</p>
              <div className="flex items-center gap-4 border-t border-card-border pt-8">
                <img src={t.avatar} className="w-12 h-12 rounded-full border border-card-border" />
                <div>
                   <h5 className="font-bold">{t.name}</h5>
                   <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 lg:px-20 mb-24">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
             <div className="flex items-center gap-1 mb-4 opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl leading-relaxed text-sm">
              Find answers to common questions about Estatein's services, property listings, and the real estate process. We're here to provide clarity and assist you every step of the way.
            </p>
          </div>
          <button onClick={() => navigate('/services')} className="btn-secondary">View All FAQ's</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FAQS.map((faq) => (
            <div key={faq.id} className="glass-card p-10 group cursor-pointer hover:border-purple-accent transition-colors flex flex-col h-full">
              <h4 className="text-xl font-bold mb-6 group-hover:text-purple-accent transition-colors">{faq.question}</h4>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                {faq.answer}
              </p>
              <button 
                onClick={() => navigate('/services')}
                className="btn-secondary w-full group-hover:bg-purple-accent transition-all mt-auto"
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction />
    </>
  );
};
