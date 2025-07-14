import { useState, useEffect } from 'react';
import LeetCodePage from './LeetCodePage';
// import { motion } from 'framer-motion';
import { useExperiences } from '../context/ExperiencesContext';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import './Experience.css';
import Card from '../components/shared/Card';

const Experience = () => {
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
  const [reportFile, setReportFile] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const expInitialForm = {
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
  const [isExpAdding, setIsExpAdding] = useState(false);
  const [expFormData, setExpFormData] = useState(expInitialForm);
  const [expEditingId, setExpEditingId] = useState(null);
  const [expConfirmDelete, setExpConfirmDelete] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
  const {
    experiences,
    loading: experiencesLoading,
    error: experiencesError,
    loadExperiences,
    addExperience,
    updateExperienceById,
    deleteExperienceById,
    loaded: experiencesLoaded,
  } = useExperiences();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    addProject,
    updateProjectById,
    deleteProjectById,
    loadProjects,
    uploadReport,
    fetchReport,
    loaded: projectsLoaded,
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

  const parseDescription = (desc) => {
    if (Array.isArray(desc)) return desc;
    if (typeof desc !== 'string') return desc;
    const lines = desc.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length > 1 && lines.every((l) => /^\d+[\.)]/.test(l))) {
      return lines.map((l) => l.replace(/^\d+[\.)]\s*/, ''));
    }
    return desc;
  };

  /* start animations after first paint */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  useEffect(() => {
    if (activeTab === 'experience' && !experiencesLoaded && experiences.length === 0) {
      loadExperiences();
    } else if (activeTab === 'projects' && !projectsLoaded && projects.length === 0) {
      loadProjects();
    }
  }, [activeTab, experiencesLoaded, projectsLoaded]);

  useEffect(() => {
    setCanEmbed(Boolean(navigator.mimeTypes?.['application/pdf']));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (selectedProject && selectedProject.reportFile) {
      fetchReport(selectedProject.id).then((url) => {
        if (!cancelled) setReportUrl(url);
      });
    } else {
      setReportUrl(null);
    }
    return () => {
      cancelled = true;
      if (reportUrl) {
        URL.revokeObjectURL(reportUrl);
      }
    };
  }, [selectedProject]);

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
        if (reportFile) {
          await uploadReport(editingId, reportFile);
        }
        showNotification('Project updated successfully');
      } else {
        showNotification('Failed to update project', 'error');
        return;
      }
    } else {
      let result = await addProject(proj);
      ({ success } = result);
      if (success) {
        if (reportFile) {
          await uploadReport(result.project.id, reportFile);
        }
        showNotification('Project added successfully');
      } else {
        showNotification('Failed to add project', 'error');
        return;
      }
    }

    setFormData({ title: '', description: '', imageUrl: '', technologies: '' });
    setReportFile(null);
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
      reportFile: proj.reportFile || '',
    });
    setReportFile(null);
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

  const handleExpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpFormData({
      ...expFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    const formatDate = (year, month) => {
      if (!year || !month) return null;
      return `${year}-${String(month).padStart(2, '0')}-01`;
    };

    const exp = {
      position: expFormData.position,
      company: expFormData.company,
      startDate: formatDate(expFormData.startYear, expFormData.startMonth),
      endDate: expFormData.currentlyWorking
        ? null
        : formatDate(expFormData.endYear, expFormData.endMonth),
      currentlyWorking: expFormData.currentlyWorking,
      skills: expFormData.skills,
      description: expFormData.description,
    };

    if (expEditingId) {
      const { success } = await updateExperienceById(expEditingId, exp);
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

    setExpFormData(expInitialForm);
    setExpEditingId(null);
    setIsExpAdding(false);
  };

  const handleExpEdit = (id) => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    setExpEditingId(id);
    const parseDate = (dateStr) => {
      if (!dateStr) return { year: '', month: '' };
      const d = new Date(dateStr);
      return { year: String(d.getFullYear()), month: String(d.getMonth() + 1) };
    };
    const start = parseDate(exp.startDate);
    const end = parseDate(exp.endDate);
    setExpFormData({
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
    setIsExpAdding(true);
  };

  const handleExpConfirmDelete = async () => {
    const { success } = await deleteExperienceById(expConfirmDelete);
    if (success) {
      showNotification('Experience deleted successfully');
    } else {
      showNotification('Failed to delete experience', 'error');
    }
    setExpConfirmDelete(null);
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
          <div className={experiences.length===0?"":"experience-timeline"}>
            {isAdmin && notification && (
              <div className={`notification ${notification.type}`}>{notification.message}</div>
            )}
            {isAdmin && expConfirmDelete && (
              <div className="confirm-dialog">
                <div className="confirm-dialog-content">
                  <h3>Delete this experience?</h3>
                  <p>This action can't be undone.</p>
                  <div className="confirm-dialog-actions">
                    <button onClick={() => setExpConfirmDelete(null)} className="button outline">Cancel</button>
                    <button onClick={handleExpConfirmDelete} className="button accent">Delete</button>
                  </div>
                </div>
              </div>
            )}
            {isAdmin && !isExpAdding && (
              <div className="dashboard-header">
                <h2>Experience</h2>
                <button
                  className="button"
                  onClick={() => {
                    setIsExpAdding(true);
                    setExpEditingId(null);
                    setExpFormData(expInitialForm);
                  }}
                  type='button'
                >
                  Add New Experience
                </button>
      </div>
            )}
            {isAdmin && isExpAdding && (
              <div className="certificate-form-container">
                <h2>{expEditingId ? 'Edit Experience' : 'Add New Experience'}</h2>
                <form className="certificate-form" onSubmit={handleExpSubmit}>
                  <div className="form-group">
                    <label htmlFor="position">Position*</label>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      value={expFormData.position}
                      onChange={handleExpChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company*</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={expFormData.company}
                      onChange={handleExpChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="startMonth">Start Month</label>
                    <select
                      id="startMonth"
                      name="startMonth"
                      value={expFormData.startMonth}
                      onChange={handleExpChange}
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
                      value={expFormData.startYear}
                      onChange={handleExpChange}
                    />
                  </div>
                    <div className="form-group">
                      <label htmlFor="endMonth">End Month</label>
                      <select
                        id="endMonth"
                        name="endMonth"
                        value={expFormData.endMonth}
                        onChange={handleExpChange}
                        disabled={expFormData.currentlyWorking}
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
                        value={expFormData.endYear}
                        onChange={handleExpChange}
                        disabled={expFormData.currentlyWorking}
                      />
                    </div>
                  <div className="form-group checkbox-group">
                      <input
                          id="currentlyWorking"
                          name="currentlyWorking"
                          type="checkbox"
                          checked={expFormData.currentlyWorking}
                          onChange={handleExpChange}
                        />
                      <label htmlFor="currentlyWorking">
                        Currently Working
                      </label>
                    </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="skills">Skills (comma separated)</label>
                    <input
                      id="skills"
                      name="skills"
                      type="text"
                      value={expFormData.skills}
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={expFormData.description}
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="button outline" onClick={() => { setIsExpAdding(false); setExpEditingId(null); }}>
                      Cancel
                    </button>
                    <button type="submit" className="button">
                      {expEditingId ? 'Save Changes' : 'Add New Experience'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {experiences.length === 0 ? (
              <div className="empty-state">
                <h3>No experiences added yet.</h3>
              </div>
            ) : (
              experiences.map((exp, i) => (
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

                  {(() => {
                    const desc = parseDescription(exp.description);
                    if (Array.isArray(desc)) {
                      return (
                        <ul className="experience-description">
                          {desc.map((item, k) => (
                            <li key={k}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      desc && <p className="certificate-takeaway">{desc}</p>
                    );
                  })()}

                  {exp.skills && (
                    <div className="technologies">
                      {exp.skills
                        .split(',')
                        .map((tech) => tech.trim())
                        .map((tech, k) => (
                          <span key={k} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                    </div>
                  )}
                    {isAdmin && (
                      <div className="project-actions">
                        <button
                          className="icon-button edit-button"
                          onClick={() => handleExpEdit(exp.id)}
                          aria-label="Edit experience"
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-button delete-button"
                          onClick={() => setExpConfirmDelete(exp.id)}
                          aria-label="Delete experience"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
            )))}
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
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="reportFile">Project Report</label>
                    <input
                      id="reportFile"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setReportFile(e.target.files[0])}
                    />
                    {isEditing && formData.reportFile && (
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
              {projects.length === 0 ? (
                <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                  <h3>No projects added yet.</h3>
                </div>
              ) : (
                projects.map((proj, i) => (
                  <Card
                    key={proj.id}
                    className={`project-card ${proj.featured ? 'featured' : ''} fade-in-up ${
                      animate ? 'run' : ''
                    }`}
                    style={{ animationDelay: `${0.1 * i + 0.2}s` }}
                    imageUrl={proj.imageUrl}
                    title={proj.title}
                    description={`${proj.description.slice(0, 100)}…`}
                    tags={proj.technologies}
                    onClick={() => setSelectedProject(proj)}
                    actions={
                      isAdmin && (
                        <>
                          <button
                            className="icon-button edit-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(proj.id);
                            }}
                            aria-label="Edit project"
                          >
                            ✏️
                          </button>
                          <button
                            className="icon-button delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(proj.id);
                            }}
                            aria-label="Delete project"
                          >
                            🗑️
                          </button>
                        </>
                      )
                    }
                  >
                    <button className="button outline view-project-btn">View Details</button>
                  </Card>
                ))
              )}
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
                {reportUrl && (
                  <div className="project-report-details">
                    <h3>Report Details</h3>
                    {canEmbed ? (
                      <iframe
                        title={selectedProject.title}
                        src={`${reportUrl}#toolbar=0&view=FitH`}
                        loading="lazy"
                        style={{ width: '100%', height: '60vh', border: 'none' }}
                      />
                    ) : (
                      <div className="no-preview-wrapper">
                        <p className="no-preview">
                          Your browser can’t display PDFs inline.
                        </p>
                        <a
                          href={reportUrl}
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

export default Experience;
