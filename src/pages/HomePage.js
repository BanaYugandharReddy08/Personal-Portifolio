import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [animate, setAnimate] = useState(false);   // flips CSS keyframes on

  /* launch animations after first paint */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  return (
    <div className="home-page">
      {/* ───────── HERO ───────── */}
      <section className="hero">
        <div className="container">
          <div className={`hero-content fade-in-up ${animate ? 'run' : ''}`}>
            <h1>Hi, I'm Yugandhar “Yugi” Reddy Bana</h1>
            <h2>
              A data-savvy front-end engineer who turns numbers into
              pixel-perfect products.
            </h2>

            {/* achievements */}
            <div className="achievements">
              {[
                {
                  title: 'Results that ship',
                  copy:
                    'Cut page-load times by 30% in a SaaS revamp and slashed a legacy telecom portal’s latency from 30 s to <10 s.',
                  delay: 0.2,
                },
                {
                  title: 'Code you can trust',
                  copy:
                    'Boosted automated-test coverage from 30% → 90% and built zero-downtime CI/CD pipelines.',
                  delay: 0.4,
                },
                {
                  title: 'Insights that matter',
                  copy:
                    'Created ensemble ML models (RF, XGBoost, LightGBM) that predict Dublin housing prices with 88% accuracy.',
                  delay: 0.6,
                },
              ].map(({ title, copy, delay }, i) => (
                <div
                  key={i}
                  className={`achievement-card fade-in-up ${
                    animate ? 'run' : ''
                  }`}
                  style={{ animationDelay: `${delay}s` }}
                >
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
            </div>

            <p className="hero-cta">
              I thrive where elegant UX meets evidence-driven decision-making—
              and I’m ready to bring that blend to your team.
            </p>

            <div className="hero-buttons">
              <Link to="/contact" className="button">
                Get in touch
              </Link>
              <Link to="/experience" className="button outline">
                View my work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ABOUT PREVIEW ───────── */}
      <section className="home-about">
        <div className="container">
          <div className="section-heading">
            <h2>About Me</h2>
          </div>

          <div className="home-about-content">
            <p>
              From software developer to data analyst — with a chef’s discipline in between. 
              I build fast, user-friendly interfaces with React and uncover insights through data.
               Whether it's code or cuisine, I focus on precision, creativity, and delivering great experiences.
            </p>
            <Link to="/about" className="button">
              Learn more about me
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── FEATURED WORK ───────── */}
      <section className="featured-work">
        <div className="container">
          <div className="section-heading">
            <h2>Featured Work</h2>
          </div>

          <div className="work-grid">
            {[
              {
                title: 'Telecom Provisioning Platform',
                copy:
                  'Built a multi-region platform with modular React components. Reduced latency from 30 s to <10 s.',
                tags: ['React', 'Node.js', 'CI/CD'],
              },
              {
                title: 'SaaS Platform Revamp',
                copy:
                  'Re-architected UI in React, trimming page loads by 30% and boosting customer satisfaction.',
                tags: ['React', 'Redux', 'REST APIs'],
              },
              {
                title: 'Dublin Housing Price Prediction',
                copy:
                  'Created ensemble ML models that predict housing prices with 88% accuracy.',
                tags: ['Python', 'ML', 'Data Visualization'],
              },
            ].map((w, i) => (
              <div key={i} className="work-item">
                <div className="work-content">
                  <h3>{w.title}</h3>
                  <p>{w.copy}</p>
                  {w.tags.map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="section-cta">
            <Link to="/experience" className="button">
              View all projects
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── CONTACT CTA ───────── */}
      <section className="contact-cta">
        <div className="container">
          <div className="contact-cta-content">
            <h2>Let’s Work Together</h2>
            <p>
              Looking for a front-end engineer who can blend technical
              excellence with data-driven insights?
            </p>
            <Link to="/contact" className="button">
              Contact me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
