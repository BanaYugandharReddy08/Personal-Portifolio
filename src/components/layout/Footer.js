import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h2 className="footer-logo">Yugandhar Reddy Bana</h2>
            <p className="footer-tagline">Data-savvy Front-End Engineer</p>
            <p className="footer-contact">
              <a href="mailto:yugandharreddybana@outlook.com">yugandharreddybana@outlook.com</a><br />
              <a href="tel:+353894851413">+353 89 485 1413</a><br />
              Dublin, Ireland
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Navigation</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/education">Education</Link></li>
                <li><Link to="/certifications">Certifications</Link></li>
                <li><Link to="/experience">Experience</Link></li>
                <li><Link to="/chat">Chatbot</Link></li>
                <li><Link to="/resume-and-cover">Cv & Cover Letter</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Connect</h3>
              <ul>
                <li><a href="https://linkedin.com/in/bana-yugandhar-reddy" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://github.com/BanaYugandharReddy08" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Yugandhar Reddy Bana | <span className="built-with">Built with React, love, and a dash of data</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;