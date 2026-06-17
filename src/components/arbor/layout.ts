import type { Node, Edge } from '@xyflow/react'
import type { BoughState, BranchState, NodeState } from '@/engine/types'

const BOUGH_RADIUS = 900
const BRANCH_RADIUS = 2000
const NODE_RADIUS = 4200

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
      selectable: false,
      interactionWidth: 0,
    })

    // Leaves (skill nodes) get one evenly-spaced angular slot apiece across the
    // whole bough arc, on a single shared ring — a classic radial-dendrogram
    // layout. This guarantees a fixed minimum angular gap between ANY two
    // leaves regardless of which branch they belong to, so dense boughs (e.g.
    // 6 branches / 19 nodes) can't pack two unrelated nodes on top of each
    // other the way independent per-branch fans could.
    const arcSpan = ((2 * Math.PI) / boughCount) * 0.95
    const totalLeaves = bough.branches.reduce((sum, b) => sum + b.nodes.length, 0)
    const leafGap = totalLeaves <= 1 ? 0 : arcSpan / (totalLeaves - 1)

    let leafIndex = 0
    bough.branches.forEach((branch) => {
      const leafAngles = branch.nodes.map((_, ni) => {
        const globalIndex = leafIndex + ni
        return boughAngle + (globalIndex - (totalLeaves - 1) / 2) * leafGap
      })
      leafIndex += branch.nodes.length

      const branchAngle = leafAngles.reduce((sum, a) => sum + a, 0) / leafAngles.length
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
        selectable: false,
        interactionWidth: 0,
      })

      branch.nodes.forEach((node, ni) => {
        const nodeAngle = leafAngles[ni]
        const nx = bx + Math.cos(nodeAngle) * NODE_RADIUS
        const ny = by + Math.sin(nodeAngle) * NODE_RADIUS

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
          selectable: false,
          interactionWidth: 0,
        })
      })
    })
  })

  return { nodes, edges }
}
