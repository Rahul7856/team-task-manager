const pool = require('../db/connection');
const { validationResult } = require('express-validator');

// Create task
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { title, description, assignedTo = null, priority = 'medium', dueDate = null } = req.body;
    const createdBy = req.user.userId;

    // Check if user is project member
    const isMember = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, createdBy]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, assigned_to, priority, due_date, created_by, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [projectId, title, description || null, assignedTo || null, priority, dueDate || null, createdBy, 'todo']
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get project tasks
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const { status, assignedTo, priority } = req.query;

    // Check if user is project member
    const isMember = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    let query = 'SELECT * FROM tasks WHERE project_id = $1';
    const params = [projectId];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    if (assignedTo) {
      query += ` AND assigned_to = $${params.length + 1}`;
      params.push(assignedTo);
    }

    if (priority) {
      query += ` AND priority = $${params.length + 1}`;
      params.push(priority);
    }

    query += ' ORDER BY due_date ASC, priority DESC';

    const result = await pool.query(query, params);

    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    const userId = req.user.userId;

    // Check if user is project member
    const isMember = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    // Get current task
    const currentTask = await pool.query('SELECT * FROM tasks WHERE id = $1 AND project_id = $2', [taskId, projectId]);

    if (currentTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = currentTask.rows[0];

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, due_date = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        title || task.title,
        description !== undefined ? description : task.description,
        status || task.status,
        priority || task.priority,
        assignedTo !== undefined ? assignedTo : task.assigned_to,
        dueDate !== undefined ? dueDate : task.due_date,
        taskId,
      ]
    );

    res.json({
      message: 'Task updated successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const userId = req.user.userId;

    // Check if user is project admin
    const isAdmin = await pool.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2 AND role = $3',
      [projectId, userId, 'admin']
    );

    if (isAdmin.rows.length === 0) {
      return res.status(403).json({ error: 'Only admins can delete tasks' });
    }

    await pool.query('DELETE FROM tasks WHERE id = $1 AND project_id = $2', [taskId, projectId]);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get assigned tasks
    const assignedTasks = await pool.query(
      `SELECT COUNT(*) as count, status FROM tasks
       WHERE assigned_to = $1
       GROUP BY status`,
      [userId]
    );

    // Get overdue tasks
    const overdueTasks = await pool.query(
      `SELECT COUNT(*) as count FROM tasks
       WHERE assigned_to = $1 AND status != 'completed' AND due_date < CURRENT_DATE`,
      [userId]
    );

    // Get recent tasks
    const recentTasks = await pool.query(
      `SELECT t.*, p.name as project_name FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [userId]
    );

    const stats = {
      assignedTasks: assignedTasks.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, {}),
      overdueCount: parseInt(overdueTasks.rows[0]?.count || 0),
      recentTasks: recentTasks.rows,
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
