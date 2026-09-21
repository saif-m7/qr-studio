import { useState, useRef } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import {
  Download,
  Copy,
  Check,
  QrCode,
} from 'lucide-react'
import { getQRFilename } from '../utils/filenames'
import {
  exportCanvasToBlob,
  exportSVGToBlob,
  triggerFileDownload,
  copyQRToClipboard,
} from '../utils/exportEngine'

const FORMATS = [
  { key: 'png',  label: 'PNG',  desc: 'Lossless raster' },
  { key: 'jpg',  label: 'JPG',  desc: 'Compressed photo' },
  { key: 'svg',  label: 'SVG',  desc: 'Scalable vector' },
  { key: 'webp', label: 'WEBP', desc: 'Modern web image' },
]

const RESOLUTIONS = [
  { size: 512,  label: '512 px',  desc: 'Screen / Chat' },
  { size: 1024, label: '1024 px', desc: 'Standard High-Res' },
  { size: 2048, label: '2048 px', desc: 'Print / Poster' },
]

const TYPE_LABELS = {
  url:      'URL',
  text:     'Text',
  phone:    'Phone',
  email:    'Email',
  wifi:     'Wi-Fi',
  contact:  'vCard',
  location: 'Geo',
  upi:      'UPI',
}

/**
 * QRPreviewStage
 * Visual centerpiece of the studio. Displays the live QR code on a drafting plinth
 * with technical metadata, format selection, resolution scale, and real genuine downloads.
 */
