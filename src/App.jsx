import { useState, useEffect } from 'react'
import { Navbar }           from './components/Navbar'
import { QRTypeSelector }   from './components/QRTypeSelector'
import { QRPreviewStage }   from './components/QRPreviewStage'
import { QROptions }        from './components/QROptions'
import { HistoryPanel }     from './components/HistoryPanel'
import { useToast }         from './components/Toast'
import { URLForm }          from './forms/URLForm'
import { TextForm }         from './forms/TextForm'
import { PhoneForm }        from './forms/PhoneForm'
import { EmailForm }        from './forms/EmailForm'
import { WiFiForm }         from './forms/WiFiForm'
import { ContactForm }      from './forms/ContactForm'
import { LocationForm }     from './forms/LocationForm'
import { UPIForm }          from './forms/UPIForm'
import { useQRData }        from './hooks/useQRData'
import { useLocalStorage }  from './hooks/useLocalStorage'
import { useQRHistory }     from './hooks/useQRHistory'

// ── Technical Headings per Type ───────────────────────────────────
const FORM_HEADINGS = {
  url:      { title: 'Website URL',        sub: 'Encodes web address for direct browser navigation.' },
  text:     { title: 'Plain Text',         sub: 'Encodes raw text, notes, or structured data.' },
  wifi:     { title: 'Wi-Fi Network',      sub: 'Enables quick connection scanning without manual password typing.' },
  contact:  { title: 'Contact Card (vCard)', sub: 'Standard electronic business card format for address books.' },
  email:    { title: 'Email Address',      sub: 'Generates pre-composed mailto action.' },
  phone:    { title: 'Phone Number',       sub: 'Triggers instant tap-to-call dialing.' },
  location: { title: 'Geographic Location', sub: 'Coordinates for maps and navigation apps.' },
  upi:      { title: 'UPI Payment',        sub: 'Standard Unified Payments Interface intent.' },
}

// ── Form Router ────────────────────────────────────────────────────
function ActiveForm({ selectedType, fields, setField, error, resetFields }) {
  const props = { fields, setField, error, onReset: resetFields }
  switch (selectedType) {
    case 'url':      return <URLForm      {...props} />
    case 'text':     return <TextForm     {...props} />
    case 'wifi':     return <WiFiForm     {...props} />
    case 'contact':  return <ContactForm  {...props} />
    case 'email':    return <EmailForm    {...props} />
    case 'phone':    return <PhoneForm    {...props} />
    case 'location': return <LocationForm {...props} />
    case 'upi':      return <UPIForm      {...props} />
    default:         return null
  }
}

// ── App Workbench ──────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useLocalStorage('qrs-theme', false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [logoDataUrl, setLogoDataUrl] = useState(null)

  const { showToast, ToastContainer } = useToast()
  const { history, addEntry, removeEntry, clearAll } = useQRHistory()

  const {
    selectedType,
    fields,
    qrString,
    error,
    options,
    setType,
    setField,
    resetFields,
    setOption,
    restoreState,
  } = useQRData()

  // Apply dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Debounced auto-save to history when payload is valid
  useEffect(() => {
    if (!qrString || error) return
    const timer = setTimeout(() => {
      addEntry({
        type: selectedType,
        qrString,
        fields,
        options,
        logoDataUrl,
      })
    }, 1200)

    return () => clearTimeout(timer)
  }, [qrString, error, selectedType, fields, options, logoDataUrl, addEntry])

  // Restore entry from history
  const handleRestore = (entry) => {
    restoreState(entry.type, entry.fields, entry.options)
    setLogoDataUrl(entry.logoDataUrl || null)
    setIsHistoryOpen(false)
    showToast(`Restored ${entry.type.toUpperCase()} configuration`, 'info')
  }

  const heading = FORM_HEADINGS[selectedType] || {}

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Desktop-grade Header */}
      <Navbar
        isDark={isDark}
        historyCount={history.length}
        onToggleTheme={() => setIsDark((d) => !d)}
        onHistoryClick={() => setIsHistoryOpen(true)}
      />

      {/* 2. Main Workbench */}
      <main
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '16px 20px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
        }}
      >
        {/* Type Navigation Rail */}
        <QRTypeSelector selectedType={selectedType} onSelect={setType} />

        {/* Workbench Split: Form/Options on Left, Prominent Preview Stage on Right */}
        <div
          id="workbench-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(360px, 440px) 1fr',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Form & Inspector Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Form Panel */}
            <section className="panel" aria-label="QR Input Form">
              <div className="panel-header">
                <div>
                  <h2 className="heading-title" style={{ margin: 0 }}>
                    {heading.title}
                  </h2>
                  <p className="heading-sub" style={{ margin: '2px 0 0' }}>
                    {heading.sub}
                  </p>
                </div>
              </div>

              <div className="panel-body">
                <ActiveForm
                  selectedType={selectedType}
                  fields={fields}
                  setField={setField}
                  error={error}
                  resetFields={resetFields}
                />
              </div>
            </section>

            {/* Styling & Parameters Panel */}
            <section className="panel" aria-label="QR Styling and Parameters">
              <div className="panel-body">
                <QROptions
                  options={options}
                  setOption={setOption}
                  logoDataUrl={logoDataUrl}
                  onLogoChange={setLogoDataUrl}
                />
              </div>
            </section>
          </div>

          {/* Right Column: Visual Centerpiece Stage & Integrated Exporter */}
          <section aria-label="QR Preview and Export Stage" style={{ position: 'sticky', top: '64px' }}>
            <QRPreviewStage
              qrString={qrString}
              error={error}
              type={selectedType}
              fields={fields}
              options={options}
              logoDataUrl={logoDataUrl}
              onSuccess={(msg) => {
                showToast(msg, 'success')
                if (qrString && !error) {
                  addEntry({
                    type: selectedType,
                    qrString,
                    fields,
                    options,
                    logoDataUrl,
                  })
                }
              }}
              onError={(msg) => showToast(msg, 'error')}
            />
          </section>
        </div>
      </main>

      {/* History Slide-over Drawer */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestore}
        onDelete={removeEntry}
        onClearAll={() => {
          clearAll()
          showToast('History cleared', 'info')
        }}
        isDark={isDark}
      />

      {/* Responsive Breakpoints */}
      <style>{`
        @media (max-width: 960px) {
          #workbench-grid {
            grid-template-columns: 1fr !important;
          }
          #workbench-grid > section:last-child {
            position: static !important;
            order: -1; /* Keep QR preview prominent on mobile/tablet */
          }
        }
        @media (max-width: 540px) {
          main {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
      `}</style>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}