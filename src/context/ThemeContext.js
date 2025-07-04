import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/actions/themeActions';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('neon');
    } else if (theme === 'neon') {
      document.documentElement.classList.add('neon');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('neon');
    }
  }, [theme]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
