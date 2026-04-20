import { motion } from 'motion/react';
import { Shield, Zap, Terminal, MessageSquare, Globe, ExternalLink, Heart, Coffee } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-16 pb-20 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-cyan-500 rounded-3xl mx-auto flex items-center justify-center text-black shadow-2xl shadow-cyan-500/20 mb-8"
        >
          <Globe size={40} />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
          Empowering Your <span className="text-cyan-400">PaperMC</span> Odyssey
        </h2>
        <p className="text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">
          Sano PaperMC adalah pusat kendali modern yang dirancang untuk mempermudah administrasi server Minecraft, dari manajemen perangkat lunak hingga bantuan teknis berbasis AI.
        </p>
      </section>

      {/* Main Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4 hover:border-cyan-500/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
            <Zap size={20} />
          </div>
          <h4 className="text-lg font-bold text-white">One-Click Downloads</h4>
          <p className="text-sm text-white/40 leading-relaxed">
            Akses instan ke build terbaru PaperMC tanpa harus mencari manual. Kami menyediakan repositori arsip yang terverifikasi untuk keamanan server Anda.
          </p>
        </div>

        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4 hover:border-cyan-500/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
            <MessageSquare size={20} />
          </div>
          <h4 className="text-lg font-bold text-white">SanoChat AI Integration</h4>
          <p className="text-sm text-white/40 leading-relaxed">
            Asisten cerdas berbasis Gemini AI yang siap menjawab pertanyaan teknis tentang optimasi server, bendera JVM, hingga rekomendasi plugin.
          </p>
        </div>

        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4 hover:border-cyan-500/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
            <Shield size={20} />
          </div>
          <h4 className="text-lg font-bold text-white">Advanced Server Tools</h4>
          <p className="text-sm text-white/40 leading-relaxed">
            Optimizer bendera JVM, desainer MOTD visual, dan profil konfigurasi server instan untuk memaksimalkan TPS dan pengalaman pemain.
          </p>
        </div>

        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4 hover:border-cyan-500/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
            <Globe size={20} />
          </div>
          <h4 className="text-lg font-bold text-white">Global Plugin Browser</h4>
          <p className="text-sm text-white/40 leading-relaxed">
            Jelajahi ribuan plugin dari Modrinth dan Hangar secara langsung. Lihat detail teknis, dependensi, dan riwayat versi dengan mudah.
          </p>
        </div>
      </section>

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
