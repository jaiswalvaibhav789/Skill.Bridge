import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Sparkles, Bot, ArrowRight, RotateCcw, ChevronDown, Minimize2 } from 'lucide-react';
import { askChatbotAssistant } from '../services/api';

export default function AyushChatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      title: 'SkillBridge Ayush UI Navigator',
      text: `👋 **Welcome to SkillBridge Ayush!** I am your interactive portal assistant.

I can guide you through our **AI Complementary Team Formation**, explain the **Mathematical Skill Matching formula**, or help you navigate between Student, Industry, and Institute dashboards!

Click a quick prompt below or ask me any question!`,
      quickLinks: [
        { label: 'Explore AI Team Builder', path: '/teams' },
        { label: 'View Documentation', path: '/' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Suggested prompt chips based on location / user
  const quickPrompts = [
    { label: '💡 AI Team Formation Flow', query: 'How does the AI Complementary Team Formation work?' },
    { label: '🧮 Match Score Formula', query: 'How is the skill compatibility match score calculated?' },
    { label: '🧭 Guide for this page', query: `What are the key actions and features available on ${location.pathname}?` },
    { label: '👨‍🎓 Student Features', query: 'How do students verify clinical skills and apply for opportunities?' },
    { label: '🏢 Recruiter Features', query: 'How do recruiters post roles and pre-rank applicants?' },
    { label: '🔑 Demo Credentials', query: 'What are the demo accounts and credentials?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userQuery) => {
    const q = (userQuery || input).trim();
    if (!q) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userQuery) setInput('');
    setLoading(true);

    try {
      const res = await askChatbotAssistant({
        query: q,
        currentPath: location.pathname,
        userRole: user?.role || 'guest'
      });

      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        title: res.data.data?.title || 'Portal Assistant',
        text: res.data.data?.answer || 'I am here to help you navigate SkillBridge Ayush.',
        quickLinks: res.data.data?.quickLinks || []
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      // Robust client fallback
      const fallbackReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        title: 'Platform Guidance',
        text: `**SkillBridge Ayush** connects traditional Ayush disciplines with modern health industry:
- **AI Complementary Team Formation**: Enter any industry problem (e.g. *Smart Medicinal Plant Inventory System*) to assemble a 4-member squad across Frontend, Backend, Domain, and Analytics!
- **Match Score Engine**: Evaluates verified clinical skills against required competencies.
- **Role Portals**: Student dashboard for applications, Industry portal for candidate shortlisting, and Institute analytics for clinical verification.`,
        quickLinks: [{ label: 'Go to AI Team Builder', path: '/teams' }]
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (path) => {
    navigate(path);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        title: 'SkillBridge Ayush UI Navigator',
        text: `Chat cleared! How can I assist you in exploring the portal today?`,
        quickLinks: [
          { label: 'Explore AI Team Builder', path: '/teams' },
          { label: 'View Home Overview', path: '/' }
        ]
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border border-emerald-400/30"
          title="Open UI Assistant"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-none">Need UI Help?</p>
            <p className="text-[10px] text-emerald-100 font-medium">Ask Portal Assistant</p>
          </div>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 px-4 py-3.5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                  Ayush UI Guide & Assistant
                </h3>
                <p className="text-[11px] text-emerald-200/80">
                  Contextual Portal Guide • SIH 2026
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Carousel */}
          <div className="bg-slate-50/90 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="text-[11px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="flex items-center gap-1 mb-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    <Bot className="h-3 w-3 text-emerald-600" />
                    <span>{m.title || 'Assistant'}</span>
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-700 text-white shadow-sm font-medium rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-xs">
                    {m.text}
                  </div>

                  {/* Interactive Quick Links */}
                  {m.quickLinks && m.quickLinks.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {m.quickLinks.map((link, lIdx) => (
                        <button
                          key={lIdx}
                          onClick={() => handleLinkClick(link.path)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200 transition"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 w-fit text-slate-500 text-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="italic">Analyzing portal knowledge...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about team matching, formulas, navigation..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white transition shadow-sm"
              title="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