export function QRPreviewStage({
  qrString,
  error,
  type,
  fields,
  options,
  logoDataUrl,
  onSuccess,
  onError,
}) {
  const [selectedFormat, setSelectedFormat] = useState('png')
  const [exportSize, setExportSize] = useState(1024)
  const [downloadStatus, setDownloadStatus] = useState('idle') // 'idle' | 'preparing' | 'done'
  const [copyStatus, setCopyStatus] = useState('idle')         // 'idle' | 'copied'

  const svgRef = useRef(null)
  const exportCanvasRef = useRef(null)

  const hasContent = Boolean(qrString && !error)

  // Calculate proportional logo size for a given base size
  const getLogoSettings = (baseSize) => {
    if (!logoDataUrl) return undefined
    const logoSize = Math.round(baseSize * 0.22)
    return {
      src: logoDataUrl,
      height: logoSize,
      width: logoSize,
      excavate: true,
    }
  }

  // Handle genuine file download
  const handleDownload = async () => {
    if (!hasContent || downloadStatus === 'preparing') return

    setDownloadStatus('preparing')
    const filename = getQRFilename(type, fields, selectedFormat)

    try {
      let blob

      if (selectedFormat === 'svg') {
        const svgEl = svgRef.current?.querySelector('svg')
        if (!svgEl) throw new Error('Vector SVG element not rendered')
        blob = exportSVGToBlob(svgEl)
      } else {
        // Raster export: render canvas at selected high resolution
        const canvas = exportCanvasRef.current?.querySelector('canvas')
        if (!canvas) throw new Error('Raster export canvas not initialized')
        blob = await exportCanvasToBlob(canvas, selectedFormat, options.bgColor)
      }

      triggerFileDownload(blob, filename)
      setDownloadStatus('done')
      onSuccess(`Downloaded ${filename}`)

      setTimeout(() => setDownloadStatus('idle'), 2200)
    } catch (err) {
      setDownloadStatus('idle')
      onError(err.message || 'Export failed. Please try again.')
    }
  }

  // Handle clipboard copy
  const handleCopy = async () => {
    if (!hasContent) return
    try {
      const canvas = exportCanvasRef.current?.querySelector('canvas')
      const result = await copyQRToClipboard(canvas, qrString)
      setCopyStatus('copied')
      onSuccess(result.type === 'image' ? 'QR image copied to clipboard!' : 'QR data copied to clipboard!')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (err) {
      onError('Clipboard permission denied.')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
      }}
    >
      {/* Hidden Offscreen Canvas for High-Resolution Raster Export */}
      <div
        ref={exportCanvasRef}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {hasContent && (
          <QRCodeCanvas
            value={qrString}
            size={exportSize}
            fgColor={options.fgColor}
            bgColor={options.bgColor}
            level={options.level}
            marginSize={options.marginSize}
            imageSettings={getLogoSettings(exportSize)}
          />
        )}
      </div>

      {/* ── Main Canvas Stage ── */}
      <div
        className="stage-canvas"
        style={{
          minHeight: '400px',
          padding: '40px 28px 28px',
          position: 'relative',
        }}
      >
        {/* Type badge — top-left corner of the stage */}
        {hasContent && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
            }}
          >
            <span className="type-badge">
              {TYPE_LABELS[type] || type.toUpperCase()}
            </span>
          </div>
        )}

        {hasContent ? (
          <div
            className="scale-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Precision QR Plinth */}
            <div
              className="qr-plinth"
              style={{
                backgroundColor: options.bgColor || '#ffffff',
              }}
            >
              <div ref={svgRef}>
                <QRCodeSVG
                  value={qrString}
                  size={264}
                  fgColor={options.fgColor}
                  bgColor={options.bgColor}
                  level={options.level}
                  marginSize={options.marginSize}
                  imageSettings={getLogoSettings(264)}
                />
              </div>
            </div>

            {/* Technical Metadata Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}
            >
              <span>ECL {options.level}</span>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span>{qrString.length} chars</span>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span style={{ color: 'var(--text-secondary)' }}>{exportSize}px export</span>
              {logoDataUrl && (
                <>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <span style={{ color: 'var(--accent)' }}>Logo</span>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Professional Empty / Ready Stage */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '10px',
              maxWidth: '260px',
              margin: '0 auto',
              height: '100%',
              minHeight: '320px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: error ? 'var(--error-soft)' : 'var(--bg-hover)',
                color: error ? 'var(--error)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: error ? 'var(--error)' : 'var(--border-subtle)',
              }}
            >
              <QrCode size={24} />
            </div>

            <div style={{ marginTop: '4px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {error ? 'Validation required' : 'Ready for input'}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: error ? 'var(--error)' : 'var(--text-muted)', lineHeight: 1.5 }}>
                {error || 'Fill in the form on the left to generate your QR code.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Integrated Export Station ── */}
      <div
        className="panel"
        style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* Controls Row: Format & Resolution */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {/* Format Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="label-mono" style={{ textTransform: 'uppercase', marginRight: '2px', whiteSpace: 'nowrap' }}>
              Format
            </span>
            <div className="segmented-group">
              {FORMATS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  id={`export-fmt-${key}`}
                  className={`segmented-item ${selectedFormat === key ? 'active' : ''}`}
                  onClick={() => setSelectedFormat(key)}
                  aria-pressed={selectedFormat === key}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Picker (Raster only) */}
          {selectedFormat !== 'svg' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="label-mono" style={{ textTransform: 'uppercase', marginRight: '2px', whiteSpace: 'nowrap' }}>
                Scale
              </span>
              <div className="segmented-group">
                {RESOLUTIONS.map(({ size, label }) => (
                  <button
                    key={size}
                    type="button"
                    id={`export-scale-${size}`}
                    className={`segmented-item ${exportSize === size ? 'active' : ''}`}
                    onClick={() => setExportSize(size)}
                    aria-pressed={exportSize === size}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-subtle)' }} aria-hidden="true" />

        {/* Action Row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Primary Download Button */}
          <button
            id="export-download-btn"
            type="button"
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={!hasContent || downloadStatus === 'preparing'}
            style={{ flex: 2, height: '36px', fontSize: '13px' }}
            aria-label={`Download ${selectedFormat.toUpperCase()} file`}
          >
            {downloadStatus === 'preparing' ? (
              <>Preparing {selectedFormat.toUpperCase()}…</>
            ) : downloadStatus === 'done' ? (
              <>
                <Check size={15} />
                Downloaded ✓
              </>
            ) : (
              <>
                <Download size={15} />
                Download {selectedFormat.toUpperCase()}
              </>
            )}
          </button>

          {/* Copy to Clipboard */}
          <button
            id="export-copy-btn"
            type="button"
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!hasContent}
            style={{ flex: 1, height: '36px', fontSize: '13px' }}
            title="Copy QR to clipboard"
            aria-label="Copy QR code to clipboard"
          >
            {copyStatus === 'copied' ? (
              <>
                <Check size={14} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
