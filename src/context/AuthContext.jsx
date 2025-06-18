import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState(null);

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
    // Mock authentication - In a real app, this would make an API call
    if (email === 'yugandharreddybana@outlook.com' && password === 'admin123') {
      if (twoFactorCode) {
        // Verify the 2FA code (in a real app)
        if (twoFactorCode === verificationCode) {
          setUser({
            id: '1',
            email,
            name: 'Yugandhar Reddy Bana',
            role: 'admin'
          });
          return { success: true };
        } else {
          return { success: false, error: 'Invalid verification code' };
        }
      } else {
        // Send verification code (simulate email)
        const code = generateVerificationCode();
        console.log(`Verification code: ${code}`); // In a real app, this would be sent via email
        return { success: true, requireVerification: true };
      }
    } else if (email && password) {
      // For guest login
      setUser({
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'guest'
      });
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, verificationCode }}>
      {children}
    </AuthContext.Provider>
  );
};