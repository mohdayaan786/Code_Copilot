import { useState } from 'react';
import Generator from './components/Generator';
import History from './components/History';
import { Code2, History as HistoryIcon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Callback to refresh history after a new generation
  const handleGenerationSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      {/* Top header */}
      <header className="px-6 pt-8 pb-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 via-blue-500 to-emerald-400">
            <Code2 size={22} />
          </span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
              Code Copilot
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              AI-Powered Code Generator
            </p>
          </div>
        </div>
      </header>

      {/* Main centered content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60">
            <button
              className={`flex-1 py-3 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-slate-900 text-sky-400 border-b-2 border-sky-500'
                  : 'text-slate-400 hover:bg-slate-900/40'
              }`}
              onClick={() => setActiveTab('generate')}
            >
              <Code2 size={18} />
              <span>Generate Code</span>
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-sky-400 border-b-2 border-sky-500'
                  : 'text-slate-400 hover:bg-slate-900/40'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <HistoryIcon size={18} />
              <span>History</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 sm:p-7 md:p-8 bg-slate-900/70">
            {activeTab === 'generate' ? (
              <Generator
                onSuccess={handleGenerationSuccess}
                switchToHistory={() => setActiveTab('history')}
              />
            ) : (
              <History refreshTrigger={refreshTrigger} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;