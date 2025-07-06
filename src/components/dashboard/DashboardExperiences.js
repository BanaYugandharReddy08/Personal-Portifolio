import { useState, useEffect } from 'react';
import { useExperiences } from '../../context/ExperiencesContext';
import '../../pages/DashboardPage.css';

const initialForm = {
  position: '',
  company: '',
  period: '',
  description: '',
};

const DashboardExperiences = () => {
  const {
    experiences,
    loading,
    error,
    addExperience,
    updateExperienceById,
    deleteExperienceById,
    loadExperiences,
  } = useExperiences();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (experiences.length === 0) {
      loadExperiences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exp = {
      position: formData.position,
      company: formData.company,
      period: formData.period,
      description: formData.description,
    };

    if (editingId) {
      const { success } = await updateExperienceById(editingId, exp);
      if (success) {
        showNotification('Experience updated successfully');
      } else {
        showNotification('Failed to update experience', 'error');
        return;
      }
    } else {
      const { success } = await addExperience(exp);
      if (success) {
        showNotification('Experience added successfully');
      } else {
        showNotification('Failed to add experience', 'error');
        return;
      }
    }

    setFormData(initialForm);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (id) => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    setEditingId(id);
    setFormData({
      position: exp.position || '',
      company: exp.company || '',
      period: exp.period || '',
      description: exp.description || '',
    });
    setIsAdding(true);
  };

  const handleConfirmDelete = async () => {
    const { success } = await deleteExperienceById(confirmDelete);
    if (success) {
      showNotification('Experience deleted successfully');
    } else {
      showNotification('Failed to delete experience', 'error');
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }


  return (
    <div className="problems-section">
      <div className="dashboard-header">
        <h2>Experience</h2>
        <button
          className="button"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData(initialForm);
          }}
        >
          Add New Experience
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}

      {confirmDelete && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h3>Delete this experience?</h3>
            <p>This action can't be undone.</p>
            <div className="confirm-dialog-actions">
              <button onClick={() => setConfirmDelete(null)} className="button outline">Cancel</button>
              <button onClick={handleConfirmDelete} className="button accent">Delete</button>
            </div>
          </div>
        </div>
      )}

      {isAdding ? (
        <div className="certificate-form-container">
          <h2>{editingId ? 'Edit Experience' : 'Add New Experience'}</h2>
          <form className="certificate-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="position">Position*</label>
              <input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company*</label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="period">Period</label>
              <input
                id="period"
                name="period"
                type="text"
                value={formData.period}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="button outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                Cancel
              </button>
              <button type="submit" className="button">
                {editingId ? 'Save Changes' : 'Add New Experience'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="certificates-container">
          {experiences.length === 0 ? (
            <div className="empty-state">
              <h3>No experiences added yet.</h3>
            </div>
          ) : (
            <div className="certificates-grid">
              {experiences.map((exp) => (
                <div className="certificate-card" key={exp.id}>
                  <div className="certificate-details">
                    <h3>{exp.position}</h3>
                    <p className="certificate-issuer">{exp.company}</p>
                    {exp.period && (
                      <p className="certificate-date">{exp.period}</p>
                    )}
                    {exp.description && (
                      <p className="certificate-takeaway">{exp.description}</p>
                    )}
                  </div>
                  <div className="certificate-actions">
                    <button
                      className="icon-button edit-button"
                      onClick={() => handleEdit(exp.id)}
                      aria-label="Edit experience"
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-button delete-button"
                      onClick={() => setConfirmDelete(exp.id)}
                      aria-label="Delete experience"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardExperiences;
