export const SET_THEME = 'SET_THEME';
export const TOGGLE_THEME = 'TOGGLE_THEME';

export const setTheme = (theme) => ({
  type: SET_THEME,
  payload: theme,
});

export const toggleTheme = () => ({
  type: TOGGLE_THEME,
});
