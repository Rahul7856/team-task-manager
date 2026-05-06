import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const projectAPI = {
  create: async (name, description) => {
    const response = await axios.post(`${API_URL}/projects`, { name, description }, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}/projects`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getById: async (projectId) => {
    const response = await axios.get(`${API_URL}/projects/${projectId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (projectId, name, description) => {
    const response = await axios.patch(`${API_URL}/projects/${projectId}`, { name, description }, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  addMember: async (projectId, userId, role = 'member') => {
    const response = await axios.post(
      `${API_URL}/projects/${projectId}/members`,
      { userId, role },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  removeMember: async (projectId, memberId) => {
    const response = await axios.delete(
      `${API_URL}/projects/${projectId}/members/${memberId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};

export const taskAPI = {
  create: async (projectId, title, description, assignedTo, priority, dueDate) => {
    const response = await axios.post(
      `${API_URL}/tasks/projects/${projectId}/tasks`,
      { title, description, assignedTo, priority, dueDate },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getProjectTasks: async (projectId, filters = {}) => {
    const response = await axios.get(`${API_URL}/tasks/projects/${projectId}/tasks`, {
      params: filters,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (projectId, taskId, updates) => {
    const response = await axios.patch(
      `${API_URL}/tasks/projects/${projectId}/tasks/${taskId}`,
      updates,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  delete: async (projectId, taskId) => {
    const response = await axios.delete(
      `${API_URL}/tasks/projects/${projectId}/tasks/${taskId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await axios.get(`${API_URL}/tasks/dashboard/stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
