export default function Loading() {
  return (
    <div className="container-x pt-20 pb-24 min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Concentric loader rings */}
        <div className="relative w-24 h-24">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-bone-200/10"
              style={{
                transform: `scale(${1 - i * 0.2})`,
                animation: `pulse-ring ${1.8 + i * 0.4}s ease-out infinite`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="font-display text-2xl text-bone-50 mb-1">Agents booting…</p>
          <p className="text-xs font-mono uppercase tracking-widest text-bone-400">
            vanguard.mesh · initializing
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { opacity: 0.6; transform: scale(0.6); }
          70%  { opacity: 0; }
          100% { opacity: 0; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}