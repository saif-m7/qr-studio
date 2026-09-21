import { AlertCircle } from 'lucide-react'

/**
 * ContactForm — vCard 3.0
 */
export function ContactForm({ fields, setField, error, onReset }) {
  const hasValue = Object.values(fields).some((v) => String(v).trim())

  const textInput = (id, label, key, opts = {}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        type={opts.type || 'text'}
        autoComplete={opts.autoComplete}
        className="input-base"
        placeholder={opts.placeholder || ''}
        value={fields[key]}
        onChange={(e) => setField(key, e.target.value)}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {textInput('contact-first', 'First Name *', 'firstName', { placeholder: 'Jane', autoComplete: 'given-name' })}
        {textInput('contact-last',  'Last Name',   'lastName',  { placeholder: 'Doe',  autoComplete: 'family-name' })}
      </div>

      {textInput('contact-phone', 'Phone', 'phone', { type: 'tel', placeholder: '+91 98765 43210', autoComplete: 'tel' })}
      {textInput('contact-email', 'Email', 'email', { type: 'email', placeholder: 'jane@example.com', autoComplete: 'email' })}
      {textInput('contact-org',   'Organisation', 'org', { placeholder: 'Acme Corp', autoComplete: 'organization' })}
      {textInput('contact-url',   'Website', 'url', { type: 'url', placeholder: 'https://janedoe.com', autoComplete: 'url' })}

      {error && hasValue && (
        <p className="error-text" role="alert"><AlertCircle size={13} />{error}</p>
      )}

      {hasValue && (
        <button type="button" className="btn btn-ghost" onClick={onReset} style={{ alignSelf: 'flex-start' }}>
          Clear all
        </button>
      )}
    </div>
  )
}
