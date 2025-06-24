import Chatbot from '../components/chatbot/Chatbot.js';
import './ChatPage.css';

const ChatPage = () => (
  <div className="chat-page">
    <div className="container">
      <h1>Interview Chat</h1>
      <Chatbot />
    </div>
  </div>
);

export default ChatPage;
