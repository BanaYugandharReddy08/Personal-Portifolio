import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AccountPage.css';

const AccountPage = () => {
  const { user, setAuthenticatedUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [error, setError] = useState('');

  const validatePassword = (pw) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*]).{8,}$/;
    return regex.test(pw);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number and symbol.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setAuthenticatedUser({
      id: user.id,
      email,
      fullName,
      admin: user.role === 'admin',
      profilePicture: profilePic,
    });
    setEdit(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="account-page">
      <div className="container">
        {!edit ? (
          <div className="account-info">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="profile-image"
                data-testid="profile-image"
              />
            ) : (
              <FaRobot className="profile-image" data-testid="profile-image" />
            )}
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <button className="button" onClick={() => setEdit(true)}>
              Edit
            </button>
          </div>
        ) : (
          <form className="account-form" onSubmit={handleSave}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="profilePic">Profile Picture</label>
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
            </div>
            <button type="submit" className="button">
              Save
            </button>
            <button
              type="button"
              className="button outline"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountPage;

