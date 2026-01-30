import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-full">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Assistant IA</h2>
            <p className="text-xs sm:text-sm text-blue-100">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages Container - WhatsApp Style */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar - Smaller on mobile */}
            <div
              className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user'
                  ? 'bg-blue-500'
                  : 'bg-gradient-to-br from-purple-500 to-blue-500'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
              )}
            </div>

            {/* Message Bubble - WhatsApp Style */}
            <div
              className={`max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                {message.text}
              </p>
              <p
                className={`text-[10px] sm:text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Bot className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Mobile Optimized */}
      <div className="bg-white border-t border-gray-200 p-2 sm:p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 bg-blue-500 text-white p-2 sm:p-2.5 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md active:scale-95"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
