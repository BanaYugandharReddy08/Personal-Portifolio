import { useState, useEffect } from 'react';
import LeetCodePage from './LeetCodePage';
// import { motion } from 'framer-motion';
import { useExperiences } from '../context/ExperiencesContext';
import { useProjects } from '../context/ProjectsContext';
import './ExperiencePage.css';

const ExperiencePage = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedProject, setSelectedProject] = useState(null);
  const [animate, setAnimate] = useState(false);          // triggers CSS keyframes
  const [canEmbed,  setCanEmbed]  = useState(true);
  const {
    experiences,
    loading: experiencesLoading,
    error: experiencesError,
  } = useExperiences();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

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
  }, []);

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
          <div id="projects" className="projects-grid">
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
                    {proj.technologies.slice(0, 3).map((tech, k) => (
                      <span key={k} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 3 && (
                      <span className="tech-tag">
                        +{proj.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <button className="button outline view-project-btn">
                    View Details
                  </button>
                </div>
              </div>
            ))}
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
                  {selectedProject.technologies.map((tech, k) => (
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
