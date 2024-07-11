import { render } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import { ThemeProvider } from '@/components/theme-provider';

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );

    expect(getByText('Test Child')).not.toBeNull();
  });
});