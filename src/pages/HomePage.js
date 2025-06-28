import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [animate, setAnimate] = useState(false);   // flips CSS keyframes on

  /* launch animations after first paint */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  const achievements = [
    {
      id: 'ship',
      title: 'Results that ship',
      copy:
        'Cut page-load times by 30% in a SaaS revamp and slashed a legacy telecom portal\u2019s latency from 30 s to <10 s.',
    },
    {
      id: 'trust',
      title: 'Code you can trust',
      copy:
        'Boosted automated-test coverage from 30% \u2192 90% and built zero-downtime CI/CD pipelines.',
    },
    {
      id: 'insight',
      title: 'Insights that matter',
      copy:
        'Created ensemble ML models (RF, XGBoost, LightGBM) that predict Dublin housing prices with 88% accuracy.',
    },
    {
      id: 'leadership',
      title: 'Agile leadership',
      copy:
        'Led Scrum ceremonies, mentored juniors and coordinated cross-functional teams to deliver on time.',
    },
    {
      id: 'foundations',
      title: 'Full-stack foundations',
      copy:
        'Integrated REST APIs and Node services, building reliable data flows from PostgreSQL to React UIs.',
    },
    {
      id: 'mindset',
      title: 'User-first mindset',
      copy:
        'Crafted responsive interfaces and accessibility features that keep users engaged across devices.',
    },
  ];

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
              <ul
                aria-label="Career highlights"
                className="achievements-scroller"
              >
                {achievements.concat(achievements).map(({ id, title, copy }) => (
                  <li
                    key={id}
                    className={`achievement-card fade-in-up ${animate ? 'run' : ''}`}
                  >
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="hero-cta" style={{ textAlign: 'justify' }}>
              I bring together design, code, and data to create digital experiences that work beautifully and make sense. Whether it’s building a dashboard, a product site, or a data story — I focus on clarity, speed, and results.
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
            <p style={{ justifyContent: 'center', textAlign: 'justify' }}>
              I'm a front-end developer with 2.5 years of experience building responsive and accessible web applications, and I recently completed my Master’s in Data Analytics. This unique blend of hands-on development and analytical training allows me to build user-friendly interfaces while also understanding the data that drives them.

              I specialize in using modern technologies like React to create clean, high-performance UIs. My recent academic journey has strengthened my ability to work with data, uncover insights, and make smarter design and development decisions.

              Whether I'm coding, analyzing, or collaborating with a team, I focus on clarity, creativity, and delivering meaningful digital experiences.
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
              I bring 2.5 years of front-end development experience, a keen eye for detail, and a mindset focused on continuous learning. I’m open to full-time, remote, or part-time roles — and currently exploring data analytics to round out my skillset.
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
