import Chatbot from '../components/chatbot/Chatbot';
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
