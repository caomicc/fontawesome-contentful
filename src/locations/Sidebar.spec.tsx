import Sidebar from './Sidebar';
import { render } from '@testing-library/react';
import { mockCma, mockSdk } from '../../test/mocks';
import { vi } from 'vitest';

vi.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe('Sidebar component', () => {
  it('Component text exists', () => {
    const { getByText } = render(<Sidebar />);

    expect(getByText('Hello Sidebar Component (AppId: test-app)')).toBeInTheDocument();
  });
});
