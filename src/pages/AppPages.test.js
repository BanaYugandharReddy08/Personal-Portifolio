import { render, screen, fireEvent } from '../test-utils';
import HomePage from './HomePage';
import LoginPage from './LoginPage';

describe('Pages', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('HomePage shows hero heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /frontend dev/i })).toBeInTheDocument();
  });

  test('LoginPage form validation', () => {
    render(<LoginPage />);
    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(button);
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
