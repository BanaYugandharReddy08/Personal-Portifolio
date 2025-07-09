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
  const [selectedFiles, setSelectedFiles] = useState({
    resume: null,
    coverLetter: null,
  });
  const [notification, setNotification] = useState(null);
  const [loadError, setLoadError] = useState(false);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (fetchedRef.current[activeTab]) return;

    fetchedRef.current[activeTab] = true;
    let cancelled = false;
    setLoadError(false);
    fetchLatest(activeTab)
      .then((url) => {
        if (cancelled) return;
        if (url) {
          setUrls((prev) => ({ ...prev, [activeTab]: url }));
        } else {
          setLoadError(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setLoadError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  /* 2️⃣ check once if the browser can embed PDFs */
  useEffect(() => {
    setCanEmbed(Boolean(navigator.mimeTypes?.['application/pdf']));
  }, []);

  /* 3️⃣ handy references */
  const { label, fallback } = DOCS[activeTab];
  const fileURL = urls[activeTab] || `${process.env.PUBLIC_URL}/${fallback}`;

  const handleUpload = (type) => async (e) => {
    e.preventDefault();
    const file = selectedFiles[type];
    if (!file) return;
    const { success } = await uploadDoc(type, file);
    if (success) {
      const url = await fetchLatest(type);
      if (url) {
        setUrls((prev) => ({ ...prev, [type]: url }));
        showNotification(`${DOCS[type].label} uploaded successfully`);
      } else {
        showNotification(`Failed to fetch latest ${DOCS[type].label}`, 'error');
        fetchedRef.current[type] = true;
      }
    } else {
      showNotification(`Failed to upload ${DOCS[type].label}`, 'error');
    }
    setSelectedFiles((prev) => ({ ...prev, [type]: null }));
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

        {loadError && (
          <div className="error fade-in-up run">
            Failed to load {label}. Showing default file.
          </div>
        )}

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

        {user?.role === 'admin' && activeTab === 'resume' && (
          <div className="certificate-form-container" style={{ marginTop: '2rem' }}>
            {notification && (
              <div className={`notification ${notification.type}`}>{notification.message}</div>
            )}
            <form className="certificate-form" onSubmit={handleUpload('resume')}>
              <div className="form-group">
                <label htmlFor="resumeUpload">Upload CV</label>
                <input
                  id="resumeUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setSelectedFiles((prev) => ({ ...prev, resume: e.target.files[0] }))
                  }
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="button">Upload</button>
              </div>
            </form>
          </div>
        )}

        {user?.role === 'admin' && activeTab === 'coverLetter' && (
          <div className="certificate-form-container" style={{ marginTop: '2rem' }}>
            {notification && (
              <div className={`notification ${notification.type}`}>{notification.message}</div>
            )}
            <form className="certificate-form" onSubmit={handleUpload('coverLetter')}>
              <div className="form-group">
                <label htmlFor="coverUpload">Upload Cover Letter</label>
                <input
                  id="coverUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setSelectedFiles((prev) => ({ ...prev, coverLetter: e.target.files[0] }))
                  }
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="button">Upload</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAndCoverPage;
