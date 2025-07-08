import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingChatbot from './components/chatbot/FloatingChatbot';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EducationPage from './pages/EducationPage';
import CertificationsPage from './pages/CertificationsPage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ResumeAndCoverPage from './pages/ResumeAndCoverPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ExperiencesProvider } from './context/ExperiencesContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { useAuth } from './context/AuthContext';

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const hideLayout = !user && ['/login', '/signup'].includes(location.pathname);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app">
      {!hideLayout && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route
            path="/experience"
            element={(
              <ExperiencesProvider>
                <ProjectsProvider>
                  <ExperiencePage />
                </ProjectsProvider>
              </ExperiencesProvider>
            )}
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/resume-and-cover" element={<ResumeAndCoverPage />} />

          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <FloatingChatbot />
      <ToastContainer position="top-center" newestOnTop />
    </div>
  );
}

export default App;
