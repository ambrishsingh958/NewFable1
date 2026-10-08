import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Globe,
  ShoppingCart,
  Search,
  Sparkles,
  Compass,
  Bookmark,
  Share2,
  Check,
  BookMarked,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { SuggestedBook, SuggestedWebsite } from '../types';

interface SuggestedResourcesProps {
  topic: string;
  books?: SuggestedBook[];
  websites?: SuggestedWebsite[];
}

export const SuggestedResources: React.FC<SuggestedResourcesProps> = ({
  topic,
  books,
  websites,
}) => {
  const [storeRegion, setStoreRegion] = useState<'us' | 'in'>('in');
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [resourceTab, setResourceTab] = useState<'all' | 'books' | 'websites'>('all');

  // Dynamic Amazon domain based on selected region
  const amazonBaseUrl = storeRegion === 'in' ? 'https://www.amazon.in/s?k=' : 'https://www.amazon.com/s?k=';

  // Curate rich, high-interest books if not provided or to augment
  const displayBooks: SuggestedBook[] = books && books.length > 0 ? books : [
    {
      title: `The Science of ${topic} for Young Explorers`,
      author: 'National Geographic Kids',
      description: `Vivid diagrams, fun facts, and real-world photos showing how ${topic} works in nature and everyday life.`,
      amazonUrl: `${amazonBaseUrl}${encodeURIComponent(`${topic} national geographic kids book`)}`,
      flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(`${topic} national geographic kids book`)}`,
      googleUrl: `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(`${topic} national geographic kids`)}`,
    },
    {
      title: `The Magic School Bus Explores ${topic}`,
      author: 'Joanna Cole & Bruce Degen',
      description: `Ms. Frizzle and her curious class take an unforgettable journey inside ${topic} with interactive discoveries.`,
      amazonUrl: `${amazonBaseUrl}${encodeURIComponent(`${topic} magic school bus`)}`,
      flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(`${topic} magic school bus`)}`,
      googleUrl: `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(`${topic} magic school bus book`)}`,
    },
    {
      title: `Super STEM Adventures: ${topic}`,
      author: 'DK Smithsonian Children',
      description: `Packed with colorful illustrations, hands-on experiments, and easy explanations of ${topic}.`,
      amazonUrl: `${amazonBaseUrl}${encodeURIComponent(`${topic} DK children science book`)}`,
      flipkartUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(`${topic} DK science book`)}`,
      googleUrl: `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(`${topic} DK science book`)}`,
    },
  ];

  // Curate top educational websites
  const displayWebsites: SuggestedWebsite[] = websites && websites.length > 0 ? websites : [
    {
      title: `National Geographic Kids: ${topic}`,
      sourceName: 'NatGeo Kids',
      description: `Interactive animal and science guides, photographs, quizzes, and cool STEM videos on ${topic}.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`National Geographic Kids ${topic}`)}`,
    },
    {
      title: `NASA STEM Engagement & Kids Club`,
      sourceName: 'NASA STEM',
      description: `Real-world space missions, interactive diagrams, and hands-on experiments for curious learners.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`NASA Kids STEM ${topic}`)}`,
    },
    {
      title: `Khan Academy Discovery: ${topic}`,
      sourceName: 'Khan Academy',
      description: `Step-by-step video lessons, visual animations, and interactive practice questions.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`Khan Academy ${topic}`)}`,
    },
    {
      title: `Britannica Kids & Science Encyclopedia`,
      sourceName: 'Britannica Kids',
      description: `Fact-checked student encyclopedia entries with age-graded reading levels and infographics.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`Britannica Kids ${topic}`)}`,
    },
  ];

  // Helper to copy book search details
  const handleCopyBookDetails = (book: SuggestedBook, idx: number) => {
    const text = `Recommended Book: "${book.title}" ${book.author ? `by ${book.author}` : ''} - Check on Amazon or Flipkart: ${book.amazonUrl}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLinkIndex(idx);
      setTimeout(() => setCopiedLinkIndex(null), 2200);
    }
  };

  const effectiveQuery = customSearchQuery.trim() || topic;

  return (
    <section id="suggested-resources" className="bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20 rounded-3xl border border-indigo-100 p-6 sm:p-9 shadow-lg shadow-indigo-100/40 my-8 transition-all">
      {/* Header with Title and Store Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7 pb-5 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Curated STEM Books & Educational Websites</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Dive Deeper into {topic}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Order recommended books directly on <strong className="text-amber-800">Amazon</strong> or <strong className="text-blue-700">Flipkart</strong>, or explore verified educational portals on <strong className="text-emerald-700">Google</strong>.
          </p>
        </div>

        {/* Region & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
            <span className="px-2 text-[11px] text-slate-500">Store:</span>
            <button
              onClick={() => setStoreRegion('in')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                storeRegion === 'in'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Amazon.in & Flipkart"
            >
              🇮🇳 India
            </button>
            <button
              onClick={() => setStoreRegion('us')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                storeRegion === 'us'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Amazon.com Global"
            >
              🌐 Global (US)
            </button>
          </div>

          <span className="hidden sm:inline-flex text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
            FableSTEM Curated
          </span>
        </div>
      </div>

      {/* Quick Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Resource Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setResourceTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              resourceTab === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Resources ({displayBooks.length + displayWebsites.length})
          </button>
          <button
            onClick={() => setResourceTab('books')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              resourceTab === 'books'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Books ({displayBooks.length})</span>
          </button>
          <button
            onClick={() => setResourceTab('websites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              resourceTab === 'websites'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Websites ({displayWebsites.length})</span>
          </button>
        </div>

        {/* 1-Click Custom Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customSearchQuery}
            onChange={(e) => setCustomSearchQuery(e.target.value)}
            placeholder={`Search books or websites...`}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 1. RECOMMENDED BOOKS SECTION */}
      {(resourceTab === 'all' || resourceTab === 'books') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <BookOpen className="w-4 h-4" />
              </span>
              <span>Recommended Books to Buy on Amazon & Flipkart</span>
            </h4>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Safe 1-click external redirects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {displayBooks.map((book, idx) => {
              // Dynamically adjust URLs if custom search query is typed
              const dynamicAmazon = customSearchQuery
                ? `${amazonBaseUrl}${encodeURIComponent(customSearchQuery)}`
                : storeRegion === 'in'
                ? book.amazonUrl.replace('amazon.com', 'amazon.in')
                : book.amazonUrl;

              const dynamicFlipkart = customSearchQuery
                ? `https://www.flipkart.com/search?q=${encodeURIComponent(customSearchQuery)}`
                : book.flipkartUrl;

              const dynamicGoogle = customSearchQuery
                ? `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(customSearchQuery)}`
                : book.googleUrl;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-blue-500 opacity-80" />

                  <div>
                    {/* Badge & Share */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <span>⭐</span>
                        <span>STEM Pick #{idx + 1}</span>
                      </span>

                      <button
                        onClick={() => handleCopyBookDetails(book, idx)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Copy book title & links"
                      >
                        {copiedLinkIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <h5 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                      {book.title}
                    </h5>

                    {book.author && (
                      <p className="text-xs font-semibold text-indigo-700 mb-2.5 flex items-center gap-1">
                        <BookMarked className="w-3 h-3 text-indigo-500" />
                        <span>by {book.author}</span>
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {book.description}
                    </p>
                  </div>

                  {/* 1-Click Redirect Buttons for Amazon, Flipkart, Google Books */}
                  <div className="pt-3.5 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Amazon Redirect */}
                      <a
                        href={dynamicAmazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02]"
                        title={`Search & buy "${book.title}" on Amazon`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-700" />
                        <span>Amazon</span>
                        <ArrowUpRight className="w-3 h-3 text-amber-600" />
                      </a>

                      {/* Flipkart Redirect */}
                      <a
                        href={dynamicFlipkart}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02]"
                        title={`Search & buy "${book.title}" on Flipkart`}
                      >
                        <span className="font-black text-blue-600 text-xs">F</span>
                        <span>Flipkart</span>
                        <ArrowUpRight className="w-3 h-3 text-blue-600" />
                      </a>
                    </div>

                    {/* Google Books Search */}
                    <a
                      href={dynamicGoogle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                    >
                      <Search className="w-3 h-3 text-slate-500" />
                      <span>Preview on Google Books & Reviews</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. RECOMMENDED EDUCATIONAL WEBSITES */}
      {(resourceTab === 'all' || resourceTab === 'websites') && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <Globe className="w-4 h-4" />
              </span>
              <span>Trusted Educational Websites & Interactive Learning</span>
            </h4>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Verified science & math portals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayWebsites.map((site, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {site.sourceName}
                    </span>
                    <Compass className="w-4 h-4 text-slate-400 group-hover:rotate-45 transition-transform" />
                  </div>

                  <h5 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5">
                    {site.title}
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {site.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.01]"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Explore on {site.sourceName}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-90" />
                  </a>

                  {/* Direct Google Search for this source and topic */}
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${site.sourceName} ${effectiveQuery}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Search specifically on Google"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Global Redirection Bar */}
      <div className="mt-8 pt-5 border-t border-slate-200/80 bg-white/80 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="text-base">🚀</span>
          <span>Want more on <strong>"{effectiveQuery}"</strong>? Launch direct search:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Google Search Button */}
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`${effectiveQuery} science educational website for students`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1 transition-colors"
          >
            <span>Google Search</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Amazon Direct Search Button */}
          <a
            href={`${amazonBaseUrl}${encodeURIComponent(`${effectiveQuery} children book`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1 transition-colors"
          >
            <ShoppingCart className="w-3 h-3 text-amber-700" />
            <span>Amazon Books</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Flipkart Direct Search Button */}
          <a
            href={`https://www.flipkart.com/search?q=${encodeURIComponent(`${effectiveQuery} book`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold flex items-center gap-1 transition-colors"
          >
            <span className="font-black text-blue-600">F</span>
            <span>Flipkart Books</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
