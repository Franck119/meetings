
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Maximize2, Sparkles, Volume2, VolumeX, Mic, ArrowLeft } from 'lucide-react';
import { chatWithAssistant, textToSpeech } from '../services/geminiService';
import { Meeting, Payment } from '../types';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
  audioData?: string;
}

interface AssistantChatProps {
  meetings: Meeting[];
  payments: Payment[];
}

const AssistantChat: React.FC<AssistantChatProps> = ({ meetings, payments }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Bonjour Boss ! Je suis prêt à analyser vos flux financiers. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlayVoice = async (index: number, msgOverride?: Message) => {
    const msg = msgOverride || messages[index];
    if (!msg) return;

    if (isPlaying === index) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
      setIsPlaying(null);
      return;
    }

    let audioBase64 = msg.audioData;
    if (!audioBase64) {
      setLoading(true);
      audioBase64 = await textToSpeech(msg.text);
      setLoading(false);
      if (audioBase64) {
        setMessages(prev => prev.map((m, i) => i === index ? { ...m, audioData: audioBase64 } : m));
      } else return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const bytes = decode(audioBase64);
    const buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = 1.1;
    source.connect(audioContextRef.current.destination);
    
    sourceNodeRef.current = source;
    setIsPlaying(index);
    
    source.onended = () => {
      if (sourceNodeRef.current === source) {
        setIsPlaying(null);
        sourceNodeRef.current = null;
      }
    };
    
    source.start();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    const userMessageObj: Message = { role: 'user', text: userMsg };
    setMessages(prev => [...prev, userMessageObj]);
    setLoading(true);
    
    const response = await chatWithAssistant(userMsg, { meetings, payments });
    setLoading(false);
    
    if (response) {
      const newMsg: Message = { role: 'assistant', text: response };
      setMessages(prev => {
        const next = [...prev, newMsg];
        setTimeout(() => handlePlayVoice(next.length - 1, newMsg), 100);
        return next;
      });
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] flex flex-col bg-slate-50 dark:bg-slate-950 rounded-[24px] sm:rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in">
      {/* Reduced Header Height */}
      <div className="px-4 py-3 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm sm:text-base">Nex Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">IA Active</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 sm:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><Mic className="w-5 h-5" /></button>
        </div>
      </div>

      {/* WhatsApp style chat area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] dark:bg-none bg-repeat bg-[length:400px_400px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] sm:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="relative group">
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none font-medium'
                }`}>
                  {m.text}
                  <div className={`text-[9px] mt-1 opacity-60 text-right ${m.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {m.role === 'assistant' && (
                  <button 
                    onClick={() => handlePlayVoice(i)}
                    className="absolute -right-10 top-0 p-2 bg-white dark:bg-slate-800 shadow-lg rounded-xl text-indigo-600 dark:text-indigo-400 hover:scale-110 active:scale-90 transition-all border border-slate-100 dark:border-slate-700"
                  >
                    {isPlaying === i ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyse...</span>
             </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input area */}
      <div className="p-3 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez au Boss..."
            className="w-full pl-5 pr-14 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full outline-none focus:border-indigo-500 transition-all text-sm font-medium dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-1.5 p-2 sm:p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg transition-all active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
