import { render, screen, fireEvent } from '../../test-utils';
import Chatbot from './Chatbot';

describe('Chatbot', () => {
  test('responds with matching answer', () => {
    render(<Chatbot />);
    fireEvent.change(screen.getByLabelText(/type your question/i), {
      target: { value: 'Tell me about your skills' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText(/react, node\.js/i)).toBeInTheDocument();
  });

  test('falls back when no match', () => {
    render(<Chatbot />);
    fireEvent.change(screen.getByLabelText(/type your question/i), {
      target: { value: 'What is your favorite color?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(
      screen.getByText(/i'm not sure how to answer that/i)
    ).toBeInTheDocument();
  });
});
