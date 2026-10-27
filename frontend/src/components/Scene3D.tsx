import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  radius: number;
  label?: string;
}

export default function Scene3D({ className = '', height = 240 }: { className?: string; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodeCount, setNodeCount] = useState<number>(28);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let heightPx = (canvas.height = height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      heightPx = canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D point cloud in a sphere/polyhedron distribution
    const count = 30;
    setNodeCount(count);
    const nodes: Node3D[] = [];

    // Distinct palette optimized for dark vs light background
    const colors = isDark
      ? ['#f95e26', '#ff844b', '#10b981', '#3b82f6', '#fbbf24', '#ffffff']
      : ['#f95e26', '#ea580c', '#059669', '#2563eb', '#d97706', '#7c3aed'];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 95 + (i % 3) * 15;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: colors[i % colors.length],
        radius: (i % 4 === 0 ? 3.5 : 2.2),
        label: i === 0 ? 'Enterprise Deal' : i === 7 ? 'Acme Inc' : i === 15 ? 'Closed Won' : undefined,
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;
    let targetAngleX = 0.003;
    let targetAngleY = 0.005;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - heightPx / 2;
      targetAngleY = (mouseX / width) * 0.02;
      targetAngleX = -(mouseY / heightPx) * 0.02;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const focalLength = 320;

    const render = () => {
      ctx.clearRect(0, 0, width, heightPx);

      // Smooth rotate easing
      angleX += (targetAngleX - angleX) * 0.08;
      angleY += (targetAngleY - angleY) * 0.08;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Rotate nodes around center
      for (const node of nodes) {
        // Rotate around Y axis
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;

        // Rotate around X axis
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;

        node.x = x1;
        node.y = y2;
        node.z = z2;
      }

      // Sort by Z for proper 3D depth rendering
      const sorted = [...nodes].sort((a, b) => b.z - a.z);

      const centerX = width / 2;
      const centerY = heightPx / 2;

      // Draw subtle orbital depth ring in 3D
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 130, 45, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(249, 94, 38, 0.14)' : 'rgba(249, 94, 38, 0.32)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw 3D connecting lines between close nodes
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const a = sorted[i];
          const b = sorted[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 80) {
            const scaleA = focalLength / (focalLength + a.z + 180);
            const scaleB = focalLength / (focalLength + b.z + 180);

            const ax = centerX + a.x * scaleA;
            const ay = centerY + a.y * scaleA;
            const bx = centerX + b.x * scaleB;
            const by = centerY + b.y * scaleB;

            const alpha = (1 - dist / 80) * 0.25 * ((a.z + 120) / 240);
            if (alpha > 0.02) {
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.strokeStyle = isDark
                ? `rgba(249, 94, 38, ${Math.min(alpha, 0.4)})`
                : `rgba(234, 88, 12, ${Math.min(alpha * 1.6, 0.55)})`;
              ctx.lineWidth = isDark ? 1 : 1.2;
              ctx.stroke();
            }
          }
        }
      }

      // Draw 3D projected nodes
      for (const node of sorted) {
        const scale = focalLength / (focalLength + node.z + 180);
        const px = centerX + node.x * scale;
        const py = centerY + node.y * scale;
        const rad = Math.max(1, node.radius * scale);
        const alpha = Math.max(0.2, (node.z + 120) / 240);

        // Ambient outer glow for foreground nodes
        if (node.z > 20) {
          ctx.beginPath();
          ctx.arc(px, py, rad * 3, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(249, 94, 38, ${0.15 * alpha})`
            : `rgba(249, 94, 38, ${0.25 * alpha})`;
          ctx.fill();
        }

        // Core 3D sphere point
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = Math.min(1, alpha + (isDark ? 0.2 : 0.4));
        ctx.fill();
        ctx.globalAlpha = 1;

        // Foreground floating labels
        if (node.label && node.z > 30) {
          ctx.font = '600 10px sans-serif';
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)';
          ctx.fillText(node.label, px + rad + 6, py + 3);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [height, isDark]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 p-5 ${
        isDark
          ? 'bg-gradient-to-b from-[#222222] to-[#1a1a1a] border border-[#333] shadow-3d-subtle'
          : 'bg-gradient-to-br from-white via-amber-50/50 to-orange-50/70 border border-amber-200/80 shadow-xl shadow-orange-500/10'
      } ${className}`}
    >
      {/* Dark mode ambient glow */}
      {isDark && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#f95e26]/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Light Mode: Radiant Lighting Animation Effects */}
      {!isDark && (
        <>
          {/* Animated Sunbeam Warm Radial Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-amber-300/30 via-orange-300/15 to-transparent rounded-full blur-3xl pointer-events-none animate-sunbeam" />

          {/* Dynamic Light Sweep Shimmer Beam */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] animate-light-sweep" />
          </div>

          {/* Corner Ambient Flare */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-400/15 rounded-full blur-2xl pointer-events-none" />
        </>
      )}

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f95e26] animate-pulse" />
          <h3 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>
            3D Pipeline Intelligence Orbit
          </h3>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f95e26]/20 text-[#f95e26] border border-[#f95e26]/40">
            Interactive
          </span>
        </div>

        <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
          <span className="hidden sm:inline">Move cursor to navigate 3D space</span>
          <span
            className={`px-2 py-1 rounded font-mono text-[11px] border transition-colors ${
              isDark
                ? 'bg-[#2a2a2a] text-gray-300 border-[#383838]'
                : 'bg-white text-slate-700 border-slate-300 shadow-sm'
            }`}
          >
            {nodeCount} Deal Nodes
          </span>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ height: `${height}px` }}
        />

        {/* Floating 3D Metric Badges */}
        <div className="absolute bottom-3 left-4 flex gap-2 flex-wrap pointer-events-none">
          <div
            className={`backdrop-blur-md px-3 py-1.5 rounded-lg border shadow-md flex items-center gap-2 transition-colors ${
              isDark
                ? 'bg-[#1f1f1f]/80 border-[#444] text-gray-300'
                : 'bg-white/90 border-amber-200/80 text-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs">
              Win Rate: <strong className={isDark ? 'text-white' : 'text-slate-900'}>68%</strong>
            </span>
          </div>

          <div
            className={`backdrop-blur-md px-3 py-1.5 rounded-lg border shadow-md flex items-center gap-2 transition-colors ${
              isDark
                ? 'bg-[#1f1f1f]/80 border-[#444] text-gray-300'
                : 'bg-white/90 border-amber-200/80 text-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f95e26]" />
            <span className="text-xs">
              Live Forecast: <strong className={isDark ? 'text-white' : 'text-slate-900'}>$1.2M</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
