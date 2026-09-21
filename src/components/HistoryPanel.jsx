import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Trash2, Clock, RotateCcw } from 'lucide-react'

const TYPE_LABELS = {
  url:      'URL',
  text:     'Text',
  phone:    'Phone',
  email:    'Email',
  wifi:     'Wi-Fi',
  contact:  'Contact',
  location: 'Location',
  upi:      'UPI',
}

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function truncateLabel(str, max = 34) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

/**
 * HistoryPanel
 * Desktop-grade slide-over drawer for past QR codes.
 */
export function HistoryPanel({ isOpen, onClose, history, onRestore, onDelete, onClearAll }) {
  const panelRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Trap focus
  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          zIndex: 100,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Drawer */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        aria-label="QR Code History"
        aria-modal="true"
        role="dialog"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          width: 'min(380px, 92vw)',
          background: 'var(--bg-panel)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-stage)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-panel)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} style={{ color: 'var(--text-muted)' }} />
            <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              History
            </h2>
            {history.length > 0 && (
              <span className="label-mono" style={{ background: 'var(--bg-subtle)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                {history.length}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {history.length > 0 && (
              <button
                type="button"
                className="btn-icon"
                onClick={onClearAll}
                title="Clear all history"
                aria-label="Clear all history"
              >
                <Trash2 size={14} style={{ color: 'var(--error)' }} />
              </button>
            )}
            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              aria-label="Close history panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {history.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '240px',
                textAlign: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
              }}
            >
              <Clock size={22} style={{ opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                No generated codes yet
              </p>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Generated QR codes will automatically log here for quick restoration.
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((entry) => (
                <li
                  key={entry.id}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '64px',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      borderRight: '1px solid var(--border)',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <QRCodeSVG
                      value={entry.qrString}
                      size={54}
                      fgColor="#000000"
                      bgColor="#ffffff"
                      level="L"
                      marginSize={0}
                    />
                  </div>

                  {/* Metadata */}
                  <div style={{ flex: 1, padding: '8px 10px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span className="label-mono" style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        {TYPE_LABELS[entry.type] || entry.type}
                      </span>
                      <span className="label-mono" style={{ fontSize: '10px' }}>
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '11.5px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={entry.qrString}
                    >
                      {truncateLabel(entry.qrString)}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onRestore(entry)}
                      title="Restore to workspace"
                      aria-label="Restore this QR"
                      style={{ height: '50%', width: '32px', borderRadius: 0 }}
                    >
                      <RotateCcw size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onDelete(entry.id)}
                      title="Delete entry"
                      aria-label="Delete entry"
                      style={{ height: '50%', width: '32px', borderRadius: 0, borderTop: '1px solid var(--border-subtle)' }}
                    >
                      <X size={12} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
