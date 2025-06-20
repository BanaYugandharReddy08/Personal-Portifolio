import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const AllProviders = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
