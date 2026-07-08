import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getProducts } from '../../../api/products/endpoints'

export const PAGE_SIZE = 12

export function useProducts() {
  const params = { limit: PAGE_SIZE, skip: 0 }

  return useQuery({
    queryKey: ['products', params],
    queryFn: ({ signal }) => getProducts(params, signal),
    placeholderData: keepPreviousData,
  })
}
