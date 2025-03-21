
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ListChecks } from 'lucide-react';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <div className="container mx-auto text-center py-12">
        <Link to="/todo">
          <Button className="cta-button bg-chameleon-green hover:bg-chameleon-green-dark text-white font-medium px-6 py-6 rounded-full text-lg shadow-md">
            <ListChecks className="mr-2" />
            Check out our To-Do List
          </Button>
        </Link>
      </div>
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
