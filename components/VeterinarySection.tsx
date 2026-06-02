'use client';

import { useState } from 'react';

const projects = [
  {
    id: 1,
    title: 'Surgical Innovation in Orthopedics',
    description:
      'Advanced techniques in veterinary orthopedic surgery with focus on joint reconstruction and recovery optimization.',
    technologies: ['Surgical Techniques', 'Orthopedics', 'Patient Care', 'Recovery Management'],
    impact: 'Improved surgical outcomes by 40% through advanced techniques',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-walk-ktLlyEmTeJJ1vrvJcTBHUEUGH8IlD1.webp',
  },
  {
    id: 2,
    title: 'Diagnostic Excellence Program',
    description:
      'Development of comprehensive diagnostic protocols and imaging interpretation expertise for complex cases.',
    technologies: ['Diagnostics', 'Medical Imaging', 'Case Analysis', 'Pathology'],
    impact: 'Enhanced diagnostic accuracy in clinical practice',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-cafe-vNFsN38WeS4VGUHwCxNY4dvjPTVKi8.jpg',
  },
  {
    id: 3,
    title: 'Emergency Medicine Response',
    description:
      'Critical care expertise and emergency response protocols for acute veterinary cases and trauma management.',
    technologies: ['Emergency Care', 'Critical Analysis', 'Triage', 'Trauma Management'],
    impact: 'Life-saving interventions with high success rates',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-school-zOdqBUpmGztC7fkvuY3NCgwpjzV1mV.jpg',
  },
];

export default function VeterinarySection() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <section className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-background via-background to-card/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold border border-secondary/30">
              Veterinary Medicine
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Medical Expertise & Clinical Excellence
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Specialized knowledge in veterinary medicine with focus on surgical innovation, diagnostic excellence, and
            emergency care.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {projects.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(idx)}
              className={`group text-left p-6 rounded-xl transition-all duration-300 cursor-pointer subtle-3d card-3d ${
                activeProject === idx
                  ? 'glass-lg bg-gradient-to-br from-primary/20 to-accent/10 border-primary/50 shadow-lg shadow-primary/20'
                  : 'glass hover:glass-lg border-white/10 hover:border-primary/30'
              }`}
            >
              <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    activeProject === idx ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-foreground/70">{project.description}</p>
            </button>
          ))}
        </div>

        {/* Active Project Details */}
        {projects[activeProject] && (
          <div className="glass-lg bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 rounded-2xl p-8 md:p-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold mb-4">{projects[activeProject].title}</h3>
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                  {projects[activeProject].description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Key Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {projects[activeProject].technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm border border-secondary/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-primary/20">
                    <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">Impact</h4>
                    <p className="text-lg font-medium text-foreground">{projects[activeProject].impact}</p>
                  </div>
                </div>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden">
                <img
                  src={projects[activeProject].image}
                  alt={projects[activeProject].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { label: 'Years of Experience', value: '5+' },
            { label: 'Successful Procedures', value: '500+' },
            { label: 'Patient Success Rate', value: '95%' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-6 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
              <p className="text-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.animate-fade-in) {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}
