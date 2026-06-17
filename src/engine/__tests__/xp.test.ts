import { describe, it, expect } from 'vitest'
import { nodeRank, xpToNextRank, overallLevel, XP_PER_LOG, RANK_THRESHOLDS } from '../xp'

describe('nodeRank', () => {
  it('returns 0 below the first threshold', () => expect(nodeRank(0)).toBe(0))
  it('returns 0 for negative XP', () => expect(nodeRank(-10)).toBe(0))
  it('returns 1 at the first threshold', () => expect(nodeRank(RANK_THRESHOLDS[0])).toBe(1))
  it('returns 2 at the second threshold', () => expect(nodeRank(RANK_THRESHOLDS[1])).toBe(2))
  it('returns 3 at the third threshold', () => expect(nodeRank(RANK_THRESHOLDS[2])).toBe(3))
  it('caps at 3 for very high XP', () => expect(nodeRank(99999)).toBe(3))
})

describe('xpToNextRank', () => {
  it('reports remaining XP to rank 1 from 0', () => {
    const r = xpToNextRank(0)
    expect(r?.nextRank).toBe(1)
    expect(r?.remaining).toBe(RANK_THRESHOLDS[0])
  })
  it('returns null at max rank', () => {
    expect(xpToNextRank(RANK_THRESHOLDS[2])).toBeNull()
  })
})

describe('overallLevel', () => {
  it('returns 1 for 0 XP', () => expect(overallLevel(0)).toBe(1))
  it('returns 1 for small XP', () => expect(overallLevel(10)).toBe(1))
  it('caps at 99', () => expect(overallLevel(9_999_999)).toBe(99))
  it('grows with XP', () => {
    expect(overallLevel(5000)).toBeGreaterThan(overallLevel(1000))
  })
})

describe('XP_PER_LOG', () => {
  it('is a positive flat amount', () => expect(XP_PER_LOG).toBeGreaterThan(0))
})
