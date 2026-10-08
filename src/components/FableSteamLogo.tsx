import React from 'react';

interface FableSteamLogoProps {
  /**
   * Layout format:
   * - 'full': Stacked emblem on top, wordmark below (matches user's original artwork)
   * - 'horizontal': Emblem on left, wordmark on right (ideal for navbar header)
   * - 'icon': Emblem mark only (book + 'f' + steam trails)
   * - 'wordmark': fableSTEAM letters only
   */
  variant?: 'full' | 'horizontal' | 'icon' | 'wordmark';
  /**
   * Color theme for the 'fable' text:
   * - 'dark': White 'fable' text (ideal on dark/black backgrounds, hero banners, footer)
   * - 'light': Dark slate 'fable' text (ideal on light/white background like navbar)
   */
  theme?: 'dark' | 'light';
  /**
   * Whether to wrap in dark rounded container matching original black artwork
   */
  withDarkBadge?: boolean;
  /**
   * Custom CSS classes
   */
  className?: string;
  /**
   * Optional custom size or height (e.g. 'h-8', 'h-10', 'h-12')
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Top Emblem: Open Book + 'f' + Cyan Steam / Vapor Trails
 */
export const FableSteamEmblem: React.FC<{
  className?: string;
  theme?: 'dark' | 'light';
  glow?: boolean;
}> = ({ className = 'w-10 h-10', theme = 'dark', glow = true }) => {
  return (
    <svg
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FableSTEM Emblem"
    >
      <defs>
        {/* Steam Gradient */}
        <linearGradient id="emblemSteamGrad" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>

        {/* Book Base Gradient */}
        <linearGradient id="emblemBookBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {glow && (
          <filter id="emblemGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* --- 1. Three Sinuous Steam / Vapor Trails (Science Energy) --- */}
      <g filter={glow ? 'url(#emblemGlow)' : undefined}>
        {/* Trail 1: Leftmost wave plume */}
        <path
          d="M 275 210 C 270 185 295 160 310 145 C 322 133 325 118 318 105 C 310 90 320 75 328 65 C 332 60 338 52 342 45 C 342 55 338 70 330 82 C 322 96 325 110 335 122 C 348 138 335 165 315 182 C 298 197 285 205 275 210 Z"
          fill="url(#emblemSteamGrad)"
        />

        {/* Trail 2: Middle prominent plume */}
        <path
          d="M 292 195 C 310 170 345 145 365 125 C 380 110 382 92 375 75 C 368 58 375 42 388 28 C 392 23 398 15 402 10 C 400 22 392 40 382 55 C 375 68 376 82 388 95 C 404 112 398 135 372 155 C 345 175 315 188 292 195 Z"
          fill="url(#emblemSteamGrad)"
        />

        {/* Trail 3: Rightmost plume */}
        <path
          d="M 335 160 C 352 140 385 120 402 102 C 418 85 420 70 412 55 C 418 68 415 82 402 98 C 388 115 365 132 345 150 C 340 154 336 157 335 160 Z"
          fill="url(#emblemSteamGrad)"
        />
      </g>

      {/* --- 2. The Open Book Foundation --- */}
      {/* Cyan Underline Foundation Curve */}
      <path
        d="M 98 296 C 145 285 200 286 250 310 C 300 286 355 285 402 296 C 372 312 315 322 250 322 C 185 322 128 312 98 296 Z"
        fill="url(#emblemBookBaseGrad)"
      />

      {/* Book Pages: Left Layered Sheets */}
      {/* Left Top Page */}
      <path
        d="M 246 295 C 190 270 142 270 108 276 C 112 260 148 245 202 248 C 220 249 238 255 246 260 Z"
        fill="#FFFFFF"
      />
      {/* Left Middle Page */}
      <path
        d="M 246 270 C 198 245 155 242 122 248 C 128 232 165 218 215 220 C 230 221 240 225 246 228 Z"
        fill="#FFFFFF"
      />
      {/* Left Bottom Primary Leaf */}
      <path
        d="M 246 242 C 200 216 160 214 135 220 C 145 204 180 190 230 192 C 238 193 243 194 246 195 Z"
        fill="#FFFFFF"
      />

      {/* Book Pages: Right Layered Sheets */}
      {/* Right Top Page */}
      <path
        d="M 254 295 C 310 270 358 270 392 276 C 388 260 352 245 298 248 C 280 249 262 255 254 260 Z"
        fill="#FFFFFF"
      />
      {/* Right Middle Page */}
      <path
        d="M 254 270 C 302 245 345 242 378 248 C 372 232 335 218 285 220 C 270 221 260 225 254 228 Z"
        fill="#FFFFFF"
      />
      {/* Right Bottom Primary Leaf */}
      <path
        d="M 254 242 C 300 216 340 214 365 220 C 355 204 320 190 270 192 C 262 193 257 194 254 195 Z"
        fill="#FFFFFF"
      />

      {/* --- 3. The Stylized Center 'f' Character --- */}
      {/* The 'f' stem and crossbar emerging from the book spine */}
      <path
        d="M 230 300 L 230 178 L 186 178 L 186 150 L 230 150 L 230 128 C 230 92 255 76 295 76 C 308 76 324 80 334 85 L 324 115 C 316 112 308 110 300 110 C 282 110 272 118 272 136 L 272 150 L 320 150 L 314 178 L 272 178 L 272 300 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

/**
 * The 'fable' wordmark in customized clean geometric typography
 */
export const FableWord: React.FC<{
  color?: string;
  className?: string;
}> = ({ color = '#FFFFFF', className = '' }) => {
  return (
    <svg
      viewBox="0 0 350 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="fable"
    >
      {/* 'f' */}
      <path
        d="M 45 110 L 45 48 L 24 48 L 24 28 L 45 28 L 45 18 C 45 4 58 0 76 0 C 84 0 92 2 98 4 L 94 24 C 90 23 85 22 80 22 C 73 22 69 26 69 34 L 69 28 L 69 48 L 94 48 L 94 28 L 69 28 L 69 48 L 94 48 L 90 68 L 69 68 L 69 110 Z"
        fill={color}
      />
      {/* 'a' */}
      <path
        d="M 148 110 L 128 110 L 128 98 C 122 106 110 112 96 112 C 74 112 58 98 58 78 C 58 56 75 44 100 44 C 111 44 121 46 128 50 L 128 46 C 128 35 120 28 106 28 C 96 28 86 32 78 37 L 72 20 C 82 14 96 10 112 10 C 138 10 152 24 152 48 L 152 110 L 148 110 Z M 128 66 C 122 63 114 61 106 61 C 90 61 78 68 78 80 C 78 91 88 97 99 97 C 113 97 124 88 128 78 L 128 66 Z"
        fill={color}
      />
      {/* 'b' */}
      <path
        d="M 168 110 L 168 4 L 192 4 L 192 42 C 200 34 212 28 226 28 C 250 28 268 48 268 72 C 268 96 250 114 225 114 C 210 114 198 107 192 98 L 192 110 L 168 110 Z M 218 94 C 234 94 244 82 244 71 C 244 60 234 48 218 48 C 203 48 192 60 192 71 C 192 82 203 94 218 94 Z"
        fill={color}
      />
      {/* 'l' */}
      <path d="M 282 110 L 282 4 L 306 4 L 306 110 Z" fill={color} />
      {/* 'e' */}
      <path
        d="M 390 74 L 334 74 C 336 88 348 96 362 96 C 372 96 381 92 388 86 L 398 99 C 388 108 374 114 358 114 C 330 114 312 96 312 71 C 312 46 330 28 357 28 C 383 28 398 46 398 71 C 398 72 398 73 390 74 Z M 335 59 L 376 59 C 374 47 366 42 356 42 C 346 42 338 48 335 59 Z"
        fill={color}
      />
    </svg>
  );
};

/**
 * The 'STEAM' acronym letters with iconic discipline graphics:
 * S = Science (Erlenmeyer Flask)
 * T = Technology (Circuit Board PCB)
 * E = Engineering (Gear / Cogwheel)
 * A = Art (Palette & Paintbrush)
 * M = Mathematics (Drafting Triangle & Set Square)
 */
export const SteamLetters: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 540 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="STEAM"
    >
      {/* === S (SCIENCE) - Amber Orange with Flask === */}
      <g>
        {/* Main S Letter Body */}
        <path
          d="M 85 32 C 80 18 66 8 48 8 C 26 8 10 22 10 40 C 10 58 24 68 44 74 C 64 80 72 85 72 94 C 72 102 62 108 48 108 C 32 108 18 98 12 85 L -4 95 C 4 112 24 122 48 122 C 76 122 96 106 96 86 C 96 68 82 58 60 52 C 40 46 32 40 32 32 C 32 24 40 18 50 18 C 62 18 72 24 76 33 Z"
          fill="#F59E0B"
        />
        {/* Flask graphic inside S */}
        {/* Flask neck and lip */}
        <rect x="42" y="68" width="6" height="8" rx="1" fill="#0F172A" />
        <rect x="40" y="66" width="10" height="3" rx="1.5" fill="#0F172A" />
        {/* Flask triangular body */}
        <path
          d="M 43 76 L 33 96 C 31 100 34 104 39 104 L 51 104 C 56 104 59 100 57 96 L 47 76 Z"
          fill="#0F172A"
        />
        {/* Flask fluid level and bubbles */}
        <path
          d="M 36 94 L 38 98 C 39 100 41 102 44 102 L 46 102 C 49 102 51 100 52 98 L 54 94 Z"
          fill="#F59E0B"
        />
        <circle cx="43" cy="88" r="1.5" fill="#F59E0B" />
        <circle cx="47" cy="85" r="1" fill="#F59E0B" />
      </g>

      {/* === T (TECHNOLOGY) - Vibrant Circuit Green === */}
      <g transform="translate(105, 0)">
        {/* T Top Bar */}
        <rect x="0" y="10" width="80" height="20" rx="3" fill="#22C55E" />
        {/* T Vertical Stem */}
        <rect x="30" y="30" width="20" height="84" rx="3" fill="#22C55E" />

        {/* PCB Circuit Traces & Nodes */}
        {/* Center vertical circuit bus */}
        <line x1="40" y1="36" x2="40" y2="98" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        {/* Circuit Branch 1 (left) */}
        <path
          d="M 40 50 L 25 50 L 16 60 L 16 75"
          fill="none"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="78" r="3" fill="#0F172A" />

        {/* Circuit Branch 2 (right) */}
        <path
          d="M 40 70 L 55 70 L 64 60 L 64 45"
          fill="none"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="64" cy="42" r="3" fill="#0F172A" />

        {/* Terminal nodes */}
        <circle cx="40" cy="36" r="3.5" fill="#0F172A" />
        <circle cx="40" cy="98" r="3.5" fill="#0F172A" />
      </g>

      {/* === E (ENGINEERING) - Cyan Blue with Gear / Cogwheel === */}
      <g transform="translate(200, 0)">
        {/* E Main Outline */}
        <path
          d="M 0 10 L 68 10 L 68 30 L 22 30 L 22 52 L 60 52 L 60 70 L 22 70 L 22 94 L 70 94 L 70 114 L 0 114 Z"
          fill="#0EA5E9"
        />

        {/* Gear / Cogwheel in center */}
        <g transform="translate(42, 61)">
          {/* Gear teeth (6 teeth) */}
          <circle cx="0" cy="0" r="14" fill="#0F172A" />
          <rect x="-4" y="-18" width="8" height="36" rx="2" fill="#0F172A" />
          <rect
            x="-4"
            y="-18"
            width="8"
            height="36"
            rx="2"
            fill="#0F172A"
            transform="rotate(60)"
          />
          <rect
            x="-4"
            y="-18"
            width="8"
            height="36"
            rx="2"
            fill="#0F172A"
            transform="rotate(120)"
          />
          {/* Inner Axle hole */}
          <circle cx="0" cy="0" r="6" fill="#0EA5E9" />
        </g>
      </g>

      {/* === A (ART) - Purple with Palette & Paintbrush === */}
      <g transform="translate(290, 0)">
        {/* A Outer Shape */}
        <path
          d="M 38 10 L 58 10 L 92 114 L 68 114 L 60 88 L 26 88 L 18 114 L -4 114 Z M 48 34 L 32 72 L 54 72 Z"
          fill="#A855F7"
        />

        {/* Artist Palette in the A counter */}
        <g transform="translate(43, 76)">
          {/* Palette body */}
          <path
            d="M -16 6 C -18 -8 4 -16 16 -8 C 22 -3 20 12 10 14 C 4 15 2 8 -4 8 C -9 8 -14 14 -16 6 Z"
            fill="#0F172A"
          />
          {/* Palette paint color dots */}
          <circle cx="-6" cy="-4" r="2.2" fill="#EF4444" />
          <circle cx="4" cy="-8" r="2.2" fill="#F59E0B" />
          <circle cx="12" cy="-2" r="2.2" fill="#22C55E" />
          <circle cx="10" cy="6" r="2" fill="#0EA5E9" />
          {/* Thumb hole */}
          <ellipse cx="-1" cy="4" rx="2.5" ry="3.5" fill="#A855F7" />

          {/* Angled Paintbrush */}
          <line
            x1="-14"
            y1="16"
            x2="16"
            y2="-16"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Brush bristle tip */}
          <polygon points="14,-14 20,-20 17,-11" fill="#0F172A" />
        </g>
      </g>

      {/* === M (MATHEMATICS) - Coral Red with Drafting Set Square & Ruler === */}
      <g transform="translate(405, 0)">
        {/* M Letter Outline */}
        <path
          d="M 0 10 L 22 10 L 46 64 L 70 10 L 92 10 L 92 114 L 70 114 L 70 48 L 52 88 L 40 88 L 22 48 L 22 114 L 0 114 Z"
          fill="#EF4444"
        />

        {/* Drafting Set Square Triangle Cutout */}
        <polygon points="46,74 72,108 30,108" fill="#0F172A" />
        {/* Triangle Inner Window */}
        <polygon points="48,84 64,103 36,103" fill="#EF4444" />

        {/* Ruler Hash Marks on left vertical leg */}
        <g stroke="#0F172A" strokeWidth="2" strokeLinecap="square">
          <line x1="2" y1="25" x2="8" y2="25" />
          <line x1="2" y1="35" x2="12" y2="35" />
          <line x1="2" y1="45" x2="8" y2="45" />
          <line x1="2" y1="55" x2="12" y2="55" />
          <line x1="2" y1="65" x2="8" y2="65" />
          <line x1="2" y1="75" x2="12" y2="75" />
          <line x1="2" y1="85" x2="8" y2="85" />
          <line x1="2" y1="95" x2="12" y2="95" />
        </g>
      </g>
    </svg>
  );
};

