import React from 'react';
import {
  BookOpen,
  Sparkles,
  Bookmark,
  PlayCircle,
  Compass,
  Layers,
  Brain,
  Trophy,
  GraduationCap,
  Flame,
  User,
  LogOut,
} from 'lucide-react';
import { ActiveNavTab, UserProfile } from '../types';
import { FableSteamLogo } from './FableSteamLogo';

interface NavbarProps {
  currentTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenLibrary: () => void;
  onOpenDemo: () => void;
  savedStoriesCount: number;
  currentUser: UserProfile | null;
  streakDays: number;
  onOpenStreak: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLibrary,
  onOpenDemo,
  savedStoriesCount,
  currentUser,
  streakDays,
  onOpenStreak,
  onOpenProfile,
  onLogout,
}) => {
  const NAV_ITEMS: { id: ActiveNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'studio', label: 'Story Studio', icon: BookOpen },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'agelab', label: 'Age Lab', icon: Layers },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'badges', label: 'Passport & Badges', icon: Trophy },
    { id: 'teacher', label: 'Educators', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main top bar */}
        <div className="h-16 flex items-center justify-between gap-2">
          {/* Logo and Brand */}
          <button
            onClick={() => onSelectTab('studio')}
            className="flex items-center group transition-transform focus:outline-hidden shrink-0 cursor-pointer hover:scale-[1.01]"
            title="FableSTEM - Story-Driven STEM Learning"
          >
            <FableSteamLogo variant="horizontal" size="md" theme="light" />
          </button>

          {/* Desktop Navigation Tabs + Daily Streak, Profile & Logout directly near Educators */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Daily Streak Indicator directly near Educators */}
            <button
              onClick={onOpenStreak}
              className="ml-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-300 shadow-2xs hover:scale-[1.02] cursor-pointer"
              title="Daily Learning Streak - Click to view habit tracker & milestones"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streakDays}d Streak</span>
            </button>

            {/* When Logged In: Show Profile details & Logout button near Educators */}
            {currentUser ? (
              <>
                <button
                  onClick={onOpenProfile}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs hover:scale-[1.02] cursor-pointer"
                  title="See explorer profile, stats, avatar & learning rank"
                >
                  <span className="text-sm">{currentUser.avatar || '🧑‍🚀'}</span>
                  <span className="max-w-[75px] xl:max-w-[95px] truncate font-extrabold">
                    {currentUser.displayName || 'Profile'}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-800">
                    {currentUser.role === 'teacher' ? 'Educator' : 'Level 2'}
                  </span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 text-slate-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                  title="Log Out of this session and go to Login page"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onSelectTab('login')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 cursor-pointer shadow-2xs"
                title="Sign In / Choose Explorer Profile"
              >
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sign In</span>
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Hackathon Demo Quick Switcher */}
            <button
              onClick={onOpenDemo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all hover:scale-[1.02] shadow-2xs cursor-pointer"
              title="Fast 1-click presets for live demonstration"
            >
              <PlayCircle className="w-4 h-4 text-indigo-600" />
              <span>Presets</span>
            </button>

            {/* Library Button */}
            <button
              onClick={onOpenLibrary}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Saved Stories Library"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden md:inline">Library</span>
              {savedStoriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                  {savedStoriesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Sub Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Daily Streak in Mobile Bar near Educators */}
          <button
            onClick={onOpenStreak}
            className="px-2.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-300 shrink-0 cursor-pointer shadow-2xs"
            title="Daily Learning Streak"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{streakDays}d Streak</span>
          </button>

          {/* Mobile Near Educators: Profile & Logout if logged in, Sign In if logged out */}
          {currentUser ? (
            <>
              <button
                onClick={onOpenProfile}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 bg-indigo-50 text-indigo-900 border border-indigo-200 shrink-0 cursor-pointer shadow-2xs"
                title="See Explorer Profile"
              >
                <span>{currentUser.avatar || '🧑‍🚀'}</span>
                <span className="max-w-[70px] truncate">{currentUser.displayName || 'Profile'}</span>
              </button>
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 shrink-0 cursor-pointer shadow-2xs"
                title="Log Out and go to Login page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onSelectTab('login')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shrink-0 cursor-pointer shadow-2xs"
              title="Sign In to FableSTEM"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
