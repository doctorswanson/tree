import { useRef, useState } from 'react'
import type { SkillCategory, SkillState } from '@/engine/types'
import CategoryCluster from './CategoryCluster'
import SkillNodeDetail from './SkillNodeDetail'
import { useCharacter } from '@/store/CharacterProvider'

const CATEGORY_ORDER: SkillCategory[] = [
  'Security',
  'Infrastructure',
  'Development',
  'Data & AI',
  'Cloud',
  'Leadership',
  'Rare Arts',
]

export default function SkillConstellation() {
  const { state } = useCharacter()
  const [active, setActive] = useState<SkillState | null>(null)
  const [page, setPage] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  if (!state) return null

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    skills: Object.values(state.skills).filter((s) => s.category === cat),
  }))

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setPage(idx)
  }

  return (
    <div className="pb-4">
      <div className="px-4 pt-3 pb-1">
        <p className="font-display text-xs font-semibold tracking-[0.18em] uppercase text-mist">Skill Trees</p>
        <p className="text-[11px] text-meta mt-0.5">Swipe between categories · tap a node for detail</p>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {grouped.map(({ cat, skills }) => (
          <CategoryCluster key={cat} category={cat} skills={skills} onTapSkill={setActive} />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {grouped.map((g, i) => (
          <span
            key={g.cat}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === page ? 'bg-cyan' : 'bg-shadow'}`}
          />
        ))}
      </div>

      <SkillNodeDetail skill={active} state={state} onClose={() => setActive(null)} />
    </div>
  )
}
