import { useState, useCallback, useRef } from 'react'
import { Link, X, AlertCircle } from 'lucide-react'

/**
 * URLForm
 * Controlled form for URL QR type.
 * Emits field updates immediately (live preview).
 * Auto-prefixes https:// on blur.
 *
 * @param {{
 *   fields: { url: string },
 *   setField: (key: string, value: string) => void,
 *   error: string,
 *   onReset: () => void,
 * }} props
 */
export function URLForm({ fields, setField, error, onReset }) {
  const [touched, setTouched] = useState(false)
  const inputRef = useRef(null)

  const handleChange = (e) => {
    setField('url', e.target.value)
  }

  const handleBlur = () => {
    setTouched(true)

    // Auto-prefix protocol on blur if missing
    const val = (fields.url || '').trim()
    if (val && !/^https?:\/\//i.test(val) && !val.startsWith('//')) {
      setField('url', `https://${val}`)
    }
  }

  const handleClear = useCallback(() => {
    onReset()
    setTouched(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [onReset])

  const showError = touched && !!error
  const hasValue = !!(fields.url || '').trim()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Label */}
      <label htmlFor="url-input" className="label">
        Website URL
      </label>

      {/* Input row */}
      <div style={{ position: 'relative' }}>
        {/* Leading icon */}
        <span
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: showError ? 'var(--error)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            transition: 'color 0.15s ease',
          }}
          aria-hidden="true"
        >
          <Link size={15} />
        </span>

        <input
          ref={inputRef}
          id="url-input"
          type="url"
          autoComplete="url"
          spellCheck={false}
          className={`input-base ${showError ? 'error' : ''}`}
          style={{ paddingLeft: '38px', paddingRight: hasValue ? '38px' : '14px' }}
          placeholder="https://example.com"
          value={fields.url}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError}
          aria-describedby={showError ? 'url-error' : undefined}
        />

        {/* Clear button */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear URL"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '6px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}  
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Error message */}
      {showError && (
        <p id="url-error" className="error-text" role="alert">
          <AlertCircle size={13} />
          {error}
        </p>
      )}

      {/* Helper text */}
      {!showError && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          Enter any website address. The QR will update as you type.
        </p>
      )}
    </div>
  )
}
