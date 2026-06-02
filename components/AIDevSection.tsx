'use client';

import { useState } from 'react';

const projects = [
  {
    id: 1,
    title: 'AI-Powered Diagnostic System',
    description:
      'Machine learning models for veterinary diagnostic support combining medical expertise with neural networks.',
    technologies: ['Python', 'TensorFlow', 'Medical AI', 'Computer Vision'],
    achievements: [
      '99.2% accuracy in image classification',
      'Real-time processing capability',
      'Integration with veterinary clinics',
    ],
  },
  {
    id: 2,
    title: 'Full-Stack Clinical Management Platform',
    description:
      'End-to-end web application for veterinary clinic management with real-time data synchronization.',
    technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Vercel'],
    achievements: [
      'Reduced admin time by 60%',
      'Real-time patient tracking',
      'Mobile-responsive design',
    ],
  },
  {
    id: 3,
    title: 'Mobile Health Monitoring App',
    description:
      'Native mobile application for post-operative patient monitoring with AI-driven health alerts.',
    technologies: ['React Native', 'Node.js', 'Firebase', 'Medical APIs'],
    achievements: [
      '10K+ active users',
      'Push notification system',
      'Real-time data visualization',
    ],
  },
  {
    id: 4,
    title: 'Data Analytics Dashboard',
    description:
      'Comprehensive analytics platform for clinical data insights and performance metrics visualization.',
    technologies: ['React', 'D3.js', 'PostgreSQL', 'REST APIs'],
    achievements: [
      'Advanced data visualizations',
      'Custom report generation',
      'Export to multiple formats',
    ],
  },
];

export default function AIDevSection() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <section className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold border border-accent/30">
              AI & Development
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Innovative Technology Solutions
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Leveraging cutting-edge AI, full-stack development, and cloud technologies to build intelligent,
            scalable applications.
          </p>
        </div>

        {/* Projects Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {projects.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(idx)}
              className={`group text-left p-6 rounded-xl transition-all duration-300 border cursor-pointer text-balance ${
                activeProject === idx
                  ? 'bg-gradient-to-br from-primary/20 to-accent/10 border-accent/50 shadow-lg shadow-accent/20'
                  : 'bg-card/50 border-border hover:border-accent/30 hover:bg-card'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
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
                      d="M10 20l4-16m4 4l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-foreground/70">{project.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Project Detailed View */}
        {projects[activeProject] && (
          <div className="bg-gradient-to-br from-accent/10 via-transparent to-primary/10 border border-accent/20 rounded-2xl p-8 md:p-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold mb-4">{projects[activeProject].title}</h3>
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                  {projects[activeProject].description}
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {projects[activeProject].technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm border border-accent/30 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-accent/20">
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">Key Achievements</h4>
                    <ul className="space-y-2">
                      {projects[activeProject].achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-foreground/80">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl p-8 flex items-center justify-center min-h-80">
                <div className="text-center">
                  <svg
                    className="w-24 h-24 mx-auto text-accent mb-4 opacity-50"
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
                  <p className="text-foreground/60">Innovation in Technology</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills & Expertise */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card/50 border border-border rounded-xl p-8 hover:border-accent/30 transition-colors">
            <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="p-2 bg-accent/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5" />
                </svg>
              </span>
              Languages & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Python',
                'JavaScript',
                'TypeScript',
                'React',
                'Next.js',
                'Node.js',
                'PostgreSQL',
                'TensorFlow',
                'FastAPI',
                'REST APIs',
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-lg text-sm border border-accent/30 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card/50 border border-border rounded-xl p-8 hover:border-primary/30 transition-colors">
            <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="p-2 bg-primary/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 7H7v6h6V7z" />
                </svg>
              </span>
              Tools & Platforms
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Vercel', 'AWS', 'Docker', 'Git', 'GitHub', 'Firebase', 'Figma', 'VS Code'].map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm border border-primary/30 font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
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
