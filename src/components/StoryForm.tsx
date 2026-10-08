import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Clock,
  Users,
  BookOpen,
  AlertCircle,
  Info,
  Flame,
  Moon,
  School,
  GraduationCap,
  Heart,
  Compass,
  Smile,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AgeGroup, StoryLength, SupportedLanguage, StoryMode, CurriculumStandard } from '../types';

interface StoryFormProps {
  onSubmit: (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
    hero_name?: string;
    hero_companion?: string;
    hero_hobby?: string;
    story_mode?: StoryMode;
    curriculum_standard?: CurriculumStandard;
  }) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  isUnsafeError?: boolean;
  defaultAgeGroup?: AgeGroup;
  userName?: string;
}

const EXAMPLE_TOPICS = [
  { label: '💧 Water Cycle', value: 'The Water Cycle' },
  { label: '🌱 Photosynthesis', value: 'Photosynthesis and Plant Food' },
  { label: '🚀 Solar System', value: 'The Solar System & Planets' },
  { label: '🍕 Fractions', value: 'Fractions and Sharing Fairly' },
  { label: '🌟 Gravity', value: 'Gravity and Why Objects Fall' },
  { label: '🚦 Road Safety', value: 'Road Safety and Traffic Rules' },
  { label: '🌊 Pollution', value: 'Ocean Pollution and Marine Life' },
  { label: '⚡ Electricity', value: 'How Electricity Powers Our Homes' },
];

const CURRICULUM_TOPICS: Record<CurriculumStandard, { grade: string; topic: string }[]> = {
  none: [],
  cbse: [
    { grade: 'Grade 4 (EVS)', topic: 'Photosynthesis & Parts of a Plant' },
    { grade: 'Grade 5 (Science)', topic: 'Water Cycle & States of Matter' },
    { grade: 'Grade 6 (Science)', topic: 'Frictional Force and Motion' },
    { grade: 'Grade 7 (Science)', topic: 'Heat Transfer: Conduction and Convection' },
    { grade: 'Grade 8 (Science)', topic: 'Sound Waves and Vibration' },
  ],
  us_common_core: [
    { grade: 'Grade 2 (NGSS)', topic: 'Habitats & Biodiversity' },
    { grade: 'Grade 3 (Math/Sci)', topic: 'Fractions on a Number Line & Balanced Forces' },
    { grade: 'Grade 4 (NGSS)', topic: 'Energy Transfer and Collision' },
    { grade: 'Grade 5 (NGSS)', topic: 'Matter, Food Chains & Ecosystem Energy' },
    { grade: 'Middle School', topic: 'Newton’s Laws of Motion' },
  ],
  uk_curriculum: [
    { grade: 'Key Stage 1', topic: 'Seasonal Weather and Light' },
    { grade: 'Key Stage 2', topic: 'Electricity, Circuits and Switches' },
    { grade: 'Key Stage 2', topic: 'Forces and Magnets' },
    { grade: 'Key Stage 3', topic: 'The Particle Model of Matter' },
  ],
};

const COMPANIONS = [
  { id: 'Robot Puppy Bolt', name: 'Bolt', title: 'Robot Puppy', icon: '🤖🐶' },
  { id: 'Baby Dragon Ignis', name: 'Ignis', title: 'Baby Dragon', icon: '🐉' },
  { id: 'Space Explorer Nova', name: 'Nova', title: 'Cosmic Drone', icon: '🧑‍🚀' },
  { id: 'Forest Fox Rusty', name: 'Rusty', title: 'Forest Fox', icon: '🦊' },
  { id: 'Curious Kitten Whiskers', name: 'Whiskers', title: 'Curious Kitten', icon: '🐱' },
  { id: 'Quantum Owl Athena', name: 'Athena', title: 'Quantum Owl', icon: '🦉' },
];

const HOBBIES = [
  { id: 'stargazing & astronomy', label: '🔭 Stargazing' },
  { id: 'coding & robot building', label: '💻 Coding' },
  { id: 'drawing & colorful art', label: '🎨 Drawing' },
  { id: 'soccer & athletics', label: '⚽ Soccer' },
  { id: 'dinosaur digging & fossils', label: '🦕 Dino Digging' },
  { id: 'gardening & plant foraging', label: '🌿 Nature Exploring' },
  { id: 'baking & kitchen chemistry', label: '🧁 Baking & Food' },
  { id: 'music & sound beats', label: '🎵 Music Beats' },
];

