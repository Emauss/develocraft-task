import { describe, expect, it } from 'vitest'

import {
  applyProductListParamsPatch,
  defaultProductListParams,
  parseProductListParams,
  serializeProductListParams,
} from './useProductListParams'

const params = (
  overrides: Partial<typeof defaultProductListParams> = {},
): typeof defaultProductListParams => {
  return { ...defaultProductListParams, ...overrides }
}

describe('parseProductListParams', () => {
  it('returns defaults for empty search params', () => {
    expect(parseProductListParams(new URLSearchParams())).toEqual(
      defaultProductListParams,
    )
  })

  it('parses valid values', () => {
    const result = parseProductListParams(
      new URLSearchParams('q=phone&sortBy=price&order=desc&page=3'),
    )

    expect(result).toEqual(
      params({ q: 'phone', sortBy: 'price', order: 'desc', page: 3 }),
    )
  })

  it('falls back to defaults for invalid values instead of crashing', () => {
    const result = parseProductListParams(
      new URLSearchParams('page=abc&sortBy=hack&order=up'),
    )

    expect(result).toEqual(defaultProductListParams)
  })

  it.each(['0', '-3', '1.5'])(
    'falls back to page 1 for invalid page %s',
    (page) => {
      expect(parseProductListParams(new URLSearchParams({ page })).page).toBe(1)
    },
  )

  it('trims surrounding whitespace from the query', () => {
    expect(parseProductListParams(new URLSearchParams('q=+phone+')).q).toBe(
      'phone',
    )
  })

  it('drops category when combined with q (API limitation: search wins)', () => {
    const result = parseProductListParams(
      new URLSearchParams('q=phone&category=laptops'),
    )

    expect(result.q).toBe('phone')
    expect(result.category).toBe('')
  })
})

describe('serializeProductListParams', () => {
  it('omits params with default values so URLs stay clean', () => {
    expect(
      serializeProductListParams(defaultProductListParams).toString(),
    ).toBe('')
  })

  it('serializes non-default values', () => {
    const result = serializeProductListParams(
      params({ category: 'laptops', sortBy: 'price', order: 'desc', page: 2 }),
    )

    expect(result.toString()).toBe(
      'category=laptops&sortBy=price&order=desc&page=2',
    )
  })

  it('omits the default ascending order even when sorting is active', () => {
    const result = serializeProductListParams(params({ sortBy: 'rating' }))

    expect(result.toString()).toBe('sortBy=rating')
  })

  it('round-trips through parse', () => {
    const original = params({ q: 'watch', sortBy: 'title', page: 4 })

    expect(
      parseProductListParams(serializeProductListParams(original)),
    ).toEqual(original)
  })
})

describe('applyProductListParamsPatch', () => {
  it('resets page to 1 when a filter changes', () => {
    const result = applyProductListParamsPatch(params({ page: 5 }), {
      q: 'phone',
    })

    expect(result.page).toBe(1)
  })

  it('keeps an explicitly patched page', () => {
    const result = applyProductListParamsPatch(params({ page: 5 }), {
      page: 3,
    })

    expect(result.page).toBe(3)
  })

  it('does not reset page when the patched value equals the current one', () => {
    const result = applyProductListParamsPatch(
      params({ q: 'phone', page: 5 }),
      { q: 'phone' },
    )

    expect(result.page).toBe(5)
  })

  it('clears category when q is set', () => {
    const result = applyProductListParamsPatch(
      params({ category: 'laptops' }),
      { q: 'phone' },
    )

    expect(result).toEqual(params({ q: 'phone', category: '' }))
  })

  it('clears q when category is set', () => {
    const result = applyProductListParamsPatch(params({ q: 'phone' }), {
      category: 'laptops',
    })

    expect(result).toEqual(params({ category: 'laptops', q: '' }))
  })

  it('keeps sorting when switching between search and category', () => {
    const result = applyProductListParamsPatch(
      params({ q: 'phone', sortBy: 'price', order: 'desc' }),
      { category: 'laptops' },
    )

    expect(result.sortBy).toBe('price')
    expect(result.order).toBe('desc')
  })
})
