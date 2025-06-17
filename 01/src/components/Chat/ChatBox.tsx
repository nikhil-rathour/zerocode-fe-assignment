import { useState, useRef, useEffect } from 'react';
import { askGemini } from '@/app/api/chat/chatAPI';

// Add Web Speech API types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export const ChatBox = () => {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botResponse, setBotResponse] = useState('');
  const [typingInterval, setTypingInterval] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user?.name || 'User');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Clean up effects on unmount
  useEffect(() => {
    return () => {
      if (typingInterval) clearInterval(typingInterval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [typingInterval]);

  // Auto-scroll and dynamic typing effects
  useEffect(() => {
    scrollToBottom();
  }, [messages, botResponse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stopTyping = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsTyping(false);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setBotResponse('');
    abortControllerRef.current = new AbortController();
    
    try {
      const reply = await askGemini(input);
      
      // Simulate typing effect with 10x faster speed
      setIsTyping(true);
      let displayedText = '';
      const cleanReply = reply.replace(/\*\*/g, '').replace(/\*/g, '');
      const typingSpeed = 1 + Math.random() * 2; // 1-3ms per character
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < cleanReply.length) {
          displayedText = cleanReply.substring(0, i + 1);
          setBotResponse(displayedText);
          i++;
        } else {
          clearInterval(interval);
          setMessages(prev => [...prev, { from: 'bot', text: cleanReply }]);
          setIsTyping(false);
          setIsLoading(false);
        }
      }, typingSpeed);
      
      setTypingInterval(interval);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'name' in error && (error as { name: string }).name !== 'AbortError') {
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: 'Sorry, I encountered an error processing your request. Please try again later.' 
        }]);
      }
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Voice input handler
  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  // Export chat as a text file
  const exportChat = () => {
    if (messages.length === 0) return;
    const chatContent = messages
      .map(msg => `${msg.from === 'user' ? userName : 'AI'}: ${msg.text}`)
      .join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear chat messages
  const clearChat = () => {
    setMessages([]);
  };

  // Format long text with proper line breaks
  const formatMessage = (text: string) => {
    return text.split('\n').map((paragraph, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {paragraph || <br />}
      </p>
    ));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 h-screen max-h-screen flex flex-col mt-28  ">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1  className="text-2xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6">AI Chat Assistant</h1>
        <p className="text-gray-300 text-sm md:text-base">
          {userName ? `Hello, ${userName}. How can I assist you today?` : 'How can I assist you today?'}
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden">
        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 relative"
          style={{ maxHeight: 'calc(100vh - 250px)' }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg 
                  className="w-12 h-12 mx-auto mb-4 text-gray-500 animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">Start a conversation</p>
                <p className="text-sm opacity-80">Type your message below to begin</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`max-w-[90%] md:max-w-[80%] p-3 md:p-4 rounded-lg ${
                    msg.from === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        msg.from === 'user' 
                          ? 'bg-purple-800 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {msg.from === 'user' ? userName.charAt(0).toUpperCase() : 'AI'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium mb-1 ${
                          msg.from === 'user' ? 'text-purple-200' : 'text-gray-400'
                        }`}>
                          {msg.from === 'user' ? userName : 'AI Assistant'}
                        </div>
                        <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {formatMessage(msg.text)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[80%] p-4 rounded-lg bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-gray-300">
                        AI
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium mb-1 text-gray-400">
                          AI Assistant
                        </div>
                        <div className="text-white text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {formatMessage(botResponse)}
                          <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>
                        </div>
                        <button
                          onClick={stopTyping}
                          className="mt-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Stop Generating
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}

          {/* Scroll controls */}
          {messages.length > 3 && (
            <div className="sticky bottom-4 left-0 right-0 flex justify-center space-x-2">
              <button
                onClick={scrollToTop}
                className="p-2 bg-gray-800/80 text-gray-300 rounded-full hover:bg-gray-700/80 transition-all"
                aria-label="Scroll to top"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={scrollToBottom}
                className="p-2 bg-gray-800/80 text-gray-300 rounded-full hover:bg-gray-700/80 transition-all"
                aria-label="Scroll to bottom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-gray-900/50">
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  className="w-full p-3 pr-10 border border-gray-700 rounded-lg bg-gray-800 text-white 
                           placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 
                           transition-all duration-200 min-h-[60px] max-h-32"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  {input.length}/1000
                </div>
              </div>
              <button
                onClick={isTyping ? stopTyping : handleSend}
                disabled={!input.trim() && !isTyping}
                className={`px-4 py-3 rounded-lg text-white transition-all duration-200 shadow-md 
                           flex items-center justify-center ${
                             isTyping 
                               ? 'bg-red-600 hover:bg-red-700' 
                               : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                           }`}
              >
                {isLoading ? (
                  isTyping ? (
                    <>
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop
                    </>
                  ) : (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h16" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={startVoiceInput}
                  disabled={isLoading}
                  className={`px-3 py-2 ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  } text-gray-300 rounded-lg transition-all duration-200 text-sm flex items-center space-x-1`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>{isListening ? 'Stop' : 'Voice'}</span>
                </button>

                <button
                  onClick={exportChat}
                  disabled={messages.length === 0}
                  className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 
                           transition-all duration-200 text-sm flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export</span>
                </button>

                <button
                  onClick={clearChat}
                  disabled={messages.length === 0}
                  className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 
                           transition-all duration-200 text-sm flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear</span>
                </button>
              </div>

              <div className="text-xs text-gray-500">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};