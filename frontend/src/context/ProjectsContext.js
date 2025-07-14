import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectReport,
  fetchProjectReport,
} from '../services/api';

const ProjectsContext = createContext();

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

function projectsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, projects: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SUCCESS':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

export const ProjectsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectsReducer, initialState);

  const loadProjects = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchProjects();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load projects');
    }
  };

  const addProject = async (proj) => {
    try {
      const created = await createProject(proj);
      dispatch({ type: 'ADD_SUCCESS', payload: created });
      return { success: true, project: created };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load projects');
      return { success: false };
    }
  };

  const updateProjectById = async (id, proj) => {
    try {
      const updated = await updateProject(id, proj);
      dispatch({ type: 'UPDATE_SUCCESS', payload: updated });
      return { success: true, project: updated };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load projects');
      return { success: false };
    }
  };

  const deleteProjectById = async (id) => {
    try {
      await deleteProject(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      toast.error('Failed to load projects');
      return { success: false };
    }
  };

  const uploadReport = async (id, file) => {
    try {
      const data = await uploadProjectReport(id, file);
      return { success: true, data };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      return { success: false };
    }
  };

  const fetchReport = async (id) => {
    try {
      return await fetchProjectReport(id);
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      return null;
    }
  };

  // Data is loaded on demand

  return (
    <ProjectsContext.Provider
      value={{
        ...state,
        loadProjects,
        addProject,
        updateProjectById,
        deleteProjectById,
        uploadReport,
        fetchReport,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
