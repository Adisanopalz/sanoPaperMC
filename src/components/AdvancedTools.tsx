import { useState } from 'react';
import { Zap, Copy, Check, MessageSquare, Terminal, Sliders, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdvancedTools() {
  const [ram, setRam] = useState(4);
  const [copied, setCopied] = useState(false);
  const [motd, setMotd] = useState('§bSano PaperMC §7Server\n§eMari bergabung dan bermain!');

  const jvmFlags = `java -Xms${ram}G -Xmx${ram}G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar paper.jar nogui`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jvmFlags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMotd = (text: string) => {
    const parts = text.split(/§([0-9a-fk-or])/g);
    const colors: Record<string, string> = {
      '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA', '4': '#AA0000',
      '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA', '8': '#555555', '9': '#5555FF',
      'a': '#55FF55', 'b': '#55FFFF', 'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55',
      'f': '#FFFFFF'
    };

    let currentColor = '#AAAAAA';
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        currentColor = colors[part] || currentColor;
        return null;
      }
      return <span key={i} style={{ color: currentColor }}>{part}</span>;
    });
  };

  return (
    <div className="space-y-16 pb-20">
      <header>
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Expert System Module</h4>
        <h3 className="text-3xl font-bold text-white tracking-tight">Advanced Tools</h3>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* JVM Flags Generator */}
        <section className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Zap size={20} />
              </div>
              <h4 className="font-bold text-white">JVM Flags Optimizer</h4>
            </div>
            <div className="text-[10px] font-bold text-orange-500/50 uppercase tracking-widest bg-orange-500/5 px-2 py-1 rounded">Aikar's Pattern</div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Server RAM Amount (GB)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="2" 
                max="64" 
                value={ram} 
                onChange={(e) => setRam(parseInt(e.target.value))}
                className="flex-1 accent-orange-500" 
              />
              <span className="w-12 text-center font-mono font-bold text-orange-500">{ram}G</span>
            </div>
          </div>

          <div className="relative group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Optimized Startup Command</label>
            <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-white/60 border border-white/5 max-h-48 overflow-y-auto break-all scrollbar-thin">
              {jvmFlags}
            </div>
            <button 
              onClick={copyToClipboard}
              className="absolute top-[34px] right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all active:scale-95"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          
          <p className="text-[10px] text-white/30 flex items-center gap-2">
            <Info size={12} />
            Flags ini mengoptimalkan Garbage Collection untuk mengurangi TPS lag spikes.
          </p>
        </section>

        {/* MOTD Designer */}
        <section className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <MessageSquare size={20} />
            </div>
            <h4 className="font-bold text-white">MOTD Designer</h4>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Input (Use Minecraft Color Codes)</label>
            <textarea 
              value={motd}
              onChange={(e) => setMotd(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500/30 min-h-[100px] resize-none"
              placeholder="e.g. §bSelamat Datang!"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Visual Preview</label>
            <div className="bg-[#1e1e1e] border-4 border-[#333333] rounded p-4 font-minecraft text-base leading-tight h-16 flex flex-col justify-center">
              <div className="flex flex-col">
                <div className="truncate whitespace-pre">{renderMotd(motd.split('\n')[0])}</div>
                <div className="truncate whitespace-pre">{renderMotd(motd.split('\n')[1] || '')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Config Presets */}
        <section className="bg-white/5 border border-white/5 rounded-3xl p-8 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Sliders size={20} />
            </div>
            <h4 className="font-bold text-white">Server Config Presets</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Extreme Survival', desc: 'Optimasi untuk survival vanilla dengan render distance luas.', icon: ShieldCheck, color: 'text-green-500' },
              { title: 'PvP Network', desc: 'Latency rendah, KB konsisten, dan TPS stabil.', icon: Zap, color: 'text-cyan-500' },
              { title: 'Lite Server', desc: 'Minimal RAM, cocok untuk server teman-teman kecil.', icon: Terminal, color: 'text-white' },
            ].map((preset, i) => (
              <div key={i} className="p-6 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                <preset.icon size={24} className={`${preset.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h5 className="font-bold text-white text-sm mb-2">{preset.title}</h5>
                <p className="text-[10px] text-white/30 leading-relaxed uppercase font-bold tracking-wider">{preset.desc}</p>
                <button className="mt-4 text-[10px] font-black text-cyan-400 group-hover:text-cyan-300 uppercase tracking-widest">Apply Preset</button>
              </div>
            ))}
          </div>
        </section>

        {/* Server.properties Helper */}
        <section className="bg-white/5 border border-white/5 rounded-3xl p-8 lg:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Sliders size={20} />
                </div>
                <h4 className="font-bold text-white">Interactive server.properties Helper</h4>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'View Distance', val: '10', desc: 'Total chunks rendered' },
                { label: 'Max Players', val: '20', desc: 'Simultaneous users' },
                { label: 'PvP Enabled', val: 'true', desc: 'Combat settings' },
                { label: 'Online Mode', val: 'true', desc: 'Mojang authentication' },
                { label: 'Difficulty', val: 'easy', desc: 'Survival difficulty' },
                { label: 'Flight', val: 'false', desc: 'Allow player flying' },
                { label: 'Spawn Protection', val: '16', desc: 'Radius of spawn prot' },
                { label: 'White-list', val: 'false', desc: 'Access control' },
              ].map((prop, i) => (
                <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5">
                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{prop.label}</p>
                   <div className="bg-white/5 px-3 py-2 rounded text-xs text-cyan-400 font-mono mb-2 border border-white/5">{prop.val}</div>
                   <p className="text-[9px] text-white/30 italic">{prop.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
