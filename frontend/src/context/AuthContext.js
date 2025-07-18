import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState(null);

  const setAuthenticatedUser = (apiUser) => {
    if (!apiUser) return;
    setUser({
      id: apiUser.id ? apiUser.id.toString() : Date.now().toString(),
      email: apiUser.email,
      name: apiUser.fullName,
      role: apiUser.admin ? 'admin' : 'user',
      profilePic: apiUser.profilePicture || null
    });
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Generate a 6-digit verification code
  const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    return code;
  };

  const login = (email, password, twoFactorCode) => {
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      if (twoFactorCode) {
        if (twoFactorCode === verificationCode) {
          setUser({
            id: '1',
            email,
            name: 'Admin User',
            role: 'admin'
          });
          setToken('admin-token');
          return { success: true, token: 'admin-token' };
        } else {
          return { success: false, error: 'Invalid verification code' };
        }
      } else {
        generateVerificationCode();
        return { success: true, requireVerification: true };
      }
    } else if (email && password) {
      setUser({
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'guest'
      });
      setToken('guest-token');
      return { success: true, token: 'guest-token' };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (fullName, email, password) => {
    if (email && password) {
      setUser({
        id: Date.now().toString(),
        email,
        name: fullName,
        role: 'guest'
      });
      setToken('guest-token');
      return { success: true, token: 'guest-token' };
    }

    return { success: false, error: 'Invalid details' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading, verificationCode, setAuthenticatedUser }}>
      {children}
    </AuthContext.Provider>
  );
};
