import { useState, useEffect, useRef } from 'react';
import qaData from './qaData';
import './Chatbot.css';

const fallback = "I'm not sure how to answer that. Try asking about my skills, education or experience.";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! Ask me about my background or skills.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    const node = endRef.current;
    if (!node) return;
    const parent = node.parentElement;
    if (parent && parent.scrollHeight > parent.clientHeight) {
      parent.scrollTop = parent.scrollHeight - parent.clientHeight;
    }
  }, [messages]);

  const findAnswer = (q) => {
    const lower = q.toLowerCase();
    const match = qaData.find((qa) => lower.includes(qa.question.toLowerCase()));
    return match ? match.answer : fallback;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const user = { type: 'user', text: input.trim() };
    const bot = { type: 'bot', text: findAnswer(input.trim()) };
    setMessages((msgs) => [...msgs, user, bot]);
    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.type}`}>
            <span
              className="avatar"
              role="img"
              aria-label={m.type === 'user' ? 'interviewer' : 'developer'}
            >
              {m.type === 'user' ? '🧑\u200d💼' : '👨\u200d💻'}
            </span>
            <div className="message-text">{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question"
          aria-label="Type your question"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
