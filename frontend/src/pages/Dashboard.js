import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, projectAPI } from '../api/api';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, projectsData] = await Promise.all([
        dashboardAPI.getStats(),
        projectAPI.getAll(),
      ]);
      setStats(statsData.stats);
      setProjects(projectsData.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={() => navigate('/projects/new')} className="btn btn-primary">
          + New Project
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tasks Summary</h3>
          {stats?.assignedTasks && (
            <div>
              <p>Todo: {stats.assignedTasks.todo || 0}</p>
              <p>In Progress: {stats.assignedTasks.in_progress || 0}</p>
              <p>Completed: {stats.assignedTasks.completed || 0}</p>
            </div>
          )}
        </div>

        <div className="stat-card warning">
          <h3>Overdue Tasks</h3>
          <p className="big-number">{stats?.overdueCount || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="big-number">{projects.length}</p>
        </div>
      </div>

      <div className="projects-section">
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet. Create one to get started!</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <small>Created: {new Date(project.created_at).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {stats?.recentTasks && stats.recentTasks.length > 0 && (
        <div className="recent-tasks">
          <h2>Recent Tasks</h2>
          <ul>
            {stats.recentTasks.map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong> - {task.project_name}
                <span className={`status ${task.status}`}>{task.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
