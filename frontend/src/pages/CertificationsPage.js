import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './CertificationsPage.css';
import DashboardCertificates from '../components/dashboard/DashboardCertificates';
import { CertificatesProvider } from '../context/CertificatesContext';

import defaultCertificates from '../data/certificates';
import { fetchCertificates } from '../services/api';


const CertificationsPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filter, setFilter] = useState('All');
  const { user } = useAuth();

  const categories = ['All', 'Development', 'Data', 'Cloud', 'Design', 'Academic'];

  useEffect(() => {
    if (user?.role === 'admin') {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCertificates()
      .then((data) => setCertificates(data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load certificates');
        setCertificates(defaultCertificates);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role === 'admin') {
    return (
      <div className="certifications-page">
        <div className="container">
          <CertificatesProvider>
            <DashboardCertificates />
          </CertificatesProvider>
        </div>
      </div>
    );
  }

  const filteredCertificates = filter === 'All'
    ? certificates
    : certificates.filter(cert => cert.category === filter);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="certifications-page">
      <div className="container">
        <div className="certifications-header">
          <h1>Professional & Academic Certifications</h1>
          <p className="intro-text">
            Below is a curated gallery of every professional course I've completed. Click any tile to view the certificate and a 'What I learned' summary.
          </p>
          
          {user?.role === 'guest' && (
            <div className="guest-notice">
              <p>Welcome! You now have read-only access. Certificates and profile data always stay fresh—no refresh needed.</p>
            </div>
          )}
          
          <div className="filter-controls">
            <div className="categories-filter">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-button ${filter === category ? 'active' : ''}`}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="certificates-grid">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map(certificate => (
              <div 
                className="certificate-card" 
                key={certificate.id}
                onClick={() => setSelectedCertificate(certificate)}
              >
                <div className="certificate-image">
                  {certificate.imageUrl ? (
                    <img src={certificate.imageUrl} alt={certificate.title} />
                  ) : (
                    <div className="certificate-placeholder">
                      <span>Certificate</span>
                    </div>
                  )}
                </div>
                <div className="certificate-details">
                  <h3>{certificate.title}</h3>
                  <p className="certificate-issuer">{certificate.issuer}</p>
                  <p className="certificate-date">
                    {new Date(certificate.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                    { certificate.status === 'In Progress' ? ' (Expected Finish Date)' : ''}
                  </p>
                  <p className={'certificate-' + (certificate.status === 'In Progress' ? 'ongoing' : 'completed')}>{certificate.status}</p>
                  <span className="certificate-category">{certificate.category}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No certificates found for this category.</p>
            </div>
          )}
        </div>
        
        {selectedCertificate && (
          <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
            <div className="certificate-modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={() => setSelectedCertificate(null)}>×</button>
              
              <div
                className="certificate-modal-image"
                style={selectedCertificate.imageUrl ? { backgroundImage: `url(${selectedCertificate.imageUrl})` } : {}}
              >
                {!selectedCertificate.imageUrl && (
                  <div className="certificate-placeholder large">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              
              <div className="certificate-modal-details">
                <h2>{selectedCertificate.title}</h2>
                <p className="certificate-issuer">Issued by {selectedCertificate.issuer}</p>
                <p className="certificate-date">
                  Date: {new Date(selectedCertificate.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                <div className="certificate-takeaway-section">
                  <h3>What I Learned</h3>
                  <p>{selectedCertificate.takeaway || "No summary available."}</p>
                </div>

                {selectedCertificate.children && selectedCertificate.children.length > 0 && (
                  <div className="course-certifications">
                    <h3>Course Certifications</h3>
                    <p>Here are the individual courses completed within the {selectedCertificate.title} Professional Certificate program, along with their respective certificates:</p>
                    <div className="course-cert-list">
                      {selectedCertificate.children.map(child => (
                      <div className="course-card" key={child.id}>
                        <h4>{child.title}</h4>
                        <p>{child.takeaway}</p>
                        {
                          child.status === 'In Progress' ?
                          <p className="status ongoing">Status: {child.status}</p> :
                          <a href={child.certificateLink} target='_blank' rel="noopener noreferrer">View Certificate</a>
                        }
                      </div>
                    ))}
                    </div>
                  
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;
