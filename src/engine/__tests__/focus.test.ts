import { describe, it, expect } from 'vitest'
import { nodeFocusState, branchFocusState, boughFocusState, progressionLayer } from '../focus'
import type { NodeState } from '../types'

function makeNode(overrides: Partial<NodeState> = {}): NodeState {
  return {
    id: 'n1',
    name: 'Node',
    desc: '',
    repeatable: true,
    branchId: 'b1',
    branchName: 'Branch',
    boughId: 'bo1',
    boughName: 'Bough',
    boughColor: '#fff',
    xp: 0,
    rank: 0,
    logCount: 0,
    achieved: false,
    focusState: 'locked',
    ...overrides,
  }
}

describe('nodeFocusState', () => {
  it('is active once a node has any progress', () => {
    const n = makeNode({ rank: 1, xp: 150 })
    expect(nodeFocusState(n, [n])).toBe('active')
  })

  it('is active when achieved (credential) even with 0 rank-derived xp path', () => {
    const n = makeNode({ achieved: true })
    expect(nodeFocusState(n, [n])).toBe('active')
  })

  it('is available when it is the first node in an untouched branch', () => {
    const first = makeNode({ id: 'n1' })
    const second = makeNode({ id: 'n2' })
    expect(nodeFocusState(first, [first, second])).toBe('available')
  })

  it('is available when a sibling in the branch has progress, even if not first', () => {
    const first = makeNode({ id: 'n1' })
    const started = makeNode({ id: 'n2', rank: 1, xp: 150 })
    const third = makeNode({ id: 'n3' })
    expect(nodeFocusState(third, [first, started, third])).toBe('available')
  })

  it('is locked when untouched, not first, and no sibling has progress', () => {
    const first = makeNode({ id: 'n1' })
    const second = makeNode({ id: 'n2' })
    expect(nodeFocusState(second, [first, second])).toBe('locked')
  })
})

describe('branchFocusState', () => {
  it('is available when no node in the branch has progress', () => {
    expect(branchFocusState([makeNode()])).toBe('available')
  })

  it('is active when any node in the branch has progress', () => {
    expect(branchFocusState([makeNode({ rank: 2, xp: 500 })])).toBe('active')
  })
})

describe('boughFocusState', () => {
  it('is available at 0 XP', () => expect(boughFocusState(0)).toBe('available'))
  it('is active above 0 XP', () => expect(boughFocusState(100)).toBe('active'))
})

describe('progressionLayer', () => {
  it('classifies a credential-majority branch as mastery regardless of position', () => {
    const credentialNode = makeNode({ repeatable: false })
    expect(progressionLayer([credentialNode], 0, 5)).toBe('mastery')
  })

  it('classifies the first branch as fundamentals', () => {
    expect(progressionLayer([makeNode()], 0, 5)).toBe('fundamentals')
  })

  it('classifies a middle branch as applied', () => {
    expect(progressionLayer([makeNode()], 2, 5)).toBe('applied')
  })

  it('classifies the last skill branch as advanced', () => {
    expect(progressionLayer([makeNode()], 4, 5)).toBe('advanced')
  })

  it('falls back to fundamentals for an empty branch', () => {
    expect(progressionLayer([], 3, 5)).toBe('fundamentals')
  })
})
