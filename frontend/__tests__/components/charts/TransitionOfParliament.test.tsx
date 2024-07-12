import React from 'react';
import { describe, expect } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';
import TransitionOfParliament from '@/components/ReportCharts/TransitionOfParliament/TransitionOfParliament';
import * as echarts from 'echarts';

jest.mock('echarts');

describe('TransitionOfParliament', () => {
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
    render(<TransitionOfParliament />);
  });

  it('updates the chart options on data change', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          data: {
            resolved: { category1: 10 },
            unresolved: { category1: 5 },
          }
        })
      })
    ) as jest.Mock;

    render(<TransitionOfParliament />);

    await waitFor(() => {
      expect(mockEchartsInstance.setOption).toHaveBeenCalledTimes(1);
    });
  });
});
