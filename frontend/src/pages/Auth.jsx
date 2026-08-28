import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

const API_URL = 'http://127.0.0.1:5000/api/auth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = '/'; 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-[#18181b] p-8 rounded-[2rem] shadow-2xl shadow-zinc-200/40 dark:shadow-black/40 border border-zinc-100 dark:border-zinc-800/60 transition-colors duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 transition-colors">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium transition-colors">
          {isLogin ? 'Log in to view your saved chats.' : 'Sign up to permanently save your chat history.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/20 transition-colors">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Name</label>
            <input 
              type="text" 
              name="name"
              required={!isLogin}
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              placeholder="Enter your name"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Email</label>
          <input 
            type="email" 
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors">Password</label>
          <input 
            type="password" 
            name="password"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 font-bold py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm transition-colors">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline transition-all"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
