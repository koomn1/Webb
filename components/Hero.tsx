'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl opacity-20"
          style={{
            transform: `translate(calc(-50% + ${mousePosition.x * 0.01}px), calc(-50% + ${mousePosition.y * 0.01}px))`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Profile Image */}
        <div className="mb-8 inline-block animate-fade-in subtle-3d perspective-3d">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-accent/30 shadow-2xl glass">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-sun-MAzL5okLa1okpBwL99gVCJT8jihfWh.jpg"
              alt="Youssef Badawi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name and Title */}
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Youssef Badawi
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-light">
            Veterinary Medicine Specialist & AI/Full-Stack Developer
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          Bridging the gap between medical expertise and cutting-edge technology. Passionate about
          developing intelligent solutions that combine veterinary knowledge with advanced software
          engineering.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => {
              const element = document.getElementById('veterinary');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 glass-lg rounded-full font-semibold hover:glass transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 hover:border-accent/50"
          >
            Explore Portfolio
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('assistant');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 glass rounded-full font-semibold hover:glass-lg transition-all duration-300 border border-white/20"
          >
            Chat with AI
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center animate-bounce">
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Scroll Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.animate-fade-in) {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
