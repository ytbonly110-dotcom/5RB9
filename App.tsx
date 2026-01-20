
import React, { useState, useEffect, useCallback } from 'react';
import { BannerStyle, GeneratedBanner } from './types';
import { GeminiService } from './services/geminiService';
import SafeZoneOverlay from './components/SafeZoneOverlay';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState<BannerStyle>(BannerStyle.GAMING);
  const [customPrompt, setCustomPrompt] = useState('');
  const [highQuality, setHighQuality] = useState(false);
  const [banners, setBanners] = useState<GeneratedBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(-1);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (highQuality) {
        const hasKey = await GeminiService.checkHighQualityAccess();
        if (!hasKey) {
          await GeminiService.requestHighQualityAccess();
          // Assuming success per instructions
        }
      }

      const prompt = customPrompt 
        ? `${style} style: ${customPrompt}` 
        : `${style} style, focus on high energy clips channel aesthetics`;
      
      const imageUrl = await GeminiService.generateBanner(prompt, highQuality);
      
      const newBanner: GeneratedBanner = {
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now()
      };

      setBanners(prev => [newBanner, ...prev]);
      setCurrentBannerIndex(0);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key error. Please re-select your key for High Quality mode.");
        await GeminiService.requestHighQualityAccess();
      } else {
        setError("Failed to generate banner. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentBanner = currentBannerIndex >= 0 ? banners[currentBannerIndex] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0f0f0f]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 8l6 4-6 4V8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">ClipCanvas</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSafeZone(!showSafeZone)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${showSafeZone ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {showSafeZone ? 'Hide Safe Zone' : 'Show Safe Zone'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-full lg:w-96 border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto bg-[#1a1a1a]">
          <section>
            <label className="block text-sm font-medium text-white/60 mb-3">Channel Style</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(BannerStyle).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${style === s ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium text-white/60 mb-3">Custom Description (Optional)</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Neon colors, futuristic city, focus on Call of Duty clips..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 min-h-[100px] resize-none"
            />
          </section>

          <section className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <h3 className="text-sm font-medium">High Quality (2K)</h3>
              <p className="text-[10px] text-white/40">Uses Gemini 3 Pro (Requires Paid Key)</p>
            </div>
            <button
              onClick={() => setHighQuality(!highQuality)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${highQuality ? 'bg-red-600' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${highQuality ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </section>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Generate Banner'}
          </button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {/* History */}
          {banners.length > 0 && (
            <section className="mt-auto">
              <label className="block text-sm font-medium text-white/60 mb-3">Recent Banners</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {banners.map((b, idx) => (
                  <button
                    key={b.timestamp}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentBannerIndex === idx ? 'border-red-600 scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={b.url} alt="History" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Preview Area */}
        <section className="flex-1 p-4 lg:p-12 flex flex-col items-center justify-center bg-[#0a0a0a] relative">
          <div className="w-full max-w-5xl aspect-video bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
            {!currentBanner && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Create Your Banner</h2>
                <p className="text-white/40 max-w-md">Select a style and hit generate. We'll show you exactly how it looks on YouTube.</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="font-bold text-lg">Designing your masterpiece...</p>
                  <p className="text-white/40 text-sm">Gemini is rendering high-impact visuals.</p>
                </div>
              </div>
            )}

            {currentBanner && (
              <img 
                src={currentBanner.url} 
                alt="Banner Preview" 
                className="w-full h-full object-cover"
              />
            )}

            <SafeZoneOverlay isVisible={showSafeZone && (!!currentBanner || loading)} />
          </div>

          {currentBanner && (
            <div className="mt-8 flex gap-4 animate-in fade-in slide-in-from-bottom-4">
              <a
                href={currentBanner.url}
                download={`youtube-banner-${currentBanner.timestamp}.png`}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all flex items-center gap-2 shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Banner
              </a>
            </div>
          )}

          {/* Help Tooltip */}
          <div className="mt-12 max-w-2xl text-center">
            <h3 className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-white/40 leading-relaxed uppercase tracking-wider">
              <p>Keep your logos and text within the center "Safe Zone" to ensure visibility on all devices.</p>
              <p>Clips channels perform best with high-contrast, energetic imagery that pops on dark mode.</p>
              <p>The full 16:9 image is what TV viewers see, while mobile users only see the center slice.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
