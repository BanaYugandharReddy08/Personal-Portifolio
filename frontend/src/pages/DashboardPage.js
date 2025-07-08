import { useState } from 'react';
import './DashboardPage.css';
import { CertificatesProvider } from '../context/CertificatesContext';
import { ExperiencesProvider } from '../context/ExperiencesContext';
import { ProjectsProvider } from '../context/ProjectsContext';
import { ProblemsProvider } from '../context/ProblemsContext';
import { DocsProvider } from '../context/DocsContext';
import DashboardCertificates from '../components/dashboard/DashboardCertificates';
import DashboardExperiences from '../components/dashboard/DashboardExperiences';
import DashboardProjects from '../components/dashboard/DashboardProjects';
import ProblemsSection from '../components/dashboard/ProblemsSection';
import DashboardDocuments from '../components/dashboard/DashboardDocuments';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('certificates');

  return (
    <CertificatesProvider>
      <ExperiencesProvider>
        <ProjectsProvider>
          <ProblemsProvider>
            <DocsProvider>
              <div className="dashboard-page">
                <div className="container">
                  <div className="tabs">
                  <button
                    className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('certificates')}
                  >
                    Certificates
                  </button>
                  <button
                    className={`tab ${activeTab === 'experience' ? 'active' : ''}`}
                    onClick={() => setActiveTab('experience')}
                  >
                    Experience
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
                  <button
                    className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                  >
                    Documents
                  </button>
                  </div>

                  {activeTab === 'certificates' && <DashboardCertificates />}
                  {activeTab === 'experience' && <DashboardExperiences />}
                  {activeTab === 'projects' && <DashboardProjects />}
                  {activeTab === 'leetcode' && <ProblemsSection />}
                  {activeTab === 'documents' && <DashboardDocuments />}
                </div>
              </div>
            </DocsProvider>
          </ProblemsProvider>
        </ProjectsProvider>
      </ExperiencesProvider>
    </CertificatesProvider>
  );
};

export default DashboardPage;
