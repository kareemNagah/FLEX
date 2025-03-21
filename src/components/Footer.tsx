
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Send, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="relative h-8 w-8 overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-chameleon-gradient"></div>
                <div className="absolute inset-1.5 rounded-full bg-white"></div>
                <div className="absolute inset-[8px] rounded-full bg-chameleon-green"></div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-chameleon-gradient">
                Flex
              </span>
            </Link>
            <p className="text-foreground/70">
              Adaptive habit building platform that evolves with you, helping you transform your routines and achieve your goals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-chameleon-green/10 text-chameleon-green hover:bg-chameleon-green/20 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-chameleon-green/10 text-chameleon-green hover:bg-chameleon-green/20 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-chameleon-green/10 text-chameleon-green hover:bg-chameleon-green/20 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-chameleon-green/10 text-chameleon-green hover:bg-chameleon-green/20 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'About', 'Contact', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-foreground/70 hover:text-chameleon-green transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Blog', 'Help Center', 'Community', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-foreground/70 hover:text-chameleon-green transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="text-foreground/70 mb-4">
              Subscribe to our newsletter for tips, updates, and exclusive content.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 rounded-l-lg border border-border focus:outline-none focus:ring-1 focus:ring-chameleon-green"
              />
              <button className="bg-chameleon-green text-white px-4 py-2 rounded-r-lg hover:bg-chameleon-green-dark transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-foreground/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Flex. All rights reserved.
          </p>
          <p className="text-foreground/60 text-sm flex items-center">
            Made with <Heart size={14} className="mx-1 text-chameleon-green" /> by the Flex Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
