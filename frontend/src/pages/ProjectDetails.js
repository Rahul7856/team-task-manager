import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI } from '../api/api';
import '../styles/project.css';

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectData, tasksData] = await Promise.all([
        projectAPI.getById(projectId),
        taskAPI.getProjectTasks(projectId),
      ]);
      setProject(projectData.project);
      setMembers(projectData.members);
      setTasks(tasksData.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create(
        projectId,
        newTask.title,
        newTask.description,
        null,
        newTask.priority,
        newTask.dueDate
      );
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowNewTaskForm(false);
      fetchProjectData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.update(projectId, taskId, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await taskAPI.delete(projectId, taskId);
        fetchProjectData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!project) return <div className="error-message">Project not found</div>;

  return (
    <div className="project-details">
      <div className="project-header">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          ← Back
        </button>
        <h1>{project.name}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="project-content">
        <div className="description">
          <h2>Description</h2>
          <p>{project.description || 'No description'}</p>
        </div>

        <div className="members-section">
          <h2>Team Members ({members.length})</h2>
          <div className="members-list">
            {members.map((member) => (
              <div key={member.id} className="member-card">
                <p>
                  <strong>{member.username}</strong>
                </p>
                <p>{member.email}</p>
                <span className={`role ${member.role}`}>{member.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <button onClick={() => setShowNewTaskForm(!showNewTaskForm)} className="btn btn-primary">
              {showNewTaskForm ? 'Cancel' : '+ Add Task'}
            </button>
          </div>

          {showNewTaskForm && (
            <form onSubmit={handleAddTask} className="new-task-form">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <button type="submit">Create Task</button>
            </form>
          )}

          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p>No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={`task-card status-${task.status}`}>
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className={`priority ${task.priority}`}>{task.priority}</span>
                      {task.due_date && (
                        <span className="due-date">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
