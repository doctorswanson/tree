import type { ReactNode } from 'react'

interface Props {
  title?: string
  raised?: boolean
  right?: ReactNode
  children: ReactNode
  className?: string
}

export default function Panel({ title, raised, right, children, className = '' }: Props) {
  return (
    <div className={`${raised ? 'panel-raised' : 'panel'} ${className}`}>
      {title && (
        <div className="panel-header">
          <h2 className="panel-title">{title}</h2>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}
