import { useState, useEffect, useRef } from 'react';
import { extractKnowledgeBase, findBestMatch } from './utils';
import './Chatbot.css';

const fallback = "I'm not sure about that. Please feel free to email me your question at your-email@example.com.";

const Chatbot = () => {
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! Ask me anything about my work or skills.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    setKnowledgeBase(extractKnowledgeBase());
  }, []);

  useEffect(() => {
    const node = endRef.current;
    if (!node) return;
    const parent = node.parentElement;
    if (parent && parent.scrollHeight > parent.clientHeight) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    const user = { type: 'user', text: question };
    const match = findBestMatch(question, knowledgeBase);
    const bot = {
      type: 'bot',
      text: match ? match.text.slice(0, 300) : fallback,
    };
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
              {m.type === 'user' ? '🧑‍💼' : '🧑‍💻'}
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
