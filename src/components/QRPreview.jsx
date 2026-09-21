import { useRef, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode } from 'lucide-react'

/**
 * QRPreview
 * Renders the live QR code or an appropriate empty/error state.
 *
 * @param {{
 *   qrString: string,
 *   error: string,
 *   options: { size: number, fgColor: string, bgColor: string, level: string, marginSize: number },
 *   svgRef: React.RefObject,
 * }} props
 */
export function QRPreview({ qrString, error, options, svgRef, logoDataUrl }) {
  const { size, fgColor, bgColor, level, marginSize } = options

  const hasContent = !!qrString && !error

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '20px',
        padding: '24px',
      }}
    >
      {/* QR code area */}
      <div
        id="qr-preview-container"
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: hasContent
            ? '0 8px 32px rgb(99 102 241 / 0.18), 0 2px 8px rgb(0 0 0 / 0.10)'
            : 'none',
          transition: 'box-shadow 0.3s ease',
          background: hasContent ? bgColor : 'transparent',
        }}
      >
        {hasContent ? (
          <div
            ref={svgRef}
            className="scale-in"
            style={{ display: 'block', lineHeight: 0 }}
          >
            <QRCodeSVG
              value={qrString}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              marginSize={marginSize}
              imageSettings={logoDataUrl ? {
                src: logoDataUrl,
                height: Math.round(size * 0.22),
                width: Math.round(size * 0.22),
                excavate: true,
              } : undefined}
            />
          </div>
        ) : (
          <EmptyState error={error} />
        )}
      </div>

      {/* Metadata below QR */}
      {hasContent && (
        <div
          className="fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-3)',
              margin: 0,
              letterSpacing: '0.03em',
            }}
          >
            {size} × {size} px · ECL {level}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-2)',
              margin: 0,
              maxWidth: '220px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
            title={qrString}
          >
            {qrString}
          </p>
        </div>
      )}
    </div>
  )
}

function EmptyState({ error }) {
  if (error) {
    return (
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '16px',
          border: '2px dashed #fca5a5',
          background: 'rgb(254 242 242 / 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <QrCode size={20} color="#f87171" />
        </div>
        <p style={{ fontSize: '12px', color: '#dc2626', margin: 0, lineHeight: 1.4 }}>
          Fix the error to see your QR code
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '200px',
        height: '200px',
        borderRadius: '16px',
        border: '2px dashed var(--border)',
        background: 'var(--surface-1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgb(99 102 241 / 0.12), rgb(139 92 246 / 0.12))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <QrCode size={24} color="#6366f1" />
      </div>
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', margin: '0 0 4px' }}>
          Your QR code
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: 0, lineHeight: 1.4 }}>
          Fill in the form to generate a live preview
        </p>
      </div>
    </div>
  )
}
