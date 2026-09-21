/**
 * validators.js
 * Per-type validation helpers.
 * Each returns { valid: boolean, message: string }
 */

const OK = { valid: true, message: '' }
const fail = (message) => ({ valid: false, message })

/**
 * URL validation
 * Accepts full URLs (https://...) or bare domains (example.com)
 */
export function validateURL(url) {
  const trimmed = (url || '').trim()
  if (!trimmed) return fail('Please enter a URL.')

  // Allow bare domains — prepend https:// for the URL constructor check
  const toTest = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(toTest)
    if (!parsed.hostname.includes('.')) return fail('URL must contain a valid domain.')
    return OK
  } catch {
    return fail('Please enter a valid URL (e.g. https://example.com).')
  }
}

/**
 * Text validation
 */
export function validateText(text) {
  if (!(text || '').trim()) return fail('Please enter some text.')
  if (text.length > 2953) return fail('Text is too long for a QR code (max ~2953 chars).')
  return OK
}

/**
 * Phone validation — E.164-ish
 */
export function validatePhone(phone) {
  const cleaned = (phone || '').replace(/[\s\-().]/g, '')
  if (!cleaned) return fail('Please enter a phone number.')
  if (!/^\+?\d{7,15}$/.test(cleaned)) return fail('Enter a valid phone number.')
  return OK
}

/**
 * Email validation
 */
export function validateEmail(email) {
  if (!(email || '').trim()) return fail('Please enter an email address.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email address.')
  return OK
}

/**
 * Wi-Fi validation
 */
export function validateWifi({ ssid, password, security }) {
  const cleanSsid = (ssid || '').trim()
  if (!cleanSsid) return fail('Network name (SSID) is required.')
  if (security !== 'nopass') {
    const cleanPass = (password || '').trim()
    if (!cleanPass) return fail('Password is required for secured networks.')
    if (security === 'WPA' && cleanPass.length < 8) {
      return fail('WPA/WPA2 password must be at least 8 characters.')
    }
  }
  return OK
}

/**
 * vCard validation
 */
export function validateVCard({ firstName, lastName }) {
  if (!(firstName || '').trim() && !(lastName || '').trim()) return fail('Please enter at least a first or last name.')
  return OK
}

/**
 * Geo validation
 */
export function validateGeo({ lat, lng }) {
  const latN = parseFloat(lat)
  const lngN = parseFloat(lng)
  if (isNaN(latN) || isNaN(lngN)) return fail('Enter valid latitude and longitude values.')
  if (latN < -90 || latN > 90) return fail('Latitude must be between -90 and 90.')
  if (lngN < -180 || lngN > 180) return fail('Longitude must be between -180 and 180.')
  return OK
}

/**
 * UPI validation
 */
export function validateUPI({ upiId }) {
  if (!(upiId || '').trim()) return fail('Please enter a UPI ID.')
  if (!/^[\w.\-]+@[\w]+$/.test(upiId)) return fail('Enter a valid UPI ID (e.g. name@upi).')
  return OK
}

/** Map of type key → validator function */
export const VALIDATORS = {
  url:      (f) => validateURL(f.url),
  text:     (f) => validateText(f.text),
  phone:    (f) => validatePhone(f.phone),
  email:    (f) => validateEmail(f.email),
  wifi:     validateWifi,
  contact:  validateVCard,
  location: validateGeo,
  upi:      validateUPI,
}
