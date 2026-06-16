import type { AttributeState, AttributeId } from '@/engine/types'

interface Props {
  attributes: Record<AttributeId, AttributeState>
}

const ORDER: AttributeId[] = ['INT', 'WIS', 'DEX', 'CON', 'CHA', 'WIL']

const ATTR_LABEL: Record<AttributeId, string> = {
  INT: 'Intellect',
  WIS: 'Wisdom',
  DEX: 'Dexterity',
  CON: 'Constitution',
  CHA: 'Charisma',
  WIL: 'Willpower',
}

const NODE_W = 168
const NODE_R = 38

export default function AttributeRadar({ attributes }: Props) {
  const width = ORDER.length * NODE_W
  const cy = 70

  return (
    <div className="panel p-3">
      <p className="panel-title mb-2">Attributes</p>
      <div className="relative">
        {/* Edge fades hinting continuous scroll */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-panel to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-panel to-transparent z-10" />

        <div className="overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <svg
            viewBox={`0 0 ${width} 150`}
            width={width}
            height={150}
            className="block select-none"
          >
            {/* The connecting chain */}
            <line x1={NODE_W / 2} y1={cy} x2={width - NODE_W / 2} y2={cy} stroke="#3a2f1f" strokeWidth={2} />
            <line
              x1={NODE_W / 2} y1={cy} x2={width - NODE_W / 2} y2={cy}
              stroke="#c9a227" strokeWidth={2} strokeOpacity={0.35} strokeDasharray="1 7"
            />

            {ORDER.map((id, i) => {
              const attr = attributes[id]
              const cx = NODE_W / 2 + i * NODE_W
              const pct = attr.pct / 100
              const r = NODE_R
              // Radial fill gauge via stroke-dasharray on a ring
              const circumference = 2 * Math.PI * r
              const dash = circumference * pct

              return (
                <g key={id}>
                  {/* socket */}
                  <circle cx={cx} cy={cy} r={r + 8} fill="#1a150f" stroke="#3a2f1f" strokeWidth={1} />
                  {/* track ring */}
                  <circle cx={cx} cy={cy} r={r} fill="#241d14" stroke="#3a2f1f" strokeWidth={3} />
                  {/* gauge ring */}
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke="#c9a227"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ filter: 'drop-shadow(0 0 3px rgba(201,162,39,0.55))' }}
                  />
                  <text
                    x={cx} y={cy - 3}
                    textAnchor="middle" fontSize={15} fontWeight={700}
                    fontFamily="Cinzel, serif" fill="#ecdfc0"
                  >
                    {id}
                  </text>
                  <text
                    x={cx} y={cy + 13}
                    textAnchor="middle" fontSize={10}
                    fontFamily="JetBrains Mono, monospace" fill="#b3a584"
                  >
                    {attr.score} ({attr.modifier >= 0 ? '+' : ''}{attr.modifier})
                  </text>
                  <text
                    x={cx} y={cy + r + 22}
                    textAnchor="middle" fontSize={11}
                    fontFamily="EB Garamond, serif" fill="#7a6c4f"
                  >
                    {ATTR_LABEL[id]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
      <p className="text-center text-[10px] text-meta font-body italic mt-1">Drag to scroll the chain</p>
    </div>
  )
}
