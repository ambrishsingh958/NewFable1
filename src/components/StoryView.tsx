import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Bookmark,
  Printer,
  Check,
  Award,
  Globe,
  Tag,
  Lightbulb,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Eye,
  Sliders,
  Palette,
  Moon,
  School,
  Share2,
  Copy,
  CheckCircle2,
  HelpCircle,
  Paintbrush,
  X,
  Star,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoryData, CharacterMentor } from '../types';
import { SuggestedResources } from './SuggestedResources';
import { askCharacter } from '../services/api';
import { globalVoiceEngine, playWebAudioChime, getVoiceLanguageCode } from '../services/voiceEngine';

interface StoryViewProps {
  storyData: StoryData;
  onTakeQuiz: () => void;
  onNewStory: () => void;
  onSaveStory: (story: StoryData) => void;
  isSaved: boolean;
  isLoadingQuiz?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'child' | 'mentor';
  text: string;
  time: string;
}

export const StoryView: React.FC<StoryViewProps> = ({
  storyData,
  onTakeQuiz,
  onNewStory,
  onSaveStory,
  isSaved,
  isLoadingQuiz,
}) => {
  // Speech Synthesis state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [currentReadingChunk, setCurrentReadingChunk] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [audioFeedbackNotice, setAudioFeedbackNotice] = useState<string | null>(null);

  // Dyslexia & Accessibility State
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState<'standard' | 'dyslexic' | 'serif'>('standard');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [letterSpacing, setLetterSpacing] = useState<'normal' | 'wide' | 'extra'>('normal');
  const [lineSpacing, setLineSpacing] = useState<'normal' | 'relaxed' | 'double'>('relaxed');
  const [bgTint, setBgTint] = useState<'white' | 'cream' | 'soft-blue' | 'soft-mint' | 'dark'>('white');
  const [enableReadingRuler, setEnableReadingRuler] = useState(false);
  const [rulerY, setRulerY] = useState(200);

  // Micro-Mini Mission State
  const [missionCount, setMissionCount] = useState(0);
  const [missionCompleted, setMissionCompleted] = useState(false);

  // "Ask the Character" State
  const mentor: CharacterMentor = storyData.characterMentor || {
    name: storyData.age_group === '5-7' ? 'Pip & Bella' : storyData.age_group === '11-14' || storyData.age_group === '15+' ? 'Dr. Nova' : 'Captain Cosmos',
    role: 'Chief STEM Mentor & Guide',
    avatar: storyData.age_group === '5-7' ? '🦉' : '🚀',
    greeting: `Greetings! I followed your quest into ${storyData.topic}. What curious question can I answer for you?`,
    suggestedQuestions: [
      `Why is ${storyData.topic} so important for life on Earth?`,
      `Can we try a safe experiment with ${storyData.topic} at home?`,
      `What would happen if ${storyData.topic} stopped for just one day?`
    ]
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      sender: 'mentor',
      text: mentor.greeting,
      time: 'Just now'
    }
  ]);
  const [characterInput, setCharacterInput] = useState('');
  const [isAskingCharacter, setIsAskingCharacter] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceErrorMsg, setVoiceErrorMsg] = useState<string | null>(null);
  const [mentorSpeakingId, setMentorSpeakingId] = useState<string | null>(null);

  // Printable Coloring Book Modal State
  const [isColoringBookModalOpen, setIsColoringBookModalOpen] = useState(false);

  const storyArticleRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Language mapping for Web Speech API
  const getLanguageCode = (lang: string): string => {
    switch (lang) {
      case 'Hindi': return 'hi-IN';
      case 'Tamil': return 'ta-IN';
      case 'Spanish': return 'es-ES';
      case 'French': return 'fr-FR';
      case 'German': return 'de-DE';
      default: return 'en-US';
    }
  };

  // Speech synthesis handlers using robust globalVoiceEngine
  const handleToggleSpeak = async () => {
    if (!globalVoiceEngine.isAvailable()) {
      setAudioFeedbackNotice('Speech audio is disabled or unavailable in this browser. Trying audio tone.');
      playWebAudioChime('welcome');
      setTimeout(() => setAudioFeedbackNotice(null), 4000);
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        globalVoiceEngine.resume();
        setIsPaused(false);
      } else {
        globalVoiceEngine.pause();
        setIsPaused(true);
      }
      return;
    }

    const fullText = `${storyData.title}. ${storyData.story}. ${
      storyData.takeaway ? 'Takeaway: ' + storyData.takeaway : ''
    }`;

    // Play instant pleasant chime so user gets immediate sound confirmation
    playWebAudioChime('welcome');
    setAudioFeedbackNotice('Voice playback started! Listening to narration...');
    setTimeout(() => setAudioFeedbackNotice(null), 3000);

    await globalVoiceEngine.speakText(fullText, {
      lang: storyData.language,
      rate: speechRate,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onChunkStart: (idx, total, text) => {
        setReadingProgress({ current: idx + 1, total });
        setCurrentReadingChunk(text);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentReadingChunk(null);
        playWebAudioChime('success');
      },
      onError: (err) => {
        console.warn('Voice engine error:', err);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentReadingChunk(null);
      },
    });
  };

  const handleStopSpeak = () => {
    globalVoiceEngine.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentReadingChunk(null);
  };

  // One-click audio & voice test verification
  const handleTestAudio = async () => {
    playWebAudioChime('welcome');
    setAudioFeedbackNotice('Testing audio output... Chime played!');
    setTimeout(() => setAudioFeedbackNotice(null), 3500);

    if (globalVoiceEngine.isAvailable()) {
      const testMsg = `Hello young explorer! FableSTEM audio is connected and ready to read your story about ${storyData.topic}.`;
      setIsPlaying(true);
      setCurrentReadingChunk(testMsg);
      await globalVoiceEngine.speakText(testMsg, {
        lang: storyData.language,
        rate: speechRate,
        onEnd: () => {
          setIsPlaying(false);
          setCurrentReadingChunk(null);
          playWebAudioChime('success');
        },
        onError: () => {
          setIsPlaying(false);
          setCurrentReadingChunk(null);
        },
      });
    }
  };

  // Speak specific mentor text
  const handleSpeakMentorText = async (msgId: string, text: string) => {
    if (mentorSpeakingId === msgId) {
      globalVoiceEngine.stop();
      setMentorSpeakingId(null);
      return;
    }

    setMentorSpeakingId(msgId);
    playWebAudioChime('welcome');

    await globalVoiceEngine.speakText(text, {
      lang: storyData.language,
      rate: 0.95,
      pitch: 1.1,
      onStart: () => setMentorSpeakingId(msgId),
      onEnd: () => setMentorSpeakingId(null),
      onError: () => setMentorSpeakingId(null),
    });
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      globalVoiceEngine.stop();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Track mouse for reading ruler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (enableReadingRuler && storyArticleRef.current) {
      const rect = storyArticleRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      setRulerY(relativeY);
    }
  };

  // Micro-mini mission click handler
  const handleMissionAction = () => {
    if (missionCompleted) return;
    const next = missionCount + 1;
    setMissionCount(next);

    if (next >= 3) {
      setMissionCompleted(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {}

      // Save mission achievement to explorer passport in localStorage
      try {
        const key = 'fablestem_passport_data_v1';
        const raw = localStorage.getItem(key);
        const passport = raw ? JSON.parse(raw) : { missionsCompleted: 0 };
        passport.missionsCompleted = (passport.missionsCompleted || 0) + 1;
        localStorage.setItem(key, JSON.stringify(passport));
      } catch {}
    }
  };

  // Ask character handler
  const handleAskCharacter = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || isAskingCharacter) return;

    const childMsg: ChatMessage = {
      id: `child-${Date.now()}`,
      sender: 'child',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, childMsg]);
    setCharacterInput('');
    setIsAskingCharacter(true);

    try {
      const res = await askCharacter({
        characterName: mentor.name,
        characterRole: mentor.role,
        storyTitle: storyData.title,
        topic: storyData.topic,
        question: q,
        age_group: storyData.age_group,
        language: storyData.language,
      });

      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: res.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, mentorMsg]);
    } catch {
      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: `That's a fantastic observation about ${storyData.topic}! Keep questioning and exploring like a true scientist! 🌟`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, mentorMsg]);
    } finally {
      setIsAskingCharacter(false);
    }
  };

  // Voice speech-to-text recognition handler
  const handleToggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isListeningMic) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListeningMic(false);
      setInterimTranscript('');
      return;
    }

    if (!SpeechRecognition) {
      setVoiceErrorMsg(
        'Speech recognition is restricted in this browser or preview iframe. You can click any instant voice question below or type!'
      );
      return;
    }

    try {
      setVoiceErrorMsg(null);
      setInterimTranscript('');

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = getLanguageCode(storyData.language);
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningMic(true);
        setVoiceErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setCharacterInput(final);
          setInterimTranscript('');
          setIsListeningMic(false);
          handleAskCharacter(final);
        } else if (interim) {
          setInterimTranscript(interim);
          setCharacterInput(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListeningMic(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceErrorMsg(
            'Microphone access is blocked by browser permissions or preview iframe. Click any instant voice question below or type your question!'
          );
        } else if (event.error === 'no-speech') {
          setVoiceErrorMsg('No speech was detected. Speak closer to your microphone or click an instant question below!');
        } else {
          setVoiceErrorMsg(`Voice recognition: ${event.error}. You can click any question below or type!`);
        }
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
    } catch (err: any) {
      console.warn('Could not start SpeechRecognition:', err);
      setIsListeningMic(false);
      setVoiceErrorMsg(
        'Microphone is not permitted in this iframe window. Click any quick question below or type to ask!'
      );
    }
  };

  // Split story text into clean paragraphs
  const paragraphs = storyData.story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Background tint class resolver
  const getBgTintClass = () => {
    switch (bgTint) {
      case 'cream':
        return 'bg-[#fcf7ea] text-amber-950 border-amber-200';
      case 'soft-blue':
        return 'bg-[#edf6fa] text-slate-900 border-sky-200';
      case 'soft-mint':
        return 'bg-[#eef8f2] text-emerald-950 border-emerald-200';
      case 'dark':
        return 'bg-slate-900 text-slate-100 border-slate-700';
      default:
        return 'bg-white text-slate-800 border-slate-200/90';
    }
  };

  // Font family class resolver
  const getFontFamilyStyle = () => {
    if (fontFamily === 'dyslexic') {
      return {
        fontFamily: '"Comic Neue", "Trebuchet MS", "Plus Jakarta Sans", system-ui, sans-serif',
      };
    }
    if (fontFamily === 'serif') {
      return { fontFamily: 'Georgia, Cambria, "Times New Roman", serif' };
    }
    return { fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' };
  };

  const getLetterSpacingClass = () => {
    if (letterSpacing === 'extra') return 'tracking-widest';
    if (letterSpacing === 'wide') return 'tracking-wider';
    return 'tracking-normal';
  };

  const getLineSpacingClass = () => {
    if (lineSpacing === 'double') return 'leading-loose';
    if (lineSpacing === 'relaxed') return 'leading-8 sm:leading-9';
    return 'leading-normal';
  };

  const getFontSizeClass = () => {
    if (fontSize === 'huge') return 'text-xl sm:text-2xl';
    if (fontSize === 'large') return 'text-lg sm:text-xl';
    return 'text-base sm:text-lg';
  };

  const handleCopyDiscussionPrompts = () => {
    const text = (storyData.discussionPrompts || []).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification('Discussion prompts copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 animate-fade-in relative">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          onClick={onNewStory}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-white border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Topic</span>
        </button>

        <div className="flex items-center flex-wrap gap-2">
          {/* Dyslexia & Accessibility Reader Mode Toggle */}
          <button
            onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
            className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAccessibilityOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
            title="Open Dyslexia & Accessible Reader Settings"
          >
            <Sliders className="w-4 h-4" />
            <span>Accessible Reader</span>
          </button>

          {/* Jump to Suggested Books */}
          <a
            href="#suggested-resources"
            className="text-xs sm:text-sm font-semibold text-amber-900 hover:text-amber-950 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Browse recommended books on Amazon & Flipkart"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Books & Links</span>
          </a>

          {/* Printable Coloring Book & Worksheet Button */}
          <button
            onClick={() => setIsColoringBookModalOpen(true)}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="One-click printable coloring sheets and worksheets"
          >
            <Paintbrush className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Coloring Sheet</span>
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={() => onSaveStory(storyData)}
            className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white border-slate-200'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-white border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Print this story"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Dyslexia & Accessibility Reader Settings Panel */}
      {isAccessibilityOpen && (
        <div className="mb-6 p-5 rounded-3xl bg-white border border-indigo-200 shadow-md animate-fade-in no-print">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">👓</span>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                Dyslexia & Accessible Reader Settings
              </h3>
            </div>
            <button
              onClick={() => setIsAccessibilityOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Font Type */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Reading Font:</span>
              <div className="space-y-1">
                {[
                  { id: 'standard', label: 'Plus Jakarta (Clean)' },
                  { id: 'dyslexic', label: 'Dyslexic / Rounded' },
                  { id: 'serif', label: 'Book Serif' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id as any)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                      fontFamily === f.id
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Letter Spacing:</span>
              <div className="space-y-1">
                {[
                  { id: 'normal', label: 'Standard' },
                  { id: 'wide', label: 'Wide (+0.08em)' },
                  { id: 'extra', label: 'Extra Wide (+0.15em)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setLetterSpacing(s.id as any)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                      letterSpacing === s.id
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Tint (Visual Stress Reduction) */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Background Tint:</span>
              <div className="space-y-1">
                {[
                  { id: 'white', label: '⚪ Pure White' },
                  { id: 'cream', label: '📜 Warm Cream' },
                  { id: 'soft-blue', label: '🌊 Soft Blue (Dyslexia Aid)' },
                  { id: 'soft-mint', label: '🌿 Soft Mint' },
                  { id: 'dark', label: '🌙 High Contrast Dark' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setBgTint(t.id as any)}
                    className={`w-full text-left px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                      bgTint === t.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Ruler & Line Spacing */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">Line Focus & Ruler:</span>
              <div className="space-y-2">
                <button
                  onClick={() => setEnableReadingRuler(!enableReadingRuler)}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    enableReadingRuler
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Reading Ruler Bar</span>
                  <span>{enableReadingRuler ? 'ON' : 'OFF'}</span>
                </button>

                <div className="flex gap-1">
                  {[
                    { id: 'normal', label: '1.5x' },
                    { id: 'relaxed', label: '2.0x' },
                    { id: 'double', label: '2.5x' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLineSpacing(l.id as any)}
                      className={`flex-1 py-1 rounded-lg text-center border font-bold text-[11px] ${
                        lineSpacing === l.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Story Article */}
      <article
        ref={storyArticleRef}
        onMouseMove={handleMouseMove}
        className={`rounded-3xl border shadow-xs overflow-hidden transition-all duration-300 mb-10 relative ${getBgTintClass()}`}
        style={getFontFamilyStyle()}
      >
        {/* Reading Focus Ruler Overlay */}
        {enableReadingRuler && (
          <div
            className="absolute left-0 right-0 pointer-events-none transition-all duration-75 z-20 border-y-2 border-amber-400 bg-amber-400/15"
            style={{
              top: `${Math.max(100, rulerY - 24)}px`,
              height: '48px',
            }}
          />
        )}

        {/* Story Header */}
        <div className="p-6 sm:p-10 border-b border-inherit bg-black/2">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Globe className="w-3.5 h-3.5" />
              <span>{storyData.language}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800">
              <Tag className="w-3.5 h-3.5" />
              <span>Age {storyData.age_group}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
              <Award className="w-3.5 h-3.5" />
              <span>{storyData.reading_level}</span>
            </span>

            {storyData.storyMode === 'bedtime' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 border border-purple-300 text-purple-900">
                <Moon className="w-3.5 h-3.5" />
                <span>Bedtime Calm Mode</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-900">
                <School className="w-3.5 h-3.5" />
                <span>Classroom Active</span>
              </span>
            )}

            {storyData.hero && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-800">
                <span>🌟 Starring: {storyData.hero.name} & {storyData.hero.companion}</span>
              </span>
            )}
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl tracking-tight leading-tight mb-3">
            {storyData.title}
          </h1>

          <p className="text-xs sm:text-sm opacity-75">
            Topic:{' '}
            <strong className="opacity-95">{storyData.topic}</strong>
            {storyData.hero?.hobby && (
              <span> • Hero Passion: <em>{storyData.hero.hobby}</em></span>
            )}
          </p>

          {/* Audio Narration Controls */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-inherit no-print">
            <button
              onClick={handleToggleSpeak}
              className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-300'
                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-300 hover:bg-indigo-700'
              }`}
            >
              {isPlaying ? (
                isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Resume Story</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Reading</span>
                  </>
                )
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Story (Audio)</span>
                </>
              )}
            </button>

            {/* Test Audio Chime Verification Button */}
            <button
              onClick={handleTestAudio}
              className="px-3 py-2 rounded-2xl bg-white/70 hover:bg-white text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Test audio speakers/earphones with a sound chime"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Test Audio</span>
            </button>

            {isPlaying && (
              <button
                onClick={handleStopSpeak}
                className="px-3 py-2 rounded-2xl bg-white/70 hover:bg-white text-slate-700 font-bold text-xs border border-inherit transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            )}

            {/* Voice Speed */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="opacity-80">Speed:</span>
              <div className="flex bg-black/5 rounded-xl p-0.5 border border-inherit">
                {[0.85, 1.0, 1.15].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                      speechRate === rate ? 'bg-indigo-600 text-white' : 'opacity-70'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Feedback Notification / Status */}
          {audioFeedbackNotice && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 animate-fade-in no-print">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{audioFeedbackNotice}</span>
            </div>
          )}

          {/* Active Live Reading HUD */}
          {isPlaying && currentReadingChunk && (
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-100/90 to-orange-100/90 border border-amber-300 text-amber-950 text-xs animate-fade-in shadow-xs flex items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base animate-bounce shrink-0">🔊</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-900">
                      Now Reading Aloud {readingProgress.total > 0 && `(${readingProgress.current}/${readingProgress.total})`}:
                    </span>
                  </div>
                  <p className="font-medium text-amber-950 truncate italic">
                    "{currentReadingChunk}"
                  </p>
                </div>
              </div>
              <button
                onClick={handleStopSpeak}
                className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Story Text Content with Accessible Styling */}
        <div
          className={`p-6 sm:p-10 space-y-6 ${getFontSizeClass()} ${getLetterSpacingClass()} ${getLineSpacingClass()}`}
        >
          {paragraphs.slice(0, 2).map((para, idx) => {
            const isHighlighted = currentReadingChunk && para.toLowerCase().includes(currentReadingChunk.slice(0, 20).toLowerCase());
            return (
              <p
                key={idx}
                className={`transition-all rounded-xl p-1 -m-1 ${
                  isHighlighted ? 'bg-amber-100/60 ring-2 ring-amber-300/80' : ''
                } first-letter:font-extrabold first-letter:text-2xl first-letter:mr-0.5`}
              >
                {para}
              </p>
            );
          })}

          {/* Micro-Mini Mission Interactive Prompt */}
          <div className="my-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 text-amber-950 no-print shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-200 text-amber-900">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  <span>Micro-Mini Mission Checkpoint</span>
                </div>
                <h4 className="font-heading font-black text-base sm:text-lg text-amber-950">
                  {missionCompleted
                    ? '🎉 Mission Accomplished: Chapter Unlocked!'
                    : '✨ Starlight Energy Pulse: Tap 3 Stars to Continue!'}
                </h4>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {missionCompleted
                    ? 'You calibrated the STEM sensors and powered up the explorer compass! Bonus XP added to your Passport.'
                    : 'Break through the next scientific secret by tapping the three glowing starlight cores below:'}
                </p>
              </div>

              {/* Interactive Mission Clickers */}
              <div className="flex items-center gap-2 shrink-0">
                {[1, 2, 3].map((starNum) => {
                  const isDone = missionCount >= starNum;
                  return (
                    <button
                      key={starNum}
                      type="button"
                      onClick={handleMissionAction}
                      disabled={missionCompleted}
                      className={`w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isDone
                          ? 'bg-amber-400 border-amber-500 scale-105 shadow-md shadow-amber-300'
                          : 'bg-white border-amber-300 hover:scale-105 hover:bg-amber-100 text-amber-700'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${isDone ? 'fill-amber-950 text-amber-950' : 'text-amber-500'}`} />
                      <span className="text-[10px] font-black">{starNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {paragraphs.slice(2).map((para, idx) => {
            const isHighlighted = currentReadingChunk && para.toLowerCase().includes(currentReadingChunk.slice(0, 20).toLowerCase());
            return (
              <p
                key={idx + 2}
                className={`transition-all rounded-xl p-1 -m-1 ${
                  isHighlighted ? 'bg-amber-100/60 ring-2 ring-amber-300/80' : ''
                } first-letter:font-extrabold`}
              >
                {para}
              </p>
            );
          })}

          {/* Teacher Takeaway Box */}
          {storyData.takeaway && (
            <div className="mt-8 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3.5 text-amber-950">
              <div className="p-2 rounded-xl bg-amber-200/70 text-amber-800 shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-amber-900">
                  🌟 Inspiring STEM Takeaway:
                </h3>
                <p className="text-xs sm:text-sm font-medium text-amber-800 mt-1 italic">
                  "{storyData.takeaway}"
                </p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Feature 2: "Ask the Character" (Interactive Voice/Text Q&A) */}
      <section className="mb-10 bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-2xl shadow-md shadow-indigo-200 ${mentorSpeakingId ? 'animate-bounce ring-4 ring-amber-300' : ''}`}>
              {mentor.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-slate-900">
                  Ask {mentor.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {mentor.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Spontaneous voice & text Q&A with your story mentor.
              </p>
            </div>
          </div>

          {/* Hear Mentor Welcome Voice Button */}
          <button
            type="button"
            onClick={() => handleSpeakMentorText('greeting', mentor.greeting)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Hear character mentor voice"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{mentorSpeakingId === 'greeting' ? 'Stop Voice' : 'Hear Mentor Voice'}</span>
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto p-1">
          {chatHistory.map((msg) => {
            const isMentor = msg.sender === 'mentor';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMentor ? 'justify-start' : 'justify-end'}`}
              >
                {isMentor && (
                  <div className={`w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm shrink-0 mt-0.5 ${mentorSpeakingId === msg.id ? 'ring-2 ring-indigo-500 animate-pulse' : ''}`}>
                    {mentor.avatar}
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMentor
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-indigo-600 text-white font-medium'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-between gap-3 mt-2 text-[10px] opacity-70">
                    <span>{msg.time}</span>
                    {isMentor && (
                      <button
                        type="button"
                        onClick={() => handleSpeakMentorText(msg.id, msg.text)}
                        className="hover:underline flex items-center gap-1 font-bold cursor-pointer text-indigo-700"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{mentorSpeakingId === msg.id ? 'Stop Audio' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isAskingCharacter && (
            <div className="flex gap-2.5 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm shrink-0">
                {mentor.avatar}
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-500">
                {mentor.name} is thinking of an answer... 💡
              </div>
            </div>
          )}
        </div>

        {/* Live Voice Recording Status HUD */}
        {isListeningMic && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-300 text-xs text-rose-950 shadow-sm animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping shrink-0" />
              <div>
                <p className="font-extrabold text-rose-900">
                  🎙️ Listening... Speak clearly into your microphone!
                </p>
                {interimTranscript && (
                  <p className="text-[11px] font-medium text-rose-800 italic mt-0.5">
                    "{interimTranscript}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {characterInput && (
                <button
                  type="button"
                  onClick={() => {
                    if (recognitionRef.current) {
                      try {
                        recognitionRef.current.stop();
                      } catch {}
                    }
                    setIsListeningMic(false);
                    handleAskCharacter(characterInput);
                  }}
                  className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Send Voice
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (recognitionRef.current) {
                    try {
                      recognitionRef.current.stop();
                    } catch {}
                  }
                  setIsListeningMic(false);
                  setInterimTranscript('');
                }}
                className="px-3 py-1 rounded-xl bg-white border border-rose-200 text-rose-800 font-bold text-xs hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Voice Assistance Banner (if mic denied or unsupported) */}
        {voiceErrorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start justify-between gap-3 animate-fade-in">
            <div className="flex items-start gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-amber-900 leading-snug">{voiceErrorMsg}</p>
                <p className="text-[11px] text-amber-800 mt-1">
                  Click any suggested voice question below to ask {mentor.name} immediately!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVoiceErrorMsg(null)}
              className="text-amber-700 hover:text-amber-950 font-bold text-[11px] p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Suggested Quick Questions Chips */}
        {mentor.suggestedQuestions && mentor.suggestedQuestions.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              Click to ask directly (Voice & Text):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {mentor.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskCharacter(q)}
                  disabled={isAskingCharacter}
                  className="text-xs px-3 py-1.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium transition-all text-left cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span>💬</span>
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text & Voice Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskCharacter(characterInput);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={characterInput}
              onChange={(e) => setCharacterInput(e.target.value)}
              placeholder={`Ask ${mentor.name} a question (e.g. "Wait, why can't light stop moving?")...`}
              disabled={isAskingCharacter}
              className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border text-slate-800 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all ${
                isListeningMic ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200'
              }`}
            />
          </div>

          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
              isListeningMic
                ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300 animate-pulse'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 hover:scale-105'
            }`}
            title={isListeningMic ? 'Stop listening' : 'Speak your question with microphone'}
          >
            {isListeningMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!characterInput.trim() || isAskingCharacter}
            className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </section>

      {/* Feature 3: Parent & Teacher Discussion Prompts for Dinner / Bedtime */}
      {storyData.discussionPrompts && storyData.discussionPrompts.length > 0 && (
        <section className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80 border border-amber-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌙</span>
              <div>
                <h3 className="font-heading font-black text-base sm:text-lg text-amber-950">
                  Offline Discussion Prompts for Dinner & Bedtime
                </h3>
                <p className="text-xs text-amber-900/80">
                  Reinforce STEM curiosity away from the screen with open-ended family conversations.
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyDiscussionPrompts}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Prompts</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {storyData.discussionPrompts.map((prompt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/90 border border-amber-200 shadow-2xs hover:border-amber-400 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    {idx === 0 ? 'Dinner Table Talk' : idx === 1 ? 'Curiosity Challenge' : 'Pillow Reflection'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  "{prompt}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vocabulary Section */}
      {storyData.vocabulary && storyData.vocabulary.length > 0 && (
        <section className="mb-10 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                Word Bank & Vocabulary
              </h3>
              <p className="text-xs text-slate-500">
                Key terms from the story with age-friendly definitions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {storyData.vocabulary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading font-extrabold text-sm text-indigo-700 group-hover:text-indigo-800">
                    {item.word}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    Word #{idx + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {item.meaning}
                </p>
                {item.example && (
                  <p className="text-[11px] text-slate-500 italic mt-2 pt-2 border-t border-slate-200/60">
                    "{item.example}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Books and Educational Websites */}
      <SuggestedResources
        topic={storyData.topic}
        books={storyData.suggested_books}
        websites={storyData.suggested_websites}
      />

      {/* Bottom CTA: Take Quiz */}
      <div className="no-print bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-9 text-white text-center shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="max-w-xl mx-auto relative z-10">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Comprehension Check
          </span>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mt-3 mb-2">
            Ready to test your understanding?
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 mb-6">
            FableSTEM has prepared 5 quick questions based strictly on the story you just read.
          </p>

          <button
            onClick={onTakeQuiz}
            disabled={isLoadingQuiz}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-base shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            {isLoadingQuiz ? (
              <span>Preparing Your Quiz...</span>
            ) : (
              <>
                <span>Take the Quiz</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* One-Click Printable Coloring Book & Worksheet Modal */}
      {isColoringBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative animate-scale-up border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Paintbrush className="w-5 h-5 text-emerald-600" />
                <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                  Printable Coloring Book & STEM Activity Sheet
                </h3>
              </div>
              <button
                onClick={() => setIsColoringBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Preview Container */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-white text-slate-900 space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-center border-b-2 border-black pb-3 text-xs font-bold font-mono">
                <div>FableSTEM Offline Discovery Sheet</div>
                <div>Name: ______________________ Date: ________</div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h2 className="font-heading font-black text-2xl uppercase tracking-wider">
                  {storyData.title}
                </h2>
                <p className="text-xs font-semibold mt-1">Topic: {storyData.topic} • Age {storyData.age_group}</p>
              </div>

              {/* Coloring Frame Box */}
              <div className="border-2 border-black rounded-xl p-8 text-center bg-slate-50 min-h-[220px] flex flex-col items-center justify-center">
                <span className="text-4xl mb-2">🎨 🖍️ 🌿</span>
                <p className="font-heading font-extrabold text-base text-slate-800">
                  Coloring & Sketching Canvas
                </p>
                <p className="text-xs text-slate-600 max-w-md mt-1">
                  Draw and color your main scene from this story: Draw {storyData.hero ? storyData.hero.name : 'the explorer'} and their companion discovering how {storyData.topic} works!
                </p>
              </div>

              {/* Story Excerpt in Big Readable Font */}
              <div className="space-y-3 text-sm leading-relaxed border-t border-slate-200 pt-4">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700">
                  Story to Read & Trace:
                </h4>
                {paragraphs.slice(0, 2).map((p, i) => (
                  <p key={i} className="text-xs sm:text-sm font-serif">{p}</p>
                ))}
              </div>

              {/* Vocabulary Matching Check */}
              {storyData.vocabulary && storyData.vocabulary.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                    Vocabulary Word Bank:
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {storyData.vocabulary.slice(0, 3).map((v, i) => (
                      <div key={i} className="border border-slate-300 p-2 rounded-lg font-mono">
                        <strong>[ ] {v.word}:</strong> {v.meaning}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsColoringBookModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Coloring Sheet Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