/**
 * Main FableSTEM Logo Component
 * Supports multiple layouts, themes, sizes, and badge treatments
 */
export const FableSteamLogo: React.FC<FableSteamLogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  withDarkBadge = false,
  className = '',
  size = 'md',
}) => {
  // Size presets
  const sizeClasses = {
    xs: {
      wrap: 'gap-1.5',
      emblem: 'w-6 h-6',
      text: 'h-4',
    },
    sm: {
      wrap: 'gap-2',
      emblem: 'w-8 h-8',
      text: 'h-5',
    },
    md: {
      wrap: 'gap-2.5',
      emblem: 'w-10 h-10',
      text: 'h-6 sm:h-7',
    },
    lg: {
      wrap: 'gap-3',
      emblem: 'w-14 h-14',
      text: 'h-8 sm:h-9',
    },
    xl: {
      wrap: 'gap-4',
      emblem: 'w-20 h-20',
      text: 'h-11 sm:h-12',
    },
    '2xl': {
      wrap: 'gap-5',
      emblem: 'w-28 h-28',
      text: 'h-14 sm:h-16',
    },
  }[size];

  const fableColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';

  // Badge wrapper styling (black background with rounded corners matching the user's logo mockup)
  const badgeWrapClasses = withDarkBadge
    ? 'bg-black text-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800'
    : '';

  // 1. Icon Only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${badgeWrapClasses} ${className}`}>
        <FableSteamEmblem className={sizeClasses.emblem} theme={theme} />
      </div>
    );
  }

  // 2. Wordmark Only
  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-center gap-1.5 shrink-0 ${badgeWrapClasses} ${className}`}>
        <FableWord color={fableColor} className={`${sizeClasses.text} w-auto`} />
        <SteamLetters className={`${sizeClasses.text} w-auto`} />
      </div>
    );
  }

  // 3. Full Stacked Artwork (Emblem on top, Wordmark below - exact 1:1 replica of user's upload)
  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center ${badgeWrapClasses} ${sizeClasses.wrap} ${className}`}
      >
        {/* Emblem on top */}
        <div className="relative flex items-center justify-center">
          <FableSteamEmblem
            className={`${size === '2xl' ? 'w-36 h-36' : size === 'xl' ? 'w-28 h-28' : 'w-20 h-20'}`}
            theme={theme}
          />
        </div>

        {/* Wordmark below: fable + STEAM */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1">
          <FableWord
            color={fableColor}
            className={`${size === '2xl' ? 'h-14' : size === 'xl' ? 'h-10' : 'h-7'} w-auto`}
          />
          <SteamLetters
            className={`${size === '2xl' ? 'h-14' : size === 'xl' ? 'h-10' : 'h-7'} w-auto`}
          />
        </div>
      </div>
    );
  }

  // 4. Horizontal Lockup (Emblem on left, Wordmark on right - perfect for Navbar)
  return (
    <div
      className={`inline-flex items-center ${sizeClasses.wrap} shrink-0 select-none ${badgeWrapClasses} ${className}`}
    >
      {/* Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        {withDarkBadge ? (
          <FableSteamEmblem className={sizeClasses.emblem} theme="dark" />
        ) : (
          <div className="p-1 rounded-xl bg-slate-950 shadow-md shadow-slate-900/20 border border-slate-800 flex items-center justify-center">
            <FableSteamEmblem className={sizeClasses.emblem} theme="dark" />
          </div>
        )}
      </div>

      {/* Wordmark: fable + STEAM */}
      <div className="flex items-center gap-1 shrink-0">
        <FableWord color={fableColor} className={`${sizeClasses.text} w-auto`} />
        <SteamLetters className={`${sizeClasses.text} w-auto`} />
      </div>
    </div>
  );
};
