'use client';

import { useState } from 'react';

const galleryImages = [
  {
    id: 1,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-sun-MAzL5okLa1okpBwL99gVCJT8jihfWh.jpg',
    alt: 'Professional Portrait',
    category: 'Portrait',
    description: 'Professional studio portrait',
  },
  {
    id: 2,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-moto-3zveRHxKe2LBwByWimFDLmzDaNWxOP.jpg',
    alt: 'Urban Lifestyle',
    category: 'Lifestyle',
    description: 'Urban exploration and lifestyle',
  },
  {
    id: 3,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-sitting-nxfdLPEG8UiQ7HgYdCZhpa7VTdktAv.webp',
    alt: 'Casual Professional',
    category: 'Professional',
    description: 'Relaxed professional setting',
  },
  {
    id: 4,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-walk-ktLlyEmTeJJ1vrvJcTBHUEUGH8IlD1.webp',
    alt: 'Street Walk',
    category: 'Lifestyle',
    description: 'Street photography moment',
  },
  {
    id: 5,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-hotel-qpwrqGmMCPllOPg3xDX48LGbLlVhc4.jpg',
    alt: 'Elegant Setting',
    category: 'Professional',
    description: 'Sophisticated professional environment',
  },
  {
    id: 6,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-street-4LfWWNEiO6Au6A9qrLcrLYWmmQC19E.webp',
    alt: 'Urban Scene',
    category: 'Lifestyle',
    description: 'Urban architectural moment',
  },
  {
    id: 7,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-mirror-06JjTt30qCXoznzyrdctpWFQO4tnqM.jpg',
    alt: 'Tech Professional',
    category: 'Professional',
    description: 'Tech workspace environment',
  },
  {
    id: 8,
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-cafe-vNFsN38WeS4VGUHwCxNY4dvjPTVKi8.jpg',
    alt: 'Social Moment',
    category: 'Lifestyle',
    description: 'Casual social gathering',
  },
];

const categories = ['All', 'Portrait', 'Professional', 'Lifestyle'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <section className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-background via-background to-card/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30">
              Gallery
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Moments & Memories
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A curated collection of professional and personal moments that capture my journey
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                activeCategory === category
                  ? 'glass-lg bg-gradient-to-r from-accent/30 to-primary/20 border-accent/50 shadow-lg'
                  : 'glass hover:glass-lg border-white/10 hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image.id)}
              className="relative group cursor-pointer rounded-2xl overflow-hidden h-80 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 subtle-3d card-3d"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold">{image.alt}</h3>
                <p className="text-white/80 text-sm">{image.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full h-[80vh] rounded-2xl overflow-hidden animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <img
                src={galleryImages.find((img) => img.id === selectedImage)?.src}
                alt="Gallery"
                className="w-full h-full object-contain"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white font-semibold text-lg">
                  {galleryImages.find((img) => img.id === selectedImage)?.alt}
                </p>
                <p className="text-white/70">
                  {galleryImages.find((img) => img.id === selectedImage)?.category}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        :global(.animate-fade-in) {
          animation: fade-in 0.3s ease-out;
        }

        :global(.animate-zoom-in) {
          animation: zoom-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
