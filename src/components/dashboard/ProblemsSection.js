import { useState, useEffect } from 'react';
import { useProblems } from '../../context/ProblemsContext';
import '../../pages/DashboardPage.css';

const initialForm = {
  lcId: '',
  title: '',
  difficulty: 'Easy',
  link: '',
  statement: '',
  solutionJS: '',
  solutionPython: '',
};

function ProblemsSection() {
  const {
    problems,
    loading,
    error,
    addProblem,
    updateProblem,
    deleteProblemById,
    loadProblems,
  } = useProblems();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (problems.length === 0) {
      loadProblems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = {
      lcId: formData.lcId,
      title: formData.title,
      difficulty: formData.difficulty,
      link: formData.link,
      statement: formData.statement,
      solution: {
        javascript: formData.solutionJS,
        python: formData.solutionPython,
      },
    };

    if (editingId) {
      const { success } = await updateProblem(editingId, problem);
      if (success) {
        showNotification('Problem updated successfully');
      } else {
        showNotification('Failed to update problem', 'error');
        return;
      }
    } else {
      const { success } = await addProblem(problem);
      if (success) {
        showNotification('Problem added successfully');
      } else {
        showNotification('Failed to add problem', 'error');
        return;
      }
    }

    setFormData(initialForm);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (id) => {
    const p = problems.find((pr) => pr.id === id);
    if (!p) return;
    setEditingId(id);
    setFormData({
      lcId: p.lcId,
      title: p.title,
      difficulty: p.difficulty,
      link: p.link,
      statement: p.statement || '',
      solutionJS: p.solution?.javascript || '',
      solutionPython: p.solution?.python || '',
    });
    setIsAdding(true);
  };

  const handleConfirmDelete = async () => {
    const { success } = await deleteProblemById(confirmDelete);
    if (success) {
      showNotification('Problem deleted successfully');
    } else {
      showNotification('Failed to delete problem', 'error');
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="problems-section">
      <div className="dashboard-header">
        <h2>LeetCode Problems</h2>
        <button className="button" onClick={() => { setIsAdding(true); setEditingId(null); setFormData(initialForm); }}>
          Add New Problem
        </button>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}

      {confirmDelete && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h3>Delete this problem?</h3>
            <p>This action can't be undone.</p>
            <div className="confirm-dialog-actions">
              <button onClick={() => setConfirmDelete(null)} className="button outline">Cancel</button>
              <button onClick={handleConfirmDelete} className="button accent">Delete</button>
            </div>
          </div>
        </div>
      )}

      {isAdding ? (
        <div className="certificate-form-container">
          <h2>{editingId ? 'Edit Problem' : 'Add New Problem'}</h2>
          <form className="certificate-form" onSubmit={handleSubmit}>
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
            <div className="form-actions">
              <button type="button" className="button outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                Cancel
              </button>
              <button type="submit" className="button">
                {editingId ? 'Save Changes' : 'Add New Problem'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="certificates-container">
          {problems.length === 0 ? (
            <div className="empty-state">
              <h3>No problems added yet.</h3>
            </div>
          ) : (
            <div className="certificates-grid">
              {problems.map((p) => (
                <div className="certificate-card" key={p.id}>
                  <div className="certificate-details">
                    <h3>{p.title}</h3>
                    <p className="certificate-issuer">Difficulty: {p.difficulty}</p>
                  </div>
                  <div className="certificate-actions">
                    <button
                      className="icon-button edit-button"
                      onClick={() => handleEdit(p.id)}
                      aria-label="Edit problem"
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-button delete-button"
                      onClick={() => setConfirmDelete(p.id)}
                      aria-label="Delete problem"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProblemsSection;
