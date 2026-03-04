import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const bgColor = {
    success: 'rgba(16, 185, 129, 0.15)',
    error: 'rgba(239, 68, 68, 0.15)',
    info: 'rgba(34, 211, 238, 0.15)',
  }[toast.type]

  const borderColor = {
    success: 'rgba(16, 185, 129, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    info: 'rgba(34, 211, 238, 0.3)',
  }[toast.type]

  const iconColor = {
    success: '#10b981',
    error: '#ef4444',
    info: '#4A7C59',
  }[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 50, scale: visible ? 1 : 0.9 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-xl px-4 py-3 backdrop-blur-md"
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        maxWidth: '320px',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          {toast.type === 'success' && (
            <svg className="w-5 h-5" fill={iconColor} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {toast.type === 'error' && (
            <svg className="w-5 h-5" fill={iconColor} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {toast.type === 'info' && (
            <svg className="w-5 h-5" fill={iconColor} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        {/* Message */}
        <p className="text-sm text-zen-text flex-1">{toast.message}</p>
        
        {/* Close button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 text-zen-text-dim hover:text-zen-text transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, dismissToast }
}
