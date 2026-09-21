import { useRef } from 'react'
import { SlidersHorizontal, RotateCcw, ImagePlus, Trash2 } from 'lucide-react'

const ECL_OPTIONS = [
  { value: 'L', label: 'L', title: 'Low — 7% recovery' },
  { value: 'M', label: 'M', title: 'Medium — 15% recovery (default)' },
  { value: 'Q', label: 'Q', title: 'Quartile — 25% recovery' },
  { value: 'H', label: 'H', title: 'High — 30% recovery (required for logo)' },
]

const DEFAULT_OPTIONS = {
  size: 256,
  fgColor: '#000000',
  bgColor: '#ffffff',
  level: 'M',
  marginSize: 1,
}

/**
 * QROptions
 * Compact inspector for QR visual styling, parameters, and logo overlay.
 *
 * @param {{
 *   options: object,
 *   setOption: (key: string, val: any) => void,
 *   logoDataUrl: string|null,
 *   onLogoChange: (url: string|null) => void,
 * }} props
 */
export function QROptions({ options, setOption, logoDataUrl, onLogoChange }) {
  const { fgColor, bgColor, level, marginSize } = options
  const logoInputRef = useRef(null)

  const isDefault = (
    fgColor === DEFAULT_OPTIONS.fgColor &&
    bgColor === DEFAULT_OPTIONS.bgColor &&
    level === DEFAULT_OPTIONS.level &&
    marginSize === DEFAULT_OPTIONS.marginSize &&
    !logoDataUrl
  )

  const reset = () => {
    Object.entries(DEFAULT_OPTIONS).forEach(([k, v]) => setOption(k, v))
    onLogoChange(null)
  }

  const handleLogoFile = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onLogoChange(ev.target.result)
      if (options.level !== 'H') setOption('level', 'H')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Inspector Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SlidersHorizontal size={13} style={{ color: 'var(--text-muted)' }} />
          <span className="heading-title" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Styling & Parameters
          </span>
        </div>

        {!isDefault && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={reset}
            style={{ height: '24px', padding: '0 6px', fontSize: '11px' }}
            title="Reset parameters to default"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      {/* Colors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <ColorField
          id="opt-fg"
          label="Foreground"
          value={fgColor}
          onChange={(v) => setOption('fgColor', v)}
        />
        <ColorField
          id="opt-bg"
          label="Background"
          value={bgColor}
          onChange={(v) => setOption('bgColor', v)}
        />
      </div>

      {/* Error Correction Level */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label className="label" style={{ margin: 0 }}>Error Correction</label>
          <span className="label-mono">{ECL_OPTIONS.find((o) => o.value === level)?.label} ({level === 'H' ? '30%' : level === 'Q' ? '25%' : level === 'M' ? '15%' : '7%'})</span>
        </div>
        <div className="segmented-group">
          {ECL_OPTIONS.map(({ value, label, title }) => (
            <button
              key={value}
              type="button"
              id={`opt-ecl-${value}`}
              className={`segmented-item ${level === value ? 'active' : ''}`}
              onClick={() => setOption('level', value)}
              title={title}
              aria-pressed={level === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quiet Zone (Margin) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label htmlFor="opt-margin" className="label" style={{ margin: 0 }}>Quiet Zone</label>
          <span className="label-mono">{marginSize} modules</span>
        </div>
        <input
          id="opt-margin"
          type="range"
          min={0}
          max={6}
          step={1}
          value={marginSize}
          onChange={(e) => setOption('marginSize', Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--action-bg)', cursor: 'pointer' }}
          aria-label={`Quiet zone: ${marginSize} modules`}
        />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '2px 0' }} aria-hidden="true" />

      {/* Logo Overlay */}
      <div>
        <label className="label" style={{ marginBottom: '6px' }}>Logo Overlay</label>

        {!logoDataUrl ? (
          <button
            id="opt-logo-upload"
            type="button"
            className="btn btn-secondary"
            onClick={() => logoInputRef.current?.click()}
            style={{ width: '100%', borderStyle: 'dashed', height: '36px' }}
          >
            <ImagePlus size={14} />
            <span>Attach Logo (PNG / SVG)</span>
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img src={logoDataUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Logo active</p>
                <p style={{ margin: 0, fontSize: '10.5px', color: 'var(--text-muted)' }}>Auto-switched to ECL H</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-icon"
              onClick={() => onLogoChange(null)}
              title="Remove logo"
              aria-label="Remove logo"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoFile}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

function ColorField({ id, label, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '34px',
          padding: '0 8px',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById(id)?.click()}
      >
        <span
          style={{
            width: '18px',
            height: '18px',
            borderRadius: 'var(--radius-xs)',
            background: value,
            border: '1px solid rgba(0, 0, 0, 0.15)',
            display: 'block',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
          {value}
        </span>
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ opacity: 0, position: 'absolute', pointerEvents: 'none', width: 0, height: 0 }}
          aria-label={`${label} color picker`}
        />
      </div>
    </div>
  )
}
