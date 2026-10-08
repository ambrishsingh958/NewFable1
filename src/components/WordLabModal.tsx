import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  X,
  VolumeX,
} from 'lucide-react';
import { VocabularyItem } from '../types';
import { globalVoiceEngine } from '../services/voiceEngine';
import { soundscapeEngine } from '../services/soundscapes';

interface WordLabModalProps {
  vocabulary: VocabularyItem[];
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  onAwardXp?: (amount: number, reason: string) => void;
}

export const WordLabModal: React.FC<WordLabModalProps> = ({
  vocabulary,
  isOpen,
  onClose,
  language = 'English',
  onAwardXp,
}) => {
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [masteredWords, setMasteredWords] = useState<Record<string, boolean>>({});

  if (!isOpen || !vocabulary || vocabulary.length === 0) return null;

  const currentItem = vocabulary[activeWordIdx] || vocabulary[0];

  // Syllable breakdown helper
  const getSyllables = (word: string): string[] => {
    // Break word into estimated chunks
    if (word.length <= 4) return [word];
    const chunks = word.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi);
    return chunks && chunks.length > 0 ? chunks : [word];
  };

  const syllables = getSyllables(currentItem.word);

  const handleSpeakWord = (word: string, slow = false) => {
    soundscapeEngine.playSoundEffect('pop');
    globalVoiceEngine.speakText(word, {
      lang: language,
      rate: slow ? 0.65 : 0.88,
    });
  };

  const handleToggleMastered = (word: string) => {
    soundscapeEngine.playSoundEffect('badge');
    setMasteredWords((prev) => {
      const next = { ...prev, [word]: !prev[word] };
      if (!prev[word] && onAwardXp) {
        onAwardXp(15, `Mastered STEM vocabulary word: "${word}"`);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 max-h-[90vh] overflow-y-auto relative animate-scale-up border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🔤</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                  STEM Word Lab & Phonics Explorer
                </h3>
                <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                  Phonics & Pronunciation
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tap each syllable, listen in slow motion, and master scientific terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
          {vocabulary.map((v, idx) => {
            const isSelected = activeWordIdx === idx;
            const isMastered = masteredWords[v.word];
            return (
              <button
                key={v.word}
                onClick={() => {
                  setActiveWordIdx(idx);
                  soundscapeEngine.playSoundEffect('pop');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{v.word}</span>
                {isMastered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
              </button>
            );
          })}
        </div>

        {/* Word Card Showcase */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 text-center mb-5">
          <span className="text-xs font-black uppercase tracking-widest text-violet-600 font-mono">
            Word #{activeWordIdx + 1} of {vocabulary.length}
          </span>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mt-2 mb-3">
            {currentItem.word}
          </h2>

          {/* Syllable Breakdown Interactive Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            <span className="text-xs font-bold text-slate-500">Syllables:</span>
            {syllables.map((syl, i) => (
              <button
                key={i}
                onClick={() => handleSpeakWord(syl, true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-violet-100 text-violet-900 border border-violet-300 font-bold text-sm shadow-2xs hover:scale-105 transition-all cursor-pointer"
                title={`Hear syllable: "${syl}"`}
              >
                {syl}
              </button>
            ))}
          </div>

          {/* Meaning / Definition */}
          <div className="bg-white/90 p-4 rounded-xl border border-violet-100 max-w-lg mx-auto text-left shadow-2xs mb-4">
            <div className="text-xs font-extrabold text-violet-800 uppercase tracking-wider mb-1">
              Definition:
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {currentItem.meaning}
            </p>
            {currentItem.example && (
              <p className="text-xs text-slate-600 italic mt-2 border-t border-slate-100 pt-2">
                " {currentItem.example} "
              </p>
            )}
          </div>

          {/* Audio controls */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => handleSpeakWord(currentItem.word)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-200 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Normal Voice</span>
            </button>

            <button
              onClick={() => handleSpeakWord(currentItem.word, true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-violet-500" />
              <span>Slow Phonics 🐢</span>
            </button>

            <button
              onClick={() => handleToggleMastered(currentItem.word)}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                masteredWords[currentItem.word]
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{masteredWords[currentItem.word] ? 'Mastered! (+15 XP)' : 'Mark Mastered'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Mastering vocabulary unlocks higher reading levels and badges!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
