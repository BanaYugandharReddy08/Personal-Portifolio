import { render, screen, fireEvent } from '../test-utils';
import LeetCodePage from './LeetCodePage';

describe('LeetCodePage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('opens form and adds a new problem', () => {
    render(<LeetCodePage />);
    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/id/i), { target: { value: '99' } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Sample' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));
    expect(screen.getByText('Sample')).toBeInTheDocument();
  });

  test('editing pre-fills the form', () => {
    render(<LeetCodePage />);
    // open add form and create item
    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/id/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Old' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));

    // click edit for the newly created item
    fireEvent.click(screen.getByLabelText(/edit old/i));
    expect(screen.getByDisplayValue('Old')).toBeInTheDocument();
  });

  test('updates total solved count when new problem is added', () => {
    render(<LeetCodePage />);
    expect(screen.getByText(/total solved/i)).toHaveTextContent('3');

    fireEvent.click(screen.getByRole('button', { name: /add new problem/i }));
    fireEvent.change(screen.getByLabelText(/id/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /add problem/i }));

    expect(screen.getByText(/total solved/i)).toHaveTextContent('4');
  });

  test('pagination controls navigate through pages', () => {
    const manyProblems = Array.from({ length: 7 }, (_, i) => ({
      id: String(i + 1),
      lcId: String(i + 1),
      title: `Problem ${i + 1}`,
      difficulty: 'Easy',
      link: '#',
      dateSolved: '2024-01-01T00:00:00.000Z'
    }));
    localStorage.setItem('leetcodeProblems', JSON.stringify(manyProblems));
    render(<LeetCodePage />);

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
});
