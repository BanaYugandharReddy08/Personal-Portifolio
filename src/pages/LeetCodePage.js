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
        {(problem.link || onEdit) && (
          <div className="modal-actions">
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
    lcId: '',
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
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [difficultyFilter, setDifficultyFilter] = useState('all');


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const difficultyCounts = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach((p) => {
      counts[p.difficulty] = (counts[p.difficulty] || 0) + 1;
    });
    return counts;
  }, [problems]);

  const totalSolved = problems.length;

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [problems, difficultyFilter]);

  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [difficultyFilter, pageSize]);

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
      lcId: problem.lcId || '',
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
    if (!formData.title || !formData.link || !formData.lcId) {
      setFormMessage('Please provide an ID, title and link.');
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


  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
  };


  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    setProblems(problems.filter((p) => p.id !== confirmDelete));
    setConfirmDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="leetcode-page">
      <div className="container">
        <h1>LeetCode Problems</h1>
        <div className="progress-summary">
          <div className="summary-header">
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
          <button
            type="button"
            className="button add-problem-btn"
            onClick={openAddForm}
          >
            Add New Problem
          </button>
        </div>

        <div className="results-grid">
          <div className="filter-controls">
            <div className="difficulty-filter">
              <select value={difficultyFilter} onChange={handleDifficultyChange}>
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="table-section">
            <div className="problems-table-wrapper">
              <table className="problems-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>LC ID</th>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProblems.map((p, idx) => (
                    <tr key={p.id}>
                      <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td>{p.lcId}</td>
                      <td>
                        <a href={p.link} target="_blank" rel="noopener noreferrer">
                          {p.title}
                        </a>
                      </td>
                      <td>{p.difficulty}</td>
                      <td>
                        <div className="action-buttons">
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
                          <button
                            className="button outline"
                            onClick={() => handleDeleteClick(p.id)}
                            aria-label={`Delete ${p.title}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-controls">
                <button
                  className="button outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                  className="button outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <select
                  aria-label="page size"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

        {filteredProblems.length === 0 && (
          <div className="no-results">
            <p>No problems found for these filters.</p>
          </div>
        )}
        </div>
      </div>

      {confirmDelete && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h3>Delete this problem?</h3>
            <p>This action can't be undone.</p>
            <div className="confirm-dialog-actions">
              <button onClick={handleCancelDelete} className="button outline">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="button accent">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <label htmlFor="lcId">LC ID*</label>
                  <input
                    id="lcId"
                    name="lcId"
                    type="text"
                    value={formData.lcId}
                    onChange={handleChange}
                    required
                  />
                </div>

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
