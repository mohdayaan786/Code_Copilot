import { useEffect, useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const History = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/history?page=${pageNum}&limit=3`
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

  if (loading && history.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        Loading history...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No history found. Generate some code to see it here.
        </div>
      ) : (
        history.map((item) => (
          <article
            key={item.id}
            className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/70 shadow-lg"
          >
            <header className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/70">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="font-semibold text-slate-50 text-sm sm:text-base leading-snug">
                  {item.prompt}
                </h3>
                <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/40 shrink-0">
                  {item.language}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[0.7rem] sm:text-xs text-slate-400">
                <Calendar size={14} />
                <span>{formatDate(item.timestamp)}</span>
              </div>
            </header>

            <div className="max-h-64 overflow-y-auto bg-[#050816]">
              <SyntaxHighlighter
                language={item.language.toLowerCase()}
                style={vscDarkPlus}
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

      {/* Pagination Controls */}
      {history.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full border border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900/70 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full border border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900/70 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default History;