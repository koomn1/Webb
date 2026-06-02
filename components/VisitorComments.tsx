'use client';

import { useState } from 'react';
import { Send, User } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  isApproved?: boolean;
}

export default function VisitorComments() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      message: 'Impressive portfolio! Your expertise in both veterinary and AI is remarkable.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isApproved: true,
    },
    {
      id: '2',
      name: 'Fatima Al-Mazrouei',
      email: 'fatima@example.com',
      message: 'Great design and content. Very professional presentation.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      isApproved: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date().toISOString(),
        isApproved: false,
      };
      setComments((prev) => [newComment, ...prev]);
      setFormData({ name: '', email: '', message: '' });
      setSubmitMessage('Thank you! Your comment will appear after review.');
      setTimeout(() => setSubmitMessage(''), 5000);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="space-y-12">
        {/* Form */}
        <div className="glass-lg rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-2">Share Your Thoughts</h2>
          <p className="text-foreground/60 mb-8">Leave a comment and let me know what you think!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
            </div>
            <textarea
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="glass rounded-xl px-4 py-3 w-full min-h-[120px] focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 disabled:opacity-50 border border-accent/30 rounded-xl py-3 font-medium transition-all duration-300"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Sending...' : 'Send Comment'}
            </button>
            {submitMessage && (
              <p className={`text-sm ${submitMessage.includes('Thank you') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {submitMessage}
              </p>
            )}
          </form>
        </div>

        {/* Comments List */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.filter(c => c.isApproved !== false).length})</h3>
          <div className="space-y-4">
            {comments
              .filter((c) => c.isApproved !== false)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((comment) => (
                <div key={comment.id} className="glass rounded-2xl p-6 animate-in fade-in duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">{comment.name}</h4>
                        <p className="text-xs text-foreground/50">
                          {new Date(comment.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <p className="text-foreground/80 leading-relaxed">{comment.message}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
