import { render, screen } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import Visualizations from '@/app/(home)/visualizations/page';

jest.mock('next/dynamic', () => jest.fn(() => {
  const Component = () => <div>Mocked EChartsComponent</div>;
  Component.displayName = 'EChartsComponent';
  return Component;
}));

describe('Visualizations Page', () => {
  it('renders the EChartsComponent component', () => {
    render(<Visualizations />);
    expect(screen.getByText('Mocked EChartsComponent')).not.toBeNull();
  });
});
