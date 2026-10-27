import { useState } from 'react';

interface StageData {
  label: string;
  count: number;
  amount?: number;
  color?: string;
}

interface IsometricChart3DProps {
  stages: StageData[];
  maxCount?: number;
}

export default function IsometricBar3D({ stages, maxCount }: IsometricChart3DProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const highest = maxCount || Math.max(...stages.map(s => s.count), 1);

  return (
    <div className="w-full pt-8 pb-4 px-2">
      <div className="flex items-end justify-between gap-4 h-48 sm:h-56">
        {stages.map((stage, idx) => {
          const heightPercent = Math.max(15, Math.round((stage.count / highest) * 100));
          const isHovered = hoveredIdx === idx;
          const barColor = stage.color || '#f95e26';

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
            >
              {/* Floating Value Tooltip on hover */}
              <div
                className={`absolute -top-10 transition-all duration-300 pointer-events-none z-20 px-2.5 py-1 rounded-md bg-[#2a2a2a] border border-[#444] text-[11px] shadow-xl text-white font-semibold whitespace-nowrap ${
                  isHovered ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-0'
                }`}
              >
                {stage.count} deals {stage.amount ? `• $${stage.amount.toLocaleString()}` : ''}
              </div>

              {/* 3D Volumetric Isometric Bar */}
              <div
                className="w-12 sm:w-16 relative transition-all duration-500 ease-out"
                style={{
                  height: `${heightPercent}%`,
                  transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
                }}
              >
                {/* 3D Top Face (Cap) */}
                <div
                  className="absolute -top-3 left-0 w-full h-3 rounded-t-sm transition-colors duration-300"
                  style={{
                    backgroundColor: isHovered ? '#ff9d71' : '#ff7a45',
                    transform: 'skewX(-45deg) translateX(6px)',
                    filter: 'brightness(1.25)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
                  }}
                />

                {/* 3D Right Side Face (Depth) */}
                <div
                  className="absolute top-0 -right-3 w-3 h-full rounded-r-sm transition-colors duration-300"
                  style={{
                    backgroundColor: isHovered ? '#c44214' : '#a8350d',
                    transform: 'skewY(-45deg) translateY(-6px)',
                    filter: 'brightness(0.75)',
                  }}
                />

                {/* 3D Front Face */}
                <div
                  className="w-full h-full rounded-tl-sm relative overflow-hidden transition-all duration-300"
                  style={{
                    background: `linear-gradient(180deg, ${barColor} 0%, #a8350d 100%)`,
                    boxShadow: isHovered
                      ? `0 15px 30px -5px rgba(249, 94, 38, 0.45), inset 0 1px 0 rgba(255,255,255,0.3)`
                      : 'inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Subtle specular vertical highlight */}
                  <div className="absolute top-0 left-1 w-1 h-full bg-white/20 blur-[0.5px]" />

                  {/* Count badge on front face */}
                  <div className="absolute top-2 left-0 right-0 text-center font-bold text-xs text-white drop-shadow">
                    {stage.count}
                  </div>
                </div>

                {/* 3D Ground Shadow */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-2 bg-black/60 rounded-full blur-[2px] transition-all duration-300"
                  style={{
                    transform: isHovered ? 'scale(1.2) translateY(4px)' : 'scale(1)',
                    opacity: isHovered ? 0.8 : 0.4,
                  }}
                />
              </div>

              {/* Stage Label */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors font-medium truncate max-w-[80px] sm:max-w-none">
                  {stage.label}
                </p>
                {stage.amount !== undefined && (
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    ${Math.round(stage.amount / 1000)}k
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

