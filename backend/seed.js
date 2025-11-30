const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Attendance = require('./models/Attendance');

dotenv.config();

const employeesData = [
  { name: 'John Employee', email: 'john@emp.com', dept: 'Engineering', id: 'EMP001' },
  { name: 'Alice Smith', email: 'alice@emp.com', dept: 'Marketing', id: 'EMP002' },
  { name: 'Bob Jones', email: 'bob@emp.com', dept: 'Sales', id: 'EMP003' },
  { name: 'Charlie Brown', email: 'charlie@emp.com', dept: 'HR', id: 'EMP004' },
  { name: 'Diana Prince', email: 'diana@emp.com', dept: 'Design', id: 'EMP005' },
  { name: 'Evan Wright', email: 'evan@emp.com', dept: 'Engineering', id: 'EMP006' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🌱 Seeding Database...');
    
    // 1. Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});

    // 2. Create Password Hash
    const password = await bcrypt.hash('123456', 10);

    // 3. Create Manager
    await User.create({
      name: 'Manager User',
      email: 'manager@admin.com',
      password: password,
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });

    console.log('✅ Manager Created: manager@admin.com / 123456');

    // 4. Create Employees & Attendance
    for (const emp of employeesData) {
      // Create User
      const user = await User.create({
        name: emp.name,
        email: emp.email,
        password: password,
        role: 'employee',
        employeeId: emp.id,
        department: emp.dept
      });

      // Generate Attendance for the last 7 days
      const attendanceRecords = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Randomize Status
        // 70% Present, 20% Late, 10% Absent
        const rand = Math.random();
        let status = 'Present';
        if (rand > 0.7) status = 'Late';
        if (rand > 0.9) status = 'Absent';

        // Skip weekends (optional logic, kept simple here)
        
        let checkIn = null;
        let checkOut = null;
        let hours = 0;

        if (status !== 'Absent') {
          // Randomize Check In (8:00 AM to 10:30 AM)
          checkIn = new Date(d);
          checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
          
          // Randomize Check Out (5:00 PM to 7:00 PM)
          checkOut = new Date(d);
          checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);

          hours = ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(2);
        }

        attendanceRecords.push({
          userId: user._id,
          date: dateStr,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          status: status,
          totalHours: hours,
          createdAt: d
        });
      }

      await Attendance.insertMany(attendanceRecords);
      console.log(`👤 Created ${emp.name} (${emp.dept}) + 7 days attendance`);
    }

    console.log('✨ Database Seeded Successfully!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });