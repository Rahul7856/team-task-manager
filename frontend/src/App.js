import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignUp, LogIn } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { CreateProject } from './pages/CreateProject';
import { ProjectDetails } from './pages/ProjectDetails';
import './App.css';

function AppContent() {
  const { isAuthenticated, token, getCurrentUser } = useAuth();

  useEffect(() => {
    if (token && !isAuthenticated) {
      getCurrentUser();
    }
  }, [token, isAuthenticated, getCurrentUser]);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
