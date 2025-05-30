'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';

// Simple UUID generator for client-side use
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Helper function to format time consistently
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export default function AiCoachPage() {
  const { user, loading: authLoading } = useAuth();
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat history on client side only
  useEffect(() => {
    setIsClient(true);
    if (user) {
      setChatHistory([
        {
          id: generateId(),
          text: "Hello! I'm your FitTrack AI Coach powered by Google Gemini. How can I help you with your fitness journey today?",
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    }
  }, [user]);

  // Scroll to bottom of chat on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (currentMessage.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      text: currentMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Prepare history for the API (exclude the current user message)
      const historyForAPI = chatHistory.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text, 
          history: historyForAPI 
        }),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: generateId(),
        text: data.reply || "Sorry, I couldn't get a response.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error: any) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: generateId(),
        text: `Error: ${error.message || "Could not connect to the AI coach. Please try again."}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render chat messages until client-side hydration is complete
  if (!isClient || authLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Fitness Coach</h2>
            <div className="space-y-6">
              <div className="space-y-4 h-96 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Fitness Coach</h2>
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-500 mb-6">
                Please log in to chat with your AI Fitness Coach and get personalized fitness advice.
              </p>
              <div className="space-x-3">
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Fitness Coach</h2>

          <div className="space-y-6">
            {/* Chat Container */}
            <div
              ref={chatContainerRef}
              className="space-y-4 h-96 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm break-words ${
                      msg.sender === 'user'
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'bot' ? (
                      <div className="text-sm">
                        <ReactMarkdown 
                          components={{
                            p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2">{children}</ol>,
                            li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                            br: () => <br className="mb-1" />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'} text-right`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <p className="text-sm italic text-gray-600">FitTrack AI is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isLoading ? "AI is responding..." : "Ask a fitness question..."}
                disabled={isLoading}
                className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || currentMessage.trim() === ''}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 h-full disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send'
                )}
              </button>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-500">
                Try asking: "How can I build muscle?" or "What's a good beginner workout?" or "Help me create a workout plan"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Powered by Google Gemini AI • Responses are for general guidance only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 