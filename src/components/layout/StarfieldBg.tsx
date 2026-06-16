import { useMemo } from 'react'

interface Ember {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  opacity: number
  drift: number
}

function generateEmbers(count: number): Ember[] {
  // Seeded-ish but deterministic across renders
  const embers: Ember[] = []
  for (let i = 0; i < count; i++) {
    embers.push({
      id: i,
      x: ((Math.sin(i * 2.399) + 1) / 2) * 100,
      size: 1 + (i % 4) * 0.7,
      delay: (i % 11) * 1.1,
      duration: 9 + (i % 7) * 2.5,
      opacity: 0.25 + (i % 6) * 0.08,
      drift: ((i % 5) - 2) * 14,
    })
  }
  return embers
}

export default function StarfieldBg() {
  const embers = useMemo(() => generateEmbers(45), [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Deep stone gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#100c08] via-[#16110a] to-[#0c0a07]" />

      {/* Torchlight hazes */}
      <div
        className="absolute inset-0 animate-aurora"
        style={{
          background:
            'radial-gradient(ellipse at 15% 10%, rgba(201,162,39,0.10) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 85% 15%, rgba(217,123,52,0.08) 0%, transparent 48%),' +
            'radial-gradient(ellipse at 50% 90%, rgba(139,95,191,0.05) 0%, transparent 45%)',
        }}
      />

      {/* Rising embers */}
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full bg-amber"
          style={{
            left: `${e.x}%`,
            bottom: 0,
            width: e.size,
            height: e.size,
            opacity: e.opacity,
            boxShadow: '0 0 4px rgba(217,123,52,0.8), 0 0 8px rgba(201,162,39,0.4)',
            '--drift': `${e.drift}px`,
            animation: `emberRise ${e.duration}s ${e.delay}s linear infinite`,
          } as React.CSSProperties}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
