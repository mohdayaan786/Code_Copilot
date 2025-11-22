import { useEffect, useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronLeft, ChevronRight, Calendar, Copy, Check } from 'lucide-react';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const History = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  const fetchHistory = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendURL}/api/history?page=${pageNum}&limit=3`
      );
      setHistory(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(response.data.pagination.page);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refreshTrigger]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleCopy = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="text-center py-10 text-slate-600 dark:text-slate-400 text-sm">
        Loading history...
      </div>
    );
  }

  // Detect current theme from <html class="dark">
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-6">
      {history.length === 0 ? (
        <div className="text-center py-10 text-slate-600 dark:text-slate-400 text-sm">
          No history found. Generate some code to see it here.
        </div>
      ) : (
        history.map((item) => (
          <article
            key={item.id}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-md"
          >
            <header className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3
                  className="
                    font-semibold 
                    text-slate-900 dark:text-slate-50 
                    text-sm sm:text-base 
                    leading-relaxed 
                    break-words
                  "
                >
                  {item.prompt}
                </h3>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(item.code, item.id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition text-xs"
                    title={copiedId === item.id ? 'Copied!' : 'Copy code'}
                  >
                    {copiedId === item.id ? (
                      <Check
                        size={16}
                        className="text-emerald-500 dark:text-emerald-400"
                      />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>

                  {/* Language badge */}
                  <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-medium bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/40">
                    {item.language}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[0.7rem] sm:text-xs text-slate-500 dark:text-slate-400">
                <Calendar size={14} />
                <span>{formatDate(item.timestamp)}</span>
              </div>
            </header>

            <div className="max-h-64 overflow-y-auto bg-slate-100 dark:bg-[#050816]">
              <SyntaxHighlighter
                language={item.language.toLowerCase()}
                style={isDark ? vscDarkPlus : oneLight}
                customStyle={{
                  margin: 0,
                  padding: '0.9rem 1.1rem',
                  fontSize: '0.85rem',
                  background: 'transparent',
                }}
              >
                {item.code}
              </SyntaxHighlighter>
            </div>
          </article>
        ))
      )}

      {history.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:dark:hover:bg-slate-900 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:dark:hover:bg-slate-900 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default History;