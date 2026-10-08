import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';
import { StoryData } from '../types';
import { globalVoiceEngine } from '../services/voiceEngine';

interface ComicStripModalProps {
  storyData: StoryData;
  isOpen: boolean;
  onClose: () => void;
}

interface ComicPanel {
  panelNumber: number;
  caption: string;
  dialogue?: string;
  sceneEmoji: string;
  characterEmoji: string;
  actionText: string;
  colorBg: string;
}

export const ComicStripModal: React.FC<ComicStripModalProps> = ({
  storyData,
  isOpen,
  onClose,
}) => {
  const [activePanelIdx, setActivePanelIdx] = useState(0);

  if (!isOpen) return null;

  // Split story text into 4 dynamic comic panels
  const paragraphs = storyData.story.split(/\n+/).filter((p) => p.trim().length > 0);
  const heroName = storyData.hero?.name || 'Explorer Pip';
  const companion = storyData.hero?.companion || 'Bolt';
  const companionIcon = storyData.hero?.companionIcon || '🤖🐶';

  const panels: ComicPanel[] = [
    {
      panelNumber: 1,
      caption: `Chapter 1: The Curious Question`,
      dialogue: `"Look at that! Why does ${storyData.topic} work that way?"`,
      sceneEmoji: '🌄 🔍',
      characterEmoji: `🧑‍🚀 ${companionIcon}`,
      actionText: `${heroName} and ${companion} start their journey to understand the mystery!`,
      colorBg: 'from-amber-100 to-orange-50 border-amber-300',
    },
    {
      panelNumber: 2,
      caption: `Chapter 2: The Breakthrough`,
      dialogue: `"Aha! The hidden forces of nature are connecting right before our eyes!"`,
      sceneEmoji: '⚡ 🔬',
      characterEmoji: '🧪 ✨',
      actionText: paragraphs[0]?.slice(0, 160) || 'An incredible discovery takes place in real time!',
      colorBg: 'from-sky-100 to-indigo-50 border-sky-300',
    },
    {
      panelNumber: 3,
      caption: `Chapter 3: The Big Discovery`,
      dialogue: `"Now the scientific rule makes complete sense! Everything is in balance!"`,
      sceneEmoji: '💡 🌿',
      characterEmoji: '🦉 🌟',
      actionText: paragraphs[1]?.slice(0, 160) || paragraphs[0]?.slice(160, 320) || 'The secret of science is unlocked!',
      colorBg: 'from-emerald-100 to-teal-50 border-emerald-300',
    },
    {
      panelNumber: 4,
      caption: `Chapter 4: The STEM Hero's Takeaway`,
      dialogue: storyData.takeaway ? `"${storyData.takeaway}"` : `"Curiosity solves any puzzle!"`,
      sceneEmoji: '🏆 🚀',
      characterEmoji: '🎉 🛰️',
      actionText: `Mission accomplished! ${heroName} recorded the laws of ${storyData.topic}!`,
      colorBg: 'from-purple-100 to-pink-50 border-purple-300',
    },
  ];

  const handleReadPanel = (p: ComicPanel) => {
    if (globalVoiceEngine.isAvailable()) {
      globalVoiceEngine.speakText(`${p.caption}. ${p.actionText}. ${p.dialogue}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 max-h-[92vh] overflow-y-auto relative animate-scale-up border border-slate-200 shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🎨</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                  {storyData.title} — Illustrated Comic Strip
                </h3>
                <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  4-Panel Strip
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Visual story scenes with dialogue bubbles & comic action cues
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Comic</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>

        {/* 4 Comic Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          {panels.map((p) => (
            <div
              key={p.panelNumber}
              className={`rounded-2xl border-3 p-4 bg-gradient-to-br ${p.colorBg} shadow-sm relative flex flex-col justify-between min-h-[220px] transition-transform hover:scale-[1.01]`}
            >
              {/* Panel Top Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider font-mono bg-black/80 text-white px-2 py-0.5 rounded-md">
                  Panel #{p.panelNumber}
                </span>
                <button
                  onClick={() => handleReadPanel(p)}
                  className="p-1 rounded-lg bg-white/70 hover:bg-white text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                  title="Read panel dialogue"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Graphic Scene Illustration */}
              <div className="my-2 p-3 rounded-xl bg-white/70 border border-black/10 flex items-center justify-between shadow-2xs">
                <span className="text-3xl">{p.characterEmoji}</span>
                <div className="text-right">
                  <span className="text-2xl">{p.sceneEmoji}</span>
                </div>
              </div>

              {/* Speech Bubble */}
              {p.dialogue && (
                <div className="relative bg-white text-slate-900 rounded-2xl p-3 border-2 border-slate-900 text-xs font-bold shadow-xs my-2">
                  <div className="italic text-indigo-900">{p.dialogue}</div>
                  <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-900 rotate-45" />
                </div>
              )}

              {/* Action caption description */}
              <div className="mt-2 text-[11px] font-medium text-slate-700 bg-white/60 p-2 rounded-lg border border-black/5">
                {p.actionText}
              </div>
            </div>
          ))}
        </div>

        {/* Comic Strip Footer Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Tip: Click the speaker button on each comic panel to hear character lines!</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold cursor-pointer"
          >
            Back to Story Reader
          </button>
        </div>
      </div>
    </div>
  );
};
