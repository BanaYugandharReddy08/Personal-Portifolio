import { render, screen, fireEvent } from '../../test-utils';
import Chatbot from './Chatbot.js';

describe('Chatbot', () => {
  test('responds with matching answer', () => {
    render(
      <>
        <section id="skills">Skilled in React and Node.js.</section>
        <section id="education">Completed MSc in Data Analytics.</section>
        <Chatbot />
      </>
    );
    fireEvent.change(screen.getByLabelText(/type your question/i), {
      target: { value: 'Tell me about your skills' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText(/Skilled in React/i)).toBeInTheDocument();
  });

  test('responds to education question', () => {
    render(
      <>
        <section id="education">Completed MSc in Data Analytics.</section>
        <Chatbot />
      </>
    );
    fireEvent.change(screen.getByLabelText(/type your question/i), {
      target: { value: 'What education do you have?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText(/Completed MSc/i)).toBeInTheDocument();
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

  test('does not scroll when chat is not overflowed', async () => {
    const original = Element.prototype.scrollIntoView;
    const spy = jest.fn();
    Element.prototype.scrollIntoView = spy;
    render(<Chatbot />);
    await screen.findByText(/ask me anything/i);
    expect(spy).not.toHaveBeenCalled();
    Element.prototype.scrollIntoView = original;
  });
});
