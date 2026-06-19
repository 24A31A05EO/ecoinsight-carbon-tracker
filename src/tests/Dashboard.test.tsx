import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { api } from '../services/api';

import { vi } from 'vitest';

// Mock the API service
vi.mock('../services/api', () => ({
  api: {
    getUserStats: vi.fn()
  }
}));

describe('Dashboard Component', () => {
  it('displays loading state initially', () => {
    // Return a promise that doesn't resolve immediately
    (api.getUserStats as any).mockReturnValue(new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Initializing Dashboard.../i)).toBeInTheDocument();
  });

  it('renders user stats after load', async () => {
    const mockStats = {
      eco_score: 950,
      total_footprint_kg: 45.2,
      activities: [],
      level: 4,
      current_xp: 3200,
      next_level_xp: 5000,
      daily_streak: 12,
      badges: []
    };

    (api.getUserStats as any).mockResolvedValue(mockStats);
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for the data to load and render
    await waitFor(() => {
      expect(screen.getByText(/Carbon Insights Active/i)).toBeInTheDocument();
    });

    // Check level and streak
    expect(screen.getByText('4')).toBeInTheDocument(); // Level
    expect(screen.getByText('12')).toBeInTheDocument(); // Streak
    
    // Check footprint
    expect(screen.getByText('45.2')).toBeInTheDocument();
  });
});
