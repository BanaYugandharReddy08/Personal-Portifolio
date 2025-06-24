import './YugiQuestPage.css';

const YugiQuestPage = () => (
  <div className="yugiquest-page">
    <iframe
      src="/yugi-quest/index.html"
      title="Yugi Quest"
      loading="lazy"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  </div>
);

export default YugiQuestPage;
