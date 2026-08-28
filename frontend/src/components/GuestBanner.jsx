import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

const GuestBanner = () => {
  return (
    <div className="bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-zinc-200/50 dark:bg-zinc-800/50 p-2 rounded-xl text-zinc-600 dark:text-zinc-400 transition-colors">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium transition-colors">
          Chatting as a <span className="font-bold text-zinc-900 dark:text-white">Guest</span>. History will not be saved.
        </p>
      </div>
      <Link 
        to="/auth" 
        className="shrink-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
      >
        Save History
      </Link>
    </div>
  );
};

export default GuestBanner;
