import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Logo } from '../common/Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Properties', path: '/properties' },
    { name: 'Services', path: '/services' },
  ];

  // Close menu on location change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="bg-bg-card border-b border-border-card px-6 lg:px-20 py-4.5 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
      <NavLink to="/">
        <Logo className="h-10 grow-0 shrink-0" />
      </NavLink>

      <div className="hidden md:flex items-center gap-2 p-1 bg-bg-main border border-border-card rounded-xl">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'nav-link-active' : 'text-text-secondary hover:text-text-primary'}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <NavLink to="/contact">
          <button className="btn-secondary py-2.5 px-6">Contact Us</button>
        </NavLink>
      </div>

      <div className="flex items-center gap-4 md:hidden">
        <button 
          className="p-2 border border-border-card rounded-lg bg-bg-button text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-accent/30 transition-all" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-bg-card border-l border-border-card p-6 flex flex-col gap-6 md:hidden z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <Logo className="h-10" />
                <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `py-4 px-4 rounded-xl flex items-center justify-between font-medium transition-all ${
                        isActive 
                          ? 'bg-purple-accent/10 text-purple-accent border border-purple-accent/20' 
                          : 'text-text-secondary hover:bg-bg-button'
                      }`
                    }
                  >
                    {({ isActive }: any) => (
                      <>
                        {link.name}
                        <ChevronRight size={18} className={isActive ? 'opacity-100' : 'opacity-40'} />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto">
                <NavLink to="/contact">
                  <button className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-purple-accent/20">Contact Us Now</button>
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
