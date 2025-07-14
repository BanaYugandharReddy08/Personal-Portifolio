import { useState, useEffect } from 'react';
import { useExperiences } from '../../context/ExperiencesContext';
import '../../pages/DashboardPage.css';
import Card from '../shared/Card';

const initialForm = {
  position: '',
  company: '',
  startMonth: '',
  startYear: '',
  endMonth: '',
  endYear: '',
  currentlyWorking: false,
  skills: '',
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

  useEffect(() => {
    loadExperiences();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);


  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatDate = (year, month) => {
      if (!year || !month) return null;
      return `${year}-${String(month).padStart(2, '0')}-01`;
    };

    const exp = {
      position: formData.position,
      company: formData.company,
      startDate: formatDate(formData.startYear, formData.startMonth),
      endDate: formData.currentlyWorking
        ? null
        : formatDate(formData.endYear, formData.endMonth),
      currentlyWorking: formData.currentlyWorking,
      skills: formData.skills,
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
    const parseDate = (dateStr) => {
      if (!dateStr) return { year: '', month: '' };
      const d = new Date(dateStr);
      return { year: String(d.getFullYear()), month: String(d.getMonth() + 1) };
    };
    const start = parseDate(exp.startDate);
    const end = parseDate(exp.endDate);
    setFormData({
      position: exp.position || '',
      company: exp.company || '',
      startMonth: start.month,
      startYear: start.year,
      endMonth: end.month,
      endYear: end.year,
      currentlyWorking: exp.currentlyWorking || false,
      skills: exp.skills || '',
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

  const formatPeriod = (exp) => {
    const format = (d) =>
      d.toLocaleString('default', { month: 'short', year: 'numeric' });
    const start = exp.startDate ? format(new Date(exp.startDate)) : '';
    const end = exp.currentlyWorking
      ? 'Present'
      : exp.endDate
      ? format(new Date(exp.endDate))
      : '';
    return start && end ? `${start} - ${end}` : start || end;
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
              <label htmlFor="startMonth">Start Month</label>
              <select
                id="startMonth"
                name="startMonth"
                value={formData.startMonth}
                onChange={handleChange}
              >
                <option value="">Month</option>
                {[...Array(12).keys()].map((m) => (
                  <option key={m + 1} value={m + 1}>{m + 1}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="startYear">Start Year</label>
              <input
                id="startYear"
                name="startYear"
                type="number"
                value={formData.startYear}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="currentlyWorking">
                <input
                  id="currentlyWorking"
                  name="currentlyWorking"
                  type="checkbox"
                  checked={formData.currentlyWorking}
                  onChange={handleChange}
                />{' '}
                Currently Working
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="endMonth">End Month</label>
              <select
                id="endMonth"
                name="endMonth"
                value={formData.endMonth}
                onChange={handleChange}
                disabled={formData.currentlyWorking}
              >
                <option value="">Month</option>
                {[...Array(12).keys()].map((m) => (
                  <option key={m + 1} value={m + 1}>{m + 1}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="endYear">End Year</label>
              <input
                id="endYear"
                name="endYear"
                type="number"
                value={formData.endYear}
                onChange={handleChange}
                disabled={formData.currentlyWorking}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="skills">Skills (comma separated)</label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
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
                <Card
                  key={exp.id}
                  className="certificate-card"
                  title={exp.position}
                  subtitle={exp.company}
                  date={formatPeriod(exp)}
                  description={exp.description}
                  tags={exp.skills}
                  actions={
                    <>
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
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardExperiences;
