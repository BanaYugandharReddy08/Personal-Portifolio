import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../services/api';

const ExperiencesContext = createContext();

const initialState = {
  experiences: [],
  loading: false,
  error: null,
  loaded: false,
};

function experiencesReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, experiences: action.payload, loaded: true };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SUCCESS':
      return { ...state, experiences: [...state.experiences, action.payload] };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        experiences: state.experiences.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        experiences: state.experiences.filter((e) => e.id !== action.payload),
      };
    default:
      return state;
  }
}

export const ExperiencesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(experiencesReducer, initialState);

  const loadExperiences = async () => {
    if (state.loaded) return;
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchExperiences();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load experiences');
    }
  };

  const addExperience = async (exp) => {
    try {
      const created = await createExperience(exp);
      dispatch({ type: 'ADD_SUCCESS', payload: created });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load experiences');
      return { success: false };
    }
  };

  const updateExperienceById = async (id, exp) => {
    try {
      const updated = await updateExperience(id, exp);
      dispatch({ type: 'UPDATE_SUCCESS', payload: updated });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load experiences');
      return { success: false };
    }
  };

  const deleteExperienceById = async (id) => {
    try {
      await deleteExperience(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load experiences');
      return { success: false };
    }
  };

  // Data is loaded on demand

  return (
    <ExperiencesContext.Provider
      value={{
        ...state,
        loadExperiences,
        addExperience,
        updateExperienceById,
        deleteExperienceById,
      }}
    >
      {children}
    </ExperiencesContext.Provider>
  );
};

export const useExperiences = () => useContext(ExperiencesContext);
