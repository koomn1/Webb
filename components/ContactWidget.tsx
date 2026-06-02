'use client';

import { useState } from 'react';
import { MessageCircle, Mail, Send, Instagram, Music2, ChevronUp } from 'lucide-react';

interface ContactLink {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  label: string;
}

export default function ContactWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  const contacts: ContactLink[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      href: 'https://wa.me/201018995002',
      color: 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-600 dark:text-green-400',
      label: '01018995002',
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      href: 'mailto:yo01009950871@gmail.com',
      color: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-600 dark:text-blue-400',
      label: 'yo01009950871@gmail.com',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      href: 'https://t.me/DR_Youssef_Badawy',
      color: 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-500/30 text-sky-600 dark:text-sky-400',
      label: '@DR_Youssef_Badawy',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      href: 'https://instagram.com/youssef_mo7ammed_02',
      color: 'bg-pink-500/20 hover:bg-pink-500/30 border-pink-500/30 text-pink-600 dark:text-pink-400',
      label: 'youssef_mo7ammed_02',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <Music2 className="w-5 h-5" />,
      href: 'https://tiktok.com/@youssef_m_badawy',
      color: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-purple-600 dark:text-purple-400',
      label: 'youssef_m_badawy',
    },
  ];

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col gap-3">
      {isExpanded && (
        <div className="glass-lg rounded-2xl p-4 w-80 max-w-[calc(100vw-3rem)] shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-bold text-foreground mb-4">Get In Touch</h3>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${contact.color}`}
              >
                <div className="flex-shrink-0">{contact.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs opacity-75 truncate">{contact.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`glass rounded-full p-4 transition-all duration-300 shadow-lg hover:shadow-xl ${
          isExpanded ? 'bg-accent/20 border-accent/30' : 'hover:glass-lg'
        }`}
        aria-label="Toggle contact widget"
      >
        <ChevronUp
          className={`w-6 h-6 text-accent transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}
