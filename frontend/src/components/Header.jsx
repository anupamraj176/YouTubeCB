import { Link, useNavigate } from 'react-router-dom';
import { Play, LogOut, User, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <header className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-2xl group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
            <Play className="text-zinc-900 dark:text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white transition-colors">
            YouTube<span className="font-medium text-zinc-500 dark:text-zinc-400">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hidden sm:inline-block transition-colors">
                {user?.name}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-2xl transition-all font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/auth"
              className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 px-5 py-2.5 rounded-2xl transition-all shadow-sm font-medium text-sm"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
