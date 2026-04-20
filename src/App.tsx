import React, { useState } from 'react';
import { Download, Search, Server, Sparkles, Terminal, Box, Moon, Sun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Data versi PaperMC dari Sano
const paperData = {
  "latest": "1.21.11",
  "versions": {
    "1.21.11": "https://fill-data.papermc.io/v1/objects/e708e8c132dc143ffd73528cccb9532e2eb17628b1a0eee74469bf466c7003f8/paper-1.21.11-116.jar",
    "1.21.11-rc3": "https://fill-data.papermc.io/v1/objects/213ceae4eb2268fc110a8605c00597ab56fe733ec41a59d06689de178bbec3f9/paper-1.21.11-rc3-31.jar",
    "1.21.11-rc2": "https://fill-data.papermc.io/v1/objects/417e9e6fb7cd34245c6a2a5ad4479eea018dc373fe36e74a6224b3652c784723/paper-1.21.11-rc2-29.jar",
    "1.21.11-rc1": "https://fill-data.papermc.io/v1/objects/bfd57d33c550fa70a493fc00f30eac275dc4a71fa7f8eaa990ca240ef7024f02/paper-1.21.11-rc1-19.jar",
    "1.21.11-pre5": "https://fill-data.papermc.io/v1/objects/b9d820240254e2a2e2f98093d9624cbcb772c441ecdac93e9fb9a10da4ecbff7/paper-1.21.11-pre5-16.jar",
    "1.21.11-pre4": "https://fill-data.papermc.io/v1/objects/160ade98b0e697537d47335f9bb8b7c74f4d0b1d9f18f6ad6aba0549d42dd98f/paper-1.21.11-pre4-13.jar",
    "1.21.11-pre3": "https://fill-data.papermc.io/v1/objects/5f7079d6ec5862bc03195012eea2f6e0b3cba6922e7cefa0ac660ebf279decda/paper-1.21.11-pre3-6.jar",
    "1.21.10": "https://fill-data.papermc.io/v1/objects/158703f75a26f842ea656b3dc6d75bf3d1ec176b97a2c36384d0b80b3871af53/paper-1.21.10-130.jar",
    "1.21.9": "https://fill-data.papermc.io/v1/objects/aec002e77c7566e49494fdf05430b96078ffd1d7430e652d4f338fef951e7a10/paper-1.21.9-59.jar",
    "1.21.9-rc1": "https://fill-data.papermc.io/v1/objects/f737c4ce0afd8ca897c5330188634859148419c6c2d2e172c65f581c47430ab1/paper-1.21.9-rc1-36.jar",
    "1.21.9-pre4": "https://fill-data.papermc.io/v1/objects/59f2df043a9b186243439398c0dd8ed876e8eacd995f3f667a86406a699b1a27/paper-1.21.9-pre4-22.jar",
    "1.21.9-pre3": "https://fill-data.papermc.io/v1/objects/b823c6ff6a11ccbab475bf4e5786ee271fea406331e27d0581387765ccc16bc8/paper-1.21.9-pre3-12.jar",
    "1.21.9-pre2": "https://fill-data.papermc.io/v1/objects/f24f81421449bbcf125be5501223bf9faa9a3ef2006b16988be25601c015757e/paper-1.21.9-pre2-7.jar",
    "1.21.8": "https://fill-data.papermc.io/v1/objects/8de7c52c3b02403503d16fac58003f1efef7dd7a0256786843927fa92ee57f1e/paper-1.21.8-60.jar",
    "1.21.7": "https://fill-data.papermc.io/v1/objects/83838188699cb2837e55b890fb1a1d39ad0710285ed633fbf9fc14e9f47ce078/paper-1.21.7-32.jar",
    "1.21.6": "https://fill-data.papermc.io/v1/objects/35e2dfa66b3491b9d2f0bb033679fa5aca1e1fdf097e7a06a80ce8afeda5c214/paper-1.21.6-48.jar",
    "1.21.5": "https://fill-data.papermc.io/v1/objects/2ae6ae22adf417699746e0f89fc2ef6cb6ee050a5f6608cee58f0535d60b509e/paper-1.21.5-114.jar",
    "1.21.4": "https://fill-data.papermc.io/v1/objects/5ee4f542f628a14c644410b08c94ea42e772ef4d29fe92973636b6813d4eaffc/paper-1.21.4-232.jar",
    "1.21.3": "https://fill-data.papermc.io/v1/objects/87e973e1d338e869e7fdbc4b8fadc1579d7bb0246a0e0cf6e5700ace6c8bc17e/paper-1.21.3-83.jar",
    "1.21.1": "https://fill-data.papermc.io/v1/objects/39bd8c00b9e18de91dcabd3cc3dcfa5328685a53b7187a2f63280c22e2d287b9/paper-1.21.1-133.jar",
    "1.21": "https://fill-data.papermc.io/v1/objects/ab9bb1afc3cea6978a0c03ce8448aa654fe8a9c4dddf341e7cbda1b0edaa73f5/paper-1.21-130.jar",
    "1.20.6": "https://fill-data.papermc.io/v1/objects/4b011f5adb5f6c72007686a223174fce82f31aeb4b34faf4652abc840b47e640/paper-1.20.6-151.jar",
    "1.20.5": "https://fill-data.papermc.io/v1/objects/3cd7da2f8df92e082a501a39c674aab3c0343edd179b86f5baccaebfc9974132/paper-1.20.5-22.jar",
    "1.20.4": "https://fill-data.papermc.io/v1/objects/cabed3ae77cf55deba7c7d8722bc9cfd5e991201c211665f9265616d9fe5c77b/paper-1.20.4-499.jar",
    "1.20.2": "https://fill-data.papermc.io/v1/objects/ba340a835ac40b8563aa7eda1cd6479a11a7623409c89a2c35cd9d7490ed17a7/paper-1.20.2-318.jar",
    "1.20.1": "https://fill-data.papermc.io/v1/objects/234a9b32098100c6fc116664d64e36ccdb58b5b649af0f80bcccb08b0255eaea/paper-1.20.1-196.jar",
    "1.20": "https://fill-data.papermc.io/v1/objects/1e4ccfc0599f491ee6fee4455d3722332ac5d78584fccd55cbb3b51e11504505/paper-1.20-17.jar",
    "1.19.4": "https://fill-data.papermc.io/v1/objects/e587d78cba3e99ef8c4bc24cf20cc3bdbbe89e33b0b572070446af4eb6be5ccf/paper-1.19.4-550.jar",
    "1.19.3": "https://fill-data.papermc.io/v1/objects/3007f2c638d5f04ed32b6adaa33053fe3634ccfa74345c83d3ea4982d38db5dc/paper-1.19.3-448.jar",
    "1.19.2": "https://fill-data.papermc.io/v1/objects/2eb5c7459ec94bcdc597ed711d549a3ab4b0fda13e412a0792a1a069b5903864/paper-1.19.2-307.jar",
    "1.19.1": "https://fill-data.papermc.io/v1/objects/5afe23a1fade92c547124fa874bc7d908fa676f49f09879fa876224b62e9d51b/paper-1.19.1-111.jar",
    "1.19": "https://fill-data.papermc.io/v1/objects/0d39cacc51a77b2b071e1ce862fcbf0b4a4bd668cc7e8b313598d84fa09fabac/paper-1.19-81.jar",
    "1.18.2": "https://fill-data.papermc.io/v1/objects/0578f18f4d632b494b468ec56b3b414b5b56fea087ee7d39cf6dcdf4c9d01f05/paper-1.18.2-388.jar",
    "1.18.1": "https://fill-data.papermc.io/v1/objects/a94917a4472c2cbc9907a15c666bbb784f95ecd7b53c77bc08fe71103e5487f5/paper-1.18.1-216.jar",
    "1.18": "https://fill-data.papermc.io/v1/objects/3c995f20dae4e4e21d5554fac957a0a8a5c85bd5bf34915fac4b4f16e0ef101b/paper-1.18-66.jar",
    "1.17.1": "https://fill-data.papermc.io/v1/objects/6cc1ee2f94253ce10b5374ed85fffc735a97d8f1b64db293683dfa24dd3cc05f/paper-1.17.1-411.jar",
    "1.17": "https://fill-data.papermc.io/v1/objects/760a93b94a58d619bd647d71af84688617d0444d22b716500bc6b343858dc871/paper-1.17-79.jar",
    "1.16.5": "https://fill-data.papermc.io/v1/objects/e67da4851d08cde378ab2b89be58849238c303351ed2482181a99c2c2b489276/paper-1.16.5-794.jar",
    "1.16.4": "https://fill-data.papermc.io/v1/objects/963268ed564ac7d2ec076463e921ffa09570235f587bbd1a4d91a23ca4264b66/paper-1.16.4-416.jar",
    "1.16.3": "https://fill-data.papermc.io/v1/objects/940303ee5f5bcc08377e388ea1c1daa109c1ac8c4d189dc67de1106853f2fc23/paper-1.16.3-253.jar",
    "1.16.2": "https://fill-data.papermc.io/v1/objects/e5e10517daaa9bd6d54a8a0d22d866e31da7c1b47cb9e425ffaac236fde75ec9/paper-1.16.2-189.jar",
    "1.16.1": "https://fill-data.papermc.io/v1/objects/929559ba1dfc6de2904e17289fb3d1ac95f0ab48c7540cf5b8c2f055fea9d59c/paper-1.16.1-138.jar",
    "1.15.2": "https://fill-data.papermc.io/v1/objects/bd2dd6f2cc489cf9e2bb800cb4fb6d63e9d293945d3ac10b09dd9c6098fa9f34/paper-1.15.2-393.jar",
    "1.15.1": "https://fill-data.papermc.io/v1/objects/22a7a19f378db8edf92cdba57d91ceea7e4fa6470b677e6bbe57e8f7e1d9a4dd/paper-1.15.1-62.jar",
    "1.15": "https://fill-data.papermc.io/v1/objects/8b726c0deb6c3a265d679a3d3a2c0f8e5243fbc6ddcfcaf42e24209cb1f829b4/paper-1.15-21.jar",
    "1.14.4": "https://fill-data.papermc.io/v1/objects/bd8ec5cdb22370d37816a6de26798df3d2b0d6f9c7c96c88ca45a1303fea50e8/paper-1.14.4-245.jar",
    "1.14.3": "https://fill-data.papermc.io/v1/objects/b6d2d8ac67d685141697a8cecd99c47baf604900007eb0e270fd6ea86cbbc540/paper-1.14.3-134.jar",
    "1.14.2": "https://fill-data.papermc.io/v1/objects/12034e578e014eb369e2929f3725bd409858bf94128e46d1f286d5be36c3cb0e/paper-1.14.2-107.jar",
    "1.14.1": "https://fill-data.papermc.io/v1/objects/2bcf8017485cc41b3e72daa7285a46f26a85d055b9d638bc9a07f77632168ad7/paper-1.14.1-50.jar",
    "1.14": "https://fill-data.papermc.io/v1/objects/338be77f5239c44cff3f80f5c107b5e61ac48fb39348bce7249303209201072a/paper-1.14-17.jar",
    "1.13.2": "https://fill-data.papermc.io/v1/objects/11e828d0565ab76a0a0e180c056364a95de44958cfd6a6af3f9b1dc70b03e9cd/paper-1.13.2-657.jar",
    "1.13.1": "https://fill-data.papermc.io/v1/objects/6637401d87d0f5db5aaee90d7103f52c5e1baaf6b6d4643a5793e7b02b5775cb/paper-1.13.1-386.jar",
    "1.13": "https://fill-data.papermc.io/v1/objects/00db82d214242c9345266d44ff8d11a8e857a1a02edf7cb5fcc2d1d973283129/paper-1.13-173.jar",
    "1.13-pre7": "https://fill-data.papermc.io/v1/objects/8c2c4dbc3a2842be8454b4c4b306266bc622e2db681233558fedf8230800940c/paper-1.13-pre7-12.jar",
    "1.12.2": "https://fill-data.papermc.io/v1/objects/3a2041807f492dcdc34ebb324a287414946e3e05ec3df6fd03f5b5f7d9afc210/paper-1.12.2-1620.jar",
    "1.12.1": "https://fill-data.papermc.io/v1/objects/dba2219d674ad85e4ef2c41931d34b6fa4be75a887973ecaaf286727a03812da/paper-1.12.1-1204.jar",
    "1.12": "https://fill-data.papermc.io/v1/objects/1e7e88a2ed6f2b70fa3f6ec6611373458c5d72b2a8707e60921df601c791e60e/paper-1.12-1169.jar",
    "1.11.2": "https://fill-data.papermc.io/v1/objects/3d0f40ec1f9630dfdbafa626cc20c266d7fb90fc22583dc1b995e7fbfb76830d/paper-1.11.2-1106.jar",
    "1.10.2": "https://fill-data.papermc.io/v1/objects/83354d24a22b6265e76c089b3d17a568abb446c0ccd12c2452f5e148412b16c2/paper-1.10.2-918.jar",
    "1.9.4": "https://fill-data.papermc.io/v1/objects/15a5821ddeacc596432c3fbf24262a2d264f556060ecd6f1838fb01ab5629a81/paper-1.9.4-775.jar",
    "1.8.8": "https://fill-data.papermc.io/v1/objects/7ff6d2cec671ef0d95b3723b5c92890118fb882d73b7f8fa0a2cd31d97c55f86/paper-1.8.8-445.jar",
    "1.7.10": "https://fill-data.papermc.io/v1/objects/33772078d92e9dbb027602da016524ef29af5b4c12eaddac1fe2465b01108185/paper-1.7.10-2025.jar"
  }
};

// Data Bahasa (Translate)
const translations: Record<string, any> = {
  id: {
    subtitle: "Download server.jar instan",
    latestBadge: "Versi Paling Baru",
    heroDesc: "Dapatkan file server.jar untuk versi terbaru Minecraft. Performa optimal, tinggal download dan jalankan.",
    download: "Download",
    allVersions: "Semua Versi",
    searchPlaceholder: "Cari versi (contoh: 1.20, 1.8.8)...",
    latest: "Terbaru",
    notFound: "Versi tidak ditemukan",
    notFoundDesc: "Coba gunakan kata kunci pencarian yang lain.",
    footer: "Download file dengan mudah, cuman klik doang."
  },
  en: {
    subtitle: "Instant server.jar downloads",
    latestBadge: "Latest Version",
    heroDesc: "Get the server.jar file for the latest Minecraft version. Optimal performance, just download and run.",
    download: "Download",
    allVersions: "All Versions",
    searchPlaceholder: "Search version (e.g., 1.20, 1.8.8)...",
    latest: "Latest",
    notFound: "Version not found",
    notFoundDesc: "Try using different search keywords.",
    footer: "Download files easily, just one click away."
  }
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('id');
  
  const t = translations[lang];

  // Mengubah object menjadi array
  const allVersions = Object.entries(paperData.versions).map(([version, url]) => ({
    version,
    url
  }));

  // Setup versi terbaru
  const latestVersion = paperData.latest;
  const latestUrl = paperData.versions[latestVersion as keyof typeof paperData.versions];

  // Filter pencarian
  const filteredVersions = allVersions.filter(v => 
    v.version.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        .theme-transition {
          transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                      color 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .editorial-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .editorial-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
      `}</style>

      <div className={`min-h-screen font-sans theme-transition ${isDark ? 'bg-paper text-ink selection:bg-accent/30' : 'bg-slate-50 text-slate-800'}`}>
        
        {/* Navbar */}
        <nav className={`sticky top-0 z-50 border-b backdrop-blur-md theme-transition ${isDark ? 'border-border-subtle bg-paper/80' : 'border-slate-200 bg-white/80'}`}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
            
            {/* Logo */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2 text-accent">
                <span className={`text-xl lg:text-2xl font-black tracking-tighter uppercase ${isDark ? 'text-ink' : 'text-slate-900'}`}>
                  Sano PaperMC
                </span>
              </div>
              <div className={`text-[10px] lg:text-[11px] uppercase tracking-[3px] font-bold opacity-40 hidden md:block ${isDark ? 'text-ink' : 'text-slate-500'}`}>
                {t.subtitle}
              </div>
            </motion.div>

            {/* Controls (Lang & Theme) */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4 lg:gap-6"
            >
              {/* Language Toggle */}
              <button 
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                className={`px-3 py-1 rounded-full text-[10px] lg:text-[11px] font-bold uppercase tracking-widest border transition-all active:scale-90 cursor-pointer ${isDark ? 'border-border-subtle text-ink hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                title="Toggle Language"
              >
                {lang}
              </button>

              {/* Theme Slider Toggle */}
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-500 flex items-center px-1 cursor-pointer focus:outline-none ${isDark ? 'bg-accent' : 'bg-slate-300'}`}
                aria-label="Toggle Theme"
              >
                <motion.div 
                  layout
                  className={`w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm ${isDark ? 'ml-auto' : 'mr-auto'}`}
                >
                  {isDark ? <Moon className="w-2.5 h-2.5 text-accent" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
                </motion.div>
              </button>
            </motion.div>

          </div>
        </nav>

        <main className={`max-w-[1440px] mx-auto border-x min-h-[calc(100vh-80px)] editorial-grid theme-transition ${isDark ? 'border-border-subtle' : 'border-slate-200'}`}>
          
          {/* Hero Section */}
          <section id="hero" className={`p-8 lg:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r overflow-hidden theme-transition ${isDark ? 'border-border-subtle' : 'border-slate-200'}`}>
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-[10px] lg:text-xs font-bold uppercase tracking-[4px] mb-6 lg:mb-8 block ${isDark ? 'text-accent' : 'text-blue-600'}`}
              >
                {t.latestBadge}
              </motion.span>
              <h1 className={`text-[80px] sm:text-[120px] lg:text-[160px] font-black font-serif leading-[0.85] mb-6 lg:mb-8 tracking-tighter ${isDark ? 'text-ink' : 'text-slate-900'}`}>
                {latestVersion}
              </h1>
              <p className={`text-lg lg:text-2xl leading-relaxed max-w-lg mb-10 lg:mb-12 opacity-70 ${isDark ? 'text-ink' : 'text-slate-600'}`}>
                {t.heroDesc}
              </p>
              
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={latestUrl}
                download={`paper-${latestVersion}.jar`}
                className={`inline-flex items-center gap-4 px-8 lg:px-10 py-4 lg:py-5 bg-accent text-white font-bold uppercase tracking-widest transition-all hover:brightness-110 ${isDark ? '' : 'shadow-xl shadow-blue-500/20'}`}
              >
                <Download className="w-5 h-5" />
                {t.download} {latestUrl ? 'server.jar' : latestVersion}
              </motion.a>
            </motion.div>
          </section>

          {/* Archive / Versions Section */}
          <section id="versions" className="p-8 lg:p-14 flex flex-col">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-end justify-between mb-10 pb-4 border-b-2 border-current theme-transition"
            >
              <h2 className="text-2xl lg:text-3xl font-serif italic font-bold">
                {t.allVersions}
              </h2>
              <span className="text-[10px] lg:text-[11px] uppercase tracking-widest opacity-60">
                Paper Archive
              </span>
            </motion.div>

            {/* Search Box */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative mb-8 group"
            >
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-40">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-4 text-[10px] lg:text-xs font-bold uppercase tracking-widest border transition-all focus:outline-none focus:border-accent ${isDark ? 'bg-white/5 border-border-subtle text-ink' : 'bg-white border-slate-200 text-slate-800'}`}
              />
            </motion.div>

            <motion.div 
              layout
              className={`flex flex-col gap-0 border-t theme-transition ${isDark ? 'border-border-subtle' : 'border-slate-200'}`}
            >
              <AnimatePresence mode="popLayout">
                {filteredVersions.length > 0 ? (
                  filteredVersions.map(({ version, url }, index) => (
                    <motion.div 
                      key={version} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index < 10 ? index * 0.05 : 0 }}
                      className={`group transition-all duration-300 py-4 lg:py-5 border-b hover:pl-4 lg:hover:pl-6 cursor-pointer flex items-center justify-between theme-transition ${isDark ? 'border-border-subtle hover:text-accent' : 'border-slate-200 hover:text-blue-600'}`}
                    >
                      <div className="flex items-center gap-4 lg:gap-6">
                        <span className="text-lg lg:text-xl font-serif font-bold tracking-tight">
                          {version}
                        </span>
                        <span className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest opacity-40">
                          {version === latestVersion ? t.latest : 'Build Jar'}
                        </span>
                      </div>
                      
                      <motion.a 
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        href={url}
                        download={`paper-${version}.jar`}
                        className="p-2 opacity-40 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-5 h-5" />
                      </motion.a>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center opacity-40"
                  >
                    <Search className="w-10 h-10 mx-auto mb-4" />
                    <p className="text-sm uppercase tracking-widest">{t.notFound}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 lg:mt-auto pt-10 text-[10px] uppercase tracking-[5px] opacity-40 text-center lg:text-right"
            >
              Sano Production &middot; {new Date().getFullYear()}
            </motion.div>
          </section>

        </main>

        <footer className={`border-t theme-transition ${isDark ? 'border-border-subtle' : 'border-slate-200'}`}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest opacity-40">
            <p>&copy; {new Date().getFullYear()} Sano PaperMC</p>
            <p className="text-center md:text-right">{t.footer}</p>
          </div>
        </footer>

      </div>
    </>
  );
}
