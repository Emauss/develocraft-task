import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { z } from 'zod'

export const SORT_FIELDS = ['title', 'price', 'rating'] as const
export type SortField = (typeof SORT_FIELDS)[number]
export type SortOrder = 'asc' | 'desc'

// The single source for both the URL schema and the page-size <select> options.
export const PAGE_SIZE_OPTIONS = [12, 24, 36, 48] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]
export const DEFAULT_PAGE_SIZE: PageSize = 12

const isPageSize = (value: number): value is PageSize =>
  (PAGE_SIZE_OPTIONS as readonly number[]).includes(value)

// Invalid or missing values never crash the page — they fall back to defaults.
export const productListParamsSchema = z.object({
  q: z.string().trim().catch(''),
  category: z.string().trim().catch(''),
  sortBy: z.enum(SORT_FIELDS).nullable().catch(null),
  order: z.enum(['asc', 'desc']).catch('asc'),
  limit: z.coerce.number().int().refine(isPageSize).catch(DEFAULT_PAGE_SIZE),
  page: z.coerce.number().int().min(1).catch(1),
})

export type ProductListParams = z.infer<typeof productListParamsSchema>

export const defaultProductListParams: ProductListParams = {
  q: '',
  category: '',
  sortBy: null,
  order: 'asc',
  limit: DEFAULT_PAGE_SIZE,
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
    limit: searchParams.get('limit') ?? undefined,
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
  if (params.limit !== defaultProductListParams.limit) {
    searchParams.set('limit', String(params.limit))
  }
  if (params.page > 1) {
    searchParams.set('page', String(params.page))
  }
  return searchParams
}

// Changing any of these makes the current page number meaningless, so page
// resets to 1 (e.g. a new page size or filter shifts what "page 5" even means).
const PAGE_RESET_KEYS = ['q', 'category', 'sortBy', 'order', 'limit'] as const

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

  const changesPageContext = PAGE_RESET_KEYS.some(
    (key) => key in patch && patch[key] !== current[key],
  )
  if (changesPageContext && patch.page === undefined) {
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
