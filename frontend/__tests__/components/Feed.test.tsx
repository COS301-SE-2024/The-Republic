import { render, screen } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import Home from '@/app/(home)/page';
import Feed from '@/components/Feed/Feed';

jest.mock('@/components/Feed/Feed', () => jest.fn(() => <div>Mocked Feed</div>));

describe('Home Page', () => {
  it('renders the Feed component with showInputBox set to true', () => {
    render(<Home />);
    expect(Feed).toHaveBeenCalledWith({ showInputBox: true }, {});
    expect(screen.getByText('Mocked Feed')).not.toBeNull();
  });
});
