export function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="particle-dot absolute h-1 w-1 rounded-full bg-cyan-200/60"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
            animationDelay: `${index * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}
