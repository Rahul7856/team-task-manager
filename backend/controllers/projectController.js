const pool = require('../db/connection');
const { validationResult } = require('express-validator');

// Create project
exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const ownerId = req.user.userId;

    const result = await pool.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, ownerId]
    );

    const project = result.rows[0];

    // Add owner as project admin
    await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [project.id, ownerId, 'admin']
    );

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all projects for user
exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT DISTINCT p.* FROM projects p
       JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = $1 OR p.owner_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get project details with members
exports.getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    // Check if user is member
    const isMember = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (isMember.rows.length === 0 && userId !== req.user.userId) {
      // Also check if user is owner
      const isOwner = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND owner_id = $2',
        [projectId, userId]
      );

      if (isOwner.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);

    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const members = await pool.query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name, pm.role
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = $1`,
      [projectId]
    );

    res.json({
      project: project.rows[0],
      members: members.rows,
    });
  } catch (error) {
    console.error('Get project details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add member to project
exports.addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId: memberId, role = 'member' } = req.body;
    const requestorId = req.user.userId;

    // Check if requester is project admin
    const adminCheck = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2 AND role = $3',
      [projectId, requestorId, 'admin']
    );

    if (adminCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Only admins can add members' });
    }

    // Add member
    const result = await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3 RETURNING *',
      [projectId, memberId, role]
    );

    res.status(201).json({
      message: 'Member added successfully',
      member: result.rows[0],
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove member from project
exports.removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const requestorId = req.user.userId;

    // Check if requester is project admin
    const adminCheck = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2 AND role = $3',
      [projectId, requestorId, 'admin']
    );

    if (adminCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Only admins can remove members' });
    }

    await pool.query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, memberId]
    );

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.userId;

    // Check if user is project owner
    const project = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND owner_id = $2',
      [projectId, userId]
    );

    if (project.rows.length === 0) {
      return res.status(403).json({ error: 'Only owner can update project' });
    }

    const result = await pool.query(
      'UPDATE projects SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name || project.rows[0].name, description !== undefined ? description : project.rows[0].description, projectId]
    );

    res.json({
      message: 'Project updated successfully',
      project: result.rows[0],
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