const AGE_OPTIONS: { id: AgeGroup; title: string; subtitle: string; badge: string; icon: string }[] = [
  {
    id: '5-7',
    title: 'Ages 5–7',
    subtitle: '120–180 words. Simple sentences, cute animal characters, gentle ending.',
    badge: 'Grade 1–2',
    icon: '🐣',
  },
  {
    id: '8-10',
    title: 'Ages 8–10',
    subtitle: '250–350 words. Fun adventure, explanations woven into the story.',
    badge: 'Grade 3–5',
    icon: '🦊',
  },
  {
    id: '11-14',
    title: 'Ages 11–14',
    subtitle: '400–550 words. Richer vocabulary, cause & effect, engaging dilemma.',
    badge: 'Grade 6–8',
    icon: '🦉',
  },
  {
    id: '15+',
    title: 'Ages 15+',
    subtitle: '500–700 words. Real-world systems, mature concepts & analytical reasoning.',
    badge: 'Grade 9+',
    icon: '🦅',
  },
];

const LANGUAGE_OPTIONS: { id: SupportedLanguage; label: string; native: string; flag: string }[] = [
  { id: 'English', label: 'English', native: 'English', flag: '🇬🇧' },
  { id: 'Hindi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { id: 'Tamil', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { id: 'Spanish', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { id: 'French', label: 'French', native: 'Français', flag: '🇫🇷' },
  { id: 'German', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
];

const LENGTH_OPTIONS: { id: StoryLength; label: string; desc: string }[] = [
  { id: 'short', label: 'Short', desc: 'Quick bite (3 mins)' },
  { id: 'medium', label: 'Medium', desc: 'Ideal standard story' },
  { id: 'long', label: 'Long', desc: 'Deep dive story' },
];

export const StoryForm: React.FC<StoryFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
  isUnsafeError,
  defaultAgeGroup,
  userName,
}) => {
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(defaultAgeGroup || '8-10');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [length, setLength] = useState<StoryLength>('medium');
  const [clientError, setClientError] = useState<string | null>(null);

  // New Features: Story Mode, Curriculum, Hero
  const [storyMode, setStoryMode] = useState<StoryMode>('classroom');
  const [curriculumStandard, setCurriculumStandard] = useState<CurriculumStandard>('none');
  const [isHeroOpen, setIsHeroOpen] = useState(false);
  const [childHeroName, setChildHeroName] = useState(userName || '');
  const [selectedCompanion, setSelectedCompanion] = useState(COMPANIONS[0].id);
  const [selectedHobby, setSelectedHobby] = useState(HOBBIES[0].id);

  // Sync default age group if user logs in
  React.useEffect(() => {
    if (defaultAgeGroup) {
      setAgeGroup(defaultAgeGroup);
    }
    if (userName && !childHeroName) {
      setChildHeroName(userName);
    }
  }, [defaultAgeGroup, userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setClientError('Please enter what you want to learn!');
      return;
    }
    if (cleanTopic.length > 100) {
      setClientError('Please keep topic under 100 characters.');
      return;
    }

    setClientError(null);
    onSubmit({
      topic: cleanTopic,
      age_group: ageGroup,
      language,
      length,
      hero_name: childHeroName.trim() || undefined,
      hero_companion: selectedCompanion,
      hero_hobby: selectedHobby,
      story_mode: storyMode,
      curriculum_standard: curriculumStandard,
    });
  };

  const handleSelectExample = (val: string) => {
    setTopic(val);
    setClientError(null);
  };

  return (
    <div id="story-form-card" className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/40 p-6 sm:p-9 relative">
        {/* Mode Switcher Banner: Bedtime Calm vs. Classroom Active */}
        <div className="mb-6 p-2 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setStoryMode('classroom')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              storyMode === 'classroom'
                ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4 text-indigo-600" />
            <span>Classroom Active Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setStoryMode('bedtime')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              storyMode === 'bedtime'
                ? 'bg-gradient-to-r from-indigo-900 to-purple-900 text-amber-200 shadow-sm border border-indigo-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-300" />
            <span>🌙 Bedtime Calm Mode</span>
          </button>
        </div>

        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
              {childHeroName ? `Adventure Awaits, Hero ${childHeroName}!` : 'Create Your STEM Story'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {storyMode === 'bedtime'
                ? 'Soothing, gentle twilight prose designed to relax the mind toward sweet sleep.'
                : 'Engaging, interactive STEM narrative adapted for your developmental age level.'}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {(clientError || errorMessage) && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-sm flex items-start gap-3 animate-fade-in ${
              isUnsafeError
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">
                {isUnsafeError ? 'Child Safety Guidance 🌱' : 'Just a moment'}
              </p>
              <p className="mt-0.5 leading-relaxed">{clientError || errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* 1. Topic Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="topic-input" className="block text-sm font-bold text-slate-800">
                1. What STEM topic do you want to learn? <span className="text-indigo-600">*</span>
              </label>
              <span className={`text-xs font-mono ${topic.length > 90 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                {topic.length}/100
              </span>
            </div>

            <div className="relative">
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value.slice(0, 100));
                  if (clientError) setClientError(null);
                }}
                placeholder="e.g. The Water Cycle, Photosynthesis, Solar System, Fractions, Black Holes..."
                disabled={isLoading}
                maxLength={100}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-base focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Topic Chips */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular ideas (click to try):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_TOPICS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectExample(item.value)}
                    disabled={isLoading}
                    className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/60 text-slate-700 font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 1: "Make Me the Hero" (Avatar & Name Personalization) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <button
              type="button"
              onClick={() => setIsHeroOpen(!isHeroOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌟</span>
                <div>
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-amber-950 flex items-center gap-2">
                    <span>"Make Me the Hero" Personalization</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      Stars in the Story
                    </span>
                  </h3>
                  <p className="text-xs text-amber-800/90 mt-0.5">
                    {childHeroName
                      ? `Hero: ${childHeroName} • Companion: ${selectedCompanion}`
                      : 'Put your child or student directly at the center of the story with a loyal companion pet!'}
                  </p>
                </div>
              </div>
              <div className="text-amber-800">
                {isHeroOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {isHeroOpen && (
              <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-4 animate-fade-in">
                {/* Child Name Input */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1.5">
                    Child's Explorer Name:
                  </label>
                  <input
                    type="text"
                    value={childHeroName}
                    onChange={(e) => setChildHeroName(e.target.value)}
                    placeholder="e.g. Aria, Kabir, Zoe, Liam..."
                    maxLength={30}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Companion Pet Selector */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1.5">
                    Choose a Companion Pet:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMPANIONS.map((pet) => {
                      const isSelected = selectedCompanion === pet.id;
                      return (
                        <button
                          key={pet.id}
                          type="button"
                          onClick={() => setSelectedCompanion(pet.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-amber-100 border-amber-500 shadow-2xs ring-1 ring-amber-500'
                              : 'bg-white/80 border-amber-200/80 hover:bg-white text-slate-700'
                          }`}
                        >
                          <span className="text-xl">{pet.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-amber-950 leading-tight">{pet.name}</p>
                            <p className="text-[10px] text-amber-800">{pet.title}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Favorite Hobby */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1.5">
                    Favorite Hobby to Weave into the Quest:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {HOBBIES.map((h) => {
                      const isSelected = selectedHobby === h.id;
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setSelectedHobby(h.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-600 text-white border-amber-700 font-bold'
                              : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100/50'
                          }`}
                        >
                          {h.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feature 2: Curriculum Standard Mapping (CBSE / NCERT / US Common Core) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Curriculum Standard Mapping (CBSE / NCERT / Common Core):</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                Educator Standard
              </span>
            </div>

            <select
              value={curriculumStandard}
              onChange={(e) => setCurriculumStandard(e.target.value as CurriculumStandard)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-800 text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="none">🌍 General STEM Fun & Inquiry</option>
              <option value="cbse">🇮🇳 CBSE / NCERT Curriculum (Grades 3–8 Science & EVS)</option>
              <option value="us_common_core">🇺🇸 US Common Core & NGSS (Next Gen Science)</option>
              <option value="uk_curriculum">🇬🇧 UK National Curriculum (Key Stages 1–3)</option>
            </select>

            {curriculumStandard !== 'none' && CURRICULUM_TOPICS[curriculumStandard].length > 0 && (
              <div className="mt-3 pt-3 border-t border-emerald-200/80 animate-fade-in">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1.5">
                  Click a syllabus benchmark to explore:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CURRICULUM_TOPICS[curriculumStandard].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectExample(item.topic)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100/70 font-medium transition-all active:scale-95 cursor-pointer"
                    >
                      <strong>{item.grade}:</strong> {item.topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Age Group Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>2. Select Age Group</span>
              </label>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                Vocabulary adapts to age
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              The exact same topic produces a completely tailored story length, sentence structure, and vocabulary depth for each developmental stage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGE_OPTIONS.map((item) => {
                const isSelected = ageGroup === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAgeGroup(item.id)}
                    disabled={isLoading}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-heading font-bold text-sm text-slate-900">
                          {item.title}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pr-2">
                      {item.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Language & Length Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>3. Select Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                disabled={isLoading}
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.label} ({lang.native})
                  </option>
                ))}
              </select>
            </div>

            {/* Length Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>4. Story Length</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LENGTH_OPTIONS.map((len) => {
                  const isSelected = length === len.id;
                  return (
                    <button
                      key={len.id}
                      type="button"
                      onClick={() => setLength(len.id)}
                      disabled={isLoading}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                      }`}
                      title={len.desc}
                    >
                      {len.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <strong>FableSTEM Multi-Feature Experience:</strong> Each generated story includes interactive mini-missions, Q&A with the character mentor, printable coloring sheets, Amazon/Flipkart book suggestions, and offline parent-child discussion prompts!
            </p>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isLoading || topic.trim().length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLoading || topic.trim().length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : storyMode === 'bedtime'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-amber-200 shadow-purple-300/60 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-300/60 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {isLoading
                ? 'Your STEM Story is Being Crafted...'
                : storyMode === 'bedtime'
                ? '🌙 Create Soothing Bedtime Story'
                : '✨ Create My STEM Adventure'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
