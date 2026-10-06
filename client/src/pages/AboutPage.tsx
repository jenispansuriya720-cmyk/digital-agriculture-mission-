import React from 'react';
import {
  Sprout,
  ShieldCheck,
  Heart,
  Lightbulb,
  Users,
  Leaf,
  Eye,
  CheckCircle,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const values = [
    {
      title: 'Farmer First',
      desc: 'Every feature, decision, and algorithm prioritizes the livelihood and practical convenience of smallholder and progressive farmers.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-700',
    },
    {
      title: 'Innovation',
      desc: 'Deploying cutting-edge AI, IoT sensors, and mobile transparency to leapfrog legacy agricultural bottlenecks.',
      icon: Lightbulb,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Accessibility',
      desc: 'Engineered for regional languages, low-bandwidth 4G rural connectivity, and intuitive visual navigation.',
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Sustainability',
      desc: 'Encouraging precision water budgeting, organic soil revitalization, and natural biological pest management.',
      icon: Leaf,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Transparency',
      desc: 'Real-time open Mandi prices, transparent government DBT guidelines, and zero hidden platform middlemen.',
      icon: Eye,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Trust',
      desc: 'Partnered with agricultural universities and certified extension scientists to deliver verified guidance.',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-700',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12 max-w-7xl mx-auto">
      {/* Hero Mission Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 sm:p-14 text-white shadow-soft-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-secondary text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>Digital Agriculture Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            About Krishi Digital
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            Krishi Digital is a unified digital agriculture platform designed to connect Indian farmers with technology, agronomic science, Mandi markets, government welfare services, and expert university guidance — all in one accessible ecosystem.
          </p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Our Purpose
          </span>
          <h3 className="text-2xl font-black text-gray-900">Our Mission</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Empower farmers with accessible, reliable, and verified digital agriculture services. We strive to reduce the cost of cultivation, enhance crop yields, and double farm income by leveraging real-time data and scientific advisory.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Future Horizon
          </span>
          <h3 className="text-2xl font-black text-gray-900">Our Vision</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Build a fully connected, climate-resilient, and technology-enabled agricultural ecosystem across every district in India, where every farm plot has a digital twin and every farmer has instant scientific support in their native language.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Guiding Principles
          </span>
          <h2 className="text-3xl font-extrabold text-[#172018] tracking-tight mt-1">
            Our Core Values
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            The foundation upon which the Krishi Digital platform and services are built.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all space-y-3"
              >
                <div className={`p-3 rounded-2xl w-fit ${v.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-900">{v.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
