import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 onClick={() => navigate('/dashboard')}>Task Manager</h1>
      </div>
      <div className="navbar-menu">
        {user && (
          <>
            <span className="user-info">
              Welcome, <strong>{user.username}</strong>
            </span>
            <button onClick={() => navigate('/dashboard')} className="nav-link">
              Dashboard
            </button>
            <button onClick={() => navigate('/projects/new')} className="nav-link">
              New Project
            </button>
            <button onClick={handleLogout} className="nav-link logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
