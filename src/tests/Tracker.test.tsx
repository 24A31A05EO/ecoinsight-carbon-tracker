import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tracker from '../pages/Tracker';
import { api } from '../services/api';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

vi.mock('../services/api', () => ({
  api: {
    logActivity: vi.fn()
  }
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('Tracker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input elements correctly', () => {
    render(
      <MemoryRouter>
        <Tracker />
      </MemoryRouter>
    );

    expect(screen.getByText('Carbon Tracker')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /LOG ACTIVITY/i })).toBeInTheDocument();
  });

  it('submits correctly', async () => {
    const user = userEvent.setup();
    (api.logActivity as any).mockResolvedValue({});

    render(
      <MemoryRouter>
        <Tracker />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('0.00');
    await user.type(input, '15');

    const submitBtn = screen.getByRole('button', { name: /LOG ACTIVITY/i });
    await user.click(submitBtn);

    expect(api.logActivity).toHaveBeenCalledWith('transport', 'car', 15);
    
    // Check loading state
    expect(screen.getByRole('button', { name: /Activity Saved/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/app');
    }, { timeout: 2000 });
  });
});
