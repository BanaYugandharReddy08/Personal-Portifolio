import { useState,useEffect } from 'react';
// import { motion } from 'framer-motion';
import './ExperiencePage.css';
import report from './report.pdf'; // Import the report file

const experiences = [
  {
    id: 1,
    position: "Chef",
    company: "Skylon Hotel (Dublin)",
    period: "Jun 2024 — present",
    description: [
      "Mastered high-pressure teamwork, time-boxing, and quality control—skills that translate surprisingly well to sprint rooms.",
      "Worked evening and weekend kitchen shifts as a part-time chef while simultaneously completing my MSc, balancing high-pressure service with graduate-level coursework."
    ],
    technologies: ["Team Coordination", "Time Management", "Quality Control"],
    featured: true
  },
  {
    id: 2,
    position: "React Developer (Freelance)",
    company: "US Client",
    period: "Apr 2024 — Jul 2024",
    description: [
      "Designed and implemented high-performance, scalable front-end architecture using ReactJS, delivering enhanced user experience and interface responsiveness.",
  "Rebuilt core UI components to improve web application performance, achieving a 30% reduction in page load time and boosting customer satisfaction.",
  "Integrated RESTful APIs to facilitate dynamic data exchange between client-side and server-side, improving application stability and reliability.",
  "Conducted code reviews, debugged complex issues, and resolved performance bottlenecks, resulting in improved system reliability and codebase quality.",
  "Maintained responsive, cross-browser compatible components using HTML5, CSS3, JavaScript (ES6+), and React Hooks.",
  "Delivered all development milestones on time in a fully remote setting, demonstrating strong time management, self-direction, and remote team collaboration.",
  "Documented feature specifications and user stories to support Agile Scrum workflows, sprint planning, and project handover."
    ],
    technologies: ["React", "Redux", "REST APIs", "Jest", "CI/CD","Remote Collaboration"],
    featured: true
  },
  {
    id: 3,
    position: "Software Engineer",
    company: "Verizon — Incedo Technologies",
    period: "Aug 2021 — Jan 2024",
    description: [
      "Designed and developed a scalable telecommunications request platform supporting device, application, and circuit provisioning across multiple global regions.",
      "Engineered modular, reusable ReactJS components with responsive design, improving system efficiency and reducing development time.",
      "Refactored monolithic front-end architecture to modern component-based structures, enhancing maintainability and alignment with business requirements.",
      "Increased automated test coverage from 30% to 90% by implementing robust unit testing and integration testing frameworks within a CI/CD pipeline.",
      "Built a custom CSV upload tool with real-time input validation and toaster notifications, streamlining data entry and reducing user error rates.",
      "Conducted detailed data analysis on user behaviour and system usage trends, enabling data-driven enhancements and performance tuning.",
      "Resolved critical system latency issues, reducing page load times from 30+ seconds to under 10 seconds, improving SEO performance and user retention.",
      "Led cross-functional collaboration and Agile delivery by managing version control through Git, contributing to daily Scrum.",
      "Mentored junior developers in React best practices, code quality, and Agile methodologies, fostering a culture of continuous learning and improvement.",
      "Contributed to team growth by leading knowledge transfer sessions, conducting technical interviews, and onboarding new developers.",
      "Played a key role in Agile Scrum ceremonies, including sprint planning, retrospectives, and daily stand-ups, ensuring alignment with project goals and timelines.",
      "Supported team scaling through 20+ technical interviews and knowledge transfer sessions for 10+ developers, enhancing team capabilities and project delivery."
    ],
    technologies: ["React", "Node.js", "Javascript", "CI/CD", "HTML","CSS","JUnit","Java","PostgresQL","Git","Agile Scrum", "Jira", "Confluence"],
    featured: true
  }
];

const projects = [
  {
    id: 1,
    title: "Dublin Housing Price Prediction",
    description: "Created ensemble ML models (Random Forest, XGBoost, LightGBM) that predict Dublin housing prices with 88% accuracy. Integrated macroeconomic factors and location data for comprehensive analysis.",
    technologies: ["Python", "scikit-learn", "Pandas", "Matplotlib", "Jupyter"],
    imageUrl: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
    featured: true,
    reportFile: report
  }
];



const ExperiencePage = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedProject, setSelectedProject] = useState(null);
  const [animate, setAnimate] = useState(false);          // triggers CSS keyframes
  const [canEmbed,  setCanEmbed]  = useState(true);

  /* start animations after first paint */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  return (
    <div className="experience-page">
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
                <div className="experience-period">{exp.period}</div>
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
                    {exp.technologies.map((tech, k) => (
                      <span key={k} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                <div className="project-report-details">
                  <h3>Report Details</h3>
                  {
                    canEmbed ? (
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
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;
