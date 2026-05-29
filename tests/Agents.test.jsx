import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'

import Agents from '../src/views/Agents'

// ========================
// MOCK RTK QUERY
// ========================
vi.mock('../src/features/agentSlice', () => ({
  useFetchAgentQuery: vi.fn(),
  useCreateAgentMutation: vi.fn(),
}))

import {
  useFetchAgentQuery,
  useCreateAgentMutation,
} from '../src/features/agentSlice'

// ========================
// MOCK NAVIGATION
// ========================
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// ========================
// MOCK TOAST
// ========================
vi.mock('react-toastify', () => ({
  ToastContainer: () => <div />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Agents Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========================
  // 1. RENDER LIST
  // ========================
  test('renders agent list', async () => {
    useFetchAgentQuery.mockReturnValue({
      data: [{ id: 1, name: 'John Agent' }],
      isLoading: false,
      isError: false,
    })

    useCreateAgentMutation.mockReturnValue([vi.fn()])

    render(
      <BrowserRouter>
        <Agents />
      </BrowserRouter>
    )

    expect(await screen.findByText('John Agent')).toBeInTheDocument()
  })

  // ========================
  // 2. OPEN MODAL
  // ========================
  test('opens modal', async () => {
    useFetchAgentQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })

    useCreateAgentMutation.mockReturnValue([vi.fn()])

    render(
      <BrowserRouter>
        <Agents />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTitle('Add Agent'))

    expect(screen.getByText('Add Agent')).toBeInTheDocument()
  })

  // ========================
  // 3. SEARCH FILTER
  // ========================
  test('search filters agents', async () => {
    useFetchAgentQuery.mockReturnValue({
      data: [
        { id: 1, name: 'John Agent' },
        { id: 2, name: 'Jane Smith' },
      ],
      isLoading: false,
      isError: false,
    })

    useCreateAgentMutation.mockReturnValue([vi.fn()])

    render(
      <BrowserRouter>
        <Agents />
      </BrowserRouter>
    )

    const searchInput = screen.getByPlaceholderText('Type to search...')

    await userEvent.type(searchInput, 'John')

    expect(screen.getByText('John Agent')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  // ========================
  // 4. CREATE AGENT (FIXED)
  // ========================
  test('creates new agent', async () => {
    const mockCreateAgent = vi.fn(() => ({
      unwrap: () =>
        Promise.resolve({
          message: 'Created Successfully.',
          data: { id: 99 },
        }),
    }))

    useFetchAgentQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })

    useCreateAgentMutation.mockReturnValue([mockCreateAgent])

    render(
      <BrowserRouter>
        <Agents />
      </BrowserRouter>
    )

    // open modal
    await userEvent.click(screen.getByTitle('Add Agent'))

    // stable selector (NO textbox conflicts anymore)
    const input = await screen.findByLabelText(/name/i)

    await userEvent.type(input, 'New Agent')

    await userEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockCreateAgent).toHaveBeenCalledWith({
        name: 'New Agent',
      })
    })

    expect(mockNavigate).toHaveBeenCalledWith('/editAgents/99')
  })

  // ========================
  // 5. UNAUTHORIZED ERROR
  // ========================
  test('shows unauthorized error', async () => {
    useFetchAgentQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: {
        status: 401,
      },
    })

    useCreateAgentMutation.mockReturnValue([vi.fn()])

    render(
      <BrowserRouter>
        <Agents />
      </BrowserRouter>
    )

    expect(
      screen.getByText(/Unauthorized/i)
    ).toBeInTheDocument()
  })
})