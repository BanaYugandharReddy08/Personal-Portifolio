import { useState, useEffect } from 'react';
import LeetCodePage from './LeetCodePage';
// import { motion } from 'framer-motion';
import { useExperiences } from '../context/ExperiencesContext';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import './ExperiencePage.css';

const ExperiencePage = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedProject, setSelectedProject] = useState(null);
  const [animate, setAnimate] = useState(false);          // triggers CSS keyframes
  const [canEmbed,  setCanEmbed]  = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    technologies: '',
  });
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const {
    experiences,
    loading: experiencesLoading,
    error: experiencesError,
    loadExperiences,
  } = useExperiences();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    addProject,
    updateProjectById,
    deleteProjectById,
    loadProjects,
  } = useProjects();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const formatPeriod = (exp) => {
    const format = (d) => d.toLocaleString('default', { month: 'short', year: 'numeric' });
    const start = exp.startDate ? format(new Date(exp.startDate)) : '';
    const end = exp.currentlyWorking
      ? 'Present'
      : exp.endDate
      ? format(new Date(exp.endDate))
      : '';
    return start && end ? `${start} - ${end}` : start || end;
  };

  /* start animations after first paint */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
    loadExperiences();
    loadProjects();
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
    const proj = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      technologies: formData.technologies,
    };

    let success;
    if (isEditing && editingId) {
      ({ success } = await updateProjectById(editingId, proj));
      if (success) {
        showNotification('Project updated successfully');
      } else {
        showNotification('Failed to update project', 'error');
        return;
      }
    } else {
      ({ success } = await addProject(proj));
      if (success) {
        showNotification('Project added successfully');
      } else {
        showNotification('Failed to add project', 'error');
        return;
      }
    }

    setFormData({ title: '', description: '', imageUrl: '', technologies: '' });
    setEditingId(null);
    setIsEditing(false);
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
    });
    setIsAdding(false);
    setIsEditing(true);
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

  if (experiencesLoading || projectsLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (experiencesError || projectsError) {
    return <div className="error">Failed to load data</div>;
  }

  return (
    <div id="experience" className="experience-page">
      <div className="container">
        {/* ───────── header + tabs ───────── */}
        <div className={`experience-header fade-in-up ${animate ? 'run' : ''}`}>
          <h1>Experience &amp; Projects</h1>
          <p className="experience-intro">
            Browse through my professional experience and featured projects.
          </p>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              Professional Experience
            </button>
            <button
              className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button
              className={`tab ${activeTab === 'leetcode' ? 'active' : ''}`}
              onClick={() => setActiveTab('leetcode')}
            >
              LeetCode
            </button>
          </div>
        </div>

        {/* ───────── timeline or grid ───────── */}
        {activeTab === 'experience' ? (
          <div className="experience-timeline">
            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                className={`experience-card ${exp.featured ? 'featured' : ''} fade-in-up ${
                  animate ? 'run' : ''
                }`}
                style={{ animationDelay: `${0.1 * i + 0.2}s` }}
              >
                <div className="experience-period">{formatPeriod(exp)}</div>
                <div className="experience-content">
                  <div className="experience-header">
                    <h2>{exp.position}</h2>
                    <h3>{exp.company}</h3>
                  </div>

                  <ul className="experience-description">
                    {exp.description.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>

                  <div className="technologies">
                    {exp.skills.split(',').map((tech, k) => (
                      <span key={k} className="tech-tag">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'projects' ? (
          <div id="projects">
            {isAdmin && notification && (
              <div className={`notification ${notification.type}`}>{notification.message}</div>
            )}
            {isAdmin && confirmDelete && (
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
            {isAdmin && !isAdding && !isEditing && (
              <button
                type="button"
                className="button add-project-btn"
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setFormData({
                    title: '',
                    description: '',
                    imageUrl: '',
                    technologies: '',
                  });
                }}
              >
                Add New Project
              </button>
            )}
            {isAdmin && (isAdding || isEditing) && (
              <div className="certificate-form-container">
                <h2>{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
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
                  <div className="form-actions">
                    <button
                      type="button"
                      className="button outline"
                      onClick={() => {
                        setIsEditing(false);
                        setIsAdding(false);
                        setEditingId(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="button">
                      {isEditing ? 'Save Changes' : 'Add New Project'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="projects-grid">
              {projects.map((proj, i) => (
                <div
                  key={proj.id}
                  className={`project-card ${proj.featured ? 'featured' : ''} fade-in-up ${
                    animate ? 'run' : ''
                  }`}
                  style={{ animationDelay: `${0.1 * i + 0.2}s` }}
                  onClick={() => setSelectedProject(proj)}
                >
                  <div className="project-image">
                    <img src={proj.imageUrl} alt={proj.title} />
                  </div>
                  <div className="project-content">
                    <h2>{proj.title}</h2>
                    <p>{proj.description.slice(0, 100)}…</p>

                    <div className="technologies">
                      {proj.technologies
                        .split(',')
                        .map((t) => t.trim())
                        .slice(0, 3)
                        .map((tech, k) => (
                          <span key={k} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      {proj.technologies.split(',').length > 3 && (
                        <span className="tech-tag">
                          +{proj.technologies.split(',').length - 3}
                        </span>
                      )}
                    </div>

                    <button className="button outline view-project-btn">
                      View Details
                    </button>
                  </div>
                  {isAdmin && (
                    <div className="project-actions">
                      <button
                        className="icon-button edit-button"
                        onClick={(e) => { e.stopPropagation(); handleEdit(proj.id); }}
                        aria-label="Edit project"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-button delete-button"
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(proj.id); }}
                        aria-label="Delete project"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <LeetCodePage />
        )}

        {/* ───────── modal ───────── */}
        {selectedProject && (
          <div
            className="project-modal"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="project-modal-content fade-in-up run"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-button"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>

              <img
                className="project-modal-image"
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
              />

              <div className="project-modal-details">
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>

                <h3>Technologies Used</h3>
                <div className="technologies">
                  {selectedProject.technologies
                    .split(',')
                    .map((t) => t.trim())
                    .map((tech, k) => (
                      <span key={k} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                </div>
                {selectedProject.reportFile && (
                  <div className="project-report-details">
                    <h3>Report Details</h3>
                    {canEmbed ? (
                      <iframe
                        title={selectedProject.title}
                        src={`${selectedProject.reportFile}#toolbar=0&view=FitH`}
                        loading="lazy"
                        style={{ width: '100%', height: '60vh', border: 'none' }}
                      />
                    ) : (
                      <div className="no-preview-wrapper">
                        <p className="no-preview">
                          Your browser can’t display PDFs inline.
                        </p>
                        <a
                          href={selectedProject.reportFile}
                          download
                          className="button outline download-report-btn"
                        >
                          Download Report
                        </a>
                      </div>
                    )}
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

export default ExperiencePage;
