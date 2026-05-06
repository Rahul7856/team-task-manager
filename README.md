# Team Task Manager - Full Stack Application

A complete web application for managing projects and tasks with role-based access control. Built with Node.js, Express, React, and PostgreSQL.

## 🚀 Features

### ✅ Authentication & Authorization
- User signup and login with JWT-based authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcryptjs
- Protected routes and API endpoints

### ✅ Project Management
- Create and manage projects
- Add/remove team members
- Set member roles (Admin/Member)
- Project descriptions and metadata

### ✅ Task Management
- Create tasks within projects
- Assign tasks to team members
- Track task status (Todo, In Progress, Completed)
- Set task priorities (Low, Medium, High)
- Due date management
- Filter tasks by status, priority, and assignee

### ✅ Dashboard
- Overview of task statistics
- Display assigned tasks grouped by status
- Highlight overdue tasks
- Quick access to recent tasks
- Project summary

### ✅ Data Validations & Relationships
- Input validation using express-validator
- Foreign key relationships for data integrity
- Unique constraints for usernames and emails
- Proper error handling throughout the application

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Git

## ⚙️ Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd team-task-manager
\`\`\`

### 2. Backend Setup

#### Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

#### Configure Environment Variables
\`\`\`bash
# Copy the example env file
cp .env.example .env
\`\`\`

Edit \`.env\` with your database credentials:
\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_NAME=team_task_manager
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
\`\`\`

#### Create Database
\`\`\`bash
# Using PostgreSQL CLI
psql -U postgres -c "CREATE DATABASE team_task_manager;"
\`\`\`

#### Start Backend Server
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
\`\`\`bash
cd frontend
npm install
\`\`\`

#### Configure Environment (Optional)
Create \`.env.local\` if needed:
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

#### Start Frontend Development Server
\`\`\`bash
npm start
\`\`\`

The frontend will open at `http://localhost:3000`

## 📁 Project Structure

\`\`\`
team-task-manager/
├── backend/
│   ├── config/
│   │   └── auth.js                 # Auth utilities (hashing, JWT)
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   ├── projectController.js    # Project logic
│   │   └── taskController.js       # Task logic
│   ├── db/
│   │   ├── connection.js           # Database connection
│   │   └── init.js                 # Database initialization
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── projectRoutes.js        # Project endpoints
│   │   └── taskRoutes.js           # Task endpoints
│   ├── .env.example                # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # Express app setup
│
├── frontend/
│   ├── public/
│   │   └── index.html              # Main HTML file
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js              # API calls
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js      # Auth state management
│   │   ├── pages/
│   │   │   ├── Auth.js             # Login/Signup pages
│   │   │   ├── Dashboard.js        # Dashboard page
│   │   │   ├── ProjectDetails.js   # Project details page
│   │   │   └── CreateProject.js    # Create project page
│   │   ├── styles/
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   ├── navbar.css
│   │   │   ├── project.css
│   │   │   └── form.css
│   │   ├── App.js                  # Main App component
│   │   ├── App.css
│   │   ├── index.js                # React entry point
│   │   └── index.css
│   ├── .gitignore
│   └── package.json
│
└── README.md                        # This file
\`\`\`

## 🔌 API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Create new user account
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user (requires auth)

### Projects
- \`GET /api/projects\` - Get all user projects
- \`POST /api/projects\` - Create new project
- \`GET /api/projects/:projectId\` - Get project details
- \`PATCH /api/projects/:projectId\` - Update project
- \`POST /api/projects/:projectId/members\` - Add team member
- \`DELETE /api/projects/:projectId/members/:memberId\` - Remove member

### Tasks
- \`GET /api/tasks/projects/:projectId/tasks\` - Get project tasks
- \`POST /api/tasks/projects/:projectId/tasks\` - Create task
- \`PATCH /api/tasks/projects/:projectId/tasks/:taskId\` - Update task
- \`DELETE /api/tasks/projects/:projectId/tasks/:taskId\` - Delete task
- \`GET /api/tasks/dashboard/stats\` - Get dashboard statistics

## 🔐 Authentication Flow

1. User signs up with email, password, username
2. Password is hashed using bcryptjs
3. User receives JWT token valid for 7 days
4. Token is stored in localStorage
5. All API requests include Bearer token in Authorization header
6. Protected routes verify token validity

## 👥 Role-Based Access Control

### Admin
- Full project access
- Can add/remove members
- Can delete tasks
- Can update project settings

### Member
- Can view project
- Can create and update own tasks
- Can view team members
- Cannot modify project settings

## 🚀 Deployment

### Deploy on Railway

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

3. **Create Backend Service**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables from .env
   - Railway will auto-detect Node.js backend

4. **Create Database Service**
   - Click "Add Service" → "Add Database"
   - Select PostgreSQL
   - Railway will provide DATABASE_URL

5. **Configure Environment Variables**
   - Update your variables with Railway's DATABASE_URL:
     \`\`\`
     DATABASE_URL=postgresql://user:password@host:port/database
     JWT_SECRET=your_secret_key
     FRONTEND_URL=your_frontend_url
     \`\`\`

6. **Deploy Frontend**
   - You can deploy the frontend on Vercel, Netlify, or another Railway service
   - Update REACT_APP_API_URL to your Railway backend URL

7. **Monitor and Manage**
   - Monitor logs in Railway dashboard
   - View metrics and resources
   - Configure domains and SSL

## 📝 Usage Examples

### Sign Up
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123",
    "firstName": "John",
    "lastName": "Doe"
  }'
\`\`\`

### Create Project
\`\`\`bash
curl -X POST http://localhost:5000/api/projects \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "name": "Website Redesign",
    "description": "Complete website redesign project"
  }'
\`\`\`

### Create Task
\`\`\`bash
curl -X POST http://localhost:5000/api/tasks/projects/1/tasks \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "title": "Design homepage",
    "description": "Create mockups for homepage",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
\`\`\`

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Verify database exists: \`psql -l\`

### Port Already in Use
- Backend: \`lsof -i :5000\` and kill process or change PORT in .env
- Frontend: \`lsof -i :3000\` and kill process

### CORS Issues
- Check FRONTEND_URL matches your frontend domain
- Ensure backend CORS middleware is configured correctly

### Authentication Errors
- Clear localStorage and try logging in again
- Check JWT_SECRET is set correctly
- Verify token format in Authorization header

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Guide](https://jwt.io/introduction)
- [Railway Documentation](https://docs.railway.app/)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a full-stack web application assignment.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

**Happy coding! 🎉**

For questions or issues, please create a GitHub issue.
