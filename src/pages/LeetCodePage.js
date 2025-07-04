import { useState, useEffect, useMemo } from 'react';
import './LeetCodePage.css';
import defaultProblems from '../data/leetcodeProblems';
import ProgressCircle from '../components/leetcode/ProgressCircle';



const ProblemModal = ({ problem, onClose, onEdit }) => {
  const { solution } = problem;
  const [lang, setLang] = useState(() => {
    if (solution && solution.javascript) return 'javascript';
    if (solution && solution.python) return 'python';
    return 'javascript';
  });
  const showSolution = solution && (solution.javascript || solution.python);

  useEffect(() => {
    if (solution && solution.javascript) {
      setLang('javascript');
    } else if (solution && solution.python) {
      setLang('python');
    }
  }, [problem]);

  return (
    <div className="problem-modal" onClick={onClose}>
      <div className="problem-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{problem.title}</h2>
        <p className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</p>
        {problem.dateSolved && (
          <p className="date">Solved on: {new Date(problem.dateSolved).toLocaleDateString()}</p>
        )}
        {problem.statement && <p className="statement">{problem.statement}</p>}
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
        {problem.link && (
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="leetcode-link"
          >
            View on LeetCode
          </a>
        )}
        {onEdit && (
          <button type="button" className="button" onClick={() => onEdit(problem.id)}>
            Edit Problem
          </button>
        )}
      </div>
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

  const initialForm = {
    title: '',
    difficulty: 'Easy',
    link: '',
    notes: '',
    statement: '',
    solutionJS: '',
    solutionPython: '',
    dateSolved: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [selectedDifficulties, setSelectedDifficulties] = useState({
    Easy: true,
    Medium: true,
    Hard: true,
  });

  const [dateRange, setDateRange] = useState('all');

  const difficultyCounts = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach((p) => {
      counts[p.difficulty] = (counts[p.difficulty] || 0) + 1;
    });
    return counts;
  }, [problems]);

  const totalSolved = problems.length;
  const easyPct = totalSolved ? (difficultyCounts.Easy / totalSolved) * 100 : 0;
  const medPct = totalSolved ? (difficultyCounts.Medium / totalSolved) * 100 : 0;
  const hardPct = totalSolved ? (difficultyCounts.Hard / totalSolved) * 100 : 0;

  const filteredProblems = useMemo(() => {
    const now = new Date();
    return problems.filter((p) => {
      if (!selectedDifficulties[p.difficulty]) return false;

      if (dateRange !== 'all') {
        const solved = new Date(p.dateSolved);
        const diffDays = (now - solved) / (1000 * 60 * 60 * 24);
        if (dateRange === 'week' && diffDays > 7) return false;
        if (dateRange === 'month' && diffDays > 30) return false;
      }
      return true;
    });
  }, [problems, selectedDifficulties, dateRange]);

  useEffect(() => {
    localStorage.setItem('leetcodeProblems', JSON.stringify(problems));
  }, [problems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEditProblem = (id) => {
    const problem = problems.find((p) => p.id === id);
    if (!problem) return;
    setFormData({
      title: problem.title,
      difficulty: problem.difficulty,
      link: problem.link,
      notes: problem.notes || '',
      statement: problem.statement || '',
      solutionJS: problem.solution?.javascript || '',
      solutionPython: problem.solution?.python || '',
      dateSolved: problem.dateSolved,
    });
    setEditingId(id);
    setIsFormOpen(true);
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
      dateSolved: new Date().toISOString(),
      solution: {
        javascript: solutionJS,
        python: solutionPython,
      },
    };

    if (editingId) {
      setProblems(problems.map((p) => (p.id === editingId ? { ...newProblem, id: editingId } : p)));
      setFormMessage('Problem updated successfully.');
    } else {
      setProblems([...problems, { ...newProblem, id: Date.now().toString() }]);
      setFormMessage('Problem added successfully.');
    }

    setFormData(initialForm);
    setEditingId(null);
    setIsFormOpen(false);
    setTimeout(() => setFormMessage(''), 3000);
  };

  const toggleDifficulty = (diff) => {
    setSelectedDifficulties((prev) => ({ ...prev, [diff]: !prev[diff] }));
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  return (
    <div className="leetcode-page">
      <div className="container">
        <h1>LeetCode Problems</h1>
        <div className="progress-summary">
          <div className="total-solved">Total Solved: {totalSolved}</div>
          <div className="progress-circles">
            <ProgressCircle
              label="Easy"
              value={difficultyCounts.Easy}
              total={totalSolved}
              color="var(--success-600)"
            />
            <ProgressCircle
              label="Medium"
              value={difficultyCounts.Medium}
              total={totalSolved}
              color="var(--warning-600)"
            />
            <ProgressCircle
              label="Hard"
              value={difficultyCounts.Hard}
              total={totalSolved}
              color="var(--error-600)"
            />
          </div>
        </div>

        <button type="button" className="button" onClick={openAddForm}>
          Add New Problem
        </button>

        <div className="filter-controls">
          <div className="difficulty-filter">
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <label key={diff}>
                <input
                  type="checkbox"
                  checked={selectedDifficulties[diff]}
                  onChange={() => toggleDifficulty(diff)}
                />
                {diff}
              </label>
            ))}
          </div>
          <div className="date-filter">
            <select value={dateRange} onChange={handleDateRangeChange}>
              <option value="all">All Dates</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>

        {isFormOpen && (
          <div className="problem-modal" onClick={() => setIsFormOpen(false)}>
            <div
              className="problem-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-button"
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
              <h2>{editingId ? 'Edit Problem' : 'Add New Problem'}</h2>
              <form className="leetcode-form" onSubmit={handleSubmit}>
                {formMessage && (
                  <div className="form-message">{formMessage}</div>
                )}
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
                  <label htmlFor="statement">Problem Statement</label>
                  <textarea
                    id="statement"
                    name="statement"
                    rows="3"
                    value={formData.statement}
                    onChange={handleChange}
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

                {/* <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div> */}
                <button type="submit" className="button">
                  {editingId ? 'Save Changes' : 'Add Problem'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="problems-table-wrapper">
          <table className="problems-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date Solved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      {p.title}
                    </a>
                  </td>
                  <td>{new Date(p.dateSolved).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="button outline"
                      onClick={() => setSelectedProblem(p)}
                      aria-label={`View ${p.title}`}
                    >
                      View
                    </button>
                    <button
                      className="button outline"
                      onClick={() => handleEditProblem(p.id)}
                      aria-label={`Edit ${p.title}`}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProblems.length === 0 && (
          <div className="no-results">
            <p>No problems found for these filters.</p>
          </div>
        )}

        {selectedProblem && (
          <ProblemModal
            problem={selectedProblem}
            onClose={() => setSelectedProblem(null)}
            onEdit={(id) => {
              setSelectedProblem(null);
              handleEditProblem(id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LeetCodePage;
