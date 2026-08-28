import { Link, useNavigate } from 'react-router-dom';
import { Play, LogOut, User } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-2xl group-hover:bg-primary/20 transition-colors">
            <Play className="text-primary w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            YouTube<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav>
          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">
                Welcome, {user?.name}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-2xl transition-all font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/auth"
              className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-2xl transition-all shadow-sm font-medium text-sm hover:shadow-md"
            >
              <User className="w-4 h-4" />
              Login / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
