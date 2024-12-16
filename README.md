# Pro Manage | Project Task Manager

Pro Manage is a project management application designed to help users manage tasks efficiently, built using the MERN (MongoDB, Express.js, React, Node.js) stack. Users can create, update, delete, and assign tasks to themselves and team members. The app also includes features for user management, task sharing, analytics, and task filtering.

# Features

1. **User Authentication**
2. **Task Management**
3. **User Setting**
4. **Task Analytics**

# Technologies Used
Pro Manage is built using the following technologies:

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens) for authentication and authorization.

# Installation
- Before getting started, ensure you have Node.js and npm installed on your machine.
## Clone the repository:
git clone https://github.com/yashwanth2000/promanage.git
## Navigate to the project directory
cd promanage
## Install the dependencies for both client and server: 
- cd client: npm install
- cd server: npm install
## Set up the environment variables, Create a .env file in the root directory and add the following variables:
  - VITE_SERVER_URL = "http://localhost:3000" 
  - MONGODB_URL = <your_mongodb_url>
  - JWT_SECRET = <your_jwtkey>,
  - VITE_SHARE_URL = http://localhost:5173
## Running the Application, start the client and server:
  - In the client directory, run: npm run dev
  - In the server directory, run: npm run dev

# Usage
- Register a new user or log in with existing credentials. Only logged-in users can create tasks.
- Create new tasks from the board and assign properties such as title, priority, due date, and more. Users can edit, delete, and manage tasks efficiently.
- Share tasks with other users for read-only access.
- Update your profile information or delete your account from the settings page.
- View task analytics to gain insights into tasks created on the platform.
- Manually move tasks between different task states.
- Filter tasks based on today, this week, or this month.
- Add members to your board and assign them tasks during task creation.
