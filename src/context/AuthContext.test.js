import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  afterEach(() => {
    localStorage.clear();
  });

  test('login, 2FA and logout flow', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    act(() => {
      response = result.current.login('yugandharreddybana@outlook.com', 'admin123');
    });

    expect(response.requireVerification).toBe(true);
    expect(result.current.verificationCode).toHaveLength(6);

    const code = result.current.verificationCode;
    act(() => {
      response = result.current.login('yugandharreddybana@outlook.com', 'admin123', code);
    });

    expect(response.success).toBe(true);
    expect(result.current.user.email).toBe('yugandharreddybana@outlook.com');

    act(() => {
      result.current.logout();
    });
    expect(result.current.user).toBeNull();
  });
});
