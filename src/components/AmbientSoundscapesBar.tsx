import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders } from 'lucide-react';
import { soundscapeEngine } from '../services/soundscapes';

interface AmbientSoundscapesBarProps {
  topic?: string;
  className?: string;
}

const SOUNDSCAPES = [
  { id: 'rain', label: 'Rain & Droplets', icon: '🌧️', desc: 'Gentle raindrops & trickling water' },
  { id: 'ocean', label: 'Ocean Waves', icon: '🌊', desc: 'Deep soothing tidal swells' },
  { id: 'forest', label: 'Forest Breeze', icon: '🌲', desc: 'Rustling leaves & harmonic birds' },
  { id: 'space', label: 'Cosmic Drift', icon: '🪐', desc: 'Deep celestial ambient pads' },
];

export const AmbientSoundscapesBar: React.FC<AmbientSoundscapesBarProps> = ({
  topic,
  className = '',
}) => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.25);
  const [isOpen, setIsOpen] = useState(false);

  // Auto-suggest soundscape according to topic
  const getSuggestedSound = (): string => {
    if (!topic) return 'rain';
    const t = topic.toLowerCase();
    if (t.includes('water') || t.includes('rain') || t.includes('cloud')) return 'rain';
    if (t.includes('ocean') || t.includes('sea') || t.includes('fish') || t.includes('whale')) return 'ocean';
    if (t.includes('plant') || t.includes('forest') || t.includes('tree') || t.includes('animal') || t.includes('biology')) return 'forest';
    if (t.includes('space') || t.includes('planet') || t.includes('star') || t.includes('gravity') || t.includes('solar')) return 'space';
    return 'forest';
  };

  const handleToggleSound = (id: string) => {
    if (activeSound === id) {
      soundscapeEngine.stopAmbient();
      setActiveSound(null);
    } else {
      soundscapeEngine.playAmbient(id as any);
      setActiveSound(id);
      soundscapeEngine.playSoundEffect('pop');
    }
  };

  const handleStopAll = () => {
    soundscapeEngine.stopAmbient();
    setActiveSound(null);
  };

  // Stop ambient sound on component unmount
  useEffect(() => {
    return () => {
      soundscapeEngine.stopAmbient();
    };
  }, []);

  return (
    <div className={`no-print relative ${className}`}>
      {/* Quick compact bar */}
      <div className="flex items-center flex-wrap gap-2 p-2 rounded-2xl bg-slate-100/80 backdrop-blur-md border border-slate-200/80 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 text-slate-700 font-bold">
          <Volume2 className={`w-4 h-4 ${activeSound ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Focus Ambience:</span>
        </div>

        {SOUNDSCAPES.map((s) => {
          const isActive = activeSound === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handleToggleSound(s.id)}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/60'
              }`}
              title={s.desc}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />}
            </button>
          );
        })}

        {activeSound && (
          <button
            onClick={handleStopAll}
            className="px-2 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 cursor-pointer flex items-center gap-1"
            title="Mute ambient sound"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span className="text-[11px]">Mute</span>
          </button>
        )}
      </div>
    </div>
  );
};
