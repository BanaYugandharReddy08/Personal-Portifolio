import { SET_THEME, TOGGLE_THEME } from '../actions/themeActions';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState = getInitialTheme();

export default function themeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_THEME:
      localStorage.setItem('theme', action.payload);
      return action.payload;
    case TOGGLE_THEME: {
      const next = state === 'light' ? 'dark' : state === 'dark' ? 'neon' : 'light';
      localStorage.setItem('theme', next);
      return next;
    }
    default:
      return state;
  }
}
