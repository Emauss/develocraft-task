import { useId } from 'react'

import {
  PAGE_SIZE_OPTIONS,
  type PageSize,
} from '@/features/products/hooks/useProductListParams'
import styles from './PageSizeSelect.module.scss'

type PageSizeSelectProps = {
  value: PageSize
  onChange: (value: PageSize) => void
}

export const PageSizeSelect = ({ value, onChange }: PageSizeSelectProps) => {
  const selectId = useId()

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={selectId}>
        Per page
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={value}
        onChange={(event) => {
          const next = PAGE_SIZE_OPTIONS.find(
            (option) => String(option) === event.target.value,
          )
          if (next) {
            onChange(next)
          }
        }}
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
