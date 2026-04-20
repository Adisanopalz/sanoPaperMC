import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Sparkles, Zap, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { auth } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

const getApiKey = () => {
  try {
    // 1. Try Vite env var (Local/Vercel config)
    // 2. Try Process env (Server side/Build time)
    // 3. Fallback to the user's provided key for public production use
    return (import.meta as any).env.VITE_GEMINI_API_KEY || 
           (process as any).env.GEMINI_API_KEY || 
           'AIzaSyB73o4ImE0fUTFVYdFZaC7A6XWvxW_2ma0';
  } catch {
    return 'AIzaSyB73o4ImE0fUTFVYdFZaC7A6XWvxW_2ma0';
  }
};

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface SanoChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  isSidebar?: boolean;
  user?: FirebaseUser | null;
}

export default function SanoChat({ isOpen, onClose, isSidebar = false, user = null }: SanoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const API_KEY = getApiKey();
  
  // Use a ref to store the AI instance to avoid re-creating it every render
  const aiRef = useRef<GoogleGenAI | null>(null);
  if (!aiRef.current && API_KEY) {
    aiRef.current = new GoogleGenAI({ apiKey: API_KEY });
  }

  useEffect(() => {
    // SanoChat will always have a key now due to hardcoded fallback
    setShowSetup(false);
    
    setMessages(prev => {
      if (prev.length > 0) return prev;
      const welcomeMsg = user 
        ? `Halo **${user.displayName || 'Sano Citizen'}**! Saya SanoDevMC, asisten AI pribadi Anda. Ada yang bisa saya bantu dengan PaperMC atau server Anda hari ini?`
        : 'Halo! Saya **SanoDevMC**. Saya ahli dalam PaperMC dan server Minecraft. Bagaimana saya bisa membantu Anda hari ini?';
      return [{ role: 'model', text: welcomeMsg }];
    });
  }, [user]);

  const clearChat = () => {
    const welcomeMsg = user 
      ? `Halo **${user.displayName || 'Sano Citizen'}**! Sesi chat telah direset. Mau tanya apa lagi?`
      : 'Sesi chat telah direset. Ada lagi yang ingin Anda ketahui?';
    setMessages([{ role: 'model', text: welcomeMsg }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showSetup]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!API_KEY) {
      setShowSetup(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!aiRef.current) throw new Error("AI not initialized");

      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: "Anda adalah SanoDevMC, asisten AI untuk web app SanoDevMC. Anda ahli dalam Minecraft, teknis PaperMC, optimasi server, plugin, dan hal-hal terkait Paper server. Gunakan bahasa yang santai tapi profesional. Jika ditanya tentang link download, ingatkan user bahwa mereka bisa mengklik card di halaman utama."
        }
      });

      const aiText = response.text || 'Maaf, saya tidak mengerti.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Waduh, sepertinya ada masalah koneksi ke otak saya. Coba lagi nanti ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const setupGuide = (
    <div className="p-6 space-y-6">
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-cyan-500 rounded-2xl mx-auto flex items-center justify-center text-black mb-4 shadow-lg shadow-cyan-500/20">
          <Sparkles size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Setup SanoChat AI</h3>
        <p className="text-zinc-400 text-xs leading-relaxed">
          SanoChat memerlukan Google Gemini API Key agar asisten AI dapat memproses pertanyaan teknis Anda.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Instruksi Konfigurasi:</h4>
        
        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
          <div className="flex-1 space-y-3">
            <p className="text-xs text-zinc-300">
              Buat API Key baru di Google AI Studio (Gratis):
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              Get API Key <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
          <div className="text-xs text-zinc-300 space-y-3 flex-1">
            <p>Konfigurasi Environment Variable:</p>
            <div className="relative group/code">
              <div className="absolute -top-2 left-3 px-2 bg-zinc-900 text-[8px] font-bold text-zinc-500 uppercase tracking-widest border border-white/5 rounded">.env</div>
              <div className="bg-black/50 rounded-xl p-4 font-mono text-[10px] border border-white/10 leading-relaxed shadow-inner">
                <span className="text-zinc-500"># Masukkan key Anda di sini</span><br/>
                <span className="text-white">VITE_GEMINI_API_KEY</span>=<span className="text-cyan-400">AIzaSy...</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 italic">
              *Pastikan file .env berada di root direktori proyek.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
          <p className="text-xs text-zinc-300">
            Restart development server atau deploy ulang aplikasi untuk menerapkan perubahan.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 text-[10px] text-zinc-500 text-center flex items-center justify-center gap-2">
        <Zap size={12} className="text-cyan-500" />
        <span>SanoChat akan otomatis aktif setelah API Key valid.</span>
      </div>
    </div>
  );

  const content = (
    <div className={`flex flex-col h-full bg-transparent overflow-hidden ${isSidebar ? '' : 'rounded-2xl border border-white/10 shadow-2xl bg-zinc-900 shadow-black'}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-500/20">
            S
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight leading-none flex items-center gap-2">
              SanoChat 
              <span className="text-[10px] text-cyan-400 border border-cyan-400/50 px-1 rounded uppercase font-bold">Alpha</span>
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 block">AI Technical Advisor</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!showSetup && messages.length > 1 && (
            <button 
              onClick={clearChat}
              title="Reset Chat"
              className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          )}
          {!isSidebar && onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages / Setup Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {showSetup ? setupGuide : (
          <div className="p-6 space-y-6">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className="flex flex-col gap-1"
              >
                <p className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${m.role === 'model' ? 'text-cyan-400' : 'text-white/40'}`}>
                  {m.role === 'model' ? 'SanoDevMC' : 'User'}
                </p>
                <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-white/5 text-zinc-300 border border-white/5' 
                    : 'bg-cyan-500/10 text-zinc-200 border border-cyan-500/20'
                }`}>
                  <div className="prose prose-invert prose-xs max-w-none">
                    <Markdown>{m.text}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col gap-1 animate-pulse">
                <p className="text-[10px] uppercase tracking-wider font-bold mb-1 text-cyan-400">SanoDevMC</p>
                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl px-4 py-3 text-zinc-500 text-sm">
                  Berpikir...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      {!showSetup && (
        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya SanoChat..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-0 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-2.5 p-1.5 text-cyan-500 hover:text-cyan-400 disabled:opacity-30 transition-all"
            >
              <Zap size={18} fill={isLoading || !input.trim() ? "none" : "currentColor"} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isSidebar) return content;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] z-50"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

