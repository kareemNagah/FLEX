
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 py-28 md:py-40 z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Adapt, Evolve, <br/>
              <span className="bg-clip-text text-transparent bg-chameleon-gradient">
                Flourish.
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The AI-powered productivity app that adapts to your workflow and helps you achieve your goals through personalized task management.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/ai-planner" className="cta-button">
                Start Your Journey
              </Link>
              <Link to="/dashboard" className="flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-300">
                See Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
          <div className="md:w-1/2 relative">
            <motion.div
              className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <img 
                src="/placeholder.svg" 
                alt="Flex App Interface" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-chameleon-green/10 to-chameleon-yellow/10 pointer-events-none" />
              
              {/* Chameleon overlay - adding this element */}
              <div className="absolute bottom-0 right-0 w-32 h-32">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
                  <path 
                    fill="#4CAF50" 
                    d="M40,-51.2C50.8,-43.1,58.2,-29.7,62.8,-14.9C67.5,-0.1,69.3,16.2,63.4,28.8C57.5,41.5,43.8,50.6,29.4,55.5C15,60.5,-0.1,61.4,-14.4,57.7C-28.7,54,-42.1,45.7,-50.8,33.8C-59.5,21.9,-63.5,6.5,-62.5,-9.8C-61.5,-26.1,-55.5,-43.2,-43.4,-51.4C-31.4,-59.6,-13.5,-58.9,1.1,-60.2C15.7,-61.5,29.3,-59.3,40,-51.2Z" 
                    transform="translate(100 100)" 
                  />
                </svg>
              </div>
            </motion.div>
            
            {/* Enhanced background elements */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-chameleon-orange/15 rounded-full filter blur-3xl" />
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-chameleon-green/15 rounded-full filter blur-3xl" />
          </div>
        </div>
      </div>
      
      {/* Enhanced background elements with better visibility */}
      <div className="absolute top-1/4 right-10 w-24 h-24 bg-chameleon-yellow/25 rounded-full filter blur-xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-36 h-36 bg-chameleon-green/25 rounded-full filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-chameleon-orange/25 rounded-full filter blur-xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Adding curved decoration elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border-4 border-chameleon-green/10 rounded-full" />
      <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-chameleon-yellow/10 rounded-full" />
    </div>
  );
};

export default Hero;
