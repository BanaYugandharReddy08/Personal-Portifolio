import { useEffect, useState, useRef } from 'react';
import { useDocs } from '../context/DocsContext';
import { useAuth } from '../context/AuthContext';
import './ResumeAndCoverPage.css';

/* files live in PUBLIC_URL so they work in dev & production builds */
const DOCS = {
  resume:      { label: 'CV',           fallback: 'resume.pdf' },
  coverLetter: { label: 'Cover Letter', fallback: 'coverletter.pdf' },
};

const ResumeAndCoverPage = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [canEmbed,  setCanEmbed]  = useState(true);
  const [animate,   setAnimate]   = useState(false);
  const { user } = useAuth();
  const { fetchLatest, uploadDoc } = useDocs();
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [urls, setUrls] = useState({
    resume: `${process.env.PUBLIC_URL}/resume.pdf`,
    coverLetter: `${process.env.PUBLIC_URL}/coverletter.pdf`,
  });
  const fetchedRef = useRef({});

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  /* 1️⃣ kick-off entrance animation once */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  useEffect(() => {
    if (fetchedRef.current[activeTab]) return;

    fetchedRef.current[activeTab] = true;
    let cancelled = false;

    fetchLatest(activeTab)
      .then((url) => {
        if (!cancelled && url) {
          setUrls((prev) => ({ ...prev, [activeTab]: url }));
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, fetchLatest]);

  /* 2️⃣ check once if the browser can embed PDFs */
  useEffect(() => {
    setCanEmbed(Boolean(navigator.mimeTypes?.['application/pdf']));
  }, []);

  /* 3️⃣ handy references */
  const { label, fallback } = DOCS[activeTab];
  const fileURL = urls[activeTab] || `${process.env.PUBLIC_URL}/${fallback}`;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const { success } = await uploadDoc(activeTab, selectedFile);
    if (success) {
      const url = await fetchLatest(activeTab);
      if (url) {
        setUrls((prev) => ({ ...prev, [activeTab]: url }));
        fetchedRef.current[activeTab] = true;
      }
      showNotification(`${DOCS[activeTab].label} uploaded successfully`);
    } else {
      showNotification(`Failed to upload ${DOCS[activeTab].label}`, 'error');
    }
    setSelectedFile(null);
  };

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
            {Object.entries(DOCS).map(([key, { label }]) => (
              <button
                key={key}
                className={`tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
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

        {user?.role === 'admin' && (
          <div className="certificate-form-container" style={{ marginTop: '2rem' }}>
            {notification && (
              <div className={`notification ${notification.type}`}>{notification.message}</div>
            )}
            <form className="certificate-form" onSubmit={handleUpload}>
              <div className="form-group">
                <label htmlFor="docUpload">Upload {label}</label>
                <input
                  id="docUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="button">
                  Upload
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAndCoverPage;
