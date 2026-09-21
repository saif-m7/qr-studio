import { useState } from 'react'
import { IndianRupee, AlertCircle } from 'lucide-react'

/**
 * UPIForm
 */
export function UPIForm({ fields, setField, error, onReset }) {
  const [touched, setTouched] = useState(false)
  const showError = touched && !!error && !!(fields.upiId || '').trim()
  const hasValue = Object.values(fields).some((v) => String(v).trim())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* UPI ID — required */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label htmlFor="upi-id" className="label">UPI ID *</label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)',
              color: showError ? 'var(--error)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <IndianRupee size={15} />
          </span>
          <input
            id="upi-id"
            type="text"
            inputMode="email"
            className={`input-base ${showError ? 'error' : ''}`}
            style={{ paddingLeft: '38px' }}
            placeholder="yourname@upi"
            value={fields.upiId}
            onChange={(e) => setField('upiId', e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={showError}
            aria-describedby={showError ? 'upi-error' : undefined}
          />
        </div>
        {showError && (
          <p id="upi-error" className="error-text" role="alert">
            <AlertCircle size={13} />{error}
          </p>
        )}
      </div>

      {/* Optional fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Payee name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="upi-name" className="label">Payee Name</label>
          <input
            id="upi-name"
            type="text"
            className="input-base"
            placeholder="Jane Doe"
            value={fields.name}
            onChange={(e) => setField('name', e.target.value)}
          />
        </div>

        {/* Amount + Note row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="upi-amount" className="label">Amount (₹)</label>
            <input
              id="upi-amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className="input-base"
              placeholder="0.00"
              value={fields.amount}
              onChange={(e) => setField('amount', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="upi-note" className="label">Note</label>
            <input
              id="upi-note"
              type="text"
              className="input-base"
              placeholder="Dinner payment"
              value={fields.note}
              onChange={(e) => setField('note', e.target.value)}
            />
          </div>
        </div>
      </div>

      {!showError && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Scan to pay with Google Pay, PhonePe, Paytm and any UPI app.
        </p>
      )}

      {hasValue && (
        <button type="button" className="btn btn-ghost" onClick={onReset} style={{ alignSelf: 'flex-start' }}>
          Clear all
        </button>
      )}
    </div>
  )
}
