import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Play, Loader2, Sparkles, Bot, User } from 'lucide-react';
import GuestBanner from '../components/GuestBanner';

const API_URL = 'http://127.0.0.1:5000/api/ai';

const Home = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  
  const [question, setQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const [error, setError] = useState('');
  
  const chatEndRef = useRef(null);
  const isAuthenticated = !!localStorage.getItem('token');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatting]);

  const extractVideoId = (inputUrl) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[7].length === 11) ? match[7] : inputUrl; // Fallback in case they pasted just the ID
  };

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    setError('');
    const extractedId = extractVideoId(url);
    
    if (!extractedId || extractedId.length !== 11) {
      setError('Invalid YouTube URL or Video ID.');
      return;
    }

    setVideoId(extractedId);
    setIsProcessing(true);

    try {
      await axios.post(`${API_URL}/process-video`, 
        { video_id: extractedId }, 
        { headers: getHeaders() }
      );
      setProcessed(true);
      setMessages([{ role: 'ai', content: 'Hi there! I have watched the video. What would you like to know about it?' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process video. Make sure the backend and AI service are running.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsChatting(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/chat`, 
        { video_id: videoId, question: userMessage.content },
        { headers: getHeaders() }
      );
      
      const aiMessage = { role: 'ai', content: response.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get answer from AI.');
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {!isAuthenticated && <GuestBanner />}

      {!processed ? (
        <div className="flex-1 flex flex-col items-center justify-center -mt-16">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-primary/20">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 text-center mb-4 tracking-tight">
            Chat with any <span className="text-primary">YouTube</span> Video.
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl text-center mb-10 max-w-xl font-medium">
            Paste a link below to instantly summarize, ask questions, and extract knowledge without watching the whole thing.
          </p>

          <form onSubmit={handleProcess} className="w-full max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Play className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isProcessing}
              className="block w-full pl-14 pr-36 py-5 bg-white border border-slate-200 rounded-3xl text-slate-800 text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
            <button
              type="submit"
              disabled={isProcessing || !url}
              className="absolute inset-y-2 right-2 bg-primary hover:bg-indigo-600 text-white font-bold px-6 rounded-2xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Process'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 font-medium bg-red-50 px-4 py-2 rounded-2xl">{error}</p>}
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          
          {/* Header of Chat */}
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-xl text-red-600">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video ID</p>
                <p className="text-sm font-semibold text-slate-700 font-mono">{videoId}</p>
              </div>
            </div>
            <button 
              onClick={() => { setProcessed(false); setUrl(''); setMessages([]); }}
              className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
            >
              New Video
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-primary'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[75%] px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-3xl rounded-tr-sm' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-3xl rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-2xl bg-white border border-slate-200 text-primary flex items-center justify-center shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-white border border-slate-100 text-slate-500 rounded-3xl rounded-tl-sm px-5 py-4 text-sm font-medium shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            )}
            {error && <p className="text-center text-red-500 font-medium text-sm mt-4 bg-red-50 p-3 rounded-2xl">{error}</p>}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChat} className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isChatting}
                placeholder="Ask anything about this video..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-6 py-4 rounded-3xl pr-16 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={isChatting || !question.trim()}
                className="absolute right-2 bg-primary hover:bg-indigo-600 text-white p-2.5 rounded-2xl disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
