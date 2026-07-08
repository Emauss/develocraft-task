import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { z } from 'zod'

export const SORT_FIELDS = ['title', 'price', 'rating'] as const
export type SortField = (typeof SORT_FIELDS)[number]
export type SortOrder = 'asc' | 'desc'

// Invalid or missing values never crash the page — they fall back to defaults.
export const productListParamsSchema = z.object({
  q: z.string().trim().catch(''),
  category: z.string().trim().catch(''),
  sortBy: z.enum(SORT_FIELDS).nullable().catch(null),
  order: z.enum(['asc', 'desc']).catch('asc'),
  page: z.coerce.number().int().min(1).catch(1),
})

export type ProductListParams = z.infer<typeof productListParamsSchema>

export const defaultProductListParams: ProductListParams = {
  q: '',
  category: '',
  sortBy: null,
  order: 'asc',
  page: 1,
}

export const parseProductListParams = (
  searchParams: URLSearchParams,
): ProductListParams => {
  const params = productListParamsSchema.parse({
    q: searchParams.get('q') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    sortBy: searchParams.get('sortBy') ?? undefined,
    order: searchParams.get('order') ?? undefined,
    page: searchParams.get('page') ?? undefined,
  })

  // DummyJSON cannot combine search with a category filter, so a hand-edited
  // URL carrying both resolves in favour of the search query.
  if (params.q && params.category) {
    return { ...params, category: '' }
  }

  return params
}

// Params with default values are omitted so URLs stay clean and shareable.
export const serializeProductListParams = (
  params: ProductListParams,
): URLSearchParams => {
  const searchParams = new URLSearchParams()
  if (params.q) {
    searchParams.set('q', params.q)
  }
  if (params.category) {
    searchParams.set('category', params.category)
  }
  if (params.sortBy) {
    searchParams.set('sortBy', params.sortBy)
  }
  if (params.order !== defaultProductListParams.order) {
    searchParams.set('order', params.order)
  }
  if (params.page > 1) {
    searchParams.set('page', String(params.page))
  }
  return searchParams
}

const FILTER_KEYS = ['q', 'category', 'sortBy', 'order'] as const

export const applyProductListParamsPatch = (
  current: ProductListParams,
  patch: Partial<ProductListParams>,
): ProductListParams => {
  const next = { ...current, ...patch }

  // Search and category filter are mutually exclusive (API limitation):
  // setting one clears the other.
  if (patch.q) {
    next.category = ''
  }
  if (patch.category) {
    next.q = ''
  }

  const changesFilters = FILTER_KEYS.some(
    (key) => key in patch && patch[key] !== current[key],
  )
  if (changesFilters && patch.page === undefined) {
    next.page = 1
  }

  return next
}

export const useProductListParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(
    () => parseProductListParams(searchParams),
    [searchParams],
  )

  const updateParams = useCallback(
    (patch: Partial<ProductListParams>, options?: { replace?: boolean }) => {
      setSearchParams(
        (current) =>
          serializeProductListParams(
            applyProductListParamsPatch(parseProductListParams(current), patch),
          ),
        options,
      )
    },
    [setSearchParams],
  )

  return { params, updateParams }
}
