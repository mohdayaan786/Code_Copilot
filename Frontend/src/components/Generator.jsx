import { useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Loader2 } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust'];
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Generator = ({ onSuccess, switchToHistory }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const response = await axios.post(`${backendURL}/api/generate`, {
        prompt,
        language,
      });
      setResult(response.data);
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to generate code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.3fr)]">
      {/* LEFT: Form */}
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Describe the code you need
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose a language and describe the function, algorithm, or snippet you want to generate.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2.5 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Write a function to calculate the Fibonacci sequence..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2.5 text-sm h-32 resize-none shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 text-white font-semibold py-2.5 text-sm shadow-md hover:bg-sky-700 active:bg-sky-800 transition disabled:bg-sky-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              'Generate Code'
            )}
          </button>

          {error && (
            <div className="mt-2 rounded-lg border border-red-500/50 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100 dark:border-red-500/60 text-sm px-3 py-2">
              {error}
            </div>
          )}
        </form>

        {result && (
          <button
            onClick={switchToHistory}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
          >
            View this in history →
          </button>
        )}
      </div>

      {/* RIGHT: Code output */}
      <div className="mt-4 lg:mt-0">
        <div className="h-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
              {result?.language || 'Output'}
            </span>

            {result?.code && (
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-xs text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[220px] bg-slate-100 dark:bg-[#0b1020]">
            {result?.code ? (
              <SyntaxHighlighter
                language={result.language.toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  background: 'transparent',
                  fontSize: '0.85rem',
                }}
              >
                {result.code}
              </SyntaxHighlighter>
            ) : (
              <div className="h-full flex items-center justify-center px-6 text-xs sm:text-sm text-slate-500 dark:text-slate-500">
                Generated code will appear here after you submit a prompt.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;