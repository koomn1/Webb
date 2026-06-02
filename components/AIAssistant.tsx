'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Youssef's AI assistant. Ask me anything about his expertise in Veterinary Medicine or AI Development!",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API call - in production, call your backend
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAssistantResponse(input),
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const getAssistantResponse = (userInput: string): string => {
    const responses: { [key: string]: string } = {
      veterinary: "I specialize in veterinary medicine with advanced surgical expertise. Feel free to ask about my experience!",
      ai: "I'm passionate about AI and full-stack development. I work with modern technologies and frameworks.",
      experience: "I have extensive experience in both veterinary medicine and software development. What would you like to know?",
      education: "I graduated from Regent British School with distinction in veterinary medicine.",
      contact: "You can reach me through WhatsApp, Email, or any of my social media channels listed on the site.",
      default: "That's a great question! Tell me more about what interests you - veterinary medicine or AI development?",
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) return value;
    }
    return responses.default;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 glass rounded-full p-4 hover:glass-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] glass-lg rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 flex items-center justify-between border-b border-white/10">
        <div>
          <h3 className="font-bold text-foreground">Youssef's Assistant</h3>
          <p className="text-xs text-foreground/60">Always here to help</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl transition-all duration-300 ${
                message.sender === 'user'
                  ? 'bg-accent/20 text-foreground rounded-br-none border border-accent/30'
                  : 'bg-primary/10 text-foreground rounded-bl-none border border-primary/30'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-primary/10 border border-primary/30 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-white/10 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 bg-white/5 dark:bg-white/5 border border-white/10 rounded-full px-4 py-2 text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent/50 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent/20 hover:bg-accent/30 disabled:opacity-50 border border-accent/30 rounded-full p-2 transition-all"
        >
          <Send className="w-5 h-5 text-accent" />
        </button>
      </form>
    </div>
  );
}
