import React, { useEffect, useState } from 'react';
import { X, Sparkles, Gift, Copy, Check } from 'lucide-react';
import NeonButton from './NeonButton';
import { GeneratedWishResponse, Birthday } from '../types';
import { generateBirthdayContent } from '../services/geminiService';

interface GeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthday: Birthday;
  age: number;
}

const GeminiModal: React.FC<GeminiModalProps> = ({ isOpen, onClose, birthday, age }) => {
  const [content, setContent] = useState<GeneratedWishResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && birthday) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, birthday]);

  const generate = async () => {
    setLoading(true);
    setContent(null);
    const result = await generateBirthdayContent({
      name: birthday.name,
      age: age,
      relationship: birthday.relationship,
      tone: 'cyberpunk'
    });
    setContent(result);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (content?.wish) {
      navigator.clipboard.writeText(content.wish);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0a0a16] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20 flex justify-between items-center bg-purple-900/10">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h3 className="font-cyber text-lg tracking-wider">AI Neural Wish</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 min-h-[300px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
              <p className="text-purple-300 font-mono text-sm">Синтезирую поздравление...</p>
            </div>
          ) : content ? (
            <>
              <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl relative group">
                <p className="text-purple-100 font-light leading-relaxed italic">
                  "{content.wish}"
                </p>
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/30 text-purple-300 transition-all opacity-0 group-hover:opacity-100"
                  title="Copy"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Идеи подарков
                </h4>
                <ul className="space-y-2">
                  {content.giftIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm bg-slate-900/40 p-2 rounded border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500">
               Ошибка соединения с нейросетью.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/50">
          <NeonButton variant="secondary" onClick={generate} isLoading={loading} className="text-sm py-2">
            Регенерировать
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default GeminiModal;