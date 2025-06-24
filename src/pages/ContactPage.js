import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState(null);
  const [animate, setAnimate] = useState(false);   // triggers CSS keyframes

  /* start animations once the component mounts */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // basic required-field check
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    // e-mail format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    // console.log('Form data submitted:', formData);

    setFormStatus({
      type: 'success',
      message:
        "Your message has been sent successfully! I'll get back to you soon.",
    });

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setFormStatus(null), 5000);
  };

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <div className="contact-page">
      <div className="container">
        {/* header */}
        <div className={`contact-header fade-in-up ${animate ? 'run' : ''}`}>
          <h1>Get in Touch</h1>
          <p className="contact-intro">
            Have a project in mind or want to discuss potential opportunities?
            I'd love to hear from you!
          </p>
        </div>

        <div className="contact-content">
          {/* left column */}
          <div
            className={`contact-info slide-in-left delay-1 ${
              animate ? 'run' : ''
            }`}
          >
            <div className="contact-info-card">
              <h2>Contact Information</h2>

              <div className="contact-detail">
                <span className="contact-icon">✉️</span>
                <div>
                  <h3>Email</h3>
                  <a href="mailto:yugandharreddybana@outlook.com">
                    yugandharreddybana@outlook.com
                  </a>
                </div>
              </div>

              <div className="contact-detail">
                <span className="contact-icon">📱</span>
                <div>
                  <h3>Phone</h3>
                  <a href="tel:+353894851413">+353&nbsp;89&nbsp;485&nbsp;1413</a>
                </div>
              </div>

              <div className="contact-detail">
                <span className="contact-icon">📍</span>
                <div>
                  <h3>Location</h3>
                  <p>Dublin, Ireland</p>
                </div>
              </div>

              <div className="social-links">
                <h3>Connect With Me</h3>
                <div className="social-icons">
                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/bana-yugandhar-reddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/BanaYugandharReddy08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label="GitHub"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="chat-option">
                <h3>Prefer a quick chat?</h3>
                <p>
                  Live chat is <strong>on the way</strong> – in the meantime feel free to email, phone, or connect on LinkedIn.
                </p>
                <Link to="/chat" className="button outline">Start Chat</Link>
              </div>
            </div>
          </div>

          {/* right column (form) */}
          <div
            className={`contact-form-container slide-in-right delay-2 ${
              animate ? 'run' : ''
            }`}
          >
            <div className="contact-form-card">
              <h2>Send a Message</h2>

              {formStatus && (
                <div className={`form-message ${formStatus.type}`}>
                  {formStatus.message}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message*</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
