import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Award,
  ChevronRight,
  Flame,
  Beaker,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundscapeEngine } from '../services/soundscapes';

interface StemExperimentSimulatorProps {
  topic: string;
  ageGroup?: string;
  onAwardXp?: (amount: number, reason: string) => void;
  onClose?: () => void;
}

interface ExperimentStep {
  instruction: string;
  actionButton: string;
  actionFeedback: string;
  visualState: string;
}

interface ExperimentConfig {
  title: string;
  subtitle: string;
  icon: string;
  hypothesis: string;
  materials: string[];
  steps: ExperimentStep[];
  conclusion: string;
  realWorldConnection: string;
}

export const StemExperimentSimulator: React.FC<StemExperimentSimulatorProps> = ({
  topic,
  ageGroup = '8-10',
  onAwardXp,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [interactiveVar, setInteractiveVar] = useState(50); // Slider / dial variable
  const [xpClaimed, setXpClaimed] = useState(false);

  // Generate dynamic, topic-appropriate STEM experiment
  const getExperiment = (): ExperimentConfig => {
    const t = topic.toLowerCase();
    if (t.includes('water') || t.includes('rain') || t.includes('cloud')) {
      return {
        title: 'Cloud in a Jar & Condensation Chamber',
        subtitle: 'Observe how warm water vapor turns into miniature rain clouds',
        icon: '🌧️',
        hypothesis: 'If warm water vapor hits a cold atmosphere layer, tiny water droplets will condense into a cloud.',
        materials: ['Warm Water (40°C)', 'Glass Chamber', 'Ice Cubes', 'Aerosol/Smoke nuclei particle'],
        steps: [
          {
            instruction: 'Pour warm water into the sealed chamber to create invisible water vapor.',
            actionButton: 'Pour Warm Water 💧',
            actionFeedback: 'Warm water fills the bottom. Evaporating water molecules rise as vapor!',
            visualState: 'warm_water',
          },
          {
            instruction: 'Place cold ice cubes on the lid of the jar to cool the rising vapor.',
            actionButton: 'Add Ice Lid 🧊',
            actionFeedback: 'The top turns freezing cold. Rising warm vapor collides with the chill!',
            visualState: 'cooling_top',
          },
          {
            instruction: 'Inject microscopic condensation particles (condensation nuclei) for water drops to cling to.',
            actionButton: 'Release Nuclei ✨',
            actionFeedback: 'Dense, swirling cloud swirls inside the jar! Watch raindrops form on the cold glass!',
            visualState: 'full_cloud',
          },
        ],
        conclusion: 'Clouds form when invisible warm water vapor cools in the upper atmosphere and condenses around tiny dust or pollen particles!',
        realWorldConnection: 'This is why rain showers happen when warm moisture meets cool mountain air fronts.',
      };
    }

    if (t.includes('photo') || t.includes('plant') || t.includes('tree') || t.includes('leaf')) {
      return {
        title: 'Photosynthesis Solar Factory',
        subtitle: 'Dial up sunlight & CO2 to watch chloroplasts produce oxygen bubbles',
        icon: '🌿',
        hypothesis: 'Leaves submerged in water produce more oxygen bubbles when sunlight intensity increases.',
        materials: ['Submerged Green Leaf', 'Water Chamber with Baking Soda (CO2)', 'Adjustable Sunlight Lamp', 'Oxygen Sensor Tube'],
        steps: [
          {
            instruction: 'Submerge fresh green leaves in clear water infused with dissolved carbon dioxide.',
            actionButton: 'Submerge Leaf in Water 🌱',
            actionFeedback: 'The leaf stomata pores absorb the dissolved CO2 molecules.',
            visualState: 'leaf_submerged',
          },
          {
            instruction: 'Turn on the sunlight lamp to energize the chlorophyll inside the plant cells.',
            actionButton: 'Ignite Sunlight Lamp ☀️',
            actionFeedback: 'Chlorophyll traps photon packets and splits water molecules into hydrogen & oxygen!',
            visualState: 'chlorophyll_active',
          },
          {
            instruction: 'Increase light brightness to see streams of silver oxygen bubbles rise to the surface!',
            actionButton: 'Observe Bubble Stream 🫧',
            actionFeedback: 'Rapid stream of pure Oxygen (O2) bubbles collected in the test tube! Photosynthesis confirmed!',
            visualState: 'oxygen_bubbles',
          },
        ],
        conclusion: 'Plants harness solar energy to combine carbon dioxide and water, releasing life-giving oxygen and synthesizing glucose sugars.',
        realWorldConnection: 'Over 50% of Earth’s oxygen is created through this exact mechanism by ocean phytoplankton and rainforests.',
      };
    }

    if (t.includes('space') || t.includes('planet') || t.includes('gravity') || t.includes('orbit')) {
      return {
        title: 'Gravity Well & Orbit Trajectory Simulator',
        subtitle: 'Test how velocity and mass create stable planetary orbits without crashing',
        icon: '🪐',
        hypothesis: 'A satellite needs the exact orbital velocity balance to counter the sun’s gravitational pull.',
        materials: ['Central Gravitational Star', 'Orbital Thruster Probe', 'Velocity Vector Dial', 'Vacuum Field'],
        steps: [
          {
            instruction: 'Place a massive star at the center of the gravitational field fabric.',
            actionButton: 'Spawn Sun Gravity Core ☀️',
            actionFeedback: 'Space-time curves inward around the central mass!',
            visualState: 'gravity_core',
          },
          {
            instruction: 'Launch a planetary probe horizontally to test escape vs gravitational capture velocity.',
            actionButton: 'Launch Probe at 28,000 km/h 🚀',
            actionFeedback: 'The probe begins curving gracefully along the gravitational depression!',
            visualState: 'probe_curving',
          },
          {
            instruction: 'Engage micro-thrusters to lock the probe into a permanent stable circular orbit!',
            actionButton: 'Lock Stable Orbit 🛰️',
            actionFeedback: 'Perpetual balance achieved! Inertia and gravity are perfectly matched in free-fall!',
            visualState: 'stable_orbit',
          },
        ],
        conclusion: 'An orbit is not zero-gravity—it is falling towards the Earth or Sun continuously while moving forward fast enough to continually miss it!',
        realWorldConnection: 'This is the exact physics used by the International Space Station orbiting Earth every 90 minutes.',
      };
    }

    // Default universal STEM experiment
    return {
      title: `${topic} Scientific Discovery Lab`,
      subtitle: `Formulate a hypothesis, test variables, and measure results for ${topic}`,
      icon: '🔬',
      hypothesis: `Testing real-world conditions reveals the hidden scientific mechanism behind ${topic}.`,
      materials: ['Observation Chamber', 'Sensor Monitor', 'Variable Control Dial', 'Digital Microscope'],
      steps: [
        {
          instruction: `Set up the baseline control environment to examine how ${topic} behaves at standard state.`,
          actionButton: 'Calibrate Control Environment ⚖️',
          actionFeedback: 'Baseline sensors calibrated! Clean starting point established.',
          visualState: 'step1',
        },
        {
          instruction: 'Introduce the core variable to test your scientific hypothesis.',
          actionButton: 'Inject Active Variable 🧪',
          actionFeedback: 'Reaction underway! Molecules and energy transfer visibly reacting.',
          visualState: 'step2',
        },
        {
          instruction: 'Measure the resulting output and record the STEM breakthrough discovery!',
          actionButton: 'Record Discovery Data 📊',
          actionFeedback: 'Breakthrough recorded! The data matches the theoretical prediction with 99% accuracy!',
          visualState: 'step3',
        },
      ],
      conclusion: `By testing step-by-step, we uncovered the fundamental scientific laws governing ${topic}!`,
      realWorldConnection: 'Professional scientists use this precise scientific method to design clean energy and medical cures.',
    };
  };

  const exp = getExperiment();

  const handleNextStep = () => {
    soundscapeEngine.playSoundEffect('sparkle');
    if (currentStepIndex < exp.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (!xpClaimed && onAwardXp) {
        onAwardXp(40, 'Completed Virtual STEM Experiment');
        setXpClaimed(true);
      }
    }
  };

  const handleReset = () => {
    soundscapeEngine.playSoundEffect('clear');
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  const currentStep = exp.steps[currentStepIndex];

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden p-4 sm:p-6 my-6 transition-all animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Beaker className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                {exp.title}
              </h3>
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                Interactive Lab
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{exp.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Lab</span>
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

      {/* Hypothesis & Materials bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
          <span className="text-xl shrink-0">🔬</span>
          <div className="text-xs">
            <strong className="text-indigo-950 font-black block mb-0.5">Scientific Hypothesis:</strong>
            <p className="text-indigo-900 leading-relaxed font-medium">{exp.hypothesis}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
          <span className="text-xl shrink-0">🧪</span>
          <div className="text-xs">
            <strong className="text-slate-800 font-black block mb-0.5">Lab Materials:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {exp.materials.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-bold"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Experiment Stage */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-6 text-white min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Glow ambient background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Experiment Visual Simulation Canvas State */}
        <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
          <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl shadow-xl shadow-cyan-500/10 mb-4 animate-bounce">
            {currentStepIndex === 0 ? '🧪' : currentStepIndex === 1 ? '⚡' : isCompleted ? '🎉' : '✨'}
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/80 mb-2">
            Step {currentStepIndex + 1} of {exp.steps.length}: {currentStep.visualState.replace('_', ' ')}
          </span>

          <h4 className="font-heading font-black text-lg sm:text-xl text-white max-w-lg mb-2">
            {currentStep.instruction}
          </h4>

          <p className="text-xs sm:text-sm text-cyan-100 max-w-md bg-black/30 p-2.5 rounded-xl border border-white/10">
            {currentStep.actionFeedback}
          </p>
        </div>

        {/* Interactive Parameter Control Slider */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Test Parameter Dial:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={interactiveVar}
              onChange={(e) => {
                setInteractiveVar(Number(e.target.value));
                soundscapeEngine.playSoundEffect('brush');
              }}
              className="accent-cyan-400 w-28 cursor-pointer"
            />
            <span className="font-mono text-cyan-300 font-bold">{interactiveVar}% Intensity</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextStep}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-indigo-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{isCompleted ? 'Experiment Finished! 🎉' : currentStep.actionButton}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conclusion & Real World Connection when complete */}
      {isCompleted && (
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 animate-scale-up">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-heading font-black text-base text-emerald-950">
                  Lab Conclusion & STEM Breakthrough!
                </h4>
                <span className="text-[11px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                  +40 Explorer XP
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 mb-2 leading-relaxed">
                <strong>Discovery:</strong> {exp.conclusion}
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200/60 text-xs text-slate-700">
                <strong>Real-World Application:</strong> {exp.realWorldConnection}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
