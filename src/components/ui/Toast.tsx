import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2 } from 'lucide-react'

type ToastItem = { id: number; message: string }

let listeners: ((item: ToastItem) => void)[] = []
let counter = 0

export function showToast(message: string) {
  counter += 1
  const item = { id: counter, message }
  listeners.forEach((l) => l(item))
}

export default function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (item: ToastItem) => {
      setItems((prev) => [...prev, item])
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== item.id)), 2800)
    }
    listeners.push(handler)
    return () => {
      listeners = listeners.filter((l) => l !== handler)
    }
  }, [])

  if (items.length === 0) return null

  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-md border border-accent/50 bg-panel/95 text-accent animate-fade-in"
          style={{ boxShadow: '0 0 20px rgba(57,255,138,0.25)' }}
        >
          <CheckCircle2 size={14} />
          {item.message}
        </div>
      ))}
    </div>,
    document.body
  )
}
