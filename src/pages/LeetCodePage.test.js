import { render, screen, fireEvent } from '../test-utils';
import LeetCodePage from './LeetCodePage';

describe('LeetCodePage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('opens form and adds a new problem', () => {
    render(<LeetCodePage />);
    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Sample' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));
    expect(screen.getByText('Sample')).toBeInTheDocument();
  });

  test('editing pre-fills the form', () => {
    render(<LeetCodePage />);
    // open add form and create item
    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Old' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));

    // click edit for the newly created item
    fireEvent.click(screen.getByLabelText(/edit old/i));
    expect(screen.getByDisplayValue('Old')).toBeInTheDocument();
  });
});
