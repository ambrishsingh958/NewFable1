import React from 'react';
import { X, Flame, Calendar, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  onContinueReading: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  onContinueReading,
}) => {
  if (!isOpen) return null;

  const daysOfWeek = [
    { name: 'Mon', active: true },
    { name: 'Tue', active: true },
    { name: 'Wed', active: true },
    { name: 'Thu', active: false },
    { name: 'Fri', active: false },
    { name: 'Sat', active: false },
    { name: 'Sun', active: false },
  ];

  const milestones = [
    { days: 3, label: '3-Day Fire Starter', reward: 'Unlocked 🔥', reached: streakDays >= 3 },
    { days: 7, label: '7-Day STEM Champion', reward: 'Rare Sticker 💎', reached: streakDays >= 7 },
    { days: 14, label: '14-Day Stellar Scholar', reward: 'Legendary Badge 🏆', reached: streakDays >= 14 },
    { days: 30, label: '30-Day Master Alchemist', reward: 'Exclusive Avatar 👑', reached: streakDays >= 30 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative animate-scale-up border border-slate-200 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Big Flame Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-orange-300/40 animate-pulse-glow">
          🔥
        </div>

        <span className="text-[11px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full inline-block mb-2">
          Daily Learning Habit
        </span>

        <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mb-1">
          {streakDays}-Day Learning Streak!
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          You've explored STEM concepts {streakDays} days in a row! Come back every day to keep your learning momentum blazing.
        </p>

        {/* Weekly Progress Tracker */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-3">
            <span>This Week's Momentum:</span>
            <span className="text-orange-600">3 / 7 Days Active</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {daysOfWeek.map((day, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 ${
                  day.active
                    ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white font-black shadow-xs'
                    : 'bg-white text-slate-400 font-semibold border border-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase">{day.name}</span>
                <span className="text-xs">{day.active ? '🔥' : '○'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Unlocks */}
        <div className="space-y-2 mb-6 text-left">
          <h4 className="font-heading font-extrabold text-xs text-slate-500 uppercase tracking-wider mb-2">
            Streak Rewards & Milestones:
          </h4>
          {milestones.map((m) => (
            <div
              key={m.days}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                m.reached
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{m.reached ? '🏆' : '🔒'}</span>
                <div>
                  <p className="leading-tight">{m.label}</p>
                  <p className="text-[10px] font-normal opacity-80">{m.days} days required</p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                m.reached ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {m.reward}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onContinueReading();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md shadow-orange-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue Today's STEM Quest</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
