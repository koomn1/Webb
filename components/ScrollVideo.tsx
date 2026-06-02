'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how much of the section is visible
      const elementTop = rect.top;
      const elementHeight = rect.height;

      if (elementTop < viewportHeight && rect.bottom > 0) {
        // Calculate progress (0 to 1) as section scrolls through viewport
        const progress = Math.max(0, Math.min(1, (viewportHeight - elementTop) / (viewportHeight + elementHeight)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-20 md:py-32 px-6 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30">
              Journey & Vision
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Bridging Medicine & Technology
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Scroll to see the synergy between veterinary medicine and cutting-edge technology
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Professional Journey */}
            <div
              className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300"
              style={{
                transform: `translateY(${scrollProgress * -20}px)`,
                opacity: Math.max(0.5, 1 - scrollProgress * 0.2),
              }}
            >
              <h3 className="text-2xl font-bold mb-3 text-primary">Medical Excellence</h3>
              <p className="text-foreground/80 leading-relaxed">
                Years of dedicated study and hands-on practice in veterinary medicine have provided deep clinical
                expertise and understanding of complex medical scenarios. This foundation drives every technical
                solution I develop.
              </p>
            </div>

            {/* Tech Innovation */}
            <div
              className="p-6 rounded-xl bg-card/50 border border-border hover:border-accent/30 transition-all duration-300"
              style={{
                transform: `translateY(${scrollProgress * -10}px)`,
                opacity: Math.max(0.5, 1 - scrollProgress * 0.1),
              }}
            >
              <h3 className="text-2xl font-bold mb-3 text-accent">Technology Innovation</h3>
              <p className="text-foreground/80 leading-relaxed">
                Passion for software development and AI has led to creating intelligent systems that amplify medical
                expertise. Every line of code is written with clinical impact in mind.
              </p>
            </div>

            {/* Integration */}
            <div
              className="p-6 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:border-primary/50 transition-all duration-300"
              style={{
                transform: `translateY(${scrollProgress * 0}px)`,
                opacity: 1,
              }}
            >
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Unified Vision
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                The intersection of medical knowledge and technical expertise creates solutions that truly matter. This
                unique perspective enables development of innovative healthcare technology.
              </p>
            </div>
          </div>

          {/* Right Side - Visual Element with Scroll Interaction */}
          <div className="relative h-96 md:h-full min-h-96 lg:sticky lg:top-24">
            {/* Animated Background */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                transform: `scale(${0.9 + scrollProgress * 0.1}) rotateY(${scrollProgress * 5}deg)`,
              }}
            >
              <div className="relative w-full h-full">
                {/* Multi-color gradient background */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 rounded-2xl"
                  style={{
                    backgroundPosition: `${scrollProgress * 50}% ${scrollProgress * 50}%`,
                  }}
                />

                {/* Floating Elements */}
                <div
                  className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-2xl"
                  style={{
                    transform: `translateY(${scrollProgress * 100}px)`,
                  }}
                />
                <div
                  className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-accent/20 blur-2xl"
                  style={{
                    transform: `translateY(${scrollProgress * -100}px)`,
                  }}
                />
                <div
                  className="absolute bottom-1/3 left-1/3 w-36 h-36 rounded-full bg-secondary/20 blur-2xl"
                  style={{
                    transform: `scale(${1 + scrollProgress * 0.3})`,
                  }}
                />

                {/* Content Icons */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  <div
                    style={{
                      transform: `translateY(${scrollProgress * -50}px) scale(${0.8 + scrollProgress * 0.2})`,
                    }}
                  >
                    <svg
                      className="w-20 h-20 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>

                  <div
                    className="text-center"
                    style={{
                      opacity: scrollProgress < 0.5 ? 1 : 1 - (scrollProgress - 0.5) * 2,
                      transform: `translateY(${scrollProgress * 30}px)`,
                    }}
                  >
                    <svg
                      className="w-16 h-16 text-accent mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-accent">Innovation</p>
                  </div>

                  <div
                    style={{
                      transform: `translateY(${scrollProgress * 50}px) scale(${0.8 + scrollProgress * 0.2})`,
                    }}
                  >
                    <svg
                      className="w-20 h-20 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-primary">{Math.round(scrollProgress * 100)}%</div>
                <div className="w-32 h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${scrollProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            {
              label: 'Clinical Experience',
              value: '5+ Years',
              icon: '🩺',
            },
            {
              label: 'Technology Projects',
              value: '20+ Apps',
              icon: '💻',
            },
            {
              label: 'Combined Expertise',
              value: 'Unique Edge',
              icon: '⚡',
            },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-6 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-colors">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <p className="text-sm text-foreground/70 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
