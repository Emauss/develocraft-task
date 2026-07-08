import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders the windowed page buttons', () => {
    render(<Pagination page={6} totalPages={17} onPageChange={vi.fn()} />)

    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument()
    expect(
      screen
        .getAllByRole('button', { name: /^Page \d+$/ })
        .map((button) => button.textContent),
    ).toEqual(['1', '5', '6', '7', '17'])
  })

  it('marks the current page with aria-current', () => {
    render(<Pagination page={6} totalPages={17} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Page 6' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'Page 5' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('disables Previous on the first page', () => {
    render(<Pagination page={1} totalPages={17} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('disables Next on the last page', () => {
    render(<Pagination page={17} totalPages={17} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled()
  })

  it('calls onPageChange with the clicked page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={6} totalPages={17} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Page 7' }))
    await user.click(screen.getByRole('button', { name: 'Previous' }))
    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(onPageChange.mock.calls).toEqual([[7], [5], [7]])
  })

  it('renders nothing when there is a single page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
