import { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectsContext';
import '../../pages/DashboardPage.css';

const initialForm = {
  title: '',
  description: '',
  imageUrl: '',
  technologies: '',
  reportFile: '',
};

const DashboardProjects = () => {
  const {
    projects,
    loading,
    error,
    addProject,
    updateProjectById,
    deleteProjectById,
    loadProjects,
    uploadReport,
  } = useProjects();

  useEffect(() => {
    loadProjects();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [reportFile, setReportFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';


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
    const proj = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      technologies: formData.technologies,
    };

    if (editingId) {
      const { success } = await updateProjectById(editingId, proj);
      if (success) {
        showNotification('Project updated successfully');
      } else {
        showNotification('Failed to update project', 'error');
        return;
      }
      if (reportFile) {
        await uploadReport(editingId, reportFile);
      }
    } else {
      const { success, project } = await addProject(proj);
      if (success) {
        if (reportFile) {
          await uploadReport(project.id, reportFile);
        }
        showNotification('Project added successfully');
      } else {
        showNotification('Failed to add project', 'error');
        return;
      }
    }

    setFormData(initialForm);
    setReportFile(null);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (id) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    setEditingId(id);
    setFormData({
      title: proj.title || '',
      description: proj.description || '',
      imageUrl: proj.imageUrl || '',
      technologies: proj.technologies || '',
      reportFile: proj.reportFile || '',
    });
    setReportFile(null);
    setIsAdding(true);
  };

  const handleConfirmDelete = async () => {
    const { success } = await deleteProjectById(confirmDelete);
    if (success) {
      showNotification('Project deleted successfully');
    } else {
      showNotification('Failed to delete project', 'error');
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }


  return (
    <div className="problems-section">
      <div className="dashboard-header">
        <h2>Projects</h2>
        <button
          className="button"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData(initialForm);
          }}
        >
          Add New Project
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}

      {confirmDelete && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h3>Delete this project?</h3>
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
          <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
          <form className="certificate-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title*</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
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
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="technologies">Technologies</label>
              <input
                id="technologies"
                name="technologies"
                type="text"
                value={formData.technologies}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="reportFile">Project Report</label>
              <input
                id="reportFile"
                type="file"
                accept="application/pdf"
                onChange={(e) => setReportFile(e.target.files[0])}
              />
              {editingId && formData.reportFile && (
                <a
                  href={`${baseURL}/projects/${editingId}/report`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Existing Report
                </a>
              )}
            </div>
            <div className="form-actions">
              <button type="button" className="button outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                Cancel
              </button>
              <button type="submit" className="button">
                {editingId ? 'Save Changes' : 'Add New Project'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="certificates-container">
          {projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects added yet.</h3>
            </div>
          ) : (
            <div className="certificates-grid">
              {projects.map((proj) => (
                <div className="certificate-card" key={proj.id}>
                  {proj.imageUrl && (
                    <div className="certificate-image">
                      <img src={proj.imageUrl} alt={proj.title} />
                    </div>
                  )}
                  <div className="certificate-details">
                    <h3>{proj.title}</h3>
                    {proj.description && (
                      <p className="certificate-takeaway">{proj.description}</p>
                    )}
                    {proj.technologies && (
                      <div className="technologies">
                        {proj.technologies
                          .split(',')
                          .map((t) => t.trim())
                          .map((tech, k) => (
                            <span key={k} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="certificate-actions">
                    <button
                      className="icon-button edit-button"
                      onClick={() => handleEdit(proj.id)}
                      aria-label="Edit project"
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-button delete-button"
                      onClick={() => setConfirmDelete(proj.id)}
                      aria-label="Delete project"
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

export default DashboardProjects;
