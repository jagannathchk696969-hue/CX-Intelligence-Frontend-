import React from 'react';

export const CXLogo = ({
  size = 'md',
  showText = true,
  subtitle = 'AI Customer Experience',
  className = '',
  textClassName = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', iconSize: 28, text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', iconSize: 36, text: 'text-base', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', iconSize: 48, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', iconSize: 64, text: 'text-2xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      {/* Monogram Icon */}
      <div className={`relative ${currentSize.box} rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-600/30 flex-shrink-0 group`}>
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden backdrop-blur-md">
          {/* Subtle internal gradient aura */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/10 pointer-events-none" />

          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10"
          >
            <defs>
              <linearGradient id="cxGradC" x1="4" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7" />
                <stop offset="0.5" stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="cxGradX" x1="16" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="0.5" stopColor="#06B6D4" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
              <filter id="cxGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* "C" Arc - Orbital Neural Pathway */}
            <path
              d="M 17 9 C 10.5 9 6 13 6 18 C 6 23 10.5 27 17 27"
              stroke="url(#cxGradC)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* C terminal nodes */}
            <circle cx="17" cy="9" r="1.8" fill="#C084FC" />
            <circle cx="17" cy="27" r="1.8" fill="#8B5CF6" />

            {/* "X" Cross Neural Intersection */}
            <path
              d="M 19 11 L 30 25"
              stroke="url(#cxGradX)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 30 11 L 19 25"
              stroke="url(#cxGradX)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Interconnection Central Core Node */}
            <circle cx="24.5" cy="18" r="2.4" fill="#FFFFFF" filter="url(#cxGlow)" />
            <circle cx="24.5" cy="18" r="1.2" fill="#06B6D4" />

            {/* X Peripheral Nodes */}
            <circle cx="19" cy="11" r="1.6" fill="#A855F7" />
            <circle cx="30" cy="11" r="1.6" fill="#38BDF8" />
            <circle cx="19" cy="25" r="1.6" fill="#6366F1" />
            <circle cx="30" cy="25" r="1.6" fill="#06B6D4" />
          </svg>
        </div>
      </div>

      {/* Typography Brand Lockup */}
      {showText && (
        <div className={`flex flex-col ${textClassName}`}>
          <div className="flex items-center space-x-1.5">
            <span className={`font-black text-white tracking-tight ${currentSize.text}`}>
              CX
            </span>
            <span className={`font-extrabold bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-tight ${currentSize.text}`}>
              Intelligence
            </span>
          </div>
          {subtitle && (
            <span className={`font-semibold tracking-wider uppercase text-cyan-400/90 ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
