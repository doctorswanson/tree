// Pure XP / level math. No imports.

export const SKILL_XP_CAP = 5000

/** Skill level from accumulated XP. Range 0–100. */
export function skillLevel(xp: number): number {
  if (xp <= 0) return 0
  return Math.min(100, Math.floor((xp / 5) ** (1 / 1.5)))
}

/** Overall character level from total XP across all skills. Range 1–99. */
export function overallLevel(totalXP: number): number {
  if (totalXP <= 0) return 1
  return Math.min(99, Math.floor((totalXP / 250) ** (1 / 1.5)) + 1)
}

/** XP required to reach a given skill level. */
export function xpForLevel(level: number): number {
  return Math.round(5 * level ** 1.5)
}

/** XP budget for a difficulty tier. */
export const TIER_BUDGET: Record<string, number> = {
  minor:    40,
  standard: 120,
  major:    350,
  epic:     700,
}

/**
 * Auto-split a tier budget evenly across skill IDs.
 * Returns a Record<skillId, xpAmount> floored to integers,
 * with any remainder added to the first skill.
 */
export function splitXPByTier(
  tier: string,
  skillIds: string[]
): Record<string, number> {
  if (skillIds.length === 0) return {}
  const budget = TIER_BUDGET[tier] ?? TIER_BUDGET.standard
  const each = Math.floor(budget / skillIds.length)
  const remainder = budget - each * skillIds.length
  const result: Record<string, number> = {}
  skillIds.forEach((id, i) => {
    result[id] = each + (i === 0 ? remainder : 0)
  })
  return result
}
