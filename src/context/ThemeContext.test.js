import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Provider } from 'react-redux';
import store from '../redux/store';

describe('ThemeContext', () => {
  const wrapper = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );

  afterEach(() => {
    localStorage.clear();
  });

  test('cycles themes and persists to localStorage', () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('neon');
    expect(localStorage.getItem('theme')).toBe('neon');
  });

  test('initializes from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
  });
});
