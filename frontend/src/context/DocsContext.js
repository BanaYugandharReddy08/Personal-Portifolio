import { createContext, useContext, useReducer } from 'react';
import { fetchDocs, uploadDocument } from '../services/api';

const DocsContext = createContext();

const initialState = {
  docs: {},
  loading: false,
  error: null,
};

function docsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, docs: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'UPLOAD_SUCCESS':
      return { ...state, docs: { ...state.docs, ...action.payload } };
    default:
      return state;
  }
}

export const DocsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(docsReducer, initialState);

  const loadDocs = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchDocs();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
    }
  };

  const uploadDoc = async (type, file) => {
    try {
      const uploaded = await uploadDocument(type, file);
      dispatch({ type: 'UPLOAD_SUCCESS', payload: { [type]: uploaded } });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      return { success: false };
    }
  };

  return (
    <DocsContext.Provider value={{ ...state, loadDocs, uploadDoc }}>
      {children}
    </DocsContext.Provider>
  );
};

export const useDocs = () => useContext(DocsContext);
