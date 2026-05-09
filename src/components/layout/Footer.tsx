import { Send, Facebook, Linkedin, Twitter, Youtube, ArrowUpRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../common/Logo';

export const Footer = () => {
  const footerSections = [
    { 
      title: "Home", 
      links: [
        { name: "Hero Section", path: "/" },
        { name: "Features", path: "/" },
        { name: "Properties", path: "/properties" },
        { name: "Testimonials", path: "/" },
        { name: "FAQ's", path: "/" }
      ] 
    },
    { 
      title: "About Us", 
      links: [
        { name: "Our Story", path: "/about" },
        { name: "Our Works", path: "/about" },
        { name: "How it Works", path: "/about" },
        { name: "Our Team", path: "/about" },
        { name: "Our Clients", path: "/about" }
      ] 
    },
    { 
      title: "Properties", 
      links: [
        { name: "Portfolio", path: "/properties" },
        { name: "Categories", path: "/properties" }
      ] 
    },
    { 
      title: "Services", 
      links: [
        { name: "Valuation Mastery", path: "/services" },
        { name: "Strategic Marketing", path: "/services" },
        { name: "Negotiation Wizardry", path: "/services" },
        { name: "Closing Success", path: "/services" },
        { name: "Property Management", path: "/services" }
      ] 
    },
    { 
      title: "Contact Us", 
      links: [
        { name: "Contact Form", path: "/properties" },
        { name: "Our Offices", path: "/contact" }
      ] 
    },
    {
      title: "Admin",
      links: [
        { name: "Dashboard", path: "/admin" },
        { name: "Admin Login", path: "/admin/login" }
      ]
    }
  ];

  return (
    <footer className="px-6 lg:px-20 py-24 bg-bg-card border-t border-border-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
        <div className="lg:col-span-3">
           <NavLink to="/" className="mb-8 block">
              <Logo className="h-12" />
           </NavLink>
           <div className="relative flex items-center">
              <Send size={18} className="absolute left-4 text-text-secondary" />
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                className="w-full bg-bg-button border border-border-card rounded-xl py-4.5 pl-12 pr-12 focus:outline-none focus:border-purple-accent transition-colors text-sm text-text-primary"
              />
              <button className="absolute right-4 text-purple-accent hover:text-text-primary transition-colors">
                <ArrowUpRight />
              </button>
           </div>
        </div>

        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-10">
          {footerSections.map((col, idx) => (
            <div key={idx}>
              <h5 className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-6">{col.title}</h5>
              <ul className="flex flex-col gap-4 text-sm text-text-secondary">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <NavLink 
                      to={link.path} 
                      className="hover:text-purple-accent transition-colors block"
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-border-card flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-text-secondary">
         <div className="flex flex-col sm:flex-row gap-6 text-center sm:text-left">
            <span>© 2024 Estatein. All Rights Reserved.</span>
            <a href="#" className="hover:text-text-primary transition-colors">Terms & Conditions</a>
         </div>
         <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-text-primary hover:bg-purple-accent hover:text-white transition-all cursor-pointer"><Facebook size={18} /></div>
            <div className="w-10 h-10 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-text-primary hover:bg-purple-accent hover:text-white transition-all cursor-pointer"><Linkedin size={18} /></div>
            <div className="w-10 h-10 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-text-primary hover:bg-purple-accent hover:text-white transition-all cursor-pointer"><Twitter size={18} /></div>
            <div className="w-10 h-10 rounded-full bg-bg-button border border-border-card flex items-center justify-center text-text-primary hover:bg-purple-accent hover:text-white transition-all cursor-pointer"><Youtube size={18} /></div>
         </div>
      </div>
    </footer>
  );
};
