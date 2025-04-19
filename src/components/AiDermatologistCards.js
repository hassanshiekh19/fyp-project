// components/AiDermatologistCards.js
import React from 'react';
import { CheckCircle, Clock, Lock, LineChart, TouchScreen, Award } from 'lucide-react';

const Card = ({ title, description, Icon, iconColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
      <div className={`${iconColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
        {Icon && <Icon className="text-white" size={24} />}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const AiDermatologistCards = () => {
  const benefits = [
    {
      title: "24/7 Accessibility",
      description: "Get skin assessments anytime, anywhere without waiting for appointments or office hours.",
      Icon: Clock,
      iconColor: "bg-blue-500"
    },
    {
      title: "Privacy & Convenience",
      description: "Assess skin concerns from the comfort of your home without having to visit a clinic.",
      Icon: Lock,
      iconColor: "bg-green-500"
    },
    {
      title: "Accurate Analysis",
      description: "AI trained on millions of images can detect patterns and provide consistent assessment.",
      Icon: CheckCircle,
      iconColor: "bg-purple-500"
    },
    {
      title: "Data-Driven Insights",
      description: "Receive objective analyses based on vast datasets and the latest dermatological research.",
      Icon: LineChart,
      iconColor: "bg-yellow-500"
    },
    {
      title: "User-Friendly Interface",
      description: "Simple and intuitive experience designed for users of all technical backgrounds.",
      Icon: TouchScreen,
      iconColor: "bg-red-500"
    },
    {
      title: "Complementary Care",
      description: "Works alongside traditional dermatology to provide preliminary screenings and follow-ups.",
      Icon: Award,
      iconColor: "bg-indigo-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why AI Dermatologist Is Worth Using</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered dermatology solution offers numerous advantages for your skin health journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              title={benefit.title}
              description={benefit.description}
              Icon={benefit.Icon}
              iconColor={benefit.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiDermatologistCards;