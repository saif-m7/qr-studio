import { Type } from 'lucide-react'

/**
 * TextForm
 * @param {{ fields: { text: string }, setField: fn, error: string, onReset: fn }} props
 */
export function TextForm({ fields, setField, error, onReset }) {
  const charCount = (fields.text || '').length
  const MAX = 2953
  const showError = !!error && charCount > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor="text-input" className="label">Plain Text</label>
        <span style={{ fontSize: '11px', color: charCount > MAX * 0.9 ? 'var(--error)' : 'var(--text-3)' }}>
          {charCount} / {MAX}
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          id="text-input"
          className={`input-base ${showError ? 'error' : ''}`}
          style={{ minHeight: '140px', resize: 'vertical', paddingTop: '10px', lineHeight: 1.6 }}
          placeholder="Enter any text to encode as a QR code…"
          value={fields.text}
          onChange={(e) => setField('text', e.target.value)}
          aria-invalid={showError}
          aria-describedby={showError ? 'text-error' : undefined}
          maxLength={MAX + 100}
        />
      </div>

      {showError && (
        <p id="text-error" className="error-text" role="alert">{error}</p>
      )}
      {!showError && (
        <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: 0 }}>
          Encode any plain text — notes, messages, product IDs, etc.
        </p>
      )}

      {(fields.text || '').length > 0 && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onReset}
          style={{ alignSelf: 'flex-start', marginTop: '4px' }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
