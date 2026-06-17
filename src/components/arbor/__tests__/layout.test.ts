import { describe, it, expect } from 'vitest'
import { deriveCharacter } from '@/engine/derive'
import { buildArborGraph } from '../layout'

function minPairwiseDistance(points: { x: number; y: number }[]): number {
  let min = Infinity
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x
      const dy = points[i].y - points[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < min) min = d
    }
  }
  return min
}

describe('buildArborGraph — node spacing', () => {
  const state = deriveCharacter('Test', undefined, [])
  const { nodes } = buildArborGraph(state.boughs)

  it('keeps skill nodes (the densest tier) clear of each other', () => {
    const skillPositions = nodes.filter((n) => n.data.kind === 'node').map((n) => n.position)
    expect(minPairwiseDistance(skillPositions)).toBeGreaterThan(95)
  })

  it('keeps branch labels clear of each other', () => {
    const branchPositions = nodes.filter((n) => n.data.kind === 'branch').map((n) => n.position)
    expect(minPairwiseDistance(branchPositions)).toBeGreaterThan(130)
  })

  it('keeps bough nodes clear of each other', () => {
    const boughPositions = nodes.filter((n) => n.data.kind === 'bough').map((n) => n.position)
    expect(minPairwiseDistance(boughPositions)).toBeGreaterThan(300)
  })
})
