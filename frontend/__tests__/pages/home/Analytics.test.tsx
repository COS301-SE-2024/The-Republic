import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from '@/app/(home)/analytics/page';

jest.mock('@/components/Visualisations/Visualizations', () => () => <div>Visualizations Component</div>);
jest.mock('@/components/ReportCharts/Reports', () => () => <div>Reports Component</div>);

describe('Tabs Component', () => {
  test('renders Reports tab by default', () => {
    render(<Tabs />);
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Reports Component')).toBeInTheDocument();
  });

  test('switches to Visualizations tab when clicked', () => {
    render(<Tabs />);
    fireEvent.click(screen.getByText('Visualizations'));
    expect(screen.getByText('Visualizations')).toBeInTheDocument();
    expect(screen.getByText('Visualizations Component')).toBeInTheDocument();
  });

  test('highlights the active tab correctly', () => {
    render(<Tabs />);
    const reportsTab = screen.getByText('Statistics');
    const visualizationsTab = screen.getByText('Visualizations');

    fireEvent.click(reportsTab);
    expect(reportsTab).toHaveClass('text-green-600');
    expect(visualizationsTab).not.toHaveClass('text-green-600');

    fireEvent.click(visualizationsTab);
    expect(reportsTab).not.toHaveClass('text-green-600');
    expect(visualizationsTab).toHaveClass('text-green-600');
  });
});
