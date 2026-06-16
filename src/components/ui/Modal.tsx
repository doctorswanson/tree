import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  // Rendered via portal straight to <body> — several callers live inside a
  // scrollable `.scroll-area` ancestor, and mobile Safari resolves touch-drag
  // gestures by walking the DOM tree rather than the visual stacking order.
  // Without the portal, dragging the sheet's handle scrolls that ancestor
  // instead of the modal, even though the modal renders fixed on top.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet — slides up on mobile, centred on desktop */}
      <div className="relative z-10 w-full sm:max-w-lg mx-auto bg-ink border-t sm:border border-shadow/60
                      sm:rounded-xl rounded-t-2xl animate-slide-up max-h-[90vh] flex flex-col">
        {/* Handle pill (mobile) */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-shadow" />
        </div>

        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-shadow/40">
            <h2 className="font-display text-base text-starlight tracking-wide">{title}</h2>
            <button
              onClick={onClose}
              className="text-mist hover:text-starlight text-xl leading-none w-10 h-10 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        <div className="overflow-y-auto scroll-area flex-1 pb-safe">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
