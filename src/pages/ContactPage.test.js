import { render, screen, fireEvent, act } from '../test-utils';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows validation when required fields are empty', () => {
    render(<ContactPage />);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(
      screen.getByText(/fill in all required fields/i)
    ).toBeInTheDocument();
  });

  test('validates email format', () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Hi' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(
      screen.getByText(/valid email address/i)
    ).toBeInTheDocument();
  });

  test('submits successfully and clears form', () => {
    jest.useFakeTimers();
    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Hello there' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    const success = screen.getByText(/your message has been sent/i);
    expect(success).toBeInTheDocument();

    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/subject/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');

    act(() => {
      jest.runAllTimers();
    });

    expect(
      screen.queryByText(/your message has been sent/i)
    ).not.toBeInTheDocument();
  });
});
