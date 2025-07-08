import { useEffect, useState } from 'react';
import './ResumeAndCoverPage.css';
import { DocsProvider, useDocs } from '../context/DocsContext';

/* fallback file names for dev & production builds */
const FALLBACK_FILES = {
  resume: 'resume.pdf',
  coverLetter: 'coverletter.pdf',
};

const DOC_LABELS = {
  resume: 'CV',
  coverLetter: 'Cover Letter',
};

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const ResumeContent = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [canEmbed, setCanEmbed] = useState(true);
  const [animate, setAnimate] = useState(false);
  const { docs, loadDocs } = useDocs();

  /* 1️⃣ kick-off entrance animation once */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  /* 2️⃣ check once if the browser can embed PDFs */
  useEffect(() => {
    setCanEmbed(Boolean(navigator.mimeTypes?.['application/pdf']));
  }, []);

  /* 3️⃣ fetch document URLs on mount */
  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const label = DOC_LABELS[activeTab];
  const fileName = docs[activeTab]?.fileName;
  const fileURL = fileName
    ? `${API_BASE_URL}/documents/${activeTab}?${fileName}`
    : `${process.env.PUBLIC_URL}/${FALLBACK_FILES[activeTab]}`;

  return (
    <div className="resume-page">
      <div className="container">
        {/* ───────── header + tabs ───────── */}
        <div className={`resume-header fade-in-up ${animate ? 'run' : ''}`}>
          <h1>CV &amp; Cover Letter</h1>
          <p className="resume-intro">
            View or download my application documents below.
          </p>

          <div className="tabs">
            {Object.entries(DOC_LABELS).map(([key, lbl]) => (
              <button
                key={key}
                className={`tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* ───────── preview / fallback ───────── */}
        {canEmbed ? (
          <div className="pdf-frame fade-in-up run">
            <iframe
              title={label}
              src={`${fileURL}#toolbar=0&view=FitH`}
              loading="lazy"
              style={{ width: '100%', height: '80vh', border: 'none' }}
            />
          </div>
        ) : (
          <p className="no-preview fade-in-up run">
            Your browser can’t display PDFs inline.
            Use the button below to download the file.
          </p>
        )}

        {/* ───────── download ───────── */}
        <a
          href={fileURL}
          download
          className="button download-btn fade-in-up run"
        >
          ⬇️ Download {label}
        </a>
      </div>
    </div>
  );
};

const ResumeAndCoverPage = () => (
  <DocsProvider>
    <ResumeContent />
  </DocsProvider>
);

export default ResumeAndCoverPage;
