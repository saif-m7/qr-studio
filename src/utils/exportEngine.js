/**
 * exportEngine.js
 * Production-quality export engine for QR Studio.
 * Handles high-resolution raster generation (PNG, JPG, WebP), pure SVG serialization,
 * clipboard copying, and genuine browser file downloads.
 */

const MIME_MAP = {
  png:  'image/png',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg:  'image/svg+xml;charset=utf-8',
}

/**
 * Triggers a real browser file download using Blob and ObjectURL.
 * Safely revokes the object URL after triggering.
 *
 * @param {Blob} blob - valid file Blob
 * @param {string} filename - sanitized filename with extension
 */
export function triggerFileDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.style.display = 'none'
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }, 250)
}

/**
 * Exports the QR code from a canvas element to a raster image Blob.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {'png'|'jpg'|'webp'} format
 * @param {string} [bgColor='#ffffff'] - background color to guarantee no black transparency in JPG
 * @returns {Promise<Blob>}
 */
export function exportCanvasToBlob(canvas, format = 'png', bgColor = '#ffffff') {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas element not available'))
      return
    }

    const mime = MIME_MAP[format] || 'image/png'

    // If format is JPG and canvas has transparent regions, composite onto solid background
    if (format === 'jpg' || format === 'jpeg') {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const ctx = tempCanvas.getContext('2d')
      ctx.fillStyle = bgColor || '#ffffff'
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
      ctx.drawImage(canvas, 0, 0)

      tempCanvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to encode JPG blob'))),
        mime,
        0.98
      )
      return
    }

    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error(`Failed to encode ${format.toUpperCase()} blob`))),
      mime,
      format === 'webp' ? 0.95 : undefined
    )
  })
}

/**
 * Serializes the SVG DOM element into a valid, standalone SVG file Blob.
 *
 * @param {SVGSVGElement} svgEl
 * @returns {Blob}
 */
export function exportSVGToBlob(svgEl) {
  if (!svgEl) {
    throw new Error('SVG element not found')
  }

  // Clone to avoid mutating live DOM
  const clone = svgEl.cloneNode(true)

  // Ensure mandatory namespaces and attributes
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

  const serializer = new XMLSerializer()
  let source = serializer.serializeToString(clone)

  // Add XML declaration
  if (!source.match(/^<\?xml/)) {
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source
  }

  return new Blob([source], { type: MIME_MAP.svg })
}

/**
 * Copies the QR code as a PNG image to the system clipboard.
 * Falls back to copying raw data string if Image Clipboard API is not supported.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string} rawString
 * @returns {Promise<{ type: 'image' | 'text' }>}
 */
export async function copyQRToClipboard(canvas, rawString) {
  if (canvas && typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    try {
      const blob = await exportCanvasToBlob(canvas, 'png')
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      return { type: 'image' }
    } catch {
      // Fallback to text copy below
    }
  }

  if (rawString && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(rawString)
    return { type: 'text' }
  }

  throw new Error('Clipboard access denied or unavailable')
}
