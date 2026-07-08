import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Product, ProductListResponse } from '@/api/products/dto'
import {
  getCategories,
  getProducts,
  searchProducts,
} from '@/api/products/endpoints'
import { ProductsPage } from './ProductsPage'

vi.mock('@/api/products/endpoints', () => ({
  getProducts: vi.fn(),
  getProductsByCategory: vi.fn(),
  searchProducts: vi.fn(),
  getCategories: vi.fn(),
}))

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Test Product',
    description: 'A product used in tests',
    price: 9.99,
    rating: 4.5,
    thumbnail: 'https://example.com/thumbnail.webp',
    category: 'beauty',
    brand: 'Acme',
    ...overrides,
  }
}

function makeResponse(products: Product[]): ProductListResponse {
  return { products, total: products.length, skip: 0, limit: 12 }
}

function renderProductsPage(initialEntry = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createMemoryRouter(
    [{ path: '/', element: <ProductsPage /> }],
    { initialEntries: [initialEntry] },
  )

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCategories).mockResolvedValue([
      {
        slug: 'beauty',
        name: 'Beauty',
        url: 'https://dummyjson.com/products/category/beauty',
      },
    ])
  })

  it('shows the skeleton first, then the fetched products', async () => {
    vi.mocked(getProducts).mockResolvedValue(makeResponse([makeProduct()]))

    renderProductsPage()

    expect(
      screen.getByRole('status', { name: 'Loading products' }),
    ).toBeInTheDocument()

    expect(await screen.findByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('1 products found')).toBeInTheDocument()
    expect(
      screen.queryByRole('status', { name: 'Loading products' }),
    ).not.toBeInTheDocument()
  })

  it('shows the empty state with a clear action when the API returns zero results', async () => {
    const user = userEvent.setup()
    vi.mocked(searchProducts).mockResolvedValue(makeResponse([]))
    vi.mocked(getProducts).mockResolvedValue(makeResponse([makeProduct()]))

    renderProductsPage('/?q=xyz')

    const emptyState = (
      await screen.findByText('No results for “xyz”')
    ).closest('div') as HTMLElement
    const clearButton = within(emptyState).getByRole('button', {
      name: 'Clear filters',
    })

    // Clearing filters drops the search query and falls back to the plain list.
    await user.click(clearButton)

    expect(await screen.findByText('Test Product')).toBeInTheDocument()
    expect(getProducts).toHaveBeenCalled()
  })

  it('shows the error state and recovers via the retry button', async () => {
    const user = userEvent.setup()
    vi.mocked(getProducts)
      .mockRejectedValueOnce(new Error('Boom'))
      .mockResolvedValueOnce(makeResponse([makeProduct()]))

    renderProductsPage()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Something went wrong')
    expect(alert).toHaveTextContent('Boom')

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Test Product')).toBeInTheDocument()
  })
})
