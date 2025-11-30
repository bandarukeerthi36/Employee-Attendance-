Employee Attendance System

A full-stack MERN application for tracking employee attendance, managing leaves, and generating reports. The system features role-based access control for Employees and Managers.


🚀 Live Demo
- **Frontend (Render): https://employee-attendance-2-l796.onrender.com
- **Backend (Render): https://employee-attendance-3.onrender.com

🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)

✨ Features
**Employee:**
- Register/Login securely.
- Mark Daily Attendance (Check In / Check Out).
- View Personal Attendance History.
- Dashboard with Real-time Stats.

**Manager:**
- View All Employees.
- Monitor Team Attendance (Present, Late, Absent).
- Visual Analytics (Bar Charts & Pie Charts).
- Export Attendance Reports to CSV.

📸 Screenshots
(screenshots/dashboard.png)
*(Add more screenshots in a 'screenshots' folder if needed)*

⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` file in the `backend` folder.

`PORT` = 5000
`MONGO_URI` = mongodb+srv://admin:<Password123>@cluster0.iquj0au.mongodb.net/?appName=Cluster0
`JWT_SECRET` = 123456

## 💻 Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/bandarukeerthi36/Employee-Attendance-.git
cd Employee-Attendance
 Backend Setup
code
Bash
cd backend
npm install
Create a .env file in the backend folder and add your variables (see .env.example).
Seed the Database (Create Sample Users):
code
Bash
node seed.js
This creates a Manager (manager@admin.com / 123456) and Employees with dummy attendance data.
Start the Server:
code
Bash
npm run start
3. Frontend Setup
Open a new terminal.
code
Bash
cd frontend
npm install
npm run dev
🧪 How to Run
Ensure MongoDB is running (or connected via Cloud URI).
Start Backend (npm run start in /backend).
Start Frontend (npm run dev in /frontend).
Open your browser at http://localhost:5173.
Login Credentials:
Manager: manager@admin.com / 123456
Employee: john@emp.com / 123456
