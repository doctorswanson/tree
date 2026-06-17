// Shared visual-hierarchy constants for the Arbor graph. Centralized so the
// node components, edge styling, and focus pass all agree on the same scale:
// active (in-progress) > available (next step) > locked (dormant).

import type { FocusState } from '@/engine/types'

export const FOCUS_OPACITY: Record<FocusState, number> = {
  locked: 0.32,
  available: 0.68,
  active: 1,
}

export const EDGE_BASE_OPACITY: Record<FocusState, number> = {
  locked: 0.07,
  available: 0.16,
  active: 0.4,
}

/** Applied to anything outside the current hover/selection chain. */
export const DIM_MULTIPLIER = 0.3

/** Below this zoom level, the full edge graph is revealed for orientation. */
export const ZOOM_REVEAL_THRESHOLD = 0.42

/** Opacity floor applied to all edges once zoomed out past the threshold. */
export const ZOOM_REVEAL_FLOOR = 0.22
