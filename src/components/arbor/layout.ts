import type { Node, Edge } from '@xyflow/react'
import type { BoughState, BranchState, NodeState } from '@/engine/types'

const BOUGH_RADIUS = 520
const BRANCH_RADIUS = 170
const NODE_RADIUS = 100

export type ArborNodeData =
  | { kind: 'root' }
  | { kind: 'bough'; bough: BoughState }
  | { kind: 'branch'; branch: BranchState; boughColor: string }
  | { kind: 'node'; node: NodeState; boughColor: string }

export type ArborEdgeData =
  | { kind: 'root-bough'; boughId: string }
  | { kind: 'bough-branch'; boughId: string; branchId: string }
  | { kind: 'branch-node'; boughId: string; branchId: string; nodeId: string }

export function buildArborGraph(boughs: BoughState[]): { nodes: Node<ArborNodeData>[]; edges: Edge<ArborEdgeData>[] } {
  const nodes: Node<ArborNodeData>[] = []
  const edges: Edge<ArborEdgeData>[] = []

  nodes.push({
    id: 'root',
    type: 'rootNode',
    position: { x: 0, y: 0 },
    data: { kind: 'root' },
    draggable: false,
    selectable: false,
  })

  const boughCount = boughs.length

  boughs.forEach((bough, bi) => {
    const boughAngle = (bi / boughCount) * 2 * Math.PI - Math.PI / 2
    const bx = Math.cos(boughAngle) * BOUGH_RADIUS
    const by = Math.sin(boughAngle) * BOUGH_RADIUS

    nodes.push({
      id: `bough-${bough.id}`,
      type: 'boughNode',
      position: { x: bx, y: by },
      data: { kind: 'bough', bough },
      draggable: false,
    })
    edges.push({
      id: `e-root-${bough.id}`,
      source: 'root',
      target: `bough-${bough.id}`,
      type: 'straight',
      data: { kind: 'root-bough', boughId: bough.id },
      style: { stroke: bough.color },
    })

    const branchCount = bough.branches.length
    const arcSpan = ((2 * Math.PI) / boughCount) * 0.92

    bough.branches.forEach((branch, brI) => {
      const t = branchCount === 1 ? 0 : brI / (branchCount - 1) - 0.5
      const branchAngle = boughAngle + t * arcSpan
      const bxx = bx + Math.cos(branchAngle) * BRANCH_RADIUS
      const byy = by + Math.sin(branchAngle) * BRANCH_RADIUS

      nodes.push({
        id: `branch-${branch.id}`,
        type: 'branchNode',
        position: { x: bxx, y: byy },
        data: { kind: 'branch', branch, boughColor: bough.color },
        draggable: false,
        selectable: false,
      })
      edges.push({
        id: `e-${bough.id}-${branch.id}`,
        source: `bough-${bough.id}`,
        target: `branch-${branch.id}`,
        type: 'straight',
        data: { kind: 'bough-branch', boughId: bough.id, branchId: branch.id },
        style: { stroke: bough.color },
      })

      const nodeCount = branch.nodes.length
      const nodeArcSpan = Math.min((arcSpan / branchCount) * 2.4, Math.PI * 0.6)

      branch.nodes.forEach((node, ni) => {
        const tn = nodeCount === 1 ? 0 : ni / (nodeCount - 1) - 0.5
        const nodeAngle = branchAngle + tn * nodeArcSpan
        const nx = bxx + Math.cos(nodeAngle) * NODE_RADIUS
        const ny = byy + Math.sin(nodeAngle) * NODE_RADIUS

        nodes.push({
          id: node.id,
          type: 'skillNode',
          position: { x: nx, y: ny },
          data: { kind: 'node', node, boughColor: bough.color },
          draggable: false,
        })
        edges.push({
          id: `e-${branch.id}-${node.id}`,
          source: `branch-${branch.id}`,
          target: node.id,
          type: 'straight',
          data: { kind: 'branch-node', boughId: bough.id, branchId: branch.id, nodeId: node.id },
          style: { stroke: bough.color },
        })
      })
    })
  })

  return { nodes, edges }
}
