import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as apiLogin, recordGuestLogin, fetchUserPhoto } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" />;
  }

    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');

      if (!email) {
        setError('Email is required');
        return;
      }

      if (!password) {
        setError('Password is required');
        return;
      }

      try {
        const data = await apiLogin(email, password);
        const photo = await fetchUserPhoto(data.id);
        setAuthenticatedUser({ ...data, profilePicture: photo });
        const username = data.fullName || email.split('@')[0];
        let message = `Welcome, ${username}!`;
        if (data.lastLogin) {
          message += ` Last login: ${new Date(data.lastLogin).toLocaleString()}`;
        }
        toast.success(message);
        navigate('/');
      } catch (err) {
        toast.error(err.message);
      }
    };

  const handleGuestLogin = async () => {
    try {
      await recordGuestLogin();
    } catch (err) {
      // ignore analytics errors
      console.error(err);
    }
    login('guest@example.com', 'guest123');
    navigate('/');
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
                
                <button type="submit" className="button login-button">
                  Sign In
              </button>

                <div className="form-footer">
                  <Link to="/signup" className="link-button">
                    Create account
                  </Link>
                  <button type="button" className="link-button">
                    Forgot password?
                  </button>
                </div>
          </form>

          <div className="guest-login">
            <button type="button" className="button" onClick={handleGuestLogin}>
              Continue as Guest
            </button>
          </div>
          
          <div className="legal-text">
            <p>By continuing you agree to the site's Cookie and Privacy policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;