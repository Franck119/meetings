
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Maximize2, Sparkles, Volume2, VolumeX, Mic } from 'lucide-react';
import { chatWithAssistant, textToSpeech } from '../services/geminiService';
import { Meeting, Payment } from '../types';

// Helper functions for recommended audio decoding from @google/genai guidelines
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
    { role: 'assistant', text: "Bonjour Boss ! Système Nex Intelligence prêt. Je peux analyser vos finances par ville ou vous lire vos rapports à voix haute. Que décidez-vous ?" }
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

  // Clean up audio resources on unmount
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

    // Toggle playback if already playing this message
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
        // Cache audio data in message state
        setMessages(prev => prev.map((m, i) => i === index ? { ...m, audioData: audioBase64 } : m));
      } else return;
    }

    // Initialize AudioContext lazily on user interaction
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // Recommended PCM decoding implementation
    const bytes = decode(audioBase64);
    const buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = 1.1; // Professional pace as requested
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
        // Auto-play the newly added assistant message with correct indexing
        setTimeout(() => handlePlayVoice(next.length - 1, newMsg), 100);
        return next;
      });
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-indigo-50/20 dark:bg-indigo-900/10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#4f46e5] to-[#818cf8] rounded-[24px] flex items-center justify-center shadow-xl">
            <Bot className="w-9 h-9 text-white" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-xl">Boss Intelligence Voice</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></span>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Flux Vocal Turbo (1.1x)</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400"><Mic className="w-6 h-6" /></button>
           <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400"><Maximize2 className="w-6 h-6" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth custom-scrollbar bg-slate-50/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-5 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'user' ? 'bg-[#4f46e5]' : 'bg-white dark:bg-slate-800'}`}>
                {m.role === 'user' ? <User className="w-7 h-7 text-white" /> : <Bot className="w-7 h-7 text-[#4f46e5] dark:text-indigo-400" />}
              </div>
              <div className="relative">
                <div className={`p-8 rounded-[32px] text-base leading-relaxed shadow-sm transform transition-all hover:shadow-xl ${
                  m.role === 'user' ? 'bg-[#4f46e5] text-white rounded-tr-none font-bold' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-50 dark:border-slate-700 rounded-tl-none font-black'
                }`}>
                  {m.text}
                </div>
                {m.role === 'assistant' && (
                  <button 
                    onClick={() => handlePlayVoice(i)}
                    className="absolute -right-14 top-2 p-3 bg-white dark:bg-slate-800 shadow-lg rounded-2xl text-indigo-600 dark:text-indigo-400 hover:scale-110 active:scale-90 transition-all border border-slate-100 dark:border-slate-700"
                  >
                    {isPlaying === i ? <VolumeX className="w-6 h-6 animate-pulse" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-5 items-center">
               <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-md"><Loader2 className="w-7 h-7 animate-spin text-indigo-500" /></div>
               <div className="bg-white dark:bg-slate-900 px-8 py-5 rounded-[24px] border border-slate-100 dark:border-slate-800 font-black text-xs text-indigo-400 uppercase tracking-widest shadow-sm">Boss Intelligence réfléchit...</div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-10 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="relative flex items-center max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Dites quelque chose, Boss..."
            className="w-full pl-10 pr-20 py-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all text-lg font-black dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-3 p-4 bg-[#4f46e5] text-white rounded-[24px] hover:bg-[#4338ca] shadow-2xl shadow-indigo-200 transition-all active:scale-90"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
