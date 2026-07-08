import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '@/api/products/endpoints'
import { defaultProductListParams } from './useProductListParams'
import { fetchProducts, PAGE_SIZE } from './useProducts'

vi.mock('@/api/products/endpoints', () => ({
  getProducts: vi.fn(),
  getProductsByCategory: vi.fn(),
  searchProducts: vi.fn(),
  getCategories: vi.fn(),
}))

function params(
  overrides: Partial<typeof defaultProductListParams> = {},
): typeof defaultProductListParams {
  return { ...defaultProductListParams, ...overrides }
}

describe('fetchProducts endpoint selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses the plain list endpoint when neither q nor category is set', () => {
    void fetchProducts(params())

    expect(getProducts).toHaveBeenCalledWith(
      { limit: PAGE_SIZE, skip: 0 },
      undefined,
    )
    expect(searchProducts).not.toHaveBeenCalled()
    expect(getProductsByCategory).not.toHaveBeenCalled()
  })

  it('uses the search endpoint when q is set', () => {
    void fetchProducts(params({ q: 'phone', page: 2 }))

    expect(searchProducts).toHaveBeenCalledWith(
      { q: 'phone', limit: PAGE_SIZE, skip: PAGE_SIZE },
      undefined,
    )
    expect(getProducts).not.toHaveBeenCalled()
  })

  it('uses the category endpoint when category is set', () => {
    void fetchProducts(params({ category: 'laptops' }))

    expect(getProductsByCategory).toHaveBeenCalledWith(
      'laptops',
      { limit: PAGE_SIZE, skip: 0 },
      undefined,
    )
    expect(getProducts).not.toHaveBeenCalled()
  })

  it('includes sortBy and order only when sorting is active', () => {
    void fetchProducts(params({ sortBy: 'price', order: 'desc' }))

    expect(getProducts).toHaveBeenCalledWith(
      { limit: PAGE_SIZE, skip: 0, sortBy: 'price', order: 'desc' },
      undefined,
    )
  })

  it('computes skip from the page number', () => {
    void fetchProducts(params({ page: 4 }))

    expect(getProducts).toHaveBeenCalledWith(
      { limit: PAGE_SIZE, skip: 3 * PAGE_SIZE },
      undefined,
    )
  })

  it('forwards the abort signal', () => {
    const controller = new AbortController()

    void fetchProducts(params(), controller.signal)

    expect(getProducts).toHaveBeenCalledWith(
      { limit: PAGE_SIZE, skip: 0 },
      controller.signal,
    )
  })
})
