import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getProducts } from '../../../api/products/endpoints'
import type { ProductListParams } from './useProductListParams'

export const PAGE_SIZE = 12

export function useProducts(params: ProductListParams) {
  const requestParams = {
    limit: PAGE_SIZE,
    skip: (params.page - 1) * PAGE_SIZE,
    ...(params.sortBy ? { sortBy: params.sortBy, order: params.order } : {}),
  }

  return useQuery({
    queryKey: [
      'products',
      { q: params.q, category: params.category, ...requestParams },
    ],
    queryFn: ({ signal }) => getProducts(requestParams, signal),
    placeholderData: keepPreviousData,
  })
}
