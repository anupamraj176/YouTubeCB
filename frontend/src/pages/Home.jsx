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
    return (match && match[7].length === 11) ? match[7] : inputUrl; 
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
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-zinc-200/50 dark:border-zinc-700 transition-colors">
            <Sparkles className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-5 tracking-tight transition-colors">
            Chat with any YouTube Video.
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg sm:text-xl text-center mb-10 max-w-xl font-medium transition-colors">
            Paste a link below to instantly summarize, ask questions, and extract knowledge without watching the whole thing.
          </p>

          <form onSubmit={handleProcess} className="w-full max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Play className="h-6 w-6 text-zinc-400 dark:text-zinc-500 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isProcessing}
              className="block w-full pl-16 pr-36 py-5 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/80 rounded-full text-zinc-900 dark:text-zinc-100 text-lg focus:outline-none focus:ring-4 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all shadow-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
            <button
              type="submit"
              disabled={isProcessing || !url}
              className="absolute inset-y-2 right-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold px-7 rounded-full transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Process'}
            </button>
          </form>
          {error && <p className="mt-6 text-red-500 font-medium bg-red-50 dark:bg-red-900/10 px-5 py-3 rounded-2xl border border-red-100 dark:border-red-900/20 transition-colors">{error}</p>}
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white dark:bg-[#18181b] rounded-3xl shadow-2xl shadow-zinc-200/40 dark:shadow-black/40 border border-zinc-100 dark:border-zinc-800/60 overflow-hidden relative transition-colors duration-300">
          
          {/* Header of Chat */}
          <div className="bg-zinc-50 dark:bg-[#121212]/50 border-b border-zinc-100 dark:border-zinc-800/60 p-4 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-200/50 dark:bg-zinc-800 p-2 rounded-xl text-zinc-900 dark:text-zinc-100 transition-colors">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider transition-colors">Video ID</p>
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono transition-colors">{videoId}</p>
              </div>
            </div>
            <button 
              onClick={() => { setProcessed(false); setUrl(''); setMessages([]); }}
              className="text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-4 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              New Video
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-[#18181b] transition-colors">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${msg.role === 'user' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] px-5 py-4 text-[15px] leading-relaxed shadow-sm transition-colors ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-3xl rounded-tr-sm' 
                    : 'bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-3xl rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-sm transition-colors">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-3xl rounded-tl-sm px-5 py-4 text-sm font-medium shadow-sm flex items-center gap-2 transition-colors">
                  <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            )}
            {error && <p className="text-center text-red-500 font-medium text-sm mt-4 bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-900/20 transition-colors">{error}</p>}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChat} className="p-4 bg-white dark:bg-[#18181b] border-t border-zinc-100 dark:border-zinc-800/60 transition-colors">
            <div className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isChatting}
                placeholder="Ask anything about this video..."
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 px-6 py-4 rounded-full pr-16 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all shadow-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
              <button
                type="submit"
                disabled={isChatting || !question.trim()}
                className="absolute right-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 p-2.5 rounded-full disabled:opacity-50 transition-all shadow-sm"
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
