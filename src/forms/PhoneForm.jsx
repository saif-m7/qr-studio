import { useState } from 'react'
import { Phone, X, AlertCircle } from 'lucide-react'

/**
 * PhoneForm
 */
export function PhoneForm({ fields, setField, error, onReset }) {
  const [touched, setTouched] = useState(false)
  const showError = touched && !!error
  const hasValue = !!(fields.phone || '').trim()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor="phone-input" className="label">Phone Number</label>

      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: showError ? 'var(--error)' : 'var(--text-3)',
            display: 'flex', alignItems: 'center', pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <Phone size={15} />
        </span>

        <input
          id="phone-input"
          type="tel"
          autoComplete="tel"
          className={`input-base ${showError ? 'error' : ''}`}
          style={{ paddingLeft: '38px', paddingRight: hasValue ? '38px' : '14px' }}
          placeholder="+91 98765 43210"
          value={fields.phone}
          onChange={(e) => setField('phone', e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError}
          aria-describedby={showError ? 'phone-error' : undefined}
        />

        {hasValue && (
          <button
            type="button"
            onClick={() => { onReset(); setTouched(false) }}
            aria-label="Clear phone number"
            style={{
              position: 'absolute', right: '10px', top: '50%',
              transform: 'translateY(-50%)', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-3)', display: 'flex',
              alignItems: 'center', padding: '4px', borderRadius: '6px',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showError && (
        <p id="phone-error" className="error-text" role="alert">
          <AlertCircle size={13} />{error}
        </p>
      )}
      {!showError && (
        <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: 0 }}>
          Include country code for international numbers (e.g. +1, +91).
        </p>
      )}
    </div>
  )
}
