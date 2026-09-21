import { useState } from 'react'
import { Wifi, Eye, EyeOff, AlertCircle } from 'lucide-react'

const SECURITY_OPTIONS = [
  { value: 'WPA', label: 'WPA/WPA2' },
  { value: 'WEP', label: 'WEP'      },
  { value: 'nopass', label: 'None (Open)' },
]

/**
 * WiFiForm
 */
export function WiFiForm({ fields, setField, error, onReset }) {
  const [showPass, setShowPass] = useState(false)
  const [touched, setTouched] = useState(false)
  const showError = touched && !!error
  const noPassword = fields.security === 'nopass'

  const input = (id, label, key, opts = {}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        className={`input-base ${showError && key === 'ssid' ? 'error' : ''}`}
        placeholder={opts.placeholder || ''}
        value={fields[key]}
        onChange={(e) => setField(key, e.target.value)}
        onBlur={() => setTouched(true)}
        autoComplete={opts.autoComplete}
        {...opts.extra}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Network name */}
      {input('wifi-ssid', 'Network Name (SSID)', 'ssid', { placeholder: 'My Home Network' })}

      {/* Security type */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label htmlFor="wifi-security" className="label">Security</label>
        <div className="segmented-group">
          {SECURITY_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              id={`wifi-sec-${value}`}
              onClick={() => setField('security', value)}
              className={`segmented-item ${fields.security === value ? 'active' : ''}`}
              aria-pressed={fields.security === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Password */}
      {!noPassword && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }} className="fade-in">
          <label htmlFor="wifi-password" className="label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="wifi-password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              className={`input-base ${showError ? 'error' : ''}`}
              style={{ paddingRight: '42px' }}
              placeholder="••••••••"
              value={fields.password}
              onChange={(e) => setField('password', e.target.value)}
              onBlur={() => setTouched(true)}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute', right: '10px', top: '50%',
                transform: 'translateY(-50%)', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
                alignItems: 'center', padding: '4px', borderRadius: 'var(--radius-xs)',
              }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* Hidden network toggle */}
      <label
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500,
        }}
      >
        <input
          id="wifi-hidden"
          type="checkbox"
          checked={fields.hidden}
          onChange={(e) => setField('hidden', e.target.checked)}
          style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }}
        />
        Hidden network
      </label>

      {showError && (
        <p className="error-text" role="alert"><AlertCircle size={13} />{error}</p>
      )}

      {(fields.ssid || fields.password) && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => { setTouched(false); onReset() }}
          style={{ alignSelf: 'flex-start' }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
