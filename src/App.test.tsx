import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { ProductListResponse } from './api/products/dto'
import App from './App'

vi.mock('./api/products/endpoints', () => ({
  getProducts: vi.fn(() =>
    Promise.resolve({
      products: [
        {
          id: 1,
          title: 'Test Product',
          description: 'A product used in tests',
          price: 9.99,
          rating: 4.5,
          thumbnail: 'https://example.com/thumbnail.webp',
          category: 'beauty',
          brand: 'Acme',
        },
      ],
      total: 1,
      skip: 0,
      limit: 12,
    } satisfies ProductListResponse),
  ),
}))

describe('App', () => {
  it('renders the products page with fetched products', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Products', level: 1 }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Test Product')).toBeInTheDocument()
  })
})
