import React from 'react';
import { motion } from 'motion/react';
import { CallToAction } from '../components/layout/CallToAction';
import { 
  Users, 
  Target, 
  Award, 
  Star, 
  Linkedin, 
  Twitter, 
  Send,
  Zap,
  Globe,
  Briefcase,
  LayoutGrid,
  ShieldCheck,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const VALUES = [
  {
    icon: <Star size={24} />,
    title: "Trust",
    description: "Trust is the cornerstone of every successful real estate transaction. We build lasting relationships through transparency and integrity."
  },
  {
    icon: <Award size={24} />,
    title: "Excellence",
    description: "We set the bar high for ourselves. From the properties we list to the services we provide, excellence is our standard."
  },
  {
    icon: <Users size={24} />,
    title: "Client-Centric",
    description: "Your dreams and needs are at the center of our universe. We listen, understand, and then act tailored to your goals."
  },
  {
    icon: <Star size={24} />,
    title: "Our Commitment",
    description: "We are dedicated to providing you with the highest level of service, professionalism, and support throughout your journey."
  }
];

const ACHIEVEMENTS = [
  {
    title: "3+ Years of Excellence",
    description: "With over 3 years in the industry, we've amassed a wealth of knowledge and experience, becoming a go-to resource for all things real estate."
  },
  {
    title: "Happy Clients",
    description: "Our greatest achievement is the satisfaction of our clients. Their success stories fuel our passion for what we do every day."
  },
  {
    title: "Industry Recognition",
    description: "We've earned the respect of our peers and industry leaders, with accolades and awards that reflect our commitment to excellence."
  }
];

const STEPS = [
  {
    step: "Step 01",
    title: "Discover a World of Possibilities",
    description: "Your journey begins with exploring our carefully curated property listings. Use our intuitive search tools to filter properties based on your preferences."
  },
  {
    step: "Step 02",
    title: "Narrowing Down Your Choices",
    description: "Once you've found properties that catch your eye, save them to your account or make a shortlist. This allows you to compare and revisit favorites."
  },
  {
    step: "Step 03",
    title: "Personalized Guidance",
    description: "Have questions about a property or need more information? Our dedicated team of real estate experts is just a call or message away."
  },
  {
    step: "Step 04",
    title: "See It for Yourself",
    description: "Arrange viewings of the properties you're interested in. We'll coordinate with the owners and accompany you to ensure a firsthand look."
  },
  {
    step: "Step 05",
    title: "Making Informed Decisions",
    description: "Before making an offer, our team will assist you with due diligence, including property inspections, legal checks, and market analysis."
  },
  {
    step: "Step 06",
    title: "Getting the Best Deal",
    description: "We'll help you negotiate the best terms and prepare your offer. Our goal is to secure the property at the right price."
  }
];

const TEAM = [
  {
    name: "Max Mitchell",
    role: "Founder",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    twitter: "#",
  },
  {
    name: "Sarah Johnson",
    role: "Chief Real Estate Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    twitter: "#",
  },
  {
    name: "David Brown",
    role: "Head of Property Management",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    twitter: "#",
  },
  {
    name: "Michael Turner",
    role: "Legal Counsel",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    twitter: "#",
  }
];

const CLIENTS = [
  {
    year: "Since 2019",
    name: "ABC Corporation",
    domain: "Commercial Real Estate",
    category: "Luxury Home Development",
    testimonial: "Estatein's expertise in finding the perfect office space for our expanding operations was invaluable. They truly understand our business needs.",
  },
  {
    year: "Since 2018",
    name: "GreenTech Enterprises",
    domain: "Commercial Real Estate",
    category: "Retail Space",
    testimonial: "Estatein's ability to identify prime retail locations helped us expand our brand presence. They are a trusted partner in our growth.",
  }
];

export const AboutPage = () => {
  return (
    <div className="pb-24">
      {/* Our Journey */}
      <section className="px-6 lg:px-20 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-1 mb-4 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Journey</h1>
          <p className="text-gray-400 leading-relaxed mb-12 max-w-xl">
            Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary. Over the years, we've expanded our reach, forged valuable partnerships, and gained the trust of countless clients.
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="glass-card p-6 border-transparent bg-bg-button">
                <h3 className="text-3xl font-bold mb-1">200+</h3>
                <p className="text-text-secondary text-xs">Happy Customers</p>
             </div>
             <div className="glass-card p-6 border-transparent bg-bg-button">
                <h3 className="text-3xl font-bold mb-1">10k+</h3>
                <p className="text-text-secondary text-xs">Properties For Clients</p>
             </div>
             <div className="glass-card p-6 border-transparent bg-bg-button col-span-2 lg:col-span-1">
                <h3 className="text-3xl font-bold mb-1">16+</h3>
                <p className="text-text-secondary text-xs">Years of Experience</p>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border-card aspect-[4/3]"
        >
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200" 
            alt="Hand holding house" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Our Values */}
      <section className="px-6 lg:px-20 mb-20 sm:mb-24">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          <div className="lg:col-span-1">
             <div className="flex items-center gap-1 mb-4 opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
               Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.
            </p>
          </div>
          
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {VALUES.map((val, idx) => (
                <div key={idx} className="border-b sm:border-b-0 sm:border-r border-card-border pb-8 sm:pb-0 sm:pr-8 last:border-0 last:pb-0 last:pr-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-purple-accent/30 flex items-center justify-center text-purple-accent">
                      {React.cloneElement(val.icon as React.ReactElement, { size: 20 })}
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold">{val.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Achievements */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="mb-12">
          <div className="flex items-center gap-1 mb-4 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Our Achievements</h2>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((ach, idx) => (
            <div key={idx} className="glass-card p-10 hover:border-purple-accent transition-colors group">
              <h4 className="text-xl font-bold mb-6 group-hover:text-purple-accent transition-colors">{ach.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigating the Experience */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="mb-12">
          <div className="flex items-center gap-1 mb-4 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Navigating the Estatein Experience</h2>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            At Estatein, we've designed a straightforward process to help you find and purchase your dream property with ease. Here's a step-by-step guide to how it all works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <div key={idx} className="glass-card p-10 border-l-[3px] border-l-purple-accent/30 hover:border-l-purple-accent transition-all">
              <span className="text-sm font-medium text-white/50 block mb-4">{step.step}</span>
              <h4 className="text-xl font-bold mb-6">{step.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Team */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="mb-12">
          <div className="flex items-center gap-1 mb-4 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Meet the Estatein Team</h2>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            At Estatein, our success is driven by the dedication and expertise of our team. Get to know the people behind our mission to make your real estate dreams a reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, idx) => (
            <div key={idx} className="glass-card p-6 flex flex-col items-center group text-center">
              <div className="relative mb-6 rounded-2xl overflow-hidden w-full aspect-square">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-accent text-white flex items-center justify-center cursor-pointer hover:bg-white hover:text-purple-accent transition-colors shadow-lg">
                    <Linkedin size={18} />
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold mb-1">{member.name}</h4>
              <p className="text-gray-500 text-sm mb-6">{member.role}</p>
              
              <div className="w-full flex items-center justify-between bg-bg-main border border-border-card p-3 px-4 rounded-full group-hover:border-purple-accent/30 transition-colors">
                <span className="text-sm font-medium">Say Hello 👋</span>
                <div className="w-8 h-8 rounded-full bg-purple-accent flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                  <Send size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Valued Clients */}
      <section className="px-6 lg:px-20 mb-24">
        <div className="mb-12">
          <div className="flex items-center gap-1 mb-4 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Our Valued Clients</h2>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            At Estatein, we have had the privilege of working with a diverse range of clients across various industries. Here are some of the clients we've had the pleasure of serving.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {CLIENTS.map((client, idx) => (
            <div key={idx} className="glass-card p-10 border-transparent bg-bg-main">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-border-card">
                <div>
                   <span className="text-xs text-gray-500 block mb-2">{client.year}</span>
                   <h4 className="text-2xl font-bold">{client.name}</h4>
                </div>
                <button className="btn-secondary text-xs px-4 py-2 hover:bg-purple-accent/10 border-white/10">Visit Website</button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <span className="text-xs text-gray-500 flex items-center gap-2 mb-3">
                    <LayoutGrid size={14} className="text-purple-accent" /> Domain
                  </span>
                  <p className="text-sm font-medium">{client.domain}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 flex items-center gap-2 mb-3">
                    <Briefcase size={14} className="text-purple-accent" /> Category
                  </span>
                  <p className="text-sm font-medium">{client.category}</p>
                </div>
              </div>

              <div className="glass-card p-8 border-border-card bg-bg-button">
                <span className="text-xs text-gray-500 block mb-4 italic">What They Said 🏠</span>
                <p className="text-sm text-gray-300 leading-relaxed italic">"{client.testimonial}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction />
    </div>
  );
};
