import { useState, useEffect } from 'react';
import './LeetCodePage.css';
import defaultProblems from '../data/leetcodeProblems';

const ProblemCard = ({ problem }) => {
  const [lang, setLang] = useState('javascript');
  const { solution } = problem;
  const showSolution = solution && (solution.javascript || solution.python);

  return (
    <div className="problem-card">
      <h3>
        <a href={problem.link} target="_blank" rel="noopener noreferrer">
          {problem.title}
        </a>
      </h3>
      <p className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</p>
      {problem.notes && <p className="notes">{problem.notes}</p>}
      {showSolution && (
        <div className="solution-section">
          <div className="solution-tabs">
            {solution.javascript && (
              <button
                type="button"
                className={lang === 'javascript' ? 'active' : ''}
                onClick={() => setLang('javascript')}
              >
                JavaScript
              </button>
            )}
            {solution.python && (
              <button
                type="button"
                className={lang === 'python' ? 'active' : ''}
                onClick={() => setLang('python')}
              >
                Python
              </button>
            )}
          </div>
          <pre>
            <code>{solution[lang]}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

const LeetCodePage = () => {
  const [problems, setProblems] = useState(() => {
    try {
      const saved = localStorage.getItem('leetcodeProblems');
      return saved ? JSON.parse(saved) : defaultProblems;
    } catch (e) {
      console.error('Failed to parse problems', e);
      return defaultProblems;
    }
  });

  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    link: '',
    notes: '',
    solutionJS: '',
    solutionPython: ''
  });
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('leetcodeProblems', JSON.stringify(problems));
  }, [problems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.link) {
      setFormMessage('Please provide a title and link.');
      return;
    }

    const { solutionJS, solutionPython, ...rest } = formData;
    const newProblem = {
      ...rest,
      id: Date.now().toString(),
      solution: {
        javascript: solutionJS,
        python: solutionPython,
      },
    };
    setProblems([...problems, newProblem]);
    setFormData({
      title: '',
      difficulty: 'Easy',
      link: '',
      notes: '',
      solutionJS: '',
      solutionPython: '',
    });
    setFormMessage('Problem added successfully.');
    setTimeout(() => setFormMessage(''), 3000);
  };

  return (
    <div className="leetcode-page">
      <div className="container">
        <h1>LeetCode Problems</h1>

        <form className="leetcode-form" onSubmit={handleSubmit}>
          {formMessage && <div className="form-message">{formMessage}</div>}
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="link">Link*</label>
            <input
              id="link"
              name="link"
              type="url"
              value={formData.link}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="solutionJS">JavaScript Solution</label>
            <textarea
              id="solutionJS"
              name="solutionJS"
              rows="4"
              value={formData.solutionJS}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="solutionPython">Python Solution</label>
            <textarea
              id="solutionPython"
              name="solutionPython"
              rows="4"
              value={formData.solutionPython}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="button">Add Problem</button>
        </form>

        <div className="problems-list">
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeetCodePage;
