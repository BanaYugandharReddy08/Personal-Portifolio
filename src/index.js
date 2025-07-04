import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <App />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
