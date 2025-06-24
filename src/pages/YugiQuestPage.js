import './YugiQuestPage.css';

const YugiQuestPage = () => (
  <div className="yugi-quest-page">
    <div className="container">
      <iframe
        src="/yugi-quest/index.html"
        title="Yugi Quest"
        loading="lazy"
      />
    </div>
  </div>
);

export default YugiQuestPage;
