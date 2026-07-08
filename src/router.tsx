import { createBrowserRouter } from 'react-router'

import { ProductsPage } from '@/pages/ProductsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductsPage />,
  },
])
