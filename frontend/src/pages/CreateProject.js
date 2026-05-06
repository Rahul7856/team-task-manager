import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../api/api';
import '../styles/form.css';

export const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await projectAPI.create(formData.name, formData.description);
      navigate(`/projects/${result.project.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h1>Create New Project</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength="2"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
