import { describe, it, expect } from 'vitest'
import { deriveCharacter } from '../derive'
import { ALL_NODES } from '@/data/arbor'
import type { LogEntry } from '../types'
import { XP_PER_LOG, RANK_THRESHOLDS } from '../xp'

const repeatableNode = ALL_NODES.find((n) => n.repeatable)!
const credentialNode = ALL_NODES.find((n) => !n.repeatable)!

function makeEntry(nodeId: string, overrides: Partial<LogEntry> = {}): LogEntry {
  return { id: `e-${Math.random()}`, nodeId, ...overrides }
}

describe('deriveCharacter — empty log', () => {
  const state = deriveCharacter('Tyler', undefined, [])

  it('name is preserved', () => expect(state.name).toBe('Tyler'))
  it('totalXP is 0', () => expect(state.totalXP).toBe(0))
  it('overallLevel is 1', () => expect(state.overallLevel).toBe(1))
  it('all nodes are rank 0', () => {
    for (const n of Object.values(state.nodes)) expect(n.rank).toBe(0)
  })
  it('title is Unranked', () => expect(state.title.title).toBe('Unranked'))
  it('no credentials earned', () => expect(state.credentialsEarned).toHaveLength(0))
})

describe('deriveCharacter — repeatable node logging', () => {
  const log: LogEntry[] = [makeEntry(repeatableNode.id), makeEntry(repeatableNode.id)]
  const state = deriveCharacter('Tyler', undefined, log)
  const node = state.nodes[repeatableNode.id]

  it('accumulates flat XP per log', () => expect(node.xp).toBe(XP_PER_LOG * 2))
  it('logCount reflects number of entries', () => expect(node.logCount).toBe(2))
  it('rank is derived from XP thresholds', () => {
    expect(node.rank).toBe(XP_PER_LOG * 2 >= RANK_THRESHOLDS[0] ? 1 : 0)
  })
})

describe('deriveCharacter — non-repeatable credential node', () => {
  const log: LogEntry[] = [makeEntry(credentialNode.id)]
  const state = deriveCharacter('Tyler', undefined, log)
  const node = state.nodes[credentialNode.id]

  it('is marked achieved after a single log', () => expect(node.achieved).toBe(true))
  it('is immediately rank 3', () => expect(node.rank).toBe(3))
  it('appears in credentialsEarned', () => expect(state.credentialsEarned.map((n) => n.id)).toContain(credentialNode.id))
})

describe('deriveCharacter — PURITY: same log always produces same result', () => {
  const log: LogEntry[] = [makeEntry(repeatableNode.id), makeEntry(credentialNode.id)]
  const a = deriveCharacter('Tyler', undefined, log)
  const b = deriveCharacter('Tyler', undefined, log)

  it('totalXP is identical', () => expect(a.totalXP).toBe(b.totalXP))
  it('title is identical', () => expect(a.title.title).toBe(b.title.title))
})

describe('deriveCharacter — ORDER INDEPENDENCE: node XP is a commutative sum', () => {
  const e1 = makeEntry(repeatableNode.id, { id: 'e1' })
  const e2 = makeEntry(repeatableNode.id, { id: 'e2' })
  const stateAB = deriveCharacter('Tyler', undefined, [e1, e2])
  const stateBA = deriveCharacter('Tyler', undefined, [e2, e1])

  it('node XP is order-independent', () =>
    expect(stateAB.nodes[repeatableNode.id].xp).toBe(stateBA.nodes[repeatableNode.id].xp))
  it('totalXP is order-independent', () =>
    expect(stateAB.totalXP).toBe(stateBA.totalXP))
})

describe('deriveCharacter — unknown nodeId is ignored, not thrown', () => {
  const log: LogEntry[] = [makeEntry('does-not-exist')]
  it('does not throw', () => expect(() => deriveCharacter('Tyler', undefined, log)).not.toThrow())
})

describe('deriveCharacter — focus state model', () => {
  const log: LogEntry[] = [makeEntry(repeatableNode.id), makeEntry(repeatableNode.id)]
  const state = deriveCharacter('Tyler', undefined, log)

  it('every node gets a focusState', () => {
    for (const n of Object.values(state.nodes)) expect(['locked', 'available', 'active']).toContain(n.focusState)
  })
  it('a node with progress is active', () => {
    expect(state.nodes[repeatableNode.id].focusState).toBe('active')
  })
  it('a bough with progress is active, untouched boughs are available', () => {
    for (const b of state.boughs) {
      expect(b.focusState).toBe(b.totalXP > 0 ? 'active' : 'available')
    }
  })
  it('every branch gets a progression layer', () => {
    for (const b of state.boughs) {
      for (const branch of b.branches) {
        expect(['fundamentals', 'applied', 'advanced', 'mastery']).toContain(branch.layer)
      }
    }
  })
})
