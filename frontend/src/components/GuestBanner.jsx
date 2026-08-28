import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

const GuestBanner = () => {
  return (
    <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-slate-200 p-2 rounded-xl text-slate-600">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-slate-600 text-sm font-medium">
          You are chatting as a <span className="font-bold text-slate-800">Guest</span>. Your chat history will not be saved.
        </p>
      </div>
      <Link 
        to="/auth" 
        className="shrink-0 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
      >
        Login to Save
      </Link>
    </div>
  );
};

export default GuestBanner;
