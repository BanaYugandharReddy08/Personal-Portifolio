import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  fetchLeetcodeProblems,
  createLeetcodeProblem,
  updateLeetcodeProblem,
  deleteLeetcodeProblem,
} from '../services/api';

const ProblemsContext = createContext();

const initialState = {
  problems: [],
  loading: false,
  error: null,
};

function problemsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, problems: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SUCCESS':
      return { ...state, problems: [...state.problems, action.payload] };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        problems: state.problems.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        problems: state.problems.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

export const ProblemsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(problemsReducer, initialState);

  const loadProblems = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchLeetcodeProblems();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load problems');
    }
  };

  const addProblem = async (problem) => {
    try {
      const created = await createLeetcodeProblem(problem);
      dispatch({ type: 'ADD_SUCCESS', payload: created });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load problems');
      return { success: false };
    }
  };

  const updateProblem = async (id, problem) => {
    try {
      const updated = await updateLeetcodeProblem(id, problem);
      dispatch({ type: 'UPDATE_SUCCESS', payload: updated });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load problems');
      return { success: false };
    }
  };

  const deleteProblemById = async (id) => {
    try {
      await deleteLeetcodeProblem(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load problems');
      return { success: false };
    }
  };

  // Data is loaded on demand

  return (
    <ProblemsContext.Provider
      value={{
        ...state,
        loadProblems,
        addProblem,
        updateProblem,
        deleteProblemById,
      }}
    >
      {children}
    </ProblemsContext.Provider>
  );
};

export const useProblems = () => useContext(ProblemsContext);
