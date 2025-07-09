import { render, screen, fireEvent, waitFor } from '../test-utils';
import LeetCodePage from './LeetCodePage';
import defaultProblems from '../data/leetcodeProblems';

describe('LeetCodePage', () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(defaultProblems) })
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  test('opens form and adds a new problem', async () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'Admin' }));
    render(<LeetCodePage />);
    await screen.findByText('Two Sum');
    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/lc id/i), { target: { value: '99' } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Sample' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));
    await screen.findByText('Sample');
  });

  test('editing pre-fills the form', async () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'Admin' }));
    render(<LeetCodePage />);
    await screen.findByText('Two Sum');
    // open add form and create item
    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/lc id/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Old' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));

    // click edit for the newly created item
    await screen.findByLabelText(/edit old/i);
    fireEvent.click(screen.getByLabelText(/edit old/i));
    expect(screen.getByDisplayValue('Old')).toBeInTheDocument();
  });

  test('updates total solved count when new problem is added', async () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'Admin' }));
    render(<LeetCodePage />);
    await screen.findByText('Two Sum');
    expect(screen.getByText(/total solved/i)).toHaveTextContent('3');

    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/lc id/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));

    await screen.findByText('Test');
    expect(screen.getByText(/total solved/i)).toHaveTextContent('4');
  });

  test('pagination controls navigate through pages', async () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'Admin' }));
    const manyProblems = Array.from({ length: 7 }, (_, i) => ({
      id: String(i + 1),
      lcId: String(i + 1),
      title: `Problem ${i + 1}`,
      difficulty: 'Easy',
      link: '#',
      dateSolved: '2024-01-01T00:00:00.000Z'
    }));
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(manyProblems)
    });
    render(<LeetCodePage />);
    await screen.findByText('Problem 5');

    // first page shows first five problems
    expect(screen.getByText('Problem 5')).toBeInTheDocument();
    expect(screen.queryByText('Problem 6')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText('Problem 6')).toBeInTheDocument();
    expect(screen.getByText('Problem 7')).toBeInTheDocument();
    expect(screen.queryByText('Problem 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(screen.getByText('Problem 1')).toBeInTheDocument();
  });

  test('deletes a problem after confirmation', async () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'Admin' }));
    render(<LeetCodePage />);
    await screen.findByText('Two Sum');
    fireEvent.click(screen.getByLabelText(/delete two sum/i));
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(screen.queryByText('Two Sum')).not.toBeInTheDocument());
  });

  test('hides editing controls for guests', async () => {
    render(<LeetCodePage />);
    await screen.findByText('Two Sum');
    expect(screen.queryByRole('button', { name: /add new problem/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/edit two sum/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/delete two sum/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/view two sum/i)).toBeInTheDocument();
  });
});
