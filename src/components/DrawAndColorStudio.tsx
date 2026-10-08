import React, { useState, useRef, useEffect } from 'react';
import {
  Paintbrush,
  Eraser,
  Undo2,
  Trash2,
  Download,
  Sparkles,
  Maximize2,
  Minimize2,
  Sticker,
  CheckCircle2,
  RotateCcw,
  Palette,
  Volume2,
  Share2,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundscapeEngine } from '../services/soundscapes';

interface DrawAndColorStudioProps {
  topic: string;
  storyTitle: string;
  ageGroup?: string;
  onClose?: () => void;
  onAwardXp?: (amount: number, reason: string) => void;
  initialTemplatePrompt?: string;
}

// Curated coloring templates according to common STEM subjects
interface ColoringTemplate {
  id: string;
  name: string;
  icon: string;
  hint: string;
  svgPath: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const COLOR_PALETTE = [
  { hex: '#0f172a', name: 'Ink Black' },
  { hex: '#ef4444', name: 'Ruby Red' },
  { hex: '#f97316', name: 'Solar Orange' },
  { hex: '#eab308', name: 'Sun Yellow' },
  { hex: '#22c55e', name: 'Leaf Green' },
  { hex: '#06b6d4', name: 'Ocean Cyan' },
  { hex: '#3b82f6', name: 'Cosmic Blue' },
  { hex: '#8b5cf6', name: 'Magic Purple' },
  { hex: '#ec4899', name: 'Flower Pink' },
  { hex: '#854d0e', name: 'Earth Brown' },
  { hex: '#ffffff', name: 'Pure White' },
];

const STICKERS = [
  { emoji: '🌟', label: 'Star' },
  { emoji: '🌱', label: 'Sprout' },
  { emoji: '💧', label: 'Water Drop' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '⚡', label: 'Energy' },
  { emoji: '🔬', label: 'Microscope' },
  { emoji: '💡', label: 'Idea' },
  { emoji: '🪐', label: 'Planet' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '🧬', label: 'DNA' },
];

export const DrawAndColorStudio: React.FC<DrawAndColorStudioProps> = ({
  topic,
  storyTitle,
  ageGroup = '8-10',
  onClose,
  onAwardXp,
  initialTemplatePrompt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'fill' | 'sticker'>('brush');
  const [selectedSticker, setSelectedSticker] = useState<string>('🌟');
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);
  const [artworkSaved, setArtworkSaved] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>('blank');
  const [selectedStickerPos, setSelectedStickerPos] = useState<{ x: number; y: number } | null>(null);
  const [xpAwarded, setXpAwarded] = useState(false);

  // Creative Drawing Prompts based on STEM topic
  const stemPrompt = initialTemplatePrompt || (
    topic.toLowerCase().includes('water')
      ? 'Draw a tiny cloud raining fresh water droplets onto mountains and leafy plants!'
      : topic.toLowerCase().includes('photo') || topic.toLowerCase().includes('plant')
      ? 'Color a radiant sun shining golden beams on a tall green plant turning light into food!'
      : topic.toLowerCase().includes('space') || topic.toLowerCase().includes('planet') || topic.toLowerCase().includes('solar')
      ? 'Sketch the rings of Saturn, your favorite rocket ship, and glowing cosmic stars!'
      : topic.toLowerCase().includes('fraction') || topic.toLowerCase().includes('math')
      ? 'Draw a delicious pizza cut into 4 equal slices and color 3 of them!'
      : `Draw how ${topic} works in real life and color the main discovery!`
  );

  // Pre-drawn STEM Outlines that kids can color into
  const TEMPLATES: ColoringTemplate[] = [
    {
      id: 'blank',
      name: 'Freeform Canvas',
      icon: '🎨',
      hint: 'A completely blank canvas to draw your own STEM world!',
      svgPath: () => {},
    },
    {
      id: 'water_cycle',
      name: 'Water & Cloud',
      icon: '🌧️',
      hint: 'Color the cloud, raindrops, and the calm lake below.',
      svgPath: (ctx, w, h) => {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Cloud
        const cx = w * 0.45;
        const cy = h * 0.28;
        ctx.arc(cx, cy, 35, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(cx + 40, cy - 25, 45, Math.PI * 1, Math.PI * 1.85);
        ctx.arc(cx + 85, cy - 10, 38, Math.PI * 1.3, Math.PI * 2.1);
        ctx.arc(cx + 120, cy + 10, 30, Math.PI * 1.6, Math.PI * 2.5);
        ctx.arc(cx + 60, cy + 30, 45, 0, Math.PI * 0.7);
        ctx.closePath();
        ctx.stroke();

        // Raindrops
        for (let i = 0; i < 7; i++) {
          const rx = cx - 20 + i * 28;
          const ry = cy + 70 + (i % 2) * 20;
          ctx.beginPath();
          ctx.arc(rx, ry, 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // River / ground
        ctx.beginPath();
        ctx.moveTo(20, h - 70);
        ctx.bezierCurveTo(w * 0.3, h - 100, w * 0.6, h - 40, w - 20, h - 70);
        ctx.stroke();
      },
    },
    {
      id: 'solar_system',
      name: 'Rocket & Planets',
      icon: '🚀',
      hint: 'Color the rocket speeding past a ringed planet and bright stars.',
      svgPath: (ctx, w, h) => {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        // Rocket fuselage
        ctx.beginPath();
        ctx.moveTo(w * 0.35, h * 0.55);
        ctx.quadraticCurveTo(w * 0.45, h * 0.2, w * 0.6, h * 0.2);
        ctx.quadraticCurveTo(w * 0.6, h * 0.4, w * 0.55, h * 0.65);
        ctx.closePath();
        ctx.stroke();

        // Rocket window
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.36, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Planet with ring
        ctx.beginPath();
        ctx.arc(w * 0.75, h * 0.65, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(w * 0.75, h * 0.65, 58, 14, -Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
      },
    },
    {
      id: 'leaf_sun',
      name: 'Sun & Plant',
      icon: '🌱',
      hint: 'Color the sunny rays feeding the sprout in rich soil.',
      svgPath: (ctx, w, h) => {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        // Radiant Sun
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.22, 34, 0, Math.PI * 2);
        ctx.stroke();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const sx = w * 0.8 + Math.cos(a) * 44;
          const sy = h * 0.22 + Math.sin(a) * 44;
          const ex = w * 0.8 + Math.cos(a) * 58;
          const ey = h * 0.22 + Math.sin(a) * 58;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        // Stem
        ctx.beginPath();
        ctx.moveTo(w * 0.35, h - 60);
        ctx.quadraticCurveTo(w * 0.38, h * 0.6, w * 0.42, h * 0.45);
        ctx.stroke();

        // Leaf Left
        ctx.beginPath();
        ctx.moveTo(w * 0.38, h * 0.65);
        ctx.quadraticCurveTo(w * 0.2, h * 0.6, w * 0.22, h * 0.5);
        ctx.quadraticCurveTo(w * 0.34, h * 0.52, w * 0.38, h * 0.65);
        ctx.stroke();

        // Leaf Right
        ctx.beginPath();
        ctx.moveTo(w * 0.4, h * 0.55);
        ctx.quadraticCurveTo(w * 0.55, h * 0.52, w * 0.58, h * 0.4);
        ctx.quadraticCurveTo(w * 0.46, h * 0.42, w * 0.4, h * 0.55);
        ctx.stroke();

        // Soil mound
        ctx.beginPath();
        ctx.moveTo(20, h - 60);
        ctx.quadraticCurveTo(w * 0.35, h - 85, w - 20, h - 60);
        ctx.stroke();
      },
    },
  ];

  // Initialize canvas
  useEffect(() => {
    initCanvas();
  }, []);

  const initCanvas = (templateId = activeTemplate) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high density dimensions
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 700;
    const height = 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw background graph / guideline subtle grid
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Apply template outline if not blank
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template && template.id !== 'blank') {
      template.svgPath(ctx, width, height);
    }

    // Save initial state in history
    const initialImg = ctx.getImageData(0, 0, width, height);
    setHistory([initialImg]);
    setHistoryStep(0);
  };

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(nextImg);
    if (newHistory.length > 25) newHistory.shift();
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep <= 0) return;
    soundscapeEngine.playSoundEffect('pop');
    const prevStep = historyStep - 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.putImageData(history[prevStep], 0, 0);
    setHistoryStep(prevStep);
  };

  const handleClear = () => {
    soundscapeEngine.playSoundEffect('clear');
    initCanvas(activeTemplate);
  };

  const handleSelectTemplate = (id: string) => {
    soundscapeEngine.playSoundEffect('pop');
    setActiveTemplate(id);
    initCanvas(id);
  };

  // Drawing mouse/touch handlers
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'sticker') {
      // Stamp sticker onto canvas
      soundscapeEngine.playSoundEffect('sticker');
      ctx.font = `${brushSize * 5 + 24}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker, x, y);
      saveHistoryState();
      return;
    }

    setIsDrawing(true);
    soundscapeEngine.playSoundEffect('brush');

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : selectedColor;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistoryState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    soundscapeEngine.playSoundEffect('sparkle');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    const cleanTopic = topic.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    a.download = `FableSTEM_Art_${cleanTopic}.png`;
    a.click();
    setArtworkSaved(true);

    if (!xpAwarded && onAwardXp) {
      onAwardXp(35, 'Illustrated what you learned in STEM Art Studio');
      setXpAwarded(true);
    }

    setTimeout(() => setArtworkSaved(false), 4000);
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden p-4 sm:p-6 my-6 transition-all animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-md shadow-pink-200">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                Draw & Color What You Learned
              </h3>
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                STEM Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              Topic: <strong className="text-indigo-600">{topic}</strong> • Transform concepts into your own artwork
            </p>
          </div>
        </div>

        {/* Top Controls: Close & Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Clear the drawing canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Canvas</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Done / Close
            </button>
          )}
        </div>
      </div>

      {/* STEM Learning Challenge Prompt Card */}
      <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 border border-amber-200/80 flex items-start gap-3">
        <span className="text-2xl shrink-0">💡</span>
        <div className="text-xs">
          <strong className="text-slate-800 font-black block mb-0.5">Your Creative STEM Mission:</strong>
          <span className="text-slate-700 leading-relaxed">{stemPrompt}</span>
        </div>
      </div>

      {/* Template Chooser Bar */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 shrink-0">Template:</span>
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTemplate === tmpl.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>{tmpl.icon}</span>
            <span>{tmpl.name}</span>
          </button>
        ))}
      </div>

      {/* Main Drawing Canvas Container */}
      <div className="relative border-2 border-indigo-200 rounded-2xl overflow-hidden bg-white shadow-inner flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[360px] sm:h-[440px] cursor-crosshair touch-none select-none bg-white block"
        />

        {/* Floating Download & Undo Toolbar */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className={`p-2 rounded-xl text-slate-700 transition-all ${
              historyStep <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'
            }`}
            title="Undo stroke"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
            title="Save your artwork as PNG"
          >
            <Download className="w-4 h-4" />
            <span>Save Artwork</span>
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {artworkSaved && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between animate-fade-in text-xs text-emerald-800 font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Artwork saved to your device! +35 STEM Explorer XP awarded.</span>
          </div>
        </div>
      )}

      {/* Studio Tool Palette: Colors, Brushes, Stickers */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tool Modes (Brush, Eraser, Sticker) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => {
              setTool('brush');
              soundscapeEngine.playSoundEffect('pop');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tool === 'brush' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Paint Brush</span>
          </button>

          <button
            onClick={() => {
              setTool('eraser');
              soundscapeEngine.playSoundEffect('pop');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tool === 'eraser' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>

          <button
            onClick={() => {
              setTool('sticker');
              soundscapeEngine.playSoundEffect('pop');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tool === 'sticker' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sticker className="w-3.5 h-3.5" />
            <span>STEM Stickers</span>
          </button>
        </div>

        {/* Color Palette (Active when tool === 'brush') */}
        {tool !== 'sticker' ? (
          <div className="flex items-center flex-wrap gap-1.5 justify-center">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  setSelectedColor(c.hex);
                  setTool('brush');
                  soundscapeEngine.playSoundEffect('pop');
                }}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer border ${
                  selectedColor === c.hex && tool === 'brush'
                    ? 'ring-3 ring-indigo-500 scale-115 border-white shadow-xs'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        ) : (
          /* STEM Sticker selector */
          <div className="flex items-center flex-wrap gap-1.5 justify-center">
            {STICKERS.map((st) => (
              <button
                key={st.emoji}
                onClick={() => {
                  setSelectedSticker(st.emoji);
                  soundscapeEngine.playSoundEffect('pop');
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer border ${
                  selectedSticker === st.emoji
                    ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 scale-110'
                    : 'bg-white border-slate-200 hover:scale-105'
                }`}
                title={st.label}
              >
                {st.emoji}
              </button>
            ))}
          </div>
        )}

        {/* Brush Size Slider */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-500">Size:</span>
          <input
            type="range"
            min="2"
            max="32"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
          <div
            className="rounded-full bg-slate-800"
            style={{ width: `${Math.min(24, Math.max(4, brushSize))}px`, height: `${Math.min(24, Math.max(4, brushSize))}px` }}
          />
        </div>
      </div>
    </div>
  );
};
