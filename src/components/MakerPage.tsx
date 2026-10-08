import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Beaker,
  Compass,
  ArrowRight,
  BookOpen,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { DrawAndColorStudio } from './DrawAndColorStudio';
import { StemExperimentSimulator } from './StemExperimentSimulator';
import { AmbientSoundscapesBar } from './AmbientSoundscapesBar';
import { soundscapeEngine } from '../services/soundscapes';

interface MakerPageProps {
  onLaunchTopicStory?: (topic: string) => void;
}

const FEATURED_STEM_PROJECTS = [
  {
    topic: 'Photosynthesis & Plant Biology',
    category: 'Life Sciences',
    badge: 'Botany & Solar Food',
    icon: '🌱',
    color: 'from-emerald-500 to-green-600',
    prompt: 'Color the chloroplast solar factory and draw carbon dioxide & water molecules forming glucose sugar!',
  },
  {
    topic: 'The Water Cycle & Cloud Condensation',
    category: 'Earth Systems',
    badge: 'Hydrology',
    icon: '🌧️',
    color: 'from-cyan-500 to-blue-600',
    prompt: 'Illustrate ocean water evaporating into billowing clouds, cooling into raindrops falling on mountain peaks!',
  },
  {
    topic: 'Planetary Orbits & Solar System',
    category: 'Astronomy & Physics',
    badge: 'Cosmic Gravity',
    icon: '🪐',
    color: 'from-indigo-500 to-purple-600',
    prompt: 'Sketch orbiting planets around the bright sun and draw your personalized rocket probe in orbit!',
  },
  {
    topic: 'Fractions & Geometric Symmetry',
    category: 'STEM Mathematics',
    badge: 'Fair Sharing',
    icon: '🍕',
    color: 'from-amber-500 to-orange-600',
    prompt: 'Draw circles and rectangles split into equal fractions (1/2, 1/4, 3/8) and color matching portions!',
  },
];

export const MakerPage: React.FC<MakerPageProps> = ({ onLaunchTopicStory }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('The Water Cycle & Cloud Condensation');
  const [activeMode, setActiveMode] = useState<'draw' | 'experiment'>('draw');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [xpNotice, setXpNotice] = useState<string | null>(null);

  const handleCustomTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopicInput.trim()) {
      soundscapeEngine.playSoundEffect('pop');
      setSelectedTopic(customTopicInput.trim());
      setCustomTopicInput('');
    }
  };

  const handleAwardXp = (amount: number, reason: string) => {
    setXpNotice(`+${amount} STEM Explorer XP! ${reason}`);
    setTimeout(() => setXpNotice(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-purple-200/50 relative overflow-hidden mb-8">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-pink-200 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive STEM Maker Lab</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight mb-2">
            Draw, Color & Experiment What You Learned
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-xl">
            Hands-on visual learning: translate abstract science & math concepts into custom digital drawings, coloring sheets, and interactive simulations.
          </p>

          {/* Quick Mode Toggle */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setActiveMode('draw');
                soundscapeEngine.playSoundEffect('pop');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === 'draw'
                  ? 'bg-white text-purple-900 shadow-md scale-102'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Palette className="w-4 h-4 text-pink-600" />
              <span>Draw & Color Studio</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('experiment');
                soundscapeEngine.playSoundEffect('pop');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === 'experiment'
                  ? 'bg-white text-purple-900 shadow-md scale-102'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Beaker className="w-4 h-4 text-cyan-600" />
              <span>Virtual Experiment Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Focus Sound & Ambient Audio Bar */}
      <div className="mb-6">
        <AmbientSoundscapesBar topic={selectedTopic} />
      </div>

      {/* XP Toast Notification */}
      {xpNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-black text-xs flex items-center justify-between shadow-lg animate-scale-up">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span>{xpNotice}</span>
          </div>
          <button
            onClick={() => setXpNotice(null)}
            className="text-amber-950 font-bold px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Topic Switcher Bar & Custom Input */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 shrink-0">Topics:</span>
            {FEATURED_STEM_PROJECTS.map((proj) => {
              const isSelected = selectedTopic === proj.topic;
              return (
                <button
                  key={proj.topic}
                  onClick={() => {
                    setSelectedTopic(proj.topic);
                    soundscapeEngine.playSoundEffect('pop');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{proj.icon}</span>
                  <span className="max-w-[150px] truncate">{proj.topic}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Topic Form */}
          <form onSubmit={handleCustomTopicSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Or enter any custom STEM topic..."
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 flex-1 md:w-60"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Set Topic
            </button>
          </form>
        </div>
      </div>

      {/* Main Workspace: Draw & Color Studio OR Virtual Experiment Lab */}
      {activeMode === 'draw' ? (
        <DrawAndColorStudio
          topic={selectedTopic}
          storyTitle={selectedTopic}
          onAwardXp={handleAwardXp}
        />
      ) : (
        <StemExperimentSimulator
          topic={selectedTopic}
          onAwardXp={handleAwardXp}
        />
      )}

      {/* Cross link to generate story on this topic */}
      {onLaunchTopicStory && (
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h4 className="font-heading font-black text-sm sm:text-base text-slate-900">
                Want to read a full adaptive story about "{selectedTopic}"?
              </h4>
              <p className="text-xs text-slate-600">
                Generate an illustrated narrative with companion characters, quizzes, and vocabulary.
              </p>
            </div>
          </div>

          <button
            onClick={() => onLaunchTopicStory(selectedTopic)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <span>Generate Story Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
