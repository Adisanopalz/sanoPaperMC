import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Package, 
  Star, 
  AlertCircle, 
  Loader2, 
  X, 
  History, 
  Layers, 
  Calendar,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface PluginProject {
  id: string;
  source: 'modrinth' | 'hangar';
  title: string;
  description: string;
  icon_url: string;
  downloads: number;
  slug: string;
  author: string;
  owner?: string; // Specific to Hangar
}

interface VersionData {
  version_number: string;
  changelog?: string;
  date_published: string;
  files: { url: string; filename: string }[];
  dependencies?: { project_id?: string; dependency_type: string; version_id?: string }[];
}

interface PluginDetails extends PluginProject {
  body?: string;
  categories?: string[];
  versions: VersionData[];
  dependencies_names?: string[];
}

export default function PluginBrowser() {
  const [query, setQuery] = useState('');
  const [activeSource, setActiveSource] = useState<'modrinth' | 'hangar'>('modrinth');
  const [results, setResults] = useState<PluginProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'downloads' | 'newest' | 'updated'>('relevance');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadStatus, setDownloadStatus] = useState<Record<string, 'success' | 'error' | 'idle'>>({});
  
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const limit = 12;

  const [selectedPlugin, setSelectedPlugin] = useState<PluginProject | null>(null);
  const [pluginDetails, setPluginDetails] = useState<PluginDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const fetchPluginDetails = async (plugin: PluginProject) => {
    setIsDetailsLoading(true);
    setSelectedPlugin(plugin);
    setPluginDetails(null);
    try {
      if (plugin.source === 'modrinth') {
        const [projectRes, versionsRes] = await Promise.all([
          fetch(`https://api.modrinth.com/v2/project/${plugin.id}`),
          fetch(`https://api.modrinth.com/v2/project/${plugin.id}/version`)
        ]);
        const projectData = await projectRes.json();
        const versionsData = await versionsRes.json();

        setPluginDetails({
          ...plugin,
          body: projectData.body,
          categories: projectData.categories,
          versions: versionsData.map((v: any) => ({
            version_number: v.version_number,
            changelog: v.changelog,
            date_published: v.date_published,
            files: v.files.map((f: any) => ({ url: f.url, filename: f.filename })),
            dependencies: v.dependencies
          }))
        });
      } else {
        const [projectRes, versionsRes] = await Promise.all([
          fetch(`https://hangar.papermc.io/api/v1/projects/${plugin.owner}/${plugin.slug}`),
          fetch(`https://hangar.papermc.io/api/v1/projects/${plugin.owner}/${plugin.slug}/versions?limit=10`)
        ]);
        const projectData = await projectRes.json();
        const versionsData = await versionsRes.json();

        setPluginDetails({
          ...plugin,
          body: projectData.description,
          versions: versionsData.result.map((v: any) => ({
            version_number: v.name,
            changelog: v.description,
            date_published: v.createdAt,
            files: [], // Hangar download is different
            dependencies: v.dependencies?.map((d: any) => ({ project_id: d.name, dependency_type: d.required ? 'required' : 'optional' }))
          }))
        });
      }
    } catch (err) {
      console.error("Failed to fetch details:", err);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const searchPlugins = async (val: string, source: 'modrinth' | 'hangar', sort: string, pageNum: number) => {
    setLoading(true);
    setError(null);
    const offset = (pageNum - 1) * limit;
    try {
      if (source === 'modrinth') {
        const modrinthSort = sort === 'relevance' ? 'relevance' : sort;
        const response = await fetch(`https://api.modrinth.com/v2/search?query=${encodeURIComponent(val)}&facets=[["categories:paper"],["project_type:mod"]]&index=${modrinthSort}&offset=${offset}&limit=${limit}`);
        const data = await response.json();
        setTotalResults(data.total_hits || 0);
        const mappedResults: PluginProject[] = data.hits.map((hit: any) => ({
          id: hit.project_id,
          source: 'modrinth',
          title: hit.title,
          description: hit.description,
          icon_url: hit.icon_url,
          downloads: hit.downloads,
          slug: hit.slug,
          author: hit.author,
        }));
        setResults(mappedResults);
      } else {
        // Hangar Search API mapping for sort
        let hangarSort = 'relevance';
        if (sort === 'downloads') hangarSort = 'downloads';
        if (sort === 'newest') hangarSort = 'newest';
        if (sort === 'updated') hangarSort = 'updated';

        const response = await fetch(`https://hangar.papermc.io/api/v1/projects?q=${encodeURIComponent(val)}&sort=${hangarSort}&offset=${offset}&limit=${limit}`);
        const data = await response.json();
        setTotalResults(data.pagination?.count || 0);
        const mappedResults: PluginProject[] = (data.result || []).map((hit: any) => ({
          id: hit.namespace.slug,
          source: 'hangar',
          title: hit.name,
          description: hit.description,
          icon_url: hit.avatarUrl,
          downloads: hit.stats.downloads,
          slug: hit.namespace.slug,
          author: hit.namespace.owner,
          owner: hit.namespace.owner,
        }));
        setResults(mappedResults);
      }
    } catch (err) {
      setError(`Koneksi ke repository (${source === 'modrinth' ? 'Modrinth' : 'Hangar'}) terputus.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [query, activeSource, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlugins(query, activeSource, sortBy, page);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, activeSource, sortBy, page]);

  const handleDownload = async (plugin: PluginProject) => {
    setDownloadingId(plugin.id);
    setDownloadProgress(prev => ({ ...prev, [plugin.id]: 0 }));
    setDownloadStatus(prev => ({ ...prev, [plugin.id]: 'idle' }));
    
    try {
      let downloadUrl = '';
      let filename = `${plugin.slug}.jar`;

      if (plugin.source === 'modrinth') {
        const versionRes = await fetch(`https://api.modrinth.com/v2/project/${plugin.id}/version?limit=1`);
        const versions = await versionRes.json();
        if (versions.length > 0) {
          const file = versions[0].files[0];
          downloadUrl = file.url;
          filename = file.filename;
        }
      } else {
        const versionRes = await fetch(`https://hangar.papermc.io/api/v1/projects/${plugin.owner}/${plugin.slug}/versions?limit=1`);
        const data = await versionRes.json();
        if (data.result && data.result.length > 0) {
          const version = data.result[0].name;
          downloadUrl = `https://hangar.papermc.io/api/v1/projects/${plugin.owner}/${plugin.slug}/versions/${version}/download`;
        }
      }

      if (downloadUrl) {
        setDownloadStatus(prev => ({ ...prev, [plugin.id]: 'idle' }));
        
        // Use Fetch to track progress
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Response body is null');

        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          loaded += value.length;
          
          if (total > 0) {
            setDownloadProgress(prev => ({ ...prev, [plugin.id]: Math.round((loaded / total) * 100) }));
          } else {
            // Fake progress if content-length is missing
            setDownloadProgress(prev => ({ ...prev, [plugin.id]: Math.min(prev[plugin.id] + 5, 95) }));
          }
        }

        const blob = new Blob(chunks);
        const url = window.URL.createObjectURL(blob);
        const link = document.body.appendChild(document.createElement('a'));
        link.href = url;
        link.download = filename;
        link.click();
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);

        setDownloadProgress(prev => ({ ...prev, [plugin.id]: 100 }));
        setDownloadStatus(prev => ({ ...prev, [plugin.id]: 'success' }));
        setTimeout(() => {
          setDownloadStatus(prev => ({ ...prev, [plugin.id]: 'idle' }));
          setDownloadProgress(prev => {
            const next = { ...prev };
            delete next[plugin.id];
            return next;
          });
        }, 3000);
      } else {
        throw new Error('No download URL');
      }
    } catch (err) {
      console.error('Download error:', err);
      setDownloadStatus(prev => ({ ...prev, [plugin.id]: 'error' }));
      setTimeout(() => setDownloadStatus(prev => ({ ...prev, [plugin.id]: 'idle' })), 3000);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Global Repository Integration</h4>
          <h3 className="text-3xl font-bold text-white tracking-tight">Plugin Archive</h3>
          <p className="text-white/30 text-xs mt-2 max-w-md">Menghubungkan Anda langsung ke ribuan plugin di Modrinth & Hangar tanpa harus meninggalkan dashboard.</p>
        </div>
        
        <div className="w-full md:w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={`Cari di ${activeSource === 'modrinth' ? 'Modrinth' : 'Hangar'}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
          />
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveSource('modrinth')}
            className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeSource === 'modrinth' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            Modrinth
          </button>
          <button 
            onClick={() => setActiveSource('hangar')}
            className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeSource === 'hangar' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            Hangar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mr-2">Sort By</span>
          {(['relevance', 'downloads', 'newest', 'updated'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter transition-all ${sortBy === s ? 'text-cyan-400 border border-cyan-400/30' : 'text-white/20 hover:text-white/40'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 h-48 animate-pulse" />
            ))
          ) : results.length > 0 ? (
            results.map((plugin, idx) => (
              <motion.div
                key={`${plugin.source}-${plugin.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => fetchPluginDetails(plugin)}
                className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 group/card transition-all flex flex-col relative overflow-hidden cursor-pointer"
              >
                <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-500/5 blur-3xl pointer-events-none group-hover/card:bg-cyan-500/10 transition-colors" />
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-black border border-white/10 overflow-hidden shadow-2xl flex-shrink-0">
                    <img 
                      src={plugin.icon_url || `https://picsum.photos/seed/${plugin.slug}/64/64`} 
                      alt={plugin.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${plugin.slug}/64/64`;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover/card:text-cyan-400 transition-colors">{plugin.title}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">BY {plugin.author}</p>
                  </div>
                </div>

                <p className="text-xs text-white/50 line-clamp-2 mb-6 flex-1 leading-relaxed">
                  {plugin.description}
                </p>

                {/* Progress Bar Container */}
                <AnimatePresence>
                  {downloadProgress[plugin.id] !== undefined && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">
                          {downloadStatus[plugin.id] === 'success' ? 'Download Complete' : 
                           downloadStatus[plugin.id] === 'error' ? 'Download Failed' : 
                           `Downloading JAR... ${downloadProgress[plugin.id]}%`}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${downloadProgress[plugin.id]}%`,
                            backgroundColor: downloadStatus[plugin.id] === 'success' ? '#22c55e' : 
                                            downloadStatus[plugin.id] === 'error' ? '#ef4444' : '#06b6d4'
                          }}
                          className="h-full transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/30">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-cyan-500/50" />
                      {plugin.downloads.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 uppercase tracking-tighter">
                      <Package size={12} />
                      {plugin.source}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a 
                      href={plugin.source === 'modrinth' ? `https://modrinth.com/mod/${plugin.slug}` : `https://hangar.papermc.io/${plugin.owner}/${plugin.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 text-white/20 hover:text-white rounded-lg transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button 
                      onClick={() => handleDownload(plugin)}
                      disabled={downloadingId !== null}
                      className="px-4 py-2 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {downloadingId === plugin.id ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Wait..
                        </>
                      ) : (
                        <>
                          <Download size={12} />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center">
               <AlertCircle size={40} className="mx-auto mb-4 text-white/20" />
               <p className="text-white/40 uppercase font-black text-xs tracking-widest">Data tidak ditemukan</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {results.length > 0 && !loading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-white/5">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalResults)} of {totalResults.toLocaleString()} results
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === 1}
              className="px-6 py-2 bg-white/5 text-white/40 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-black">
              {page}
            </div>
            <button
              onClick={() => {
                setPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page * limit >= totalResults}
              className="px-6 py-2 bg-white/5 text-white/40 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Plugin Details Modal */}
      <AnimatePresence>
        {selectedPlugin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
              onClick={() => setSelectedPlugin(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-full bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden shadow-xl">
                    <img src={selectedPlugin.icon_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{selectedPlugin.title}</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">BY {selectedPlugin.author} • {selectedPlugin.source.toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPlugin(null)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8 space-y-10">
                {isDetailsLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-cyan-500" size={32} />
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Loading technical data...</p>
                  </div>
                ) : pluginDetails ? (
                  <>
                    {/* Overview */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60">
                        <Package size={14} />
                        Overview
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/5">
                        <Markdown>{pluginDetails.body || pluginDetails.description}</Markdown>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Version History */}
                      <section className="space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60">
                          <History size={14} />
                          Version History
                        </div>
                        <div className="space-y-3">
                          {pluginDetails.versions.slice(0, 5).map((v, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 group/ver">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-white">{v.version_number}</span>
                                <span className="text-[9px] text-white/30 font-mono">
                                  {new Date(v.date_published).toLocaleDateString()}
                                </span>
                              </div>
                              {v.changelog && (
                                <div className="text-[10px] text-white/40 line-clamp-2 italic mb-2">
                                  {v.changelog.replace(/<[^>]*>?/gm, '')}
                                </div>
                              )}
                              <a 
                                href={v.files[0]?.url || '#'} 
                                className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest hover:text-cyan-300 flex items-center gap-1"
                              >
                                {v.files[0] ? 'Download JAR' : 'View on Store'} <ExternalLink size={10} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Dependencies & Metadata */}
                      <section className="space-y-8">
                        <div className="space-y-6">
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60">
                            <Layers size={14} />
                            Dependencies
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {pluginDetails.versions[0]?.dependencies && pluginDetails.versions[0].dependencies.length > 0 ? (
                              pluginDetails.versions[0].dependencies.map((dep, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/60 border border-white/5">
                                  {dep.project_id || 'Unknown Dependency'} 
                                  <span className="ml-2 text-[8px] text-cyan-500/50">{dep.dependency_type}</span>
                                </span>
                              ))
                            ) : (
                              <p className="text-xs text-white/20 italic">No external dependencies required.</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60">
                            <Star size={14} />
                            Statistics
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Total Downloads</p>
                              <p className="text-xl font-black text-white">{pluginDetails.downloads.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                              <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Platform</p>
                              <p className="text-xl font-black text-white uppercase">{pluginDetails.source}</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-white/20 uppercase font-black tracking-widest">
                    No data available for this project.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4 order-2 sm:order-1">
                    <a 
                      href={selectedPlugin.source === 'modrinth' ? `https://modrinth.com/mod/${selectedPlugin.slug}` : `https://hangar.papermc.io/${selectedPlugin.owner}/${selectedPlugin.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white/5 text-white/60 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2"
                    >
                      View on Project Page <ExternalLink size={14} />
                    </a>
                 </div>
                 <button 
                  onClick={() => handleDownload(selectedPlugin)}
                  disabled={downloadingId !== null}
                  className="w-full sm:w-auto px-8 py-3 bg-cyan-500 text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 order-1 sm:order-2"
                >
                  {downloadingId === selectedPlugin.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      PROCESSING BUILD...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download Latest Version
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

