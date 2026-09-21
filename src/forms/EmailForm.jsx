import { useState } from 'react'
import { Mail, AlertCircle, ChevronDown } from 'lucide-react'

/**
 * EmailForm
 */
export function EmailForm({ fields, setField, error, onReset }) {
  const [touched, setTouched] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const showError = touched && !!error
  const hasValue = !!(fields.email || '').trim()

  const Field = ({ id, label, value, onChange, placeholder, type = 'text', helpText }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        type={type}
        className="input-base"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {helpText && (
        <p style={{ fontSize: '11px', color: 'var(--text-3)', margin: 0 }}>{helpText}</p>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Email address */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="email-input" className="label">Email Address</label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: showError ? 'var(--error)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <Mail size={15} />
          </span>
          <input
            id="email-input"
            type="email"
            autoComplete="email"
            className={`input-base ${showError ? 'error' : ''}`}
            style={{ paddingLeft: '38px' }}
            placeholder="hello@example.com"
            value={fields.email}
            onChange={(e) => setField('email', e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={showError}
            aria-describedby={showError ? 'email-error' : undefined}
          />
        </div>
        {showError && (
          <p id="email-error" className="error-text" role="alert">
            <AlertCircle size={13} />{error}
          </p>
        )}
      </div>

      {/* Optional fields toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600,
          fontFamily: 'var(--font-sans)', padding: 0,
          letterSpacing: '0.03em', width: 'fit-content',
        }}
        aria-expanded={expanded}
      >
        <ChevronDown
          size={14}
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        />
        {expanded ? 'Hide optional fields' : 'Add subject & body (optional)'}
      </button>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="fade-in">
          <Field
            id="email-subject"
            label="Subject"
            value={fields.subject}
            onChange={(e) => setField('subject', e.target.value)}
            placeholder="Meeting follow-up"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="email-body" className="label">Body</label>
            <textarea
              id="email-body"
              className="input-base"
              style={{ minHeight: '90px', resize: 'vertical', lineHeight: 1.6 }}
              placeholder="Hi there, just following up on…"
              value={fields.body}
              onChange={(e) => setField('body', e.target.value)}
            />
          </div>
        </div>
      )}

      {hasValue && (
        <button type="button" className="btn btn-ghost" onClick={onReset} style={{ alignSelf: 'flex-start' }}>
          Clear all
        </button>
      )}
    </div>
  )
}
