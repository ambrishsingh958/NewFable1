import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Mail,
  LogOut,
  Check,
  Edit2,
  Calendar,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, AgeGroup } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSaveProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  savedStoriesCount: number;
}

const AVAILABLE_AVATARS = [
  '🦊', '🦁', '🦉', '🚀', '🐼', '🐬', '🦄', '🦖', '🧑‍🚀', '👩‍🏫', '🤖', '🐉'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onLogout,
  savedStoriesCount,
}) => {
  if (!isOpen) return null;

  // Fallback profile if guest
  const profile: UserProfile = currentUser || {
    id: 'guest-explorer',
    displayName: 'Curious Explorer',
    role: 'student',
    avatar: '🧑‍🚀',
    ageGroup: '8-10',
    createdAt: 'Today',
    streakDays: 3,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.displayName);
  const [role, setRole] = useState<'student' | 'teacher'>(profile.role);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(profile.ageGroup || '8-10');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      displayName: name.trim() || 'Curious Explorer',
      role,
      avatar,
      ageGroup: role === 'student' ? ageGroup : undefined,
    };
    onSaveProfile(updated);
    setIsEditing(false);
  };

  const handleQuickSwitch = (newRole: 'student' | 'teacher', newName: string, newAvatar: string) => {
    const updated: UserProfile = {
      ...profile,
      displayName: newName,
      role: newRole,
      avatar: newAvatar,
      ageGroup: newRole === 'student' ? '8-10' : undefined,
    };
    onSaveProfile(updated);
  };

  const streakDays = profile.streakDays || 3;
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeDaysIndices = [0, 1, 2]; // Simulated 3-day active streak

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative animate-scale-up border border-slate-200 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl">
              {profile.avatar}
            </div>
            <div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900 leading-tight">
                User Profile & Account
              </h2>
              <p className="text-xs text-slate-500">
                Manage your avatar, daily streak, and account details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card View / Edit Form */}
        {!isEditing ? (
          <div className="space-y-6">
            {/* Top Identity Block */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-indigo-200 flex items-center justify-center text-3xl shrink-0">
                {profile.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 truncate">
                    {profile.displayName}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 shrink-0">
                    {profile.role === 'teacher' ? 'Educator' : `Age ${profile.ageGroup || '8-10'}`}
                  </span>
                </div>
                {profile.email ? (
                  <p className="text-xs text-slate-600 truncate mt-0.5">{profile.email}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-0.5">Active FableSTEM Explorer</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Daily Streak Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🔥</span>
                  <div>
                    <h4 className="font-heading font-black text-sm text-amber-950">
                      {streakDays}-Day Learning Streak!
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Keep reading every day to earn streak freeze tokens & bonus stickers!
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                  Active
                </span>
              </div>

              {/* 7-Day Streak Calendar */}
              <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-amber-200/80 text-center">
                {daysOfWeek.map((day, idx) => {
                  const isActive = activeDaysIndices.includes(idx);
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-xl text-xs flex flex-col items-center justify-center gap-1 ${
                        isActive
                          ? 'bg-amber-400 text-amber-950 font-black shadow-xs'
                          : 'bg-white/80 text-slate-400 font-semibold border border-amber-200/60'
                      }`}
                    >
                      <span className="text-[10px] uppercase">{day}</span>
                      <span className="text-sm">{isActive ? '🔥' : '○'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-black text-base text-indigo-700 block">
                  {Math.max(savedStoriesCount, 6)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Stories</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-black text-base text-emerald-700 block">
                  {streakDays}d
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Streak</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                <span className="font-black text-base text-amber-700 block">
                  100%
                </span>
                <span className="text-[10px] text-amber-800 font-bold">Quiz Score</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-black text-base text-indigo-900 block">
                  Level 5
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Master Rank</span>
              </div>
            </div>

            {/* Quick Profile Presets Switcher */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Switch Profiles:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('student', 'Alex Explorer', '🦊')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-left transition-all cursor-pointer"
                >
                  <span className="text-xl block mb-0.5">🦊</span>
                  <span className="text-xs font-bold text-slate-800 block truncate">Alex (Age 8-10)</span>
                  <span className="text-[10px] text-slate-500">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSwitch('teacher', 'Ms. Harper', '👩‍🏫')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-left transition-all cursor-pointer"
                >
                  <span className="text-xl block mb-0.5">👩‍🏫</span>
                  <span className="text-xs font-bold text-slate-800 block truncate">Ms. Harper</span>
                  <span className="text-[10px] text-slate-500">Teacher</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSwitch('student', 'Jordan Scholar', '🦉')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-left transition-all cursor-pointer"
                >
                  <span className="text-xl block mb-0.5">🦉</span>
                  <span className="text-xs font-bold text-slate-800 block truncate">Jordan (15+)</span>
                  <span className="text-[10px] text-slate-500">Scholar</span>
                </button>
              </div>
            </div>

            {/* Logout / Sign Out Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Sign Out / Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Profile Edit Form */
          <form onSubmit={handleSave} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Choose Avatar:
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVAILABLE_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`h-11 rounded-xl text-2xl flex items-center justify-center border transition-all cursor-pointer ${
                      avatar === emoji
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-400 scale-105'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Role:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'student'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Learner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'teacher'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Educator</span>
                </button>
              </div>
            </div>

            {/* Age Group (if student) */}
            {role === 'student' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Age Group:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['5-7', '8-10', '11-14', '15+'] as AgeGroup[]).map((ag) => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => setAgeGroup(ag)}
                      className={`py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                        ageGroup === ag
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
