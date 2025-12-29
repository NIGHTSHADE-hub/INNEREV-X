import React, { useState, useEffect } from 'react';
import { AppStep, AppView, PipelineStage, KhataItem, TaxDetails, User, KhataRecord, ShopType } from './types';
import { extractKhataData } from './services/geminiService';
import { saveRecord, getRecords } from './services/storageService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Reports from './components/Reports';
import Marketing from './components/Marketing';
import Settings from './components/Settings';
import ImageInput from './components/ImageInput';
import PipelineVisualizer from './components/PipelineVisualizer';
import DataVerification from './components/DataVerification';
import TaxView from './components/TaxView';
import FinalPreview from './components/FinalPreview';
import { RefreshCw, Moon, Sun, Menu, X, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<KhataRecord[]>([]);
  
  // Navigation State
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Khata Processing State
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>(PipelineStage.IDLE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string>('image/jpeg');
  const [extractedItems, setExtractedItems] = useState<KhataItem[]>([]);
  const [finalTaxDetails, setFinalTaxDetails] = useState<TaxDetails | null>(null);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Load history when user logs in
  useEffect(() => {
    if (user) {
      setHistory(getRecords(user.username));
    }
  }, [user]);

  const handleLogin = (username: string) => {
    setUser({ 
      username, 
      name: username.charAt(0).toUpperCase() + username.slice(1),
      shopType: ShopType.GENERAL // Default
    });
    setStep(AppStep.MAIN_APP);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    resetApp();
    setStep(AppStep.LOGIN);
  };

  const handleShopTypeChange = (type: ShopType) => {
    if (user) {
      setUser({ ...user, shopType: type });
    }
  };

  // Pipeline Simulation Logic
  const runPipelineSimulation = async (base64Image: string, mimeType: string) => {
    setStep(AppStep.PROCESSING);
    
    setPipelineStage(PipelineStage.YOLO_DETECTION);
    await new Promise(r => setTimeout(r, 1500));
    
    setPipelineStage(PipelineStage.CROPPING);
    await new Promise(r => setTimeout(r, 1000));
    
    setPipelineStage(PipelineStage.TROCR_RECOGNITION);
    await new Promise(r => setTimeout(r, 1200));
    
    setPipelineStage(PipelineStage.LLM_STRUCTURING);
    // Use user shop type for better extraction context
    const data = await extractKhataData(base64Image, mimeType, user?.shopType || ShopType.GENERAL);
    setExtractedItems(data);
    
    setPipelineStage(PipelineStage.DB_FILLING);
    await new Promise(r => setTimeout(r, 800));
    
    setPipelineStage(PipelineStage.COMPLETE);
    setTimeout(() => {
      setStep(AppStep.VERIFICATION);
    }, 500);
  };

  const handleImageSelected = (base64: string, previewUrl: string, mimeType: string) => {
    setCurrentImage(previewUrl);
    setCurrentMimeType(mimeType);
    runPipelineSimulation(base64, mimeType);
  };

  const handleVerificationConfirm = (verifiedItems: KhataItem[]) => {
    setExtractedItems(verifiedItems);
    setStep(AppStep.TAX_ANALYSIS);
  };

  const handleTaxFinish = (details: TaxDetails) => {
    setFinalTaxDetails(details);
    setStep(AppStep.FINAL_PREVIEW);
  };

  const finishAndSave = () => {
    if (user && finalTaxDetails) {
      const newRecord: KhataRecord = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        items: extractedItems,
        taxDetails: finalTaxDetails
      };
      const updatedHistory = saveRecord(user.username, newRecord);
      setHistory(updatedHistory);
    }
    setStep(AppStep.MAIN_APP);
    setView(AppView.DASHBOARD);
    setPipelineStage(PipelineStage.IDLE);
    setCurrentImage(null);
    setExtractedItems([]);
    setFinalTaxDetails(null);
  };

  const resetApp = () => {
    setPipelineStage(PipelineStage.IDLE);
    setCurrentImage(null);
    setExtractedItems([]);
    setFinalTaxDetails(null);
    if (user) {
      setStep(AppStep.MAIN_APP);
      setView(AppView.DASHBOARD);
    } else {
      setStep(AppStep.LOGIN);
    }
  };

  if (step === AppStep.LOGIN) {
    return (
      <>
        <div className="absolute top-4 right-4 z-50">
           <button
             onClick={toggleTheme}
             className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
           >
             {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
           </button>
        </div>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // Define logic to determine if we are in the "Scanning Flow"
  const isScanning = step !== AppStep.MAIN_APP;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar - Visible on Desktop if logged in and not scanning */}
      {user && !isScanning && (
        <Sidebar 
          currentView={view} 
          onChangeView={(v) => { setView(v); setIsMobileMenuOpen(false); }} 
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex-none flex items-center justify-between px-4 z-20 transition-colors">
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            {!isScanning && (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden mr-3 text-slate-600 dark:text-slate-300"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight md:hidden">KhataLens</span>
            
            {/* Context Title for Scanning Flow */}
            {isScanning && (
               <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight hidden md:block ml-4">Digitizing Receipt...</span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
             >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {isScanning && (
               <button 
                onClick={resetApp}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 flex items-center text-sm"
              >
                <RefreshCw size={16} className="mr-1" /> Cancel
              </button>
            )}
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && !isScanning && user && (
          <div className="absolute inset-0 z-50 md:hidden flex">
            <div className="w-64 bg-white dark:bg-slate-900 shadow-2xl h-full">
              <Sidebar 
                currentView={view} 
                onChangeView={(v) => { setView(v); setIsMobileMenuOpen(false); }} 
                user={user}
                onLogout={handleLogout}
              />
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* Main App Views */}
          {!isScanning && user && (
            <div className="max-w-5xl mx-auto">
              {view === AppView.DASHBOARD && (
                <Dashboard user={user} history={history} onNewScan={() => setStep(AppStep.UPLOAD)} />
              )}
              {view === AppView.REPORTS && (
                <Reports history={history} shopType={user.shopType} />
              )}
              {view === AppView.MARKETING && (
                <Marketing shopType={user.shopType} />
              )}
              {view === AppView.SETTINGS && (
                <Settings currentType={user.shopType} onTypeChange={handleShopTypeChange} />
              )}
            </div>
          )}

          {/* Scanning Flow Views */}
          {isScanning && (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-full">
               {step === AppStep.PROCESSING && (
                <div className="mb-8 animate-fade-in w-full">
                  <PipelineVisualizer currentStage={pipelineStage} />
                </div>
              )}

              {step === AppStep.UPLOAD && (
                <div className="w-full animate-fade-in-up">
                  <div className="mb-8 text-center max-w-lg mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Digitize New Receipt</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      Upload a photo of the handwritten khata to process it.
                    </p>
                  </div>
                  <ImageInput onImageSelected={handleImageSelected} />
                </div>
              )}

              {step === AppStep.PROCESSING && currentImage && (
                <div className="w-full flex flex-col items-center animate-fade-in">
                    <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 max-w-md w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      
                      {currentMimeType === 'application/pdf' ? (
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                          <FileText size={64} className="mb-4 text-red-500" />
                          <p className="font-semibold">PDF Document</p>
                          <p className="text-xs">Processing pages...</p>
                        </div>
                      ) : (
                         <img src={currentImage} alt="Processing" className="w-full h-full object-cover opacity-80" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent w-full h-1/4 animate-scan pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 text-white text-center">
                        <p className="font-mono text-sm">
                          {pipelineStage === PipelineStage.YOLO_DETECTION && "Identifying text regions..."}
                          {pipelineStage === PipelineStage.CROPPING && "Extracting text segments..."}
                          {pipelineStage === PipelineStage.TROCR_RECOGNITION && "Recognizing handwriting..."}
                          {pipelineStage === PipelineStage.LLM_STRUCTURING && "Refining with Gemini..."}
                          {pipelineStage === PipelineStage.DB_FILLING && "Saving to database..."}
                        </p>
                      </div>
                    </div>
                </div>
              )}

              {step === AppStep.VERIFICATION && (
                <div className="w-full animate-fade-in-up">
                  <DataVerification 
                    initialData={extractedItems} 
                    onConfirm={handleVerificationConfirm} 
                    onRetake={resetApp}
                  />
                </div>
              )}

              {step === AppStep.TAX_ANALYSIS && (
                <div className="w-full animate-fade-in-up">
                  <TaxView items={extractedItems} onFinish={handleTaxFinish} />
                </div>
              )}

              {step === AppStep.FINAL_PREVIEW && finalTaxDetails && (
                <div className="w-full animate-fade-in-up">
                  <FinalPreview items={extractedItems} taxDetails={finalTaxDetails} onReset={finishAndSave} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -25%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 125%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;