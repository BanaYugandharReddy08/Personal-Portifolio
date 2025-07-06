import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  fetchCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../services/api';

const CertificatesContext = createContext();

const initialState = {
  certificates: [],
  loading: false,
  error: null,
};

function certificatesReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, certificates: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SUCCESS':
      return { ...state, certificates: [...state.certificates, action.payload] };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        certificates: state.certificates.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        certificates: state.certificates.filter((c) => c.id !== action.payload),
      };
    default:
      return state;
  }
}

export const CertificatesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(certificatesReducer, initialState);

  const loadCertificates = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchCertificates();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
    }
  };

  const addCertificate = async (certificate) => {
    try {
      const created = await createCertificate(certificate);
      dispatch({ type: 'ADD_SUCCESS', payload: created });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      return { success: false };
    }
  };

  const updateCertificateById = async (id, certificate) => {
    try {
      const updated = await updateCertificate(id, certificate);
      dispatch({ type: 'UPDATE_SUCCESS', payload: updated });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      return { success: false };
    }
  };

  const deleteCertificateById = async (id) => {
    try {
      await deleteCertificate(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      return { success: false };
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  return (
    <CertificatesContext.Provider
      value={{
        ...state,
        loadCertificates,
        addCertificate,
        updateCertificateById,
        deleteCertificateById,
      }}
    >
      {children}
    </CertificatesContext.Provider>
  );
};

export const useCertificates = () => useContext(CertificatesContext);
