import { QrCode, History, Sun, Moon } from 'lucide-react'

/**
 * Navbar
 * Desktop-grade application header.
 *
 * @param {{
 *   isDark: boolean,
 *   onToggleTheme: () => void,
 *   onHistoryClick: () => void,
 *   historyCount: number,
 * }} props
 */
export function Navbar({ isDark, onToggleTheme, onHistoryClick, historyCount = 0 }) {
  return (
    <header
      style={{
        height: '48px',
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--action-bg)',
              color: 'var(--action-fg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <QrCode size={16} />
          </div>

          <span
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            QR Studio
          </span>

          <span
            style={{
              fontSize: '10.5px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-xs)',
              marginLeft: '4px',
            }}
          >
            Utility v1.2
          </span>
        </div>

        {/* Global Toolbar Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* History */}
          <button
            id="navbar-history-btn"
            className="btn-icon"
            onClick={onHistoryClick}
            title="History drawer"
            aria-label="View QR code history"
            style={{ position: 'relative' }}
          >
            <History size={16} />
            {historyCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  minWidth: '14px',
                  height: '14px',
                  borderRadius: '99px',
                  background: 'var(--action-bg)',
                  color: 'var(--action-fg)',
                  fontSize: '9px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2px',
                  border: '1px solid var(--bg-panel)',
                }}
                aria-hidden="true"
              >
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            id="navbar-theme-toggle"
            className="btn-icon"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}
