import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  afterEach(() => {
    localStorage.clear();
  });

  beforeEach(() => {
    process.env.REACT_APP_ADMIN_EMAIL = 'admin@test.com';
    process.env.REACT_APP_ADMIN_PASSWORD = 'admin123';
  });

  test('login, 2FA and logout flow', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    act(() => {
      response = result.current.login('admin@test.com', 'admin123');
    });

    expect(response.requireVerification).toBe(true);
    expect(result.current.verificationCode).toHaveLength(6);

    const code = result.current.verificationCode;
    act(() => {
      response = result.current.login('admin@test.com', 'admin123', code);
    });

    expect(response.success).toBe(true);
    expect(result.current.user.email).toBe('admin@test.com');
    expect(result.current.token).toBe('admin-token');

    act(() => {
      result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});
