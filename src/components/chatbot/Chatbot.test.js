import { render, screen, fireEvent } from '../../test-utils';
import Chatbot from './Chatbot.jsx';

describe('Chatbot', () => {
  test('responds with matching answer', () => {
    render(
      <>
        <section id="skills">Skilled in React and Node.js.</section>
        <Chatbot />
      </>
    );
    fireEvent.change(screen.getByLabelText(/type your question/i), {
      target: { value: 'Tell me about your skills' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText(/Skilled in React/i)).toBeInTheDocument();
  });

  test('falls back when no match', () => {
    render(<Chatbot />);
    fireEvent.change(screen.getByLabelText(/type your question/i), {
      target: { value: 'What is your favorite color?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(
      screen.getByText(/please feel free to email me/i)
    ).toBeInTheDocument();
  });
});
