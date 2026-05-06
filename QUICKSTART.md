# Quick Start Guide - Local Development

Get the Team Task Manager running on your local machine in 5 minutes!

## Prerequisites
- Node.js v14+ installed
- PostgreSQL installed and running
- Git installed

## Step 1: Clone the Repository

```bash
# Navigate to your workspace
cd c:\Users\Lenovo\Desktop\ethara

# Clone (or navigate to existing folder)
cd team-task-manager
```

## Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your PostgreSQL credentials
# Windows: notepad .env
# Mac/Linux: nano .env

# Example .env:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=team_task_manager
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=dev_secret_key_123
# PORT=5000
```

## Step 3: Create Database

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE team_task_manager;

# Exit
\q
```

## Step 4: Start Backend

```bash
# Still in backend directory
npm run dev

# You should see:
# Server running on port 5000
# Database tables initialized successfully!
```

## Step 5: Setup Frontend (New Terminal)

```bash
# Navigate to frontend
cd team-task-manager\frontend

# Install dependencies
npm install

# Start development server
npm start

# Browser will open at http://localhost:3000
```

## Step 6: Test the Application

1. **Sign Up**
   - Click "Sign Up"
   - Fill in credentials
   - Click "Create Account"

2. **Create Project**
   - Click "New Project"
   - Enter project details
   - Click "Create"

3. **Add Tasks**
   - Click on project
   - Click "Add Task"
   - Fill in task details
   - Click "Create"

4. **Manage Tasks**
   - Change task status
   - Update priorities
   - Delete tasks

## Useful Commands

### Backend
```bash
cd backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# View logs
npm run dev 2>&1 | tail -20
```

### Frontend
```bash
cd frontend

# Development mode
npm start

# Production build
npm run build

# Test build locally
npm run build
serve -s build
```

### Database
```bash
# Connect to PostgreSQL
psql -U postgres -d team_task_manager

# View tables
\dt

# View users
SELECT * FROM users;

# View projects
SELECT * FROM projects;

# View tasks
SELECT * FROM tasks;
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Change port in .env if needed
PORT=5001
```

### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rmdir /s node_modules

# Reinstall
npm install
npm start
```

### Database connection error
```bash
# Check PostgreSQL is running
# Start PostgreSQL service (Windows)
# Go to Services and restart "PostgreSQL"

# Test connection
psql -U postgres -h localhost
```

## API Testing

### Using curl
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{ \"username\": \"testuser\", \"email\": \"test@example.com\", \"password\": \"password123\" }"

# Login
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{ \"email\": \"test@example.com\", \"password\": \"password123\" }"

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer TOKEN"
```

### Using Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request
3. Set method (POST, GET, etc.)
4. Enter URL: `http://localhost:5000/api/...`
5. Add headers: `Content-Type: application/json`
6. Add Authorization: `Bearer YOUR_TOKEN`
7. Click Send

## File Structure Review

```
team-task-manager/
├── backend/
│   ├── server.js          ← Main backend file
│   ├── .env               ← Your config (create this!)
│   ├── package.json
│   └── config/db/
│
├── frontend/
│   ├── public/index.html
│   ├── src/App.js         ← Main frontend file
│   ├── package.json
│   └── src/pages/
│
└── README.md              ← Full documentation
```

## What's Next?

1. **Explore the Code**
   - Check backend/server.js
   - Check frontend/src/App.js
   - Review controllers and components

2. **Customize**
   - Modify colors in CSS files
   - Add new features
   - Change database schema

3. **Deploy**
   - Follow DEPLOYMENT_GUIDE.md for Railway setup
   - Push to GitHub
   - Deploy to production

## Getting Help

- Check README.md for full documentation
- Review DEPLOYMENT_GUIDE.md for deployment
- Check API endpoints in README.md
- Review component files for implementation examples

---

**Happy coding! 🚀**

Having issues? Check the Troubleshooting section or review the full README.md
