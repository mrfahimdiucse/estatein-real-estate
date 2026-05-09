import React from 'react';
import { motion } from 'motion/react';
import { CallToAction } from '../components/layout/CallToAction';
import { 
  Home, 
  CircleDollarSign, 
  Building2, 
  Lightbulb,
  BarChart3,
  Megaphone,
  Handshake,
  CheckCircle2,
  Users2,
  Settings,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ServicesPage = () => {
  const navigate = useNavigate();

  const mainServices = [
    { title: "Find Your Dream Home", icon: <Home size={24} /> },
    { title: "Unlock Property Value", icon: <CircleDollarSign size={24} /> },
    { title: "Effortless Property Management", icon: <Building2 size={24} /> },
    { title: "Smart Investments, Informed Decisions", icon: <Lightbulb size={24} /> },
  ];

  const section1Cards = [
    { title: "Valuation Mastery", desc: "Discover the true worth of your property with our expert valuation services.", icon: <BarChart3 /> },
    { title: "Strategic Marketing", desc: "Selling a property requires more than just a listing; it demands a strategic marketing approach.", icon: <Megaphone /> },
    { title: "Negotiation Wizardry", desc: "Negotiating the best deal is an art, and our negotiation experts are masters of it.", icon: <Handshake /> },
    { title: "Closing Success", desc: "A successful sale is not complete until the closing. We guide you through the intricate closing process.", icon: <CheckCircle2 /> },
  ];

  const section2Cards = [
    { title: "Tenant Harmony", desc: "Our Tenant Management services ensure that your tenants have a smooth and reducing vacancies.", icon: <Users2 /> },
    { title: "Maintenance Ease", desc: "Say goodbye to property maintenance headaches. We handle all aspects of property upkeep.", icon: <Settings /> },
    { title: "Financial Peace of Mind", desc: "Managing property finances can be complex. Our financial experts take care of rent collection.", icon: <CircleDollarSign /> },
    { title: "Legal Guardian", desc: "Stay compliant with property laws and regulations effortlessly.", icon: <ShieldCheck /> },
  ];

  const section3Cards = [
    { title: "Market Insight", desc: "Stay ahead of market trends with our expert Market Analysis. We provide in-depth insights into real estate market conditions.", icon: <TrendingUp /> },
    { title: "ROI Assessment", desc: "Make investment decisions with confidence. Our ROI Assessment services evaluate the potential returns on your investments.", icon: <PieChart /> },
    { title: "Customized Strategies", desc: "Every investor is unique, and so are their goals. We develop Customized Investment Strategies tailored to your specific needs.", icon: <Target /> },
    { title: "Diversification Mastery", desc: "Diversify your real estate portfolio effectively. Our experts guide you in spreading your investments across various property types and locations.", icon: <PieChart /> },
  ];

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="px-6 lg:px-20 py-12 lg:py-24 border-b border-border-card">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-text-primary leading-tight">Elevate Your Real Estate Experience</h1>
        <p className="text-text-secondary text-sm lg:text-base max-w-4xl leading-relaxed opacity-80">
          Welcome to Estatein, where your real estate aspirations meet expert guidance. Explore our comprehensive range of services, each designed to cater to your unique needs and dreams.
        </p>
      </section>

      {/* Main Services Grid */}
      <section className="px-6 lg:px-20 -mt-10 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainServices.map((service, i) => (
            <div key={i} className="glass-card p-8 flex flex-col items-center text-center group cursor-pointer hover:border-purple-accent/50 transition-all relative">
              <div className="absolute top-4 right-4 text-gray-600 group-hover:text-purple-accent transition-colors">
                <ArrowUpRight size={20} />
              </div>
              <div className="w-16 h-16 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-purple-accent mb-6 group-hover:bg-purple-accent group-hover:text-white transition-all">
                {service.icon}
              </div>
              <span className="font-bold text-sm leading-tight px-4 text-text-primary">{service.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Unlock Property Value Section */}
      <section className="px-6 lg:px-20 mb-20 sm:mb-32">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-white opacity-20" />
            <div className="w-2 h-2 rounded-full bg-white opacity-40" />
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Unlock Property Value</h2>
          <p className="text-gray-400 text-sm max-w-4xl leading-relaxed">
            Selling your property should be a rewarding experience, and at Estatein, we make sure it is. Our Property Selling Service is designed to maximize the value of your property, ensuring you get the best deal possible. Explore the categories below to see how we can help you at every step of your selling journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section1Cards.map((card, i) => (
            <div key={i} className="glass-card p-6 sm:p-10 flex flex-col hover:border-purple-accent/30 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center text-purple-accent group-hover:bg-purple-accent group-hover:text-white transition-all">
                  {React.cloneElement(card.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
          
          <div className="lg:col-span-2 glass-card p-6 sm:p-10 bg-gradient-to-br from-bg-button to-bg-main relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-purple-accent/20">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-12 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-text-primary/5" />
                ))}
              </div>
            </div>
            <div className="relative z-10 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-text-primary">Unlock the Value of Your Property Today</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
                  Ready to unlock the true value of your property? Explore our Property Selling Service categories and let us help you achieve the best deal possible for your valuable asset.
                </p>
            </div>
            <button className="btn-primary px-8 py-4 whitespace-nowrap relative z-10 w-full sm:w-auto">Learn More</button>
          </div>
        </div>
      </section>

      {/* Effortless Property Management Section */}
      <section className="px-6 lg:px-20 mb-20 sm:mb-32">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-white opacity-20" />
            <div className="w-2 h-2 rounded-full bg-white opacity-40" />
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Effortless Property Management</h2>
          <p className="text-gray-400 text-sm max-w-4xl leading-relaxed">
            Owning a property should be a pleasure, not a hassle. Estatein's Property Management Service takes the stress out of property ownership, offering comprehensive solutions tailored to your needs. Explore the categories below to see how we can make property management effortless for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section2Cards.map((card, i) => (
            <div key={i} className="glass-card p-6 sm:p-10 flex flex-col hover:border-purple-accent/30 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center text-purple-accent group-hover:bg-purple-accent group-hover:text-white transition-all">
                  {React.cloneElement(card.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
          
          <div className="lg:col-span-2 glass-card p-6 sm:p-10 bg-gradient-to-br from-bg-button to-bg-main relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-purple-accent/20">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-12 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-text-primary/5" />
                ))}
              </div>
            </div>
            <div className="relative z-10 flex-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-text-primary">Experience Effortless Property Management</h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
                Ready to experience hassle-free property management? Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership.
              </p>
            </div>
            <button className="btn-primary px-8 py-4 whitespace-nowrap relative z-10 w-full sm:w-auto">Learn More</button>
          </div>
        </div>
      </section>

      {/* Smart Investments Section */}
      <section className="px-6 lg:px-20 mb-32">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
             <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-white opacity-20" />
                  <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <h2 className="text-4xl font-bold mb-6">Smart Investments, Informed Decisions</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  Building a real estate portfolio requires a strategic approach. Estatein's Investment Advisory Service empowers you to make smart investments and informed decisions.
                </p>
                <div className="glass-card p-8 bg-gradient-to-br from-bg-button to-bg-main relative overflow-hidden mb-0">
                   <h3 className="text-xl font-bold mb-4 text-text-primary">Unlock Your Investment Potential</h3>
                   <p className="text-text-secondary text-xs leading-relaxed mb-6">
                    Explore our Property Management Service categories and let us handle the complexities while you enjoy the benefits of property ownership.
                   </p>
                   <button className="bg-bg-button border border-border-card w-full py-4 rounded-xl text-sm font-bold text-text-primary hover:bg-border-card transition-colors">Learn More</button>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 content-start">
            {section3Cards.map((card, i) => (
              <div key={i} className="glass-card p-10 flex flex-col hover:border-purple-accent/30 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center text-purple-accent group-hover:bg-purple-accent group-hover:text-white transition-all">
                    {React.cloneElement(card.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <h3 className="text-lg font-bold">{card.title}</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction />
    </div>
  );
};
