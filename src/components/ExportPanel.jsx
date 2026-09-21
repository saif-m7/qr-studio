import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Copy, Image } from 'lucide-react'

/**
 * ExportPanel
 * Handles PNG, SVG, and clipboard copy exports.
 *
 * @param {{
 *   qrString: string,
 *   options: { size: number, fgColor: string, bgColor: string, level: string, marginSize: number },
 *   svgRef: React.RefObject,     // ref pointing to the SVG wrapper div in QRPreview
 *   onSuccess: (msg: string) => void,
 *   onError: (msg: string) => void,
 * }} props
 */
export function ExportPanel({ qrString, options, svgRef, logoDataUrl, onSuccess, onError }) {
  const canvasRef = useRef(null)
  const disabled = !qrString

  /** Download a Blob as a file */
  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /** PNG / JPG / WebP via hidden canvas */
  const downloadRaster = (format = 'png') => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) { onError('Canvas not available.'); return }

    const mimeMap = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' }
    const mime = mimeMap[format] || 'image/png'

    canvas.toBlob(
      (blob) => {
        if (!blob) { onError('Export failed — try again.'); return }
        triggerDownload(blob, `qr-studio.${format}`)
        onSuccess(`Downloaded as ${format.toUpperCase()}`)
      },
      mime,
      format === 'jpg' ? 0.95 : undefined,
    )
  }

  /** SVG via serializing the rendered SVG element */
  const downloadSVG = () => {
    const svgEl = svgRef.current?.querySelector('svg')
    if (!svgEl) { onError('SVG not available.'); return }

    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svgEl)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    triggerDownload(blob, 'qr-studio.svg')
    onSuccess('Downloaded as SVG')
  }

  /** Copy QR data string to clipboard */
  const copyData = async () => {
    if (!qrString) return
    try {
      await navigator.clipboard.writeText(qrString)
      onSuccess('QR data copied to clipboard!')
    } catch {
      onError('Could not access clipboard.')
    }
  }

  return (
    <div>
      {/* Hidden canvas used only for raster exports */}
      <div ref={canvasRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }} aria-hidden="true">
        {qrString && (
          <QRCodeCanvas
            value={qrString}
            size={options.size}
            fgColor={options.fgColor}
            bgColor={options.bgColor}
            level={options.level}
            marginSize={options.marginSize}
            imageSettings={logoDataUrl ? {
              src: logoDataUrl,
              height: Math.round(options.size * 0.22),
              width: Math.round(options.size * 0.22),
              excavate: true,
            } : undefined}
          />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Section label */}
        <p className="label" style={{ marginBottom: '10px' }}>Download</p>

        {/* Raster buttons row */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            id="export-png"
            className="btn btn-primary"
            onClick={() => downloadRaster('png')}
            disabled={disabled}
            style={{ flex: 1, justifyContent: 'center', minWidth: '80px' }}
            aria-label="Download as PNG"
          >
            <Download size={14} />
            PNG
          </button>

          <button
            id="export-svg"
            className="btn btn-ghost"
            onClick={downloadSVG}
            disabled={disabled}
            style={{ flex: 1, justifyContent: 'center', minWidth: '80px' }}
            aria-label="Download as SVG"
          >
            <Image size={14} />
            SVG
          </button>
        </div>

        {/* Secondary row */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            id="export-jpg"
            className="btn btn-ghost"
            onClick={() => downloadRaster('jpg')}
            disabled={disabled}
            style={{ flex: 1, justifyContent: 'center', minWidth: '80px' }}
            aria-label="Download as JPG"
          >
            <Download size={14} />
            JPG
          </button>

          <button
            id="export-webp"
            className="btn btn-ghost"
            onClick={() => downloadRaster('webp')}
            disabled={disabled}
            style={{ flex: 1, justifyContent: 'center', minWidth: '80px' }}
            aria-label="Download as WebP"
          >
            <Download size={14} />
            WebP
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} aria-hidden="true" />

        {/* Copy data */}
        <button
          id="export-copy"
          className="btn btn-ghost"
          onClick={copyData}
          disabled={disabled}
          style={{ width: '100%', justifyContent: 'center' }}
          aria-label="Copy QR data to clipboard"
        >
          <Copy size={14} />
          Copy QR Data
        </button>
      </div>
    </div>
  )
}
