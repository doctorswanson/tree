import { useMemo, useCallback, useState } from 'react'
import { ReactFlow, Background, Controls, type Node as RFNode, type OnMove } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { BoughState } from '@/engine/types'
import { buildArborGraph, type ArborNodeData } from './layout'
import { chainFromArborData, edgeInChain, inChain, type FocusChain } from './focusChain'
import { EDGE_BASE_OPACITY, ZOOM_REVEAL_THRESHOLD, ZOOM_REVEAL_FLOOR } from './visual'
import RootNode from './nodes/RootNode'
import BoughNode from './nodes/BoughNode'
import BranchNode from './nodes/BranchNode'
import SkillNode from './nodes/SkillNode'

const nodeTypes = {
  rootNode: RootNode,
  boughNode: BoughNode,
  branchNode: BranchNode,
  skillNode: SkillNode,
}

export type ArborSelection = { kind: 'node'; id: string } | { kind: 'bough'; id: string } | null

interface Props {
  boughs: BoughState[]
  selection: ArborSelection
  onSelect: (selection: ArborSelection) => void
}

function rfNodeInChain(n: RFNode<ArborNodeData>, chain: FocusChain): boolean {
  if (n.data.kind === 'root') return true
  if (n.data.kind === 'bough') return inChain('bough', { boughId: n.data.bough.id }, chain)
  if (n.data.kind === 'branch') return inChain('branch', { boughId: n.data.branch.boughId, branchId: n.data.branch.id }, chain)
  return inChain('node', { boughId: n.data.node.boughId, branchId: n.data.node.branchId, nodeId: n.data.node.id }, chain)
}

export default function ArborGraph({ boughs, selection, onSelect }: Props) {
  const { nodes, edges } = useMemo(() => buildArborGraph(boughs), [boughs])
  const [hoveredData, setHoveredData] = useState<ArborNodeData | null>(null)
  const [zoom, setZoom] = useState(1)

  const nodeLookup = useMemo(() => {
    const map: Record<string, { boughId: string; branchId: string }> = {}
    for (const b of boughs) for (const br of b.branches) for (const n of br.nodes) map[n.id] = { boughId: n.boughId, branchId: n.branchId }
    return map
  }, [boughs])

  const selectionChain: FocusChain = useMemo(() => {
    if (!selection) return null
    if (selection.kind === 'bough') return { boughId: selection.id }
    const ids = nodeLookup[selection.id]
    return ids ? { boughId: ids.boughId, branchId: ids.branchId, nodeId: selection.id } : null
  }, [selection, nodeLookup])

  const hoveredChain = useMemo(() => chainFromArborData(hoveredData), [hoveredData])
  const effectiveChain = hoveredChain ?? selectionChain
  const zoomedOut = zoom < ZOOM_REVEAL_THRESHOLD

  const boughFocusLookup = useMemo(() => {
    const map: Record<string, BoughState['focusState']> = {}
    for (const b of boughs) map[b.id] = b.focusState
    return map
  }, [boughs])
  const branchFocusLookup = useMemo(() => {
    const map: Record<string, BoughState['branches'][number]['focusState']> = {}
    for (const b of boughs) for (const br of b.branches) map[br.id] = br.focusState
    return map
  }, [boughs])
  const nodeFocusLookup = useMemo(() => {
    const map: Record<string, BoughState['branches'][number]['nodes'][number]['focusState']> = {}
    for (const b of boughs) for (const br of b.branches) for (const n of br.nodes) map[n.id] = n.focusState
    return map
  }, [boughs])

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const d = edge.data
      const fs = !d
        ? 'locked'
        : d.kind === 'root-bough'
          ? boughFocusLookup[d.boughId] ?? 'available'
          : d.kind === 'bough-branch'
            ? branchFocusLookup[d.branchId] ?? 'available'
            : nodeFocusLookup[d.nodeId] ?? 'locked'

      let opacity = EDGE_BASE_OPACITY[fs]
      let strokeWidth = 1

      if (effectiveChain) {
        if (edgeInChain(edge, effectiveChain)) {
          opacity = 0.85
          strokeWidth = 2
        } else {
          opacity = Math.min(opacity, 0.05)
        }
      }
      if (zoomedOut) opacity = Math.max(opacity, ZOOM_REVEAL_FLOOR)

      return { ...edge, style: { ...edge.style, strokeOpacity: opacity, strokeWidth } }
    })
  }, [edges, effectiveChain, zoomedOut, boughFocusLookup, branchFocusLookup, nodeFocusLookup])

  const styledNodes = useMemo(() => {
    if (!effectiveChain) return nodes
    return nodes.map((n) => {
      if (n.data.kind === 'root') return n
      const dim = !rfNodeInChain(n, effectiveChain)
      return { ...n, data: { ...n.data, dim } }
    })
  }, [nodes, effectiveChain])

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: RFNode<ArborNodeData>) => {
      if (node.data.kind === 'node') onSelect({ kind: 'node', id: node.data.node.id })
      else if (node.data.kind === 'bough') onSelect({ kind: 'bough', id: node.data.bough.id })
    },
    [onSelect]
  )

  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: RFNode<ArborNodeData>) => {
    setHoveredData(node.data)
  }, [])
  const handleNodeMouseLeave = useCallback(() => setHoveredData(null), [])
  const handleMove: OnMove = useCallback((_, viewport) => setZoom(viewport.zoom), [])

  return (
    <div className="relative w-full h-full bg-grid">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onMove={handleMove}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesReconnectable={false}
        elementsSelectable
        fitView
        minZoom={0.15}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1c2630" gap={32} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
      <p className="absolute bottom-3 left-3 font-mono text-[10px] text-meta pointer-events-none select-none">
        hover a node to trace its path · zoom out for the full graph
      </p>
    </div>
  )
}
