import { useState, useEffect } from 'react';
import Generator from './components/Generator';
import History from './components/History';
import { Code2, History as HistoryIcon, Sun, Moon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Theme state: sync with <html> class set in index.html
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Callback to refresh history after a new generation
  const handleGenerationSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors">
      {/* Top header */}
      <header className="px-6 pt-8 pb-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 via-blue-500 to-emerald-400">
              <Code2 size={22} />
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
                Code Copilot
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                AI-Powered Code Generator
              </p>
            </div>
          </div>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-300 bg-white/80 text-slate-800 text-sm font-medium shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={16} />
                <span className="hidden sm:inline">Light mode</span>
              </>
            ) : (
              <>
                <Moon size={16} />
                <span className="hidden sm:inline">Dark mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main centered content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-5xl bg-white/80 border border-slate-200 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden dark:bg-slate-900/80 dark:border-slate-800 transition-colors">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/60">
            <button
              className={`flex-1 py-3 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-white text-sky-600 border-b-2 border-sky-500 dark:bg-slate-900 dark:text-sky-400'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/40'
              }`}
              onClick={() => setActiveTab('generate')}
            >
              <Code2 size={18} />
              <span>Generate Code</span>
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-sky-600 border-b-2 border-sky-500 dark:bg-slate-900 dark:text-sky-400'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/40'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <HistoryIcon size={18} />
              <span>History</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 sm:p-7 md:p-8 bg-slate-50/80 dark:bg-slate-900/70 transition-colors">
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
