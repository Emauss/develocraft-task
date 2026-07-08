import { useEffect, useId, useRef, useState } from 'react'

import { useDebouncedValue } from '@/features/products/hooks/useDebouncedValue'
import styles from './SearchInput.module.scss'

const SEARCH_DEBOUNCE_MS = 350

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

// The URL stays the source of truth: local state is only a typing buffer
// that reaches the URL after the debounce delay.
export function SearchInput({ value, onChange }: SearchInputProps) {
  const inputId = useId()
  const [text, setText] = useState(value)
  const debouncedText = useDebouncedValue(text, SEARCH_DEBOUNCE_MS)
  const lastEmittedRef = useRef(value)

  // Emit debounced changes that originate from typing.
  useEffect(() => {
    const next = debouncedText.trim()
    if (next !== lastEmittedRef.current) {
      lastEmittedRef.current = next
      onChange(next)
    }
  }, [debouncedText, onChange])

  // Adopt external URL changes (back/forward navigation, cleared filters)
  // without clobbering what the user is currently typing.
  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value
      setText(value)
    }
  }, [value])

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={inputId}>
        Search
      </label>
      <input
        id={inputId}
        type="search"
        className={styles.input}
        placeholder="e.g. phone"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </div>
  )
}
