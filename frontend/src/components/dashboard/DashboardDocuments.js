import { useState, useEffect } from 'react';
import { useDocs } from '../../context/DocsContext';
import '../../pages/DashboardPage.css';

const DashboardDocuments = () => {
  const { docs, loading, error, loadDocs, uploadDoc } = useDocs();
  const [cvFile, setCvFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cvFile) {
      const { success } = await uploadDoc('resume', cvFile);
      if (success) {
        showNotification('CV uploaded successfully');
      } else {
        showNotification('Failed to upload CV', 'error');
      }
    }
    if (coverLetterFile) {
      const { success } = await uploadDoc('coverLetter', coverLetterFile);
      if (success) {
        showNotification('Cover Letter uploaded successfully');
      } else {
        showNotification('Failed to upload Cover Letter', 'error');
      }
    }
    setCvFile(null);
    setCoverLetterFile(null);
    await loadDocs();
  };

  const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

  let docsList = [];
  if (Array.isArray(docs)) {
    docsList = docs;
  } else if (docs && typeof docs === 'object') {
    docsList = Object.entries(docs).map(([type, data]) => ({
      id: data.id || type,
      type,
      fileName: data.fileName || data,
    }));
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="problems-section">
      <div className="dashboard-header">
        <h2>Documents</h2>
      </div>

      {error && <div className="error">{error}</div>}
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}

      {docsList.length > 0 && (
        <ul className="documents-list">
          {docsList.map((doc) => (
            <li key={doc.id}>
              <a
                href={`${baseURL}/documents/${doc.type}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.fileName || doc.type}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="certificate-form-container">
        <h2>Upload Documents</h2>
        <form className="certificate-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cvFile">CV</label>
            <input
              id="cvFile"
              type="file"
              accept="application/pdf"
              onChange={(e) => setCvFile(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <label htmlFor="coverLetterFile">Cover Letter</label>
            <input
              id="coverLetterFile"
              type="file"
              accept="application/pdf"
              onChange={(e) => setCoverLetterFile(e.target.files[0])}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="button">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardDocuments;
