import { afterEach, describe, expect, it, vi } from 'vitest'

import { scrollToTop } from './scrollToTop'

const mockMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ matches })
}

describe('scrollToTop', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('scrolls to the top smoothly by default', () => {
    mockMatchMedia(false)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    scrollToTop()

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('jumps instantly when the user prefers reduced motion', () => {
    mockMatchMedia(true)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    scrollToTop()

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })
})
