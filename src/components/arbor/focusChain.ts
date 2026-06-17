// Pure helpers for the Arbor's hover/selection spotlight. Given whatever is
// currently hovered or selected, determine which nodes/edges belong to the
// connected root -> bough -> branch -> node chain so everything else can fade.

import type { Edge } from '@xyflow/react'
import type { ArborNodeData, ArborEdgeData } from './layout'

export type FocusChain = { boughId: string; branchId?: string; nodeId?: string } | null

export function chainFromArborData(data: ArborNodeData | null | undefined): FocusChain {
  if (!data) return null
  if (data.kind === 'bough') return { boughId: data.bough.id }
  if (data.kind === 'branch') return { boughId: data.branch.boughId, branchId: data.branch.id }
  if (data.kind === 'node') return { boughId: data.node.boughId, branchId: data.node.branchId, nodeId: data.node.id }
  return null
}

interface ChainIds {
  boughId: string
  branchId?: string
  nodeId?: string
}

export function inChain(kind: 'bough' | 'branch' | 'node', ids: ChainIds, chain: FocusChain): boolean {
  if (!chain) return false
  if (kind === 'node') {
    if (chain.nodeId) return ids.nodeId === chain.nodeId
    if (chain.branchId) return ids.branchId === chain.branchId
    return ids.boughId === chain.boughId
  }
  if (kind === 'branch') {
    if (chain.branchId) return ids.branchId === chain.branchId
    return ids.boughId === chain.boughId
  }
  return ids.boughId === chain.boughId
}

export function edgeInChain(edge: Edge<ArborEdgeData>, chain: FocusChain): boolean {
  const d = edge.data
  if (!d || !chain) return false
  if (d.kind === 'root-bough') return inChain('bough', { boughId: d.boughId }, chain)
  if (d.kind === 'bough-branch') return inChain('branch', { boughId: d.boughId, branchId: d.branchId }, chain)
  return inChain('node', { boughId: d.boughId, branchId: d.branchId, nodeId: d.nodeId }, chain)
}
