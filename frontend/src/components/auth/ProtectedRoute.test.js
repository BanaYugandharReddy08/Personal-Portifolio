import { render, screen } from '../../test-utils';
import ProtectedRoute from './ProtectedRoute';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import React from 'react';

const Secret = () => <div>secret</div>;

const renderWithRoute = (ui, { user } = {}) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }

  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/protected" element={ui} />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  afterEach(() => {
    localStorage.clear();
  });
  test('redirects unauthenticated users', () => {
    renderWithRoute(
      <ProtectedRoute>
        <Secret />
      </ProtectedRoute>
    );
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders for authenticated admin', () => {
    renderWithRoute(
      <ProtectedRoute>
        <Secret />
      </ProtectedRoute>,
      { user: { email: 'a@b.com', role: 'admin' } }
    );
    expect(screen.getByText(/secret/i)).toBeInTheDocument();
  });

  test('shows restricted message for guest', () => {
    renderWithRoute(
      <ProtectedRoute>
        <Secret />
      </ProtectedRoute>,
      { user: { email: 'c@d.com', role: 'guest' } }
    );
    expect(screen.getByText(/restricted access/i)).toBeInTheDocument();
  });
});
