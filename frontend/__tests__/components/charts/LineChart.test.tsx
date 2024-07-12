import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';
import LineChart from '@/components/ReportCharts/LineChart/LineChart';
import * as echarts from 'echarts';

jest.mock('echarts');

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({ user: { id: 'user-id' }, session: 'session-token', error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

describe('LineChart', () => {
  const mockEchartsInstance = {
    setOption: jest.fn(),
    dispose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (echarts.init as jest.Mock).mockReturnValue(mockEchartsInstance);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders the chart and sets options correctly', async () => {
    render(<LineChart />);
    await waitFor(() => {
      expect(echarts.init).toHaveBeenCalled();
      expect(mockEchartsInstance.setOption).toHaveBeenCalled();
    });
  });

  it('updates the chart options on data change', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          data: {
            "2024-01-01": [{}, {}],
            "2024-01-02": [{}, {}, {}],
            "2024-01-03": [{}],
          }
        })
      })
    ) as jest.Mock;

    render(<LineChart />);

    await waitFor(() => {
      expect(mockEchartsInstance.setOption).toHaveBeenCalledTimes(1); // Called once after data fetch
    });
  });
});
