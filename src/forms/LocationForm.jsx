import { useState } from 'react'
import { AlertCircle, MapPin } from 'lucide-react'

/**
 * LocationForm — geo: URI
 */
export function LocationForm({ fields, setField, error, onReset }) {
  const [touched, setTouched] = useState(false)
  const hasValue = !!(fields.lat || '').trim() || !!(fields.lng || '').trim()
  const showError = touched && !!error && hasValue

  const coordInput = (id, label, key, placeholder) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        type="number"
        step="any"
        className={`input-base ${showError ? 'error' : ''}`}
        placeholder={placeholder}
        value={fields[key]}
        onChange={(e) => setField(key, e.target.value)}
        onBlur={() => setTouched(true)}
      />
    </div>
  )

  // Try geolocation
  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setField('lat', String(pos.coords.latitude.toFixed(6)))
        setField('lng', String(pos.coords.longitude.toFixed(6)))
      },
      () => {}
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {coordInput('loc-lat', 'Latitude',  'lat', '28.6139')}
        {coordInput('loc-lng', 'Longitude', 'lng', '77.2090')}
      </div>

      {/* Use my location CTA */}
      <button
        type="button"
        className="btn btn-ghost"
        onClick={useMyLocation}
        style={{ alignSelf: 'flex-start', gap: '6px' }}
      >
        <MapPin size={14} />
        Use my location
      </button>

      {showError && (
        <p className="error-text" role="alert"><AlertCircle size={13} />{error}</p>
      )}

      {!showError && (
        <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: 0 }}>
          Enter decimal coordinates or click "Use my location" to auto-fill.
        </p>
      )}

      {hasValue && (
        <button type="button" className="btn btn-ghost" onClick={onReset} style={{ alignSelf: 'flex-start' }}>
          Clear
        </button>
      )}
    </div>
  )
}
