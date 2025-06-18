// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import './HomePage.css';

// const HomePage = () => {
//   return (
//     <div className="home-page">
//       <section className="hero">
//         <div className="container">
//           <motion.div 
//             className="hero-content"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h1>Hi, I'm Yugandhar "Yugi" Reddy Bana</h1>
//             <h2>A data-savvy front-end engineer who turns numbers into pixel-perfect products.</h2>
            
//             <div className="achievements">
//               <motion.div 
//                 className="achievement-card"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <h3>Results that ship</h3>
//                 <p>Cut page-load times by 30% in a SaaS revamp and slashed a legacy telecom portal's latency from 30s to &lt;10s.</p>
//               </motion.div>
              
//               <motion.div 
//                 className="achievement-card"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//               >
//                 <h3>Code you can trust</h3>
//                 <p>Boosted automated-test coverage from 30% → 90% and built zero-downtime CI/CD pipelines.</p>
//               </motion.div>
              
//               <motion.div 
//                 className="achievement-card"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.6 }}
//               >
//                 <h3>Insights that matter</h3>
//                 <p>Created ensemble ML models (RF, XGBoost, LightGBM) that predict Dublin housing prices with 88% accuracy.</p>
//               </motion.div>
//             </div>
            
//             <p className="hero-cta">I thrive where elegant UX meets evidence-driven decision-making—and I'm ready to bring that blend to your team.</p>
            
//             <div className="hero-buttons">
//               <Link to="/contact" className="button">Get in touch</Link>
//               <Link to="/experience" className="button outline">View my work</Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>
      
//       <section className="home-about">
//         <div className="container">
//           <div className="section-heading">
//             <h2>About Me</h2>
//           </div>
          
//           <div className="home-about-content">
//             <p>A former chef turned software craftsman, I blend the discipline of a commercial kitchen with the creativity of modern web engineering. Between React components and regression models, I chase one goal: experiences that feel effortless and perform flawlessly.</p>
//             <Link to="/about" className="button">Learn more about me</Link>
//           </div>
//         </div>
//       </section>
      
//       <section className="featured-work">
//         <div className="container">
//           <div className="section-heading">
//             <h2>Featured Work</h2>
//           </div>
          
//           <div className="work-grid">
//             <div className="work-item">
//               <div className="work-content">
//                 <h3>Telecom Provisioning Platform</h3>
//                 <p>Built a multi-region platform with modular React components. Reduced latency from 30s to &lt;10s.</p>
//                 <span className="tech-tag">React</span>
//                 <span className="tech-tag">Node.js</span>
//                 <span className="tech-tag">CI/CD</span>
//               </div>
//             </div>
            
//             <div className="work-item">
//               <div className="work-content">
//                 <h3>SaaS Platform Revamp</h3>
//                 <p>Re-architected UI in React, trimming page loads by 30% and boosting customer satisfaction.</p>
//                 <span className="tech-tag">React</span>
//                 <span className="tech-tag">Redux</span>
//                 <span className="tech-tag">REST APIs</span>
//               </div>
//             </div>
            
//             <div className="work-item">
//               <div className="work-content">
//                 <h3>Dublin Housing Price Prediction</h3>
//                 <p>Created ensemble ML models that predict housing prices with 88% accuracy.</p>
//                 <span className="tech-tag">Python</span>
//                 <span className="tech-tag">ML</span>
//                 <span className="tech-tag">Data Visualization</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="section-cta">
//             <Link to="/experience" className="button">View all projects</Link>
//           </div>
//         </div>
//       </section>
      
//       <section className="contact-cta">
//         <div className="container">
//           <div className="contact-cta-content">
//             <h2>Let's Work Together</h2>
//             <p>Looking for a front-end engineer who can blend technical excellence with data-driven insights?</p>
//             <Link to="/contact" className="button">Contact me</Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;

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
              A former chef turned software craftsman, I blend the discipline of
              a commercial kitchen with the creativity of modern web
              engineering. Between React components and regression models, I
              chase one goal: experiences that feel effortless and perform
              flawlessly.
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
