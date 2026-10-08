import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  FlaskConical,
  Rocket,
  History,
  HeartHandshake,
  Calculator,
  Leaf,
  Users,
  BookOpen,
  ShoppingCart,
  Search,
  ExternalLink,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import { AgeGroup, SupportedLanguage, StoryLength } from '../types';

interface ExplorePageProps {
  onSelectTopic: (params: {
    topic: string;
    age_group: AgeGroup;
    language: SupportedLanguage;
    length: StoryLength;
    autoLaunch?: boolean;
  }) => void;
}

interface CuratedTopic {
  id: string;
  category: 'science' | 'space' | 'history' | 'ethics' | 'math' | 'eco';
  title: string;
  emoji: string;
  hook: string;
  recommendedAge: AgeGroup;
  prompt: string;
  color: string;
}

const CURATED_TOPICS: CuratedTopic[] = [
  // Science & Nature
  {
    id: 'photosynthesis',
    category: 'science',
    title: 'How Plants Make Food',
    emoji: '🌱',
    hook: 'Discover the secret kitchen inside green leaves turning sunlight into sugar!',
    recommendedAge: '8-10',
    prompt: 'Photosynthesis and How Plants Eat Sunlight',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'volcanoes',
    category: 'science',
    title: 'The Fire Below: Volcanoes',
    emoji: '🌋',
    hook: 'Journey deep beneath Earth’s crust to see how magma and pressure build erupting giants.',
    recommendedAge: '8-10',
    prompt: 'How Volcanoes Form and Erupt',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'deep-ocean',
    category: 'science',
    title: 'Creatures of the Deep Sea',
    emoji: '🐙',
    hook: 'Meet glowing bioluminescent creatures swimming in the pitch-black Mariana Trench.',
    recommendedAge: '11-14',
    prompt: 'Bioluminescence and Extreme Life in Deep Ocean Trenches',
    color: 'from-blue-600 to-cyan-600',
  },

  // Space & Cosmos
  {
    id: 'mars-rover',
    category: 'space',
    title: 'The Mars Rover Adventure',
    emoji: '🤖',
    hook: 'Follow a robotic scientist exploring red dust dunes millions of miles from Earth.',
    recommendedAge: '8-10',
    prompt: 'How Mars Rovers Search for Clues of Water on the Red Planet',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'black-holes',
    category: 'space',
    title: 'Gravity & The Mystery of Black Holes',
    emoji: '🕳️',
    hook: 'What happens when a giant star collapses so dense that even light cannot escape?',
    recommendedAge: '11-14',
    prompt: 'Black Holes, Event Horizons, and Space-Time Gravity',
    color: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'moon-phases',
    category: 'space',
    title: 'Why Does the Moon Change Shape?',
    emoji: '🌙',
    hook: 'Watch the cosmic dance between the Sun, Earth, and Moon that creates crescents and full moons.',
    recommendedAge: '5-7',
    prompt: 'Why the Moon Changes Shape: Moon Phases for Kids',
    color: 'from-indigo-500 to-violet-600',
  },

  // History & Pioneers
  {
    id: 'marie-curie',
    category: 'history',
    title: 'Marie Curie: The Radium Quest',
    emoji: '🔬',
    hook: 'The relentless pioneer who won two Nobel Prizes and transformed physics and medicine.',
    recommendedAge: '11-14',
    prompt: 'Marie Curie, Radioactivity, and Scientific Discovery',
    color: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'wright-brothers',
    category: 'history',
    title: 'First Flight: Kitty Hawk 1903',
    emoji: '✈️',
    hook: 'How two bicycle builders studied bird wings and cracked the secret of powered flight.',
    recommendedAge: '8-10',
    prompt: 'The Wright Brothers and the Invention of Powered Airplane Flight',
    color: 'from-sky-500 to-indigo-600',
  },

  // Values & Ethics
  {
    id: 'empathy',
    category: 'ethics',
    title: 'The Whispering Bridge: Empathy',
    emoji: '🤝',
    hook: 'When two rival inventors realize true strength comes from listening and walking in each other’s shoes.',
    recommendedAge: '8-10',
    prompt: 'Empathy, Compassion, and Understanding Others in Science and Life',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'perseverance',
    category: 'ethics',
    title: 'The Edison Spark: Never Giving Up',
    emoji: '💡',
    hook: 'Failing 1,000 times before finding the bamboo fiber that lit up the modern world.',
    recommendedAge: '5-7',
    prompt: 'Perseverance, Grit, and Learning from Mistakes in Inventions',
    color: 'from-amber-500 to-yellow-600',
  },

  // Real-Life Math
  {
    id: 'fibonacci',
    category: 'math',
    title: 'The Secret Spiral: Fibonacci',
    emoji: '🌻',
    hook: 'Why sunflowers, seashells, pinecones, and galaxies all follow the exact same mathematical spiral.',
    recommendedAge: '11-14',
    prompt: 'The Fibonacci Sequence and Golden Ratio in Nature',
    color: 'from-emerald-500 to-green-700',
  },
  {
    id: 'fractions-pizza',
    category: 'math',
    title: 'The Great Pizza Feast: Fractions',
    emoji: '🍕',
    hook: 'Fair shares, halves, quarters, and eighths at the animal kingdom’s most delicious party.',
    recommendedAge: '5-7',
    prompt: 'Understanding Fractions, Equal Parts, and Fair Sharing for Kids',
    color: 'from-red-500 to-orange-600',
  },

  // Eco & Planet
  {
    id: 'coral-reefs',
    category: 'eco',
    title: 'The Rainforests of the Sea',
    emoji: '🪸',
    hook: 'How tiny coral polyps build gigantic cities that shelter 25% of all marine life.',
    recommendedAge: '8-10',
    prompt: 'Coral Reefs, Ocean Biodiversity, and Protecting Marine Habitats',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'renewable-energy',
    category: 'eco',
    title: 'Catching Sun and Wind: Clean Energy',
    emoji: '💨',
    hook: 'How spinning wind turbines and shiny solar panels replace fossil fuels.',
    recommendedAge: '11-14',
    prompt: 'Renewable Energy: Solar and Wind Power for a Cleaner Planet',
    color: 'from-emerald-600 to-teal-700',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: Compass },
  { id: 'science', label: 'Science & Nature', icon: FlaskConical },
  { id: 'space', label: 'Space & Cosmos', icon: Rocket },
  { id: 'history', label: 'History & Pioneers', icon: History },
  { id: 'ethics', label: 'Values & Ethics', icon: HeartHandshake },
  { id: 'math', label: 'Real-Life Math', icon: Calculator },
  { id: 'eco', label: 'Eco & Planet', icon: Leaf },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectTopic }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('English');
  const [activeTab, setActiveTab] = useState<'topics' | 'books'>('topics');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTopics = CURATED_TOPICS.filter((t) => {
    const matchesCat = activeCategory === 'all' || t.category === activeCategory;
    const matchesQuery =
      !searchFilter.trim() ||
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.prompt.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.hook.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Curated Discovery & Suggested Reading</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Explore Topics, Books & Themed Worlds
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Read interactive stories crafted by FableSTEM or instantly order recommended books on Amazon & Flipkart and explore verified educational websites!
        </p>

        {/* View Mode Toggle */}
        <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mt-5 shadow-2xs">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'topics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Story Topics ({CURATED_TOPICS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'books'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Bookshelf (Amazon & Flipkart)</span>
          </button>
        </div>
      </div>

      {/* Category Pills, Search, & Language Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Search Filter */}
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter topics..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Story Language Selector */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
            <span>Lang:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              className="font-semibold text-indigo-700 bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="English">English 🇬🇧</option>
              <option value="Hindi">Hindi (हिंदी) 🇮🇳</option>
              <option value="Tamil">Tamil (தமிழ்) 🇮🇳</option>
              <option value="Spanish">Spanish 🇪🇸</option>
              <option value="French">French 🇫🇷</option>
              <option value="German">German 🇩🇪</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: CURATED TOPICS VIEW */}
      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const amazonLink = `https://www.amazon.in/s?k=${encodeURIComponent(`${topic.prompt} kids book`)}`;
            const flipkartLink = `https://www.flipkart.com/search?q=${encodeURIComponent(`${topic.prompt} kids book`)}`;
            const googleLink = `https://www.google.com/search?q=${encodeURIComponent(`${topic.prompt} educational website for kids`)}`;

            return (
              <div
                key={topic.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl transition-all p-5.5 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{topic.emoji}</span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1 border border-slate-200">
                      <Users className="w-3 h-3 text-indigo-500" />
                      <span>Age {topic.recommendedAge}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {topic.hook}
                  </p>
                </div>

                {/* Card Actions: Primary Read Button + Direct Amazon/Flipkart/Google Links */}
                <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
                  <button
                    onClick={() =>
                      onSelectTopic({
                        topic: topic.prompt,
                        age_group: topic.recommendedAge,
                        language: selectedLanguage,
                        length: 'medium',
                        autoLaunch: true,
                      })
                    }
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200 cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Read FableSTEM Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* 1-Click Buy Books & Web Redirects */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
                    <a
                      href={amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center gap-1 font-semibold transition-colors text-center"
                      title="Search books on Amazon"
                    >
                      <ShoppingCart className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>Amazon</span>
                    </a>

                    <a
                      href={flipkartLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 flex items-center justify-center gap-1 font-semibold transition-colors text-center"
                      title="Search books on Flipkart"
                    >
                      <span className="font-black text-blue-600">F</span>
                      <span>Flipkart</span>
                    </a>

                    <a
                      href={googleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center gap-1 font-semibold transition-colors text-center"
                      title="Explore websites on Google"
                    >
                      <Globe className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>Websites</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: DEDICATED BOOKSHELF & RESOURCE DIRECTORY */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border border-indigo-100">
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Recommended STEM Books by Topic (Amazon & Flipkart)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Browse our curated reading list. Every book title links directly to purchase on Amazon or Flipkart, or preview chapters on Google Books.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTopics.map((topic, idx) => {
              const amazonBook = `https://www.amazon.in/s?k=${encodeURIComponent(`${topic.prompt} kids science book`)}`;
              const flipkartBook = `https://www.flipkart.com/search?q=${encodeURIComponent(`${topic.prompt} kids book`)}`;
              const googleBook = `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(`${topic.prompt} science`)}`;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{topic.emoji}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {topic.category.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900 mb-1">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Recommended reading level: <strong>Age {topic.recommendedAge}</strong>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                      {topic.hook}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={amazonBook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-700" />
                        <span>Amazon</span>
                        <ArrowUpRight className="w-3 h-3 text-amber-600" />
                      </a>

                      <a
                        href={flipkartBook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="font-black text-blue-600">F</span>
                        <span>Flipkart</span>
                        <ArrowUpRight className="w-3 h-3 text-blue-600" />
                      </a>
                    </div>

                    <a
                      href={googleBook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                    >
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>Preview on Google Books</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
