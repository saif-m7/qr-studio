/**
 * formatters.js
 * Pure functions that convert form field objects → raw QR string.
 * One function per QR type. No UI logic here.
 */

/**
 * URL — plain URL string (already validated before calling)
 * @param {{ url: string }} fields
 */
export function formatURL({ url }) {
  return (url || '').trim()
}

/**
 * Plain text
 * @param {{ text: string }} fields
 */
export function formatText({ text }) {
  return (text || '').trim()
}

/**
 * Phone — tel: URI
 * @param {{ phone: string }} fields
 */
export function formatPhone({ phone }) {
  const cleaned = (phone || '').replace(/\s/g, '')
  return `tel:${cleaned}`
}

/**
 * Email — mailto: URI
 * @param {{ email: string, subject?: string, body?: string }} fields
 */
export function formatEmail({ email, subject = '', body = '' }) {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body)    params.set('body', body)
  const qs = params.toString()
  return `mailto:${email}${qs ? '?' + qs : ''}`
}

/**
 * Wi-Fi — WPA/WPA2 encoded string
 * @param {{ ssid: string, password: string, security: 'WPA'|'WEP'|'nopass', hidden?: boolean }} fields
 */
export function formatWifi({ ssid, password = '', security = 'WPA', hidden = false }) {
  // Escape special characters per ZXing standard: \ ; , " :
  const esc = (s) => (s || '').replace(/([\\;,":])/g, '\\$1')
  let result = `WIFI:T:${security};S:${esc(ssid)};`
  if (security !== 'nopass' && password) {
    result += `P:${esc(password)};`
  }
  if (hidden) {
    result += `H:true;`
  }
  result += ';'
  return result
}

/**
 * vCard contact
 * @param {{ firstName: string, lastName: string, phone?: string, email?: string, org?: string, url?: string }} fields
 */
export function formatVCard({ firstName, lastName, phone, email, org, url }) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName || ''};${firstName || ''};;;`,
    `FN:${[firstName, lastName].filter(Boolean).join(' ')}`,
  ]
  if (org)   lines.push(`ORG:${org}`)
  if (phone) lines.push(`TEL:${phone}`)
  if (email) lines.push(`EMAIL:${email}`)
  if (url)   lines.push(`URL:${url}`)
  lines.push('END:VCARD')
  return lines.join('\n')
}

/**
 * Geo location
 * @param {{ lat: string|number, lng: string|number }} fields
 */
export function formatGeo({ lat, lng }) {
  return `geo:${lat},${lng}`
}

/**
 * UPI payment
 * @param {{ upiId: string, name?: string, amount?: string, note?: string }} fields
 */
export function formatUPI({ upiId, name = '', amount = '', note = '' }) {
  const params = new URLSearchParams({ pa: upiId })
  if (name)   params.set('pn', name)
  if (amount) params.set('am', amount)
  if (note)   params.set('tn', note)
  params.set('cu', 'INR')
  return `upi://pay?${params.toString()}`
}

/** Map of type key → formatter function */
export const FORMATTERS = {
  url:      formatURL,
  text:     formatText,
  phone:    formatPhone,
  email:    formatEmail,
  wifi:     formatWifi,
  contact:  formatVCard,
  location: formatGeo,
  upi:      formatUPI,
}
