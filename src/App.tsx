import { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  MessageSquare, 
  Github, 
  ExternalLink, 
  Server, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Info,
  Menu,
  X,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, githubProvider, db } from './lib/firebase';
import { PAPER_DATA } from './constants';
import SanoChat from './components/SanoChat';
import PluginBrowser from './components/PluginBrowser';
import AdvancedTools from './components/AdvancedTools';
import About from './components/About';

export default function App() {
  const [activeTab, setActiveTab] = useState<'software' | 'plugins' | 'tools' | 'about'>('software');
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Sync user with Firestore
  const syncUserToFirestore = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, userData, { merge: true });
      }
    } catch (err) {
      console.error('Firestore sync error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        syncUserToFirestore(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (provider: 'google' | 'github') => {
    setAuthError(null);
    try {
      const targetProvider = provider === 'google' ? googleProvider : githubProvider;
      await signInWithPopup(auth, targetProvider);
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.code === 'auth/popup-blocked') {
        setAuthError('Popup diblokir oleh browser. Silakan izinkan popup untuk login.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Ignore user closing the popup
      } else {
        setAuthError('Gagal menyambungkan ke akun. Silakan coba lagi.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredVersions = PAPER_DATA.versions.filter(v => 
    v.version.toLowerCase().includes(search.toLowerCase())
  );

  const latestVersion = PAPER_DATA.versions.find(v => v.version === PAPER_DATA.latest) || PAPER_DATA.versions[0];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-dark-bg text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Sidebar: SanoChat AI (Left) */}
      <aside className="hidden lg:flex w-[380px] bg-dark-sidebar border-r border-white/5 flex-col overflow-hidden shrink-0">
        <SanoChat isSidebar user={user} />
      </aside>

      {/* Main Content (Right) */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scrollbar-thin">
        
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-black/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tighter text-white uppercase flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center lg:hidden">
                <Server size={18} className="text-white" />
              </div>
              <span className="hidden sm:inline">Sano PaperMC</span>
              <span className="sm:hidden">Sano PMC</span>
            </h1>
            <nav className="hidden md:flex gap-6 text-[10px] font-bold tracking-widest uppercase">
              <button 
                onClick={() => setActiveTab('software')}
                className={`${activeTab === 'software' ? 'text-cyan-400' : 'text-white/30'} hover:text-white transition-colors cursor-pointer`}
              >
                Software
              </button>
              <button 
                onClick={() => setActiveTab('plugins')}
                className={`${activeTab === 'plugins' ? 'text-cyan-400' : 'text-white/30'} hover:text-white transition-colors cursor-pointer`}
              >
                Plugins
              </button>
              <button 
                onClick={() => setActiveTab('tools')}
                className={`${activeTab === 'tools' ? 'text-cyan-400' : 'text-white/30'} hover:text-white transition-colors cursor-pointer`}
              >
                Advanced Tools
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`${activeTab === 'about' ? 'text-cyan-400' : 'text-white/30'} hover:text-white transition-colors cursor-pointer`}
              >
                About
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {authError && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[9px] font-bold text-red-400 uppercase tracking-widest animate-pulse">
                <AlertCircle size={10} />
                {authError}
              </div>
            )}
            
            {isAuthLoading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3 pr-2 border-r border-white/10 mr-2">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-white uppercase leading-none">{user.displayName || 'User'}</p>
                  <p className="text-[8px] text-cyan-400 uppercase tracking-widest font-bold mt-1">Authorized</p>
                </div>
                <div className="group relative">
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                    className="w-8 h-8 rounded-full border border-cyan-500/50 hover:scale-110 transition-transform cursor-pointer"
                    alt="Profile"
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-white/5 mb-2">
                      <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      <p className="text-[10px] text-white/40 uppercase mt-1">Sano Citizen</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-400 hover:bg-red-400/10 rounded-lg transition-colors uppercase tracking-widest group/out"
                    >
                      <LogOut size={14} className="group-hover/out:translate-x-0.5 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 pr-2 border-r border-white/10 mr-2">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase leading-none">Sync Cloud</p>
                  <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold mt-1 italic">Sign in to save</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleLogin('google')}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    title="Sign in with Google"
                  >
                    <LogIn size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleLogin('github')}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    title="Sign in with GitHub"
                  >
                    <Github size={16} className="text-white group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )}
            <div className="hidden sm:block text-[10px] text-white/20 tracking-[0.2em] font-mono">SYS.VER: 4.2.0-SANO</div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:hidden fixed inset-0 top-16 bg-dark-bg z-20 flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex gap-4 overflow-x-auto bg-black/40">
                {['software', 'plugins', 'tools', 'about'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${activeTab === tab ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto">
                <SanoChat isSidebar user={user} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-12">
          {activeTab === 'software' && (
            <>
              {/* Hero / Featured Download */}
              <section>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-900 px-8 py-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 group"
                >
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-[0.15em] mb-6 inline-block backdrop-blur-md">
                      Latest Stable Release
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tighter">
                      Paper {latestVersion.version}
                    </h2>
                    <p className="text-white/80 text-base md:text-lg max-w-md mb-8 leading-relaxed">
                      Versi terbaru dengan perbaikan keamanan kritis dan optimasi performa mesin game Minecraft.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <a 
                        href={latestVersion.url}
                        className="bg-white text-black px-8 py-4 rounded-xl font-bold shadow-2xl hover:bg-slate-100 flex items-center gap-3 group/btn transform active:scale-95 transition-all text-sm tracking-tight"
                      >
                        UNDUH SEKARANG
                        <Download size={18} className="group-hover/btn:translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                  <div className="relative z-10 shrink-0">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-700">
                      <Server size={80} className="text-white/20 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-700" />
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Version List */}
              <section className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Archive Repository</h4>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Software Versions</h3>
                  </div>
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-500 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Saring versi..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all w-full sm:w-48"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {filteredVersions.slice(0, 15).map((v, idx) => (
                    <motion.div key={v.version} className="version-row group/row">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center font-mono text-[10px] font-bold text-white/40 group-hover/row:text-cyan-400">
                          {v.version.split('.').slice(0, 2).join('.')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Paper-{v.version}</p>
                          <p className="text-[10px] text-white/30 uppercase tracking-tighter">Verified Build • SHA-256 Confirmed</p>
                        </div>
                      </div>
                      <a href={v.url} className="px-5 py-2.5 bg-white/5 group-hover/row:bg-cyan-500 group-hover/row:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Download</a>
                    </motion.div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'plugins' && <PluginBrowser />}
          {activeTab === 'tools' && <AdvancedTools />}
          {activeTab === 'about' && <About />}
        </div>


        {/* Footer Info */}
        <footer className="mt-auto p-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-[0.25em] font-bold bg-black/40">
          <p>© 2026 Sano Digital. Not affiliated with Mojang AB or PaperMC.</p>
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Network: Latency 14ms</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors uppercase tracking-widest cursor-pointer">About Project</button>
              <a href="https://bit.ly/SANOP" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Sanopalz</a>
              <a href="#" className="hover:text-white transition-colors">Safety</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Chat Button (Mobile/Tablet or when Sidebar is hidden) */}
      <button 
        onClick={() => setIsFloatingChatOpen(true)}
        className={`fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-cyan-500 text-black shadow-2xl shadow-cyan-500/20 flex items-center justify-center lg:hidden hover:scale-110 active:scale-95 transition-all z-40 ${isFloatingChatOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Floating Chat Modal */}
      <SanoChat 
        isOpen={isFloatingChatOpen} 
        onClose={() => setIsFloatingChatOpen(false)} 
        user={user}
      />
    </div>
  );
}


