import { useState, useEffect, useCallback } from 'react'

/**
 * useLocalStorage
 * Generic hook that syncs state with localStorage.
 *
 * @param {string} key          - localStorage key
 * @param {*}      initialValue - default value when key is absent
 * @returns {[value, setter]}   - same API as useState
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.warn(`useLocalStorage: failed to write key "${key}"`, err)
    }
  }, [key, storedValue])

  // Keep in sync if another tab changes the same key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue !== null ? JSON.parse(e.newValue) : initialValue)
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, initialValue])

  return [storedValue, setValue]
}
