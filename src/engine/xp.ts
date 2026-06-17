// Pure XP / rank math. No imports.

/** Flat XP granted per log entry on a repeatable node. Tunable. */
export const XP_PER_LOG = 100

/** XP thresholds for Rank 1 / 2 / 3 on a repeatable node. Tunable. */
export const RANK_THRESHOLDS: [number, number, number] = [150, 500, 1200]

/** Node rank (0-3) from accumulated XP on that node. */
export function nodeRank(xp: number): 0 | 1 | 2 | 3 {
  if (xp >= RANK_THRESHOLDS[2]) return 3
  if (xp >= RANK_THRESHOLDS[1]) return 2
  if (xp >= RANK_THRESHOLDS[0]) return 1
  return 0
}

/** XP needed to reach the next rank, or null if already at max rank. */
export function xpToNextRank(xp: number): { nextRank: 1 | 2 | 3; target: number; remaining: number } | null {
  if (xp < RANK_THRESHOLDS[0]) return { nextRank: 1, target: RANK_THRESHOLDS[0], remaining: RANK_THRESHOLDS[0] - xp }
  if (xp < RANK_THRESHOLDS[1]) return { nextRank: 2, target: RANK_THRESHOLDS[1], remaining: RANK_THRESHOLDS[1] - xp }
  if (xp < RANK_THRESHOLDS[2]) return { nextRank: 3, target: RANK_THRESHOLDS[2], remaining: RANK_THRESHOLDS[2] - xp }
  return null
}

/** Overall character level from total XP across all nodes. Range 1–99. */
export function overallLevel(totalXP: number): number {
  if (totalXP <= 0) return 1
  return Math.min(99, Math.floor(Math.sqrt(totalXP / 50)) + 1)
}
