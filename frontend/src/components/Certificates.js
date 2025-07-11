import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCertificates } from '../context/CertificatesContext';
import '../pages/DashboardPage.css';
import '../pages/CertificationsPage.css';

const Certificates = () => {
  const { user } = useAuth();
  const {
    certificates,
    loading,
    error,
    addCertificate,
    updateCertificateById,
    deleteCertificateById,
    loadCertificates,
  } = useCertificates();

  useEffect(() => {
    loadCertificates();
  }, []);

  // admin state
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    issuer: '',
    date: '',
    category: 'Development',
    imageUrl: '',
    takeaway: '',
    status: 'In Progress',
    children: [],
  });
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // shared state
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['Development', 'Data', 'Cloud', 'Design', 'Academic', 'Other'];
  const filterCategories = ['All', ...categories];

  const isAdmin = user?.role === 'admin';

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCertificate({ ...newCertificate, [name]: value });
  };

  const handleModuleChange = (index, e) => {
    const { name, value } = e.target;
    const modules = newCertificate.children ? [...newCertificate.children] : [];
    modules[index] = { ...modules[index], [name]: value };
    setNewCertificate({ ...newCertificate, children: modules });
  };

  const handleAddModuleField = () => {
    const modules = newCertificate.children ? [...newCertificate.children] : [];
    modules.push({ id: '', title: '', takeaway: '', certificateLink: '', status: 'In Progress' });
    setNewCertificate({ ...newCertificate, children: modules });
  };

  const handleRemoveModuleField = (index) => {
    const modules = newCertificate.children ? [...newCertificate.children] : [];
    modules.splice(index, 1);
    setNewCertificate({ ...newCertificate, children: modules });
  };

  const handleAddCertificate = async () => {
    if (!newCertificate.title || !newCertificate.issuer) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    const certificate = {
      ...newCertificate,
      id: Date.now().toString(),
    };
    if (!certificate.date) {
      delete certificate.date;
    }
    const { success } = await addCertificate(certificate);
    if (!success) {
      showNotification('Failed to add certificate', 'error');
      return;
    }
    setNewCertificate({
      title: '',
      issuer: '',
      date: '',
      category: 'Development',
      imageUrl: '',
      takeaway: '',
      status: 'In Progress',
      children: [],
    });
    setIsAddingCertificate(false);
    showNotification("Certificate published—nice one! It's now visible on your Certifications page.");
  };

  const handleEditCertificate = (id) => {
    setEditingId(id);
    const certificate = certificates.find((cert) => cert.id === id);
    setNewCertificate({
      status: 'In Progress',
      children: [],
      ...certificate,
    });
    setIsAddingCertificate(true);
  };

  const handleAddModuleClick = (id) => {
    const certificate = certificates.find((cert) => cert.id === id);
    const modules = certificate.children ? [...certificate.children] : [];
    modules.push({ id: '', title: '', takeaway: '', certificateLink: '', status: 'In Progress' });
    setEditingId(id);
    setNewCertificate({
      status: 'In Progress',
      children: modules,
      ...certificate,
    });
    setIsAddingCertificate(true);
  };

  const handleEditModulesClick = (id) => {
    const certificate = certificates.find((cert) => cert.id === id);
    setEditingId(id);
    setNewCertificate({
      status: 'In Progress',
      children: certificate.children ? [...certificate.children] : [],
      ...certificate,
    });
    setIsAddingCertificate(true);
  };

  const handleSaveEdit = async () => {
    const updated = { ...newCertificate };
    if (!updated.date) {
      delete updated.date;
    }
    const { success } = await updateCertificateById(editingId, updated);
    if (!success) {
      showNotification('Failed to update certificate', 'error');
      return;
    }
    setEditingId(null);
    setIsAddingCertificate(false);
    setNewCertificate({
      title: '',
      issuer: '',
      date: '',
      category: 'Development',
      imageUrl: '',
      takeaway: '',
      status: 'In Progress',
      children: [],
    });
    showNotification('Certificate updated successfully');
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = async () => {
    const { success } = await deleteCertificateById(confirmDelete);
    if (success) {
      showNotification('Certificate deleted successfully');
    } else {
      showNotification('Failed to delete certificate', 'error');
    }
    setConfirmDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const currentDate = new Date();
  const hours = currentDate.getHours();
  let greeting = 'Evening';
  if (hours < 12) {
    greeting = 'Morning';
  } else if (hours < 18) {
    greeting = 'Afternoon';
  }

  const filteredCertificates =
    filter === 'All' ? certificates : certificates.filter((c) => c.category === filter);

  if (isAdmin) {
    return (
      <div className="dashboard-certificates">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>
              {greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p className="dashboard-stats">
              {certificates.length} certificates, last updated{' '}
              {new Date().toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <button
            className="button"
            onClick={() => {
              setIsAddingCertificate(true);
              setEditingId(null);
              setNewCertificate({
                title: '',
                issuer: '',
                date: '',
                category: 'Development',
                imageUrl: '',
                takeaway: '',
                status: 'In Progress',
                children: [],
              });
            }}
          >
            Add New Certificate
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {notification && (
          <div className={`notification ${notification.type}`}>{notification.message}</div>
        )}

        {confirmDelete && (
          <div className="confirm-dialog">
            <div className="confirm-dialog-content">
              <h3>Remove this certificate?</h3>
              <p>This action can't be undone, but you can always re-upload it later.</p>
              <div className="confirm-dialog-actions">
                <button onClick={handleCancelDelete} className="button outline">
                  Cancel
                </button>
                <button onClick={handleConfirmDelete} className="button accent">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddingCertificate ? (
          <div className="certificate-form-container">
            <h2>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h2>
            <div className="certificate-form">
              <div className="form-group">
                <label htmlFor="title">Certificate Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCertificate.title}
                  onChange={handleInputChange}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="issuer">Issuing Organization*</label>
                <input
                  type="text"
                  id="issuer"
                  name="issuer"
                  value={newCertificate.issuer}
                  onChange={handleInputChange}
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date Received</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newCertificate.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newCertificate.category}
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="imageUrl">Certificate Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={newCertificate.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newCertificate.status}
                  onChange={handleInputChange}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="takeaway">
                  Brief Takeaway{' '}
                  <span className="char-count">{newCertificate.takeaway.length}/140</span>
                </label>
                <textarea
                  id="takeaway"
                  name="takeaway"
                  value={newCertificate.takeaway}
                  onChange={handleInputChange}
                  placeholder="What you learned (max 140 characters)"
                  maxLength={140}
                  rows={3}
                />
              </div>
              <div className="modules-section">
                <h3>Modules</h3>
                {newCertificate.children && newCertificate.children.length > 0 && (
                  <div className="module-list">
                    {newCertificate.children.map((mod, idx) => (
                      <div className="module-item" key={idx}>
                        <input
                          type="text"
                          name="id"
                          placeholder="Module ID"
                          value={mod.id}
                          onChange={(e) => handleModuleChange(idx, e)}
                        />
                        <input
                          type="text"
                          name="title"
                          placeholder="Title"
                          value={mod.title}
                          onChange={(e) => handleModuleChange(idx, e)}
                        />
                        <input
                          type="text"
                          name="takeaway"
                          placeholder="Takeaway"
                          value={mod.takeaway}
                          onChange={(e) => handleModuleChange(idx, e)}
                        />
                        <input
                          type="text"
                          name="certificateLink"
                          placeholder="Certificate Link"
                          value={mod.certificateLink}
                          onChange={(e) => handleModuleChange(idx, e)}
                        />
                        <select
                          name="status"
                          value={mod.status}
                          onChange={(e) => handleModuleChange(idx, e)}
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          type="button"
                          className="button outline"
                          onClick={() => handleRemoveModuleField(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" className="button secondary add-module-field" onClick={handleAddModuleField}>
                  Add Module
                </button>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="button outline"
                  onClick={() => {
                    setIsAddingCertificate(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={editingId ? handleSaveEdit : handleAddCertificate}
                >
                  {editingId ? 'Save Changes' : 'Add Certificate'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="certificates-container">
            {certificates.length === 0 ? (
              <div className="empty-state">
                <h3>You haven't uploaded any certificates yet.</h3>
                <p>Drag a PDF or image here, or click Browse to select a file.</p>
              </div>
            ) : (
              <div className="certificates-grid">
                {certificates.map((certificate) => (
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
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="certificate-details">
                      <h3>{certificate.title}</h3>
                      <p className="certificate-issuer">{certificate.issuer}</p>
                      <p className="certificate-date">
                        {new Date(certificate.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <span className="certificate-category">{certificate.category}</span>
                      {certificate.takeaway && (
                        <p className="certificate-takeaway">{certificate.takeaway}</p>
                      )}
                    </div>
                    <div className="certificate-actions">
                      <button
                        className="icon-button edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCertificate(certificate.id);
                        }}
                        aria-label="Edit certificate"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-button delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(certificate.id);
                        }}
                        aria-label="Delete certificate"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="module-card-actions">
                      <button className="button outline" onClick={(e) => { e.stopPropagation(); handleAddModuleClick(certificate.id); }}>
                        Add Module
                      </button>
                      <button className="button outline" onClick={(e) => { e.stopPropagation(); handleEditModulesClick(certificate.id); }}>
                        Edit Modules
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {selectedCertificate && (
          <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
            <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setSelectedCertificate(null)}>
                ×
              </button>

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
                  Date:{' '}
                  {new Date(selectedCertificate.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                <div className="certificate-takeaway-section">
                  <h3>What I Learned</h3>
                  <p>{selectedCertificate.takeaway || 'No summary available.'}</p>
                </div>

                {selectedCertificate.children && selectedCertificate.children.length > 0 && (
                  <div className="course-certifications">
                    <h3>Course Certifications</h3>
                    <p>
                      Here are the individual courses completed within the {selectedCertificate.title} Professional
                      Certificate program, along with their respective certificates:
                    </p>
                    <div className="course-cert-list">
                      {selectedCertificate.children.map((child) => (
                        <div className="course-card" key={child.id}>
                          <h4>{child.title}</h4>
                          <p>{child.takeaway}</p>
                          {child.status === 'In Progress' ? (
                            <p className="status ongoing">Status: {child.status}</p>
                          ) : (
                            <a href={child.certificateLink} target="_blank" rel="noopener noreferrer">
                              View Certificate
                            </a>
                          )}
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
    );
  }

  return (
    <div className="certifications-page">
      <div className="container">
        <div className="certifications-header">
          <h1>Professional &amp; Academic Certifications</h1>
          <p className="intro-text">
            Below is a curated gallery of every professional course I've completed. Click any tile to view the certificate and a 'What I learned' summary.
          </p>

          {user?.role === 'guest' && (
            <div className="guest-notice">
              <p>
                Welcome! You now have read-only access. Certificates and profile data always stay fresh—no refresh needed.
              </p>
            </div>
          )}

          <div className="filter-controls">
            <div className="categories-filter">
              {filterCategories.map((category) => (
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
            filteredCertificates.map((certificate) => (
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
                      month: 'long',
                    })}
                    {certificate.status === 'In Progress' ? ' (Expected Finish Date)' : ''}
                  </p>
                  <p className={'certificate-' + (certificate.status === 'In Progress' ? 'ongoing' : 'completed')}>
                    {certificate.status}
                  </p>
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
            <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setSelectedCertificate(null)}>
                ×
              </button>

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
                  Date:{' '}
                  {new Date(selectedCertificate.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                <div className="certificate-takeaway-section">
                  <h3>What I Learned</h3>
                  <p>{selectedCertificate.takeaway || 'No summary available.'}</p>
                </div>

                {selectedCertificate.children && selectedCertificate.children.length > 0 && (
                  <div className="course-certifications">
                    <h3>Course Certifications</h3>
                    <p>
                      Here are the individual courses completed within the {selectedCertificate.title} Professional
                      Certificate program, along with their respective certificates:
                    </p>
                    <div className="course-cert-list">
                      {selectedCertificate.children.map((child) => (
                        <div className="course-card" key={child.id}>
                          <h4>{child.title}</h4>
                          <p>{child.takeaway}</p>
                          {child.status === 'In Progress' ? (
                            <p className="status ongoing">Status: {child.status}</p>
                          ) : (
                            <a href={child.certificateLink} target="_blank" rel="noopener noreferrer">
                              View Certificate
                            </a>
                          )}
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

export default Certificates;
