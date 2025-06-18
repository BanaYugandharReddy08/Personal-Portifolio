import { useEffect, useState } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const [animate, setAnimate] = useState(false);   // flips CSS keyframes on

  /* launch animations on first paint */
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  return (
    <div className="about-page">
      <div className="container">
        {/* ───── header ───── */}
        <div className={`about-header fade-in-up ${animate ? 'run' : ''}`}>
          <h1>About Me</h1>
        </div>

        <div className="about-content">
          {/* profile photo */}
          <div
            className={`about-image slide-in-left ${animate ? 'run' : ''}`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="about-image-container">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                alt="Yugandhar Reddy Bana"
              />
            </div>
          </div>

          {/* bio text */}
          <div
            className={`about-text slide-in-right ${animate ? 'run' : ''}`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="about-bio">
              <p className="about-intro">
                A former chef turned software craftsman, I blend the discipline
                of a commercial kitchen with the creativity of modern web
                engineering. Between React components and regression models, I
                chase one goal: experiences that feel effortless and perform
                flawlessly.
              </p>

              <h2>My Journey</h2>
              <p>
                My path to software engineering began in an unlikely place – the
                bustling kitchens of Dublin&apos;s Skylon Hotel. The precision,
                teamwork, and ability to perform under pressure I developed
                there translate surprisingly well to sprint rooms and code
                reviews.
              </p>

              <p>
                After completing my BSc in Computer Science from SASTRA
                University, I jumped into the telecom sector, building a
                multi-region provisioning platform that reduced latency from 30
                seconds to under 10 seconds. This experience ignited my passion
                for performance optimization and user-centric design.
              </p>

              <p>
                Now pursuing my MSc in Data Analytics at the National College of
                Ireland, I&apos;m focused on the intersection of front-end
                engineering and data science. My thesis on &quot;Impact of
                Macroeconomic Factors on Newly Built Residential Property Prices
                in Dublin&quot; achieved 88 % model accuracy using ensemble
                machine-learning techniques.
              </p>

              <h2>My Approach</h2>
              <p>
                I believe the best digital products are those that disappear –
                interfaces so intuitive and responsive that users never have to
                think about them. This philosophy guides my development process,
                where I combine:
              </p>

              <ul className="approach-list">
                <li>Meticulous attention to UI details and accessibility</li>
                <li>Performance-first engineering with comprehensive testing</li>
                <li>Data-driven decision making backed by analytics</li>
                <li>
                  Collaborative problem-solving with cross-functional teams
                </li>
              </ul>

              <h2>Beyond Coding</h2>
              <p>
                When I&apos;m not coding, you can find me experimenting with new
                recipes (old habits die hard!), exploring Dublin&apos;s hidden
                corners, or diving into data-visualization projects that make
                complex information accessible.
              </p>

              <div className="cta-buttons">
                <a href="/contact" className="button">
                  Get in Touch
                </a>
                <a href="/experience" className="button outline">
                  View My Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
