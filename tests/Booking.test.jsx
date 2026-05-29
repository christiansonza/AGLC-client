import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, afterEach } from 'vitest';

import Booking from '../src/views/Booking';
import { renderWithProviders } from './testUtils';
import { server } from '../src/mocks/server';
import { http, HttpResponse } from 'msw';

// mock navigation
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

afterEach(() => {
  mockNavigate.mockClear();
});

describe('Booking (MSW Integration)', () => {
  test('renders bookings from MSW', async () => {
    renderWithProviders(<Booking />);
    expect(await screen.findByText('B001')).toBeInTheDocument();
  });

  test('opens modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Booking />);
    await user.click(screen.getByTitle('Add Booking'));
    expect(screen.getByText('Add Booking')).toBeInTheDocument();
  });

  test('creates booking and navigates', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Booking />);
    await user.click(screen.getByTitle('Add Booking'));
    await user.click(await screen.findByText('Select Customer'));
    const john = await screen.findAllByText(/John/i);
    await user.click(john[0]);
    await user.type(screen.getByLabelText(/remarks/i), 'Test remark');
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/editBooking/55');
    });
  });

  test('shows unauthorized error', async () => {
    // Override handler to simulate 401 Unauthorized
    server.use(
      http.get('http://localhost:4000/booking', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'Unauthorized. Please log in to proceed.' }),
          { status: 401 }
        );
      })
    );

    renderWithProviders(<Booking />);

    // Match the unauthorized message
    expect(
      await screen.findByText(/Unauthorized/i)
    ).toBeInTheDocument();

    // Assert the login link exists
    const loginLink = await screen.findByRole('link', { name: /log in/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
