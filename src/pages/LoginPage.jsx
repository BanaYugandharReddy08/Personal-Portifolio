import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isGuestMode, setIsGuestMode] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!isGuestMode && !password) {
      setError('Password is required');
      return;
    }

    const result = login(email, isGuestMode ? 'guest123' : password, isVerifying ? verificationCode : null);

    if (result.success) {
      if (result.requireVerification) {
        setIsVerifying(true);
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const toggleGuestMode = () => {
    setIsGuestMode(!isGuestMode);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h1>Welcome back.</h1>
            <p>Sign in for the full experience—or grab a guest pass to browse.</p>
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            {!isVerifying ? (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                
                {!isGuestMode && (
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                )}
                
                <button type="submit" className="button login-button">
                  {isGuestMode ? 'Continue as Guest' : 'Sign In'}
                </button>
                
                <div className="form-footer">
                  <button 
                    type="button" 
                    className="link-button"
                    onClick={toggleGuestMode}
                  >
                    {isGuestMode ? 'I have an account' : 'Only need to look around?'}
                  </button>
                  
                  {!isGuestMode && (
                    <button type="button" className="link-button">
                      Forgot password?
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="verification-info">
                  <p>A verification code has been sent to your email. Please enter it below to complete sign-in.</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="verificationCode">2-factor code (see your inbox)</label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                
                <button type="submit" className="button login-button">
                  Verify & Sign In
                </button>
                
                <div className="form-footer">
                  <button 
                    type="button" 
                    className="link-button"
                    onClick={() => setIsVerifying(false)}
                  >
                    Back to login
                  </button>
                </div>
              </>
            )}
          </form>
          
          <div className="legal-text">
            <p>By continuing you agree to the site's Cookie and Privacy policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;