import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  Star,
  Globe,
  Brain,
  Zap,
  Compass,
  Printer,
  Shield,
  Layers,
  Heart,
  Share2,
} from 'lucide-react';
import { SavedStoryItem, StudentBadge, PassportStamp, CollectibleSticker } from '../types';

interface BadgesPageProps {
  savedStories: SavedStoryItem[];
  onStartReading: () => void;
  userName?: string;
}

export const BadgesPage: React.FC<BadgesPageProps> = ({ savedStories, onStartReading, userName }) => {
  const [activeTab, setActiveTab] = useState<'passport' | 'badges' | 'stickers'>('passport');

  const totalStories = savedStories.length;
  const quizzesTaken = savedStories.filter((s) => s.quizScore !== undefined).length;
  const perfectQuizzes = savedStories.filter(
    (s) => s.quizScore && s.quizScore.score === s.quizScore.total
  ).length;
  const multilingualStories = savedStories.filter((s) => s.language !== 'English').length;
  const olderStories = savedStories.filter((s) => s.age_group === '11-14' || s.age_group === '15+').length;

  // Retrieve passport data from localStorage if available
  const passportStorageKey = 'fablestem_passport_data_v1';
  let storedPassportData = { missionsCompleted: 0 };
  try {
    const raw = localStorage.getItem(passportStorageKey);
    if (raw) storedPassportData = JSON.parse(raw);
  } catch {}

  const missionsCompleted = storedPassportData.missionsCompleted || 0;

  // Themed STEM Passport Stamps
  const PASSPORT_STAMPS: PassportStamp[] = [
    {
      id: 'stamp-gravity',
      title: 'Gravity Navigator',
      topic: 'Gravity & Forces',
      date: 'Field Certified',
      icon: '🌌',
      score: '5/5 Stars',
    },
    {
      id: 'stamp-fraction',
      title: 'Fraction Wizard',
      topic: 'Fractions & Math',
      date: 'Field Certified',
      icon: '🍕',
      score: 'Mastered',
    },
    {
      id: 'stamp-dino',
      title: 'Dino Paleontologist',
      topic: 'Fossils & Prehistory',
      date: 'Field Certified',
      icon: '🦕',
      score: 'Field Cleared',
    },
    {
      id: 'stamp-photo',
      title: 'Photosynthesis Pioneer',
      topic: 'Plant Food & Light',
      date: 'Field Certified',
      icon: '🌱',
      score: 'Solar Balanced',
    },
    {
      id: 'stamp-water',
      title: 'Water Cycle Voyager',
      topic: 'Evaporation & Rain',
      date: 'Field Certified',
      icon: '💧',
      score: 'Cycle Completed',
    },
    {
      id: 'stamp-circuit',
      title: 'Circuit Master',
      topic: 'Electricity & Power',
      date: 'Field Certified',
      icon: '⚡',
      score: 'Energized',
    },
  ];

  // Standard Badges
  const BADGES: StudentBadge[] = [
    {
      id: 'first-story',
      title: 'First Page Turned',
      description: 'Read or save your very first educational story in FableSTEM.',
      icon: '🐣',
      unlocked: totalStories >= 1,
      category: 'reading',
    },
    {
      id: 'story-worm',
      title: 'Story Explorer',
      description: 'Read and collect 3 different educational stories.',
      icon: '📚',
      unlocked: totalStories >= 3,
      category: 'reading',
    },
    {
      id: 'quiz-hero',
      title: 'Quiz Master (100%)',
      description: 'Score a perfect 5 out of 5 on any comprehension quiz!',
      icon: '🏆',
      unlocked: perfectQuizzes >= 1,
      category: 'quiz',
    },
    {
      id: 'quiz-trio',
      title: 'Comprehension Champ',
      description: 'Complete 3 comprehension quizzes after reading.',
      icon: '🎯',
      unlocked: quizzesTaken >= 3,
      category: 'quiz',
    },
    {
      id: 'polyglot',
      title: 'World Citizen',
      description: 'Read a story in Hindi (हिंदी), Tamil (தமிழ்) or another language.',
      icon: '🌍',
      unlocked: multilingualStories >= 1,
      category: 'polyglot',
    },
    {
      id: 'scholar-mind',
      title: 'Deep Thinker',
      description: 'Explore an advanced topic in the Age 11–14 or 15+ category.',
      icon: '🦉',
      unlocked: olderStories >= 1,
      category: 'reading',
    },
    {
      id: 'mission-agent',
      title: 'Micro-Mission Operator',
      description: 'Complete in-story micro-missions to calibrate discovery sensors.',
      icon: '✨',
      unlocked: missionsCompleted >= 1 || totalStories >= 1,
      category: 'mission',
    },
    {
      id: 'curious-scientist',
      title: 'Star Inquirer',
      description: 'Ask the Character mentor spontaneous questions about science.',
      icon: '🚀',
      unlocked: totalStories >= 1,
      category: 'science',
    },
  ];

  // Collectible Stickers in Album
  const STICKERS: CollectibleSticker[] = [
    {
      id: 'st-bolt',
      name: 'Bolt the Robot Pup',
      emoji: '🤖🐶',
      rarity: 'common',
      description: 'Loyal companion who sniffs out electromagnetic radiation.',
      unlocked: true,
    },
    {
      id: 'st-ignis',
      name: 'Ignis the Baby Dragon',
      emoji: '🐉',
      rarity: 'rare',
      description: 'Friendly dragon who breathes gentle thermal convection currents.',
      unlocked: totalStories >= 1,
    },
    {
      id: 'st-athena',
      name: 'Athena the Quantum Owl',
      emoji: '🦉',
      rarity: 'legendary',
      description: 'Wise guardian of wavelength frequencies and night observation.',
      unlocked: quizzesTaken >= 2 || totalStories >= 2,
    },
    {
      id: 'st-supernova',
      name: 'Supernova Sparkle',
      emoji: '⭐',
      rarity: 'rare',
      description: 'Awarded for completing all 5 comprehension questions.',
      unlocked: perfectQuizzes >= 1,
    },
    {
      id: 'st-crystal',
      name: 'Prism Light Splitter',
      emoji: '💎',
      rarity: 'common',
      description: 'Refracts visible light into full rainbows.',
      unlocked: totalStories >= 1,
    },
    {
      id: 'st-fossil',
      name: 'Golden Ammonite Fossil',
      emoji: '🐚',
      rarity: 'rare',
      description: 'Fibonacci spiral preserved over 65 million years.',
      unlocked: totalStories >= 2,
    },
    {
      id: 'st-rocket',
      name: 'Orbital Escape Booster',
      emoji: '🚀',
      rarity: 'legendary',
      description: 'Mastered escape velocity and gravitational orbits.',
      unlocked: quizzesTaken >= 1,
    },
    {
      id: 'st-chloroplast',
      name: 'Chlorophyll Sun Shield',
      emoji: '🍃',
      rarity: 'common',
      description: 'Converts sunshine, water, and air into sweet energy.',
      unlocked: true,
    },
  ];

  const unlockedCount = BADGES.filter((b) => b.unlocked).length;
  const level =
    unlockedCount >= 6 ? 'Chief STEM Alchemist' : unlockedCount >= 3 ? 'Orbit Navigator' : 'Cadet Explorer';

  const childName = userName || 'Curious Explorer';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 no-print">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 mb-3">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>FableSTEM Explorer Passport</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Explorer Passport & Badges
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Track your developmental STEM milestones, collecting official passport stamps, badges, and shiny digital stickers!
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex justify-center gap-2 mb-8 no-print">
        <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200/80 inline-flex">
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'passport'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Official Passport</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Badges ({unlockedCount}/{BADGES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stickers'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sticker Album</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Official Explorer Passport Card */}
      {activeTab === 'passport' && (
        <div className="space-y-8 animate-fade-in">
          {/* Passport Cover / Book Frame */}
          <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-10 shadow-2xl border-4 border-amber-400/80 relative overflow-hidden">
            {/* Background seal watermarks */}
            <div className="absolute -right-10 -bottom-10 opacity-10 text-white pointer-events-none text-9xl">
              🧭
            </div>

            {/* Passport Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-indigo-700/80">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-400/30">
                  🏛️
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold block">
                    Global Academy of Science
                  </span>
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                    FableSTEM Official Explorer Passport
                  </h2>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="no-print px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Passport</span>
              </button>
            </div>

            {/* Child Profile Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 pt-2">
              {/* Photo / Avatar Box */}
              <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/15 rounded-2xl text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-indigo-950 flex items-center justify-center text-4xl mb-2 shadow-inner">
                  🧑‍🚀
                </div>
                <h3 className="font-heading font-extrabold text-base text-white">{childName}</h3>
                <span className="text-[11px] text-amber-300 font-bold">{level}</span>
              </div>

              {/* Passport Specs */}
              <div className="sm:col-span-2 space-y-3 text-xs justify-center flex flex-col font-mono">
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-indigo-300 uppercase">Passport ID:</span>
                  <span className="font-bold text-white">FABLE-STEM-2026-X9</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-indigo-300 uppercase">Explorer Rank:</span>
                  <span className="font-bold text-amber-300">{level}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-indigo-300 uppercase">Stories Explored:</span>
                  <span className="font-bold text-emerald-300">{totalStories} Completed</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-indigo-300 uppercase">Quizzes Passed:</span>
                  <span className="font-bold text-sky-300">{quizzesTaken} Field Checks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300 uppercase">Missions Calibrated:</span>
                  <span className="font-bold text-amber-200">{missionsCompleted} Mini-Missions</span>
                </div>
              </div>
            </div>

            {/* Stamped Visas Section */}
            <div className="mt-6 pt-6 border-t border-indigo-700/80">
              <h4 className="font-heading font-extrabold text-xs uppercase tracking-widest text-amber-300 mb-4 flex items-center gap-2">
                <span>Earned Explorer Stamps</span>
                <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded-full text-amber-200">
                  {savedStories.length > 0 ? 'Verified' : 'Ready to Stamp'}
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PASSPORT_STAMPS.map((stamp, idx) => {
                  const isEarned = totalStories > idx || (idx === 0 && totalStories >= 1);
                  return (
                    <div
                      key={stamp.id}
                      className={`p-3 rounded-2xl border transition-all text-center relative ${
                        isEarned
                          ? 'border-dashed border-amber-400 bg-amber-400/10 rotate-[-1deg] shadow-sm'
                          : 'border-dashed border-white/20 bg-white/5 opacity-40'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{stamp.icon}</span>
                      <h5 className="font-heading font-black text-xs text-white leading-tight">
                        {stamp.title}
                      </h5>
                      <p className="text-[10px] text-indigo-200 mt-0.5">{stamp.topic}</p>
                      <span
                        className={`inline-block mt-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isEarned ? 'bg-amber-400 text-indigo-950' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {isEarned ? 'STAMPED ✓' : 'Awaiting Mission'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Badges Grid */}
      {activeTab === 'badges' && (
        <div className="space-y-8 animate-fade-in">
          {/* Stats Summary Card */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-200 mb-10 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
                  Current Rank:
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                  {level} 🌟
                </h2>
                <p className="text-xs text-indigo-200 mt-1">
                  You have unlocked {unlockedCount} of {BADGES.length} milestone badges!
                </p>
              </div>

              {/* Stat counters */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300 block">
                    {totalStories}
                  </span>
                  <span className="text-[11px] text-indigo-200 font-medium">Stories Read</span>
                </div>

                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-300 block">
                    {quizzesTaken}
                  </span>
                  <span className="text-[11px] text-indigo-200 font-medium">Quizzes Taken</span>
                </div>

                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-violet-300 block">
                    {perfectQuizzes}
                  </span>
                  <span className="text-[11px] text-indigo-200 font-medium">100% Scores</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(unlockedCount / BADGES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all text-center flex flex-col justify-between ${
                  badge.unlocked
                    ? 'bg-white border-amber-200 shadow-md shadow-amber-100/50 hover:scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl shadow-sm ${
                      badge.unlocked
                        ? 'bg-amber-100/80 ring-4 ring-amber-300/40 animate-pulse-glow'
                        : 'bg-slate-200 grayscale'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="font-heading font-bold text-sm text-slate-900">
                      {badge.title}
                    </h3>
                    {badge.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      badge.unlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {badge.unlocked ? 'Unlocked 🌟' : 'Locked 🔒'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Digital Sticker Album */}
      {activeTab === 'stickers' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs mb-6 text-center max-w-xl mx-auto">
            <h3 className="font-heading font-black text-lg text-slate-900">
              Explorer Sticker Album
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Collect all rare and legendary STEM companion stickers by completing stories, quizzes, and language missions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STICKERS.map((sticker) => (
              <div
                key={sticker.id}
                className={`p-5 rounded-3xl border transition-all text-center flex flex-col justify-between ${
                  sticker.unlocked
                    ? sticker.rarity === 'legendary'
                      ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                      : sticker.rarity === 'rare'
                      ? 'bg-gradient-to-b from-violet-50 to-purple-50 border-violet-300 shadow-sm'
                      : 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-100 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div>
                  <div className="text-4xl mb-2 transition-transform hover:scale-110">
                    {sticker.emoji}
                  </div>
                  <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                    {sticker.name}
                  </h4>
                  <span
                    className={`inline-block my-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      sticker.rarity === 'legendary'
                        ? 'bg-amber-200 text-amber-900'
                        : sticker.rarity === 'rare'
                        ? 'bg-violet-200 text-violet-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sticker.rarity}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {sticker.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-black/5 text-[10px] font-bold">
                  {sticker.unlocked ? '✨ Placed in Album' : '🔒 Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center mt-12 no-print">
        <button
          onClick={onStartReading}
          className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer"
        >
          Read a New Story to Stamp Your Passport ✨
        </button>
      </div>
    </div>
  );
};
