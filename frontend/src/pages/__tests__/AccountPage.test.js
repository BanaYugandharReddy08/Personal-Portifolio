import { render, screen, fireEvent } from '../../test-utils';
import AccountPage from '../AccountPage';

describe('AccountPage', () => {
  const user = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(user));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('displays user details', () => {
    render(<AccountPage />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('opens edit form', () => {
    render(<AccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  test('shows validation errors', () => {
    render(<AccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });
});
