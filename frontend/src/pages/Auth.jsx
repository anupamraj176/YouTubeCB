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
        // Force header update and redirect
        window.location.href = '/'; 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-500 font-medium">
          {isLogin ? 'Log in to view your saved chats.' : 'Sign up to permanently save your chat history.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
            <input 
              type="text" 
              name="name"
              required={!isLogin}
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="John Doe"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
          <input 
            type="email" 
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input 
            type="password" 
            name="password"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/30 mt-4 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 font-medium text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-indigo-700 font-bold hover:underline transition-all"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
