import { describe, it, expect } from 'vitest'
import { skillLevel, overallLevel, xpForLevel, splitXPByTier, SKILL_XP_CAP } from '../xp'

describe('skillLevel', () => {
  it('returns 0 for 0 XP', () => expect(skillLevel(0)).toBe(0))
  it('returns 0 for negative XP', () => expect(skillLevel(-10)).toBe(0))
  it('caps at 100', () => expect(skillLevel(SKILL_XP_CAP)).toBe(100))
  it('caps at 100 for over-cap XP', () => expect(skillLevel(9999)).toBe(100))

  // Spot-check XP table from spec
  it('level 10 requires ~158 XP', () => {
    expect(skillLevel(158)).toBeGreaterThanOrEqual(10)
    expect(skillLevel(157)).toBeLessThan(10)
  })
  it('level 20 requires ~447 XP', () => {
    expect(skillLevel(447)).toBeGreaterThanOrEqual(20)
    expect(skillLevel(446)).toBeLessThan(20)
  })
  it('level 50 requires ~1768 XP', () => {
    expect(skillLevel(1768)).toBeGreaterThanOrEqual(50)
  })
})

describe('xpForLevel', () => {
  it('returns 0 for level 0', () => expect(xpForLevel(0)).toBe(0))
  it('is monotonically increasing', () => {
    for (let l = 1; l < 100; l++) {
      expect(xpForLevel(l + 1)).toBeGreaterThan(xpForLevel(l))
    }
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

describe('splitXPByTier', () => {
  it('sums to tier budget for single skill', () => {
    const result = splitXPByTier('standard', ['sec'])
    expect(result['sec']).toBe(120)
  })
  it('sums to tier budget for two skills', () => {
    const result = splitXPByTier('major', ['a', 'b'])
    const total = Object.values(result).reduce((s, v) => s + v, 0)
    expect(total).toBe(350)
  })
  it('sums to tier budget for three skills', () => {
    const result = splitXPByTier('epic', ['a', 'b', 'c'])
    const total = Object.values(result).reduce((s, v) => s + v, 0)
    expect(total).toBe(700)
  })
  it('returns empty for empty skill list', () => {
    expect(splitXPByTier('standard', [])).toEqual({})
  })
})
