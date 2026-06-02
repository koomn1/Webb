'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  isScrolled: boolean;
  activeSection: string;
}

export default function Navigation({ isScrolled, activeSection }: NavigationProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'veterinary', label: 'Veterinary' },
    { id: 'ai', label: 'AI & Dev' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'assistant', label: 'Assistant' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="Youssef Badawi"
            className="w-10 h-10 rounded-lg"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-foreground">Youssef Badawi</span>
            <span className="text-xs text-foreground/60">Vet & AI Developer</span>
          </div>
        </button>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative text-sm font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-accent'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-transparent rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Social Icons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://wa.me/201018995002"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg glass hover:glass-lg transition-all duration-300"
            title="WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.15-1.824 1.823-2.844 4.26-2.844 6.84 0 2.577 1.02 5.01 2.844 6.834 1.823 1.823 4.26 2.844 6.84 2.844 2.579 0 5.017-1.021 6.84-2.844 1.825-1.824 2.844-4.257 2.844-6.834 0-2.582-1.019-5.019-2.844-6.843-1.823-1.913-4.26-2.95-6.84-2.95zm0-2.04c3.455 0 6.717 1.395 9.06 3.738 2.344 2.344 3.738 5.606 3.738 9.06 0 3.455-1.394 6.717-3.738 9.06-2.343 2.344-5.605 3.738-9.06 3.738-3.455 0-6.717-1.394-9.06-3.738C1.395 20.748 0 17.486 0 14.031c0-3.454 1.395-6.716 3.738-9.06C6.081 2.627 9.343 1.232 12.798 1.232z"/>
            </svg>
          </a>
          <a
            href="mailto:yo01009950871@gmail.com"
            className="p-2 rounded-lg glass hover:glass-lg transition-all duration-300"
            title="Email"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <a
            href="https://t.me/DR_Youssef_Badawy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg glass hover:glass-lg transition-all duration-300"
            title="Telegram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.82-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.391 0-.329-.148-.464-.525l-1.611-5.283c-.145-.48.166-.685.464-.81l12.869-4.97c.547-.224.916.131.756.914z"/>
            </svg>
          </a>
          <a
            href="https://instagram.com/youssef_mo7ammed_02"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg glass hover:glass-lg transition-all duration-300"
            title="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110.002 2.881 1.44 1.44 0 01-.002-2.881z"/>
            </svg>
          </a>
          <a
            href="https://tiktok.com/@youssef_m_badawy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg glass hover:glass-lg transition-all duration-300"
            title="TikTok"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.66 1.94 2.89 2.89 0 015.66-1.94V9.86a7.62 7.62 0 00-7.5 7.66 7.62 7.62 0 007.5 7.66 7.62 7.62 0 007.5-7.66c0-.24 0-.48-.02-.72.02-.24.02-.48.02-.72V10.4a8.91 8.91 0 003.49-1.77 8.91 8.91 0 003.46-1.77v-3.13a8.91 8.91 0 01-3.77.99z"/>
            </svg>
          </a>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
