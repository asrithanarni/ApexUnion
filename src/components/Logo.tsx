import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'full',
}) => {
  const sizeMap = {
    sm: { box: 'w-9 h-9', icon: 'w-6 h-6', textTitle: 'text-base', textSub: 'text-[9px]' },
    md: { box: 'w-11 h-11', icon: 'w-7 h-7', textTitle: 'text-lg', textSub: 'text-[10px]' },
    lg: { box: 'w-16 h-16', icon: 'w-10 h-10', textTitle: 'text-2xl', textSub: 'text-xs' },
    xl: { box: 'w-24 h-24', icon: 'w-16 h-16', textTitle: 'text-3xl', textSub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Clean Professional "AU" Logo Mark Emblem */}
      <div
        className={`${currentSize.box} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F2238] via-[#081524] to-[#030911] border-2 border-[#D4AF37] shadow-xl shadow-black/80 ring-1 ring-[#F3E5AB]/30 transition-all duration-300 hover:scale-105 hover:border-[#FFF0B3] group cursor-pointer`}
        title="Apex Union — AU Skilled Crafts & Labour Guild"
      >
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/30 via-transparent to-transparent pointer-events-none" />

        {/* Clean, High-Precision Vector "AU" Monogram */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich 24K Metallic Gold Gradient */}
            <linearGradient id="auGoldPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="25%" stopColor="#FDE68A" />
              <stop offset="55%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#AA781C" />
              <stop offset="100%" stopColor="#5E3F05" />
            </linearGradient>

            {/* Specular Highlight Gold */}
            <linearGradient id="auGoldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#B8861B" />
            </linearGradient>

            {/* Subtle Outer Frame Gradient */}
            <linearGradient id="auFrameGold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8A5E12" />
              <stop offset="50%" stopColor="#E2BD68" />
              <stop offset="100%" stopColor="#FFF8DB" />
            </linearGradient>

            {/* Drop Shadow Filter */}
            <filter id="auSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#D4AF37" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Clean Guild Crest Inset Border */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="16"
            stroke="url(#auFrameGold)"
            strokeWidth="2"
            opacity="0.4"
          />

          {/* Geometric Inner Accent Corner Marks */}
          <path d="M 16 26 L 16 16 L 26 16" stroke="url(#auGoldPrimary)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 84 26 L 84 16 L 74 16" stroke="url(#auGoldPrimary)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 16 74 L 16 84 L 26 84" stroke="url(#auGoldPrimary)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 84 74 L 84 84 L 74 84" stroke="url(#auGoldPrimary)" strokeWidth="1.5" strokeLinecap="round" />

          {/* ================= PURE "AU" MONOGRAM MARK ================= */}
          <g filter="url(#auSoftGlow)">
            {/* LETTER "A" (Left & Apex) */}
            {/* Left Diagonal Leg */}
            <path
              d="M 33 22 L 18 78 L 27 78 L 33 54 L 46 54 L 42 78 L 51 78 L 38 22 Z"
              fill="url(#auGoldPrimary)"
            />
            {/* Inner A-Triangle Cutout */}
            <polygon points="35.5,33 32,47 41,47" fill="#06121E" />
            
            {/* Crossbar Highlight on 'A' */}
            <rect x="29" y="47" width="14" height="3" fill="url(#auGoldHighlight)" opacity="0.9" />

            {/* LETTER "U" (Right & Base Interlink) */}
            {/* Clean, Bold, Architectural 'U' */}
            <path
              d="M 52 38 L 61 38 L 61 63 C 61 70, 66 73, 73 73 C 80 73, 85 70, 85 63 L 85 38 L 94 38 L 94 63 C 94 77, 85 81, 73 81 C 61 81, 52 77, 52 63 Z"
              fill="url(#auGoldHighlight)"
            />

            {/* Connecting Synergy Bridge between A & U */}
            <rect x="42" y="58" width="14" height="3" rx="1.5" fill="url(#auGoldPrimary)" opacity="0.85" />

            {/* Apex Diamond Star Crown atop 'A' */}
            <polygon points="35.5,14 38,18 35.5,21 33,18" fill="#FFFDF5" />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-wider font-['Cinzel',serif] text-gold-gradient ${currentSize.textTitle} drop-shadow-sm`}>
              APEX UNION
            </span>
          </div>
          <span className={`font-semibold tracking-[0.24em] text-[#D4AF37] uppercase ${currentSize.textSub} flex items-center gap-1`}>
            <span>AU Skilled Guilds</span>
            <span className="text-[#D4AF37]/40">·</span>
            <span className="text-[#F3E5AB]/75 font-mono">Cooperative Network</span>
          </span>
        </div>
      )}
    </div>
  );
};
