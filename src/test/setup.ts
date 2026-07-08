import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Tests import Vitest helpers explicitly (no `globals: true`), so RTL cannot
// auto-register its cleanup — unmount the DOM after each test ourselves.
afterEach(() => {
  cleanup()
})
