import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const HISTORY_KEY = 'qrs-history'
const MAX_ENTRIES = 50

/**
 * useQRHistory
 * Manages the QR generation history in localStorage.
 *
 * Each entry: { id, type, label, qrString, fields, options, logoDataUrl, timestamp }
 */
export function useQRHistory() {
  const [history, setHistory] = useLocalStorage(HISTORY_KEY, [])

  /**
   * Add a new entry (deduplicates by qrString + type).
   * Most recent first. Caps at MAX_ENTRIES.
   */
  const addEntry = useCallback((entry) => {
    setHistory((prev) => {
      // Remove existing duplicate (same type + qrString)
      const deduped = prev.filter(
        (e) => !(e.type === entry.type && e.qrString === entry.qrString)
      )
      const newEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        ...entry,
      }
      return [newEntry, ...deduped].slice(0, MAX_ENTRIES)
    })
  }, [setHistory])

  const removeEntry = useCallback((id) => {
    setHistory((prev) => prev.filter((e) => e.id !== id))
  }, [setHistory])

  const clearAll = useCallback(() => {
    setHistory([])
  }, [setHistory])

  return { history, addEntry, removeEntry, clearAll }
}
