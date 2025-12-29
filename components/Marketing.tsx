import React, { useState } from 'react';
import { ShopType, Poster } from '../types';
import { generateMarketingCopy, generateMarketingImage } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Share2, Download, Loader2 } from 'lucide-react';

interface MarketingProps {
  shopType: ShopType;
}

const Marketing: React.FC<MarketingProps> = ({ shopType }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [poster, setPoster] = useState<Poster | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setPoster(null);

    try {
      // Parallel execution for speed
      const [copy, imageBase64] = await Promise.all([
        generateMarketingCopy(topic, shopType),
        generateMarketingImage(topic, shopType)
      ]);

      setPoster({
        id: crypto.randomUUID(),
        headline: copy.headline || "Special Offer",
        subline: copy.subline || "Limited Time",
        body: copy.body || "Visit us today!",
        colorTheme: copy.colorTheme || "#3b82f6",
        imageUrl: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
          <Sparkles className="mr-2 text-purple-500" />
          AI Marketing Studio
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Generate professional posters for your {shopType} in seconds using Gemini AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              What do you want to promote?
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 20% off on all rice bags this weekend"
              className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" /> Generate Poster
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">Pro Tips:</h4>
            <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <li>Be specific about the discount or offer.</li>
              <li>Mention the occasion (e.g., Diwali Sale, Weekend Special).</li>
              <li>The AI generates both text and a unique background image.</li>
            </ul>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 min-h-[400px]">
          {poster ? (
            <div className="w-full max-w-sm animate-fade-in-up">
              <div 
                className="relative overflow-hidden rounded-xl shadow-2xl aspect-[3/4] flex flex-col"
                style={{ backgroundColor: poster.colorTheme }}
              >
                {poster.imageUrl && (
                  <div className="absolute inset-0 z-0">
                    <img src={poster.imageUrl} alt="Background" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                )}
                
                <div className="relative z-10 flex-1 p-6 flex flex-col justify-end text-white text-center">
                  <h3 className="text-3xl font-black uppercase tracking-tight leading-none mb-2 drop-shadow-lg">
                    {poster.headline}
                  </h3>
                  <div className="w-16 h-1 bg-white mx-auto mb-3 rounded-full opacity-80"></div>
                  <h4 className="text-lg font-bold mb-4 drop-shadow-md text-white/90">
                    {poster.subline}
                  </h4>
                  <p className="text-sm font-medium opacity-90 leading-relaxed mb-6 drop-shadow">
                    {poster.body}
                  </p>
                  <div className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full mx-auto inline-block shadow-lg">
                    VISIT US TODAY
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                 <button className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                   <Download size={16} className="mr-2" /> Save Image
                 </button>
                 <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/20 transition-all">
                   <Share2 size={16} className="mr-2" /> WhatsApp
                 </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Your AI-generated poster will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketing;