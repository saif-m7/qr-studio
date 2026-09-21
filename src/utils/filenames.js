/**
 * filenames.js
 * Generates clean, meaningful, sanitized filenames based on QR type and payload.
 * Prevents invalid characters across Windows, macOS, and Linux:
 * / \ : * ? " < > |
 */

function sanitize(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/[/\:?*"<>|#%&{}\\+~`]/g, '') // remove forbidden characters
    .replace(/\s+/g, '-')                  // replace whitespace with hyphen
    .replace(/[^a-z0-9_-]/g, '')           // keep only alphanumeric, hyphen, underscore
    .replace(/-+/g, '-')                   // collapse multiple hyphens
    .replace(/^-|-$/g, '')                 // trim leading/trailing hyphens
    .slice(0, 32)                          // cap reasonable length
}

/**
 * Generate a smart sanitized filename for a QR code download.
 *
 * @param {string} type - 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'phone' | 'location' | 'upi'
 * @param {object} fields - form fields
 * @param {string} format - 'png' | 'jpg' | 'svg' | 'webp'
 * @returns {string} e.g. 'website-github-qr.png', 'wifi-office-guest-qr.svg'
 */
export function getQRFilename(type, fields = {}, format = 'png') {
  let descriptor = ''

  switch (type) {
    case 'url': {
      const raw = fields.url || ''
      try {
        const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
        descriptor = sanitize(parsed.hostname.replace(/^www\./, '').split('.')[0])
      } catch {
        descriptor = sanitize(raw)
      }
      return `${descriptor ? `website-${descriptor}` : 'website'}-qr.${format}`
    }

    case 'wifi': {
      descriptor = sanitize(fields.ssid)
      return `${descriptor ? `wifi-${descriptor}` : 'wifi'}-qr.${format}`
    }

    case 'contact': {
      const parts = [fields.firstName, fields.lastName].filter(Boolean).join('-')
      descriptor = sanitize(parts) || sanitize(fields.org)
      return `${descriptor ? `contact-${descriptor}` : 'contact'}-qr.${format}`
    }

    case 'email': {
      const emailUser = (fields.email || '').split('@')[0]
      descriptor = sanitize(emailUser)
      return `${descriptor ? `email-${descriptor}` : 'email'}-qr.${format}`
    }

    case 'phone': {
      descriptor = sanitize(fields.phone)
      return `${descriptor ? `phone-${descriptor}` : 'phone'}-qr.${format}`
    }

    case 'location': {
      const lat = fields.lat ? String(fields.lat).slice(0, 6) : ''
      const lng = fields.lng ? String(fields.lng).slice(0, 6) : ''
      descriptor = sanitize([lat, lng].filter(Boolean).join('-'))
      return `${descriptor ? `location-${descriptor}` : 'location'}-qr.${format}`
    }

    case 'upi': {
      descriptor = sanitize(fields.name) || sanitize((fields.upiId || '').split('@')[0])
      return `${descriptor ? `upi-${descriptor}` : 'upi'}-qr.${format}`
    }

    case 'text': {
      const words = (fields.text || '').trim().split(/\s+/).slice(0, 3).join('-')
      descriptor = sanitize(words)
      return `${descriptor ? `text-${descriptor}` : 'text'}-qr.${format}`
    }

    default:
      return `qr-code.${format}`
  }
}
