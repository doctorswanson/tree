export default function StarfieldBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-grid" aria-hidden>
      <div className="absolute inset-0 bg-arbor-glow" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(5,7,10,0.7) 100%)',
        }}
      />
    </div>
  )
}
