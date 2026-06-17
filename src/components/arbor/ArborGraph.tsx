import { useMemo, useCallback } from 'react'
import { ReactFlow, Background, Controls, type Node as RFNode } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { BoughState } from '@/engine/types'
import { buildArborGraph, type ArborNodeData } from './layout'
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
  onSelect: (selection: ArborSelection) => void
}

export default function ArborGraph({ boughs, onSelect }: Props) {
  const { nodes, edges } = useMemo(() => buildArborGraph(boughs), [boughs])

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: RFNode<ArborNodeData>) => {
      if (node.data.kind === 'node') onSelect({ kind: 'node', id: node.data.node.id })
      else if (node.data.kind === 'bough') onSelect({ kind: 'bough', id: node.data.bough.id })
    },
    [onSelect]
  )

  return (
    <div className="w-full h-full bg-grid">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
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
    </div>
  )
}
