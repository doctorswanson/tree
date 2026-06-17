import { useMemo, useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  type Node as RFNode,
  type OnMove,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ChevronRight, X } from 'lucide-react'
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

function describeFocusData(data: ArborNodeData | null): string | null {
  if (!data) return null
  if (data.kind === 'root') return 'The Arbor — your whole tree'
  if (data.kind === 'bough') return `${data.bough.name} — ${data.bough.focusState.toUpperCase()} · ${data.bough.totalXP} XP`
  if (data.kind === 'branch') return `${data.branch.name} branch — ${data.branch.layer}`
  const n = data.node
  return `${n.name} — ${n.achieved ? 'ACHIEVED' : `RANK ${n.rank}/3`}${n.repeatable ? ` · ${n.xp} XP` : ''} · ${n.focusState.toUpperCase()}`
}

function ArborGraphInner({ boughs, selection, onSelect }: Props) {
  const { nodes, edges } = useMemo(() => buildArborGraph(boughs), [boughs])
  const [hoveredData, setHoveredData] = useState<ArborNodeData | null>(null)
  const [zoom, setZoom] = useState(1)
  const { fitView } = useReactFlow()

  const nodeLookup = useMemo(() => {
    const map: Record<string, { boughId: string; branchId: string; name: string }> = {}
    for (const b of boughs) for (const br of b.branches) for (const n of br.nodes) map[n.id] = { boughId: n.boughId, branchId: n.branchId, name: n.name }
    return map
  }, [boughs])

  const boughLookup = useMemo(() => {
    const map: Record<string, BoughState> = {}
    for (const b of boughs) map[b.id] = b
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
      let isInChain = false

      if (effectiveChain) {
        if (edgeInChain(edge, effectiveChain)) {
          opacity = 0.85
          strokeWidth = 2
          isInChain = true
        } else {
          opacity = Math.min(opacity, 0.05)
        }
      }
      if (zoomedOut) opacity = Math.max(opacity, ZOOM_REVEAL_FLOOR)

      const color = (edge.style as { stroke?: string } | undefined)?.stroke ?? '#39ff8a'

      return {
        ...edge,
        className: isInChain ? 'arbor-edge-flow' : undefined,
        style: {
          ...edge.style,
          strokeOpacity: opacity,
          strokeWidth,
          strokeDasharray: isInChain ? '1 7' : '1 5',
          filter: isInChain ? `drop-shadow(0 0 6px ${color})` : undefined,
        },
      }
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

  const handlePaneClick = useCallback(() => onSelect(null), [onSelect])

  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: RFNode<ArborNodeData>) => {
    setHoveredData(node.data)
  }, [])
  const handleNodeMouseLeave = useCallback(() => setHoveredData(null), [])
  const handleMove: OnMove = useCallback((_, viewport) => setZoom(viewport.zoom), [])

  // Drill into a bough on select; recenter on the full graph when cleared.
  useEffect(() => {
    if (selection?.kind === 'bough') {
      const ids = ['root', `bough-${selection.id}`, ...nodes.filter((n) => rfNodeInChain(n, { boughId: selection.id })).map((n) => n.id)]
      fitView({ nodes: ids.map((id) => ({ id })), duration: 500, padding: 0.25, maxZoom: 1 })
    } else if (selection === null) {
      fitView({ duration: 500, padding: 0.12 })
    }
  }, [selection, fitView, nodes])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onSelect(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onSelect])

  const previewText = describeFocusData(hoveredData) ?? (selection?.kind === 'bough' ? describeFocusData({ kind: 'bough', bough: boughLookup[selection.id] }) : null)

  return (
    <div className="relative w-full h-full bg-grid">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onMove={handleMove}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        edgesReconnectable={false}
        elementsSelectable
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1c2630" gap={32} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* Breadcrumb / back-out control */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[11px] pointer-events-none select-none">
        <button
          className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-shadow/60 bg-panel/80 text-mist hover:text-accent hover:border-accent/50 transition-colors"
          onClick={() => onSelect(null)}
        >
          <span className="text-accent">{'>_'}</span> Arbor
        </button>
        {selection && (() => {
          const boughId = selection.kind === 'bough' ? selection.id : nodeLookup[selection.id]?.boughId
          const bough = boughId ? boughLookup[boughId] : undefined
          return (
            <>
              <ChevronRight size={13} className="text-meta" />
              <button
                className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-shadow/60 bg-panel/80 hover:border-accent/50 transition-colors"
                style={{ color: bough?.color }}
                onClick={() => boughId && onSelect({ kind: 'bough', id: boughId })}
              >
                {bough?.name ?? 'Bough'}
              </button>
              {selection.kind === 'node' && (
                <>
                  <ChevronRight size={13} className="text-meta" />
                  <span className="px-2.5 py-1 rounded-md border border-shadow/40 bg-panel/60 text-starlight">
                    {nodeLookup[selection.id]?.name ?? 'Node'}
                  </span>
                </>
              )}
            </>
          )
        })()}
        {selection && (
          <button
            className="pointer-events-auto flex items-center justify-center w-6 h-6 rounded-md border border-shadow/60 bg-panel/80 text-meta hover:text-danger hover:border-danger/50 transition-colors ml-1"
            onClick={() => onSelect(null)}
            title="Clear selection (Esc)"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Live hover/selection readout */}
      <div className="absolute top-3 right-3 max-w-xs pointer-events-none select-none">
        {previewText && (
          <p className="font-mono text-[11px] px-2.5 py-1.5 rounded-md border border-shadow/60 bg-panel/80 text-starlight text-right animate-fade-in">
            {previewText}
          </p>
        )}
      </div>

      <p className="absolute bottom-3 left-3 font-mono text-[10px] text-meta pointer-events-none select-none">
        hover a node to trace its path · click empty space or press Esc to reset
      </p>
    </div>
  )
}

export default function ArborGraph(props: Props) {
  return (
    <ReactFlowProvider>
      <ArborGraphInner {...props} />
    </ReactFlowProvider>
  )
}
