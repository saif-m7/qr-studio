import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertCircle,
}

const COLORS = {
  success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '#22c55e' },
  error:   { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', icon: '#ef4444' },
  warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', icon: '#f59e0b' },
}

const DARK_COLORS = {
  success: { bg: '#052e16', border: '#166534', text: '#bbf7d0', icon: '#4ade80' },
  error:   { bg: '#450a0a', border: '#991b1b', text: '#fecaca', icon: '#f87171' },
  warning: { bg: '#431407', border: '#92400e', text: '#fde68a', icon: '#fbbf24' },
}

/**
 * Toast
 * @param {{ message: string, type?: 'success'|'error'|'warning', duration?: number, onDismiss: () => void, isDark?: boolean }} props
 */
export function Toast({ message, type = 'success', duration = 2800, onDismiss, isDark = false }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 250) // allow fade-out
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  const Icon = ICONS[type] || CheckCircle
  const palette = isDark ? DARK_COLORS[type] : COLORS[type]

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '12px',
        background: palette.bg,
        border: `1.5px solid ${palette.border}`,
        color: palette.text,
        boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)',
        maxWidth: '340px',
        minWidth: '240px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: 1.4,
      }}
    >
      <Icon size={17} style={{ color: palette.icon, flexShrink: 0, marginTop: '1px' }} />
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 250) }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: palette.text,
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}

/**
 * ToastContainer
 * Manages a queue of toasts. Attach once at the App level.
 *
 * Usage:
 *   const { showToast, ToastContainer } = useToast()
 *   <ToastContainer />
 *   showToast('Copied!', 'success')
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success', duration = 2800) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const ToastContainer = () => (
    <div aria-label="Notifications" style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999 }}>
      {toasts.map((t, i) => (
        <div key={t.id} style={{ marginBottom: `${(toasts.length - 1 - i) * 64}px` }}>
          <Toast
            message={t.message}
            type={t.type}
            duration={t.duration}
            onDismiss={() => dismiss(t.id)}
          />
        </div>
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}
