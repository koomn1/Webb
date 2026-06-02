// Performance optimization utilities

/**
 * Lazy load images with intersection observer
 */
export const setupLazyLoading = () => {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img[data-lazy]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.removeAttribute('data-lazy');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px',
  });

  images.forEach(img => imageObserver.observe(img));
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

/**
 * Defer non-critical scripts
 */
export const deferScript = (callback: () => void, delay = 2000) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(callback, delay);
    });
  } else {
    setTimeout(callback, delay);
  }
};

/**
 * Report Web Vitals
 */
export const reportWebVitals = (metric: any) => {
  // Send to analytics service
  if (typeof window !== 'undefined' && 'fetch' in window) {
    const body = JSON.stringify(metric);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body);
    }
  }
};
