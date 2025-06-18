import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="name">Yugandhar Reddy Bana</span>
            <span className="title">Front-End Engineer | Data Analyst</span>
          </Link>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          
          <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/education" className={({ isActive }) => isActive ? 'active' : ''}>
                  Education
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/certifications" className={({ isActive }) => isActive ? 'active' : ''}>
                  Certifications
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/experience" className={({ isActive }) => isActive ? 'active' : ''}>
                  Experience
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/resume-and-cover" className={({ isActive }) => isActive ? 'active' : ''}>
                  CV & Cover Letter
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
                  Contact
                </NavLink>
              </li>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <li className="nav-item">
                      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                        Dashboard
                      </NavLink>
                    </li>
                  )}
                  <li className="nav-item">
                    <button onClick={logout} className="button outline">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <NavLink to="/login" className="button">
                    Login
                  </NavLink>
                </li>
              )}
              
              <li className="nav-item theme-toggle">
                <button 
                  onClick={toggleTheme} 
                  className="theme-toggle-button"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;