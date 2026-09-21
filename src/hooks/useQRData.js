import { useState, useMemo, useCallback } from 'react'
import { FORMATTERS } from '../utils/formatters'
import { VALIDATORS } from '../utils/validators'

/** Default empty fields per QR type */
const DEFAULT_FIELDS = {
  url:      { url: '' },
  text:     { text: '' },
  phone:    { phone: '' },
  email:    { email: '', subject: '', body: '' },
  wifi:     { ssid: '', password: '', security: 'WPA', hidden: false },
  contact:  { firstName: '', lastName: '', phone: '', email: '', org: '', url: '' },
  location: { lat: '', lng: '' },
  upi:      { upiId: '', name: '', amount: '', note: '' },
}

/** Default QR render options */
const DEFAULT_OPTIONS = {
  size: 256,
  fgColor: '#000000',
  bgColor: '#ffffff',
  level: 'M',   // error correction: L | M | Q | H
  marginSize: 1,
}

function hasMeaningfulInput(type, fields) {
  if (!fields) return false
  switch (type) {
    case 'wifi':
      return Boolean((fields.ssid && fields.ssid.trim()) || (fields.password && fields.password.trim()))
    case 'email':
      return Boolean(fields.email && fields.email.trim())
    case 'location':
      return Boolean((fields.lat && String(fields.lat).trim()) || (fields.lng && String(fields.lng).trim()))
    case 'contact':
      return Boolean(
        (fields.firstName && fields.firstName.trim()) ||
        (fields.lastName && fields.lastName.trim()) ||
        (fields.phone && fields.phone.trim()) ||
        (fields.email && fields.email.trim())
      )
    default:
      return Object.entries(fields).some(([k, v]) => {
        if (k === 'security' || k === 'hidden') return false
        return v !== null && v !== undefined && String(v).trim() !== '' && v !== false
      })
  }
}

/**
 * useQRData
 * Central state hook for QR Studio.
 */
export function useQRData() {
  const [selectedType, setSelectedType] = useState('url')
  const [allFields, setAllFields] = useState(DEFAULT_FIELDS)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)

  // Current type's fields
  const fields = allFields[selectedType]

  // Derived: validate → format → qrString
  const { qrString, error } = useMemo(() => {
    const validate = VALIDATORS[selectedType]
    const format   = FORMATTERS[selectedType]

    // If user hasn't entered meaningful input, show neutral empty state
    if (!hasMeaningfulInput(selectedType, fields)) {
      return { qrString: '', error: '' }
    }

    const result = validate ? validate(fields) : { valid: true, message: '' }
    if (!result.valid) return { qrString: '', error: result.message }

    const formatted = format ? format(fields) : ''
    return { qrString: formatted || '', error: '' }
  }, [selectedType, fields])

  const setType = useCallback((type) => {
    setSelectedType(type)
  }, [])

  const setField = useCallback((key, value) => {
    setAllFields((prev) => ({
      ...prev,
      [selectedType]: { ...prev[selectedType], [key]: value },
    }))
  }, [selectedType])

  const setFieldsBulk = useCallback((newFields) => {
    setAllFields((prev) => ({
      ...prev,
      [selectedType]: { ...prev[selectedType], ...newFields },
    }))
  }, [selectedType])

  const resetFields = useCallback(() => {
    setAllFields((prev) => ({
      ...prev,
      [selectedType]: { ...DEFAULT_FIELDS[selectedType] },
    }))
  }, [selectedType])

  const setOption = useCallback((key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }, [])

  const setOptionsBulk = useCallback((newOptions) => {
    setOptions((prev) => ({ ...prev, ...newOptions }))
  }, [])

  const restoreState = useCallback((type, targetFields, targetOptions) => {
    if (type) setSelectedType(type)
    if (targetFields && type) {
      setAllFields((prev) => ({
        ...prev,
        [type]: { ...targetFields },
      }))
    }
    if (targetOptions) {
      setOptions((prev) => ({ ...prev, ...targetOptions }))
    }
  }, [])

  return {
    selectedType,
    fields,
    qrString,
    error,
    options,
    setType,
    setField,
    setFields: setFieldsBulk,
    setOption,
    setOptionsBulk,
    restoreState,
    resetFields,
  }
}
