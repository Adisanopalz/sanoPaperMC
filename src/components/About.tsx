import { motion } from 'motion/react';
import { Shield, Zap, Terminal, MessageSquare, Globe, ExternalLink, Heart, Coffee } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-16 pb-20 max-w-4xl mx-auto">
      {/* How to Get Help */}
      <section className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[40px] p-10 md:p-16 text-center space-y-8">
        <h3 className="text-3xl font-bold text-white">Butuh Bantuan?</h3>
        <p className="text-white/50 max-w-xl mx-auto">
          Jika Anda mengalami kendala teknis atau memiliki saran fitur, Anda bisa menggunakan SanoChat di sidebar atau menghubungi saya langsung melalui portal komunitas.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://bit.ly/SANOP" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center gap-2 group"
          >
            Hubungi Sanopalz <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <button 
            className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Kembali ke Atas
          </button>
        </div>
      </section>

      {/* Author Acknowledgement */}
      <section className="text-center pt-10 border-t border-white/5">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 mb-6">
          <Heart size={14} className="text-red-500 fill-red-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Developed with passion by Sanopalz</span>
        </div>
        <div className="max-w-md mx-auto">
          <p className="text-xs text-zinc-600 leading-relaxed italic">
            "Proyek ini didedikasikan untuk seluruh komunitas Minecraft di Indonesia. Mari terus berinovasi dan membangun server yang luar biasa bersama."
          </p>
        </div>
      </section>
    </div>
  );
}
