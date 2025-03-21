
import { useEffect } from 'react';
import { 
  BarChart3, 
  Brain, 
  Calendar, 
  CheckCircle, 
  Flame, 
  LineChart, 
  Sparkles, 
  Target 
} from 'lucide-react';

const features = [
  {
    icon: <Target className="w-8 h-8 text-chameleon-green" />,
    title: "Goal Setting",
    description: "Set personalized goals and track your progress with intuitive visualizations.",
    color: "bg-chameleon-green/10"
  },
  {
    icon: <Flame className="w-8 h-8 text-chameleon-orange" />,
    title: "Habit Streaks",
    description: "Build consistency with streak tracking and milestone celebrations.",
    color: "bg-chameleon-orange/10"
  },
  {
    icon: <Brain className="w-8 h-8 text-chameleon-yellow" />,
    title: "AI Recommendations",
    description: "Receive personalized suggestions based on your performance and preferences.",
    color: "bg-chameleon-yellow/10"
  },
  {
    icon: <Calendar className="w-8 h-8 text-chameleon-green" />,
    title: "Smart Scheduling",
    description: "Plan your habits with an adaptive calendar that learns your optimal times.",
    color: "bg-chameleon-green/10"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-chameleon-orange" />,
    title: "Progress Analytics",
    description: "Visualize your growth with detailed analytics and insightful reports.",
    color: "bg-chameleon-orange/10"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-chameleon-yellow" />,
    title: "Rewards System",
    description: "Stay motivated with a gamified experience and meaningful rewards.",
    color: "bg-chameleon-yellow/10"
  }
];

const Features = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="section bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-chameleon-green/10 text-chameleon-green-dark rounded-full">
            Core Features
          </span>
          <h2 className="section-title mt-4">
            Transform Your Habits <span className="text-chameleon-green">Seamlessly</span>
          </h2>
          <p className="section-subtitle">
            Our platform adapts to your unique needs, helping you build lasting habits with powerful features designed for your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card ${feature.color} reveal`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-2xl bg-chameleon-light reveal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Adaptive Workflow</h3>
              <p className="text-foreground/70 mb-6">
                Our platform evolves with you, adjusting to your progress and preferences to create a personalized experience that maximizes your success.
              </p>
              <ul className="space-y-3">
                {[
                  "Personalized habit recommendations",
                  "Adaptive difficulty levels",
                  "Smart reminders based on your activity patterns",
                  "Progress-based journey customization"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-chameleon-green mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-[300px]">
                <div className="absolute top-0 left-0 right-0 h-[200px] bg-white rounded-xl shadow-md p-4">
                  <div className="w-full h-4 bg-chameleon-green/20 rounded-full mb-4">
                    <div className="h-full w-3/4 bg-chameleon-green rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-3 bg-gray-100 rounded-full"></div>
                    <div className="w-2/3 h-3 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
                
                {/* Improved display for charts */}
                <div className="absolute top-[100px] left-[50px] right-0 h-[200px] bg-white rounded-xl shadow-md p-4 transform -rotate-3 z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-chameleon-yellow/30 mr-3"></div>
                    <div className="space-y-1">
                      <div className="w-24 h-2 bg-gray-100 rounded-full"></div>
                      <div className="w-16 h-2 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mb-3">
                    <LineChart className="w-5 h-5 text-chameleon-green" />
                    <div className="text-xs font-medium text-chameleon-green">+15%</div>
                  </div>
                  <div className="w-full h-20">
                    <div className="flex items-end justify-between h-full px-2">
                      {[35, 50, 70, 45, 60, 80, 65].map((height, i) => (
                        <div 
                          key={i} 
                          className="w-[8%] bg-chameleon-gradient rounded-sm"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Added chameleon illustration */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 z-20">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="rotate-45">
                    <path 
                      fill="#8BC34A" 
                      d="M39.5,-65.4C50.9,-56.7,59.6,-44.5,65.7,-31.2C71.7,-17.9,75.1,-3.5,74.6,11.1C74.2,25.7,69.8,40.4,60.3,50.5C50.8,60.5,36.1,65.9,21.2,70.3C6.2,74.6,-9,78,-22.1,74.5C-35.1,71,-46,60.7,-54.2,48.7C-62.3,36.7,-67.6,23,-70.5,8.5C-73.4,-6,-73.9,-21.4,-68.4,-34.8C-62.8,-48.2,-51.1,-59.7,-37.7,-67.2C-24.3,-74.7,-9.3,-78.2,3.2,-82.6C15.7,-87,27.9,-74.3,39.5,-65.4Z" 
                      transform="translate(100 100)" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
