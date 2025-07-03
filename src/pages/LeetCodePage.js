import { useState, useEffect } from 'react';
import './LeetCodePage.css';
import defaultProblems from '../data/leetcodeProblems';

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
    notes: ''
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

    const newProblem = { ...formData, id: Date.now().toString() };
    setProblems([...problems, newProblem]);
    setFormData({ title: '', difficulty: 'Easy', link: '', notes: '' });
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
            <div key={p.id} className="problem-card">
              <h3>
                <a href={p.link} target="_blank" rel="noopener noreferrer">
                  {p.title}
                </a>
              </h3>
              <p className={`difficulty ${p.difficulty.toLowerCase()}`}>{p.difficulty}</p>
              {p.notes && <p className="notes">{p.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeetCodePage;
