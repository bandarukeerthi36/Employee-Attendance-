const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// MANAGER DASHBOARD DATA
router.get('/manager', protect, async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ message: 'Access Denied' });

  try {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // 1. Basic Counts
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const todayAttendance = await Attendance.find({ date: todayStr }).populate('userId', 'name department');
    
    const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
    const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
    const absentCount = totalEmployees - (presentCount + lateCount);

    // 2. Department Stats (Pie Chart)
    const departments = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);
    const departmentData = departments.map(d => ({ name: d._id || 'General', value: d.count }));

    // 3. Weekly Attendance (Bar Chart) - Last 7 Days
    const weeklyStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const count = await Attendance.countDocuments({ date: dateStr, status: { $in: ['Present', 'Late'] } });
      weeklyStats.push({ name: dayName, present: count });
    }

    // 4. Absent Employees List
    // Find all employees, check who is NOT in todayAttendance
    const allEmployees = await User.find({ role: 'employee' }).select('name department employeeId');
    const presentIds = todayAttendance.map(a => a.userId._id.toString());
    const absentEmployees = allEmployees.filter(emp => !presentIds.includes(emp._id.toString()));

    res.json({
      totalEmployees,
      presentCount,
      lateCount,
      absentCount,
      departmentData,
      weeklyStats,
      absentEmployees
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Employee stats (Keep existing logic)
router.get('/employee', protect, async (req, res) => {
    // ... (Keep the previous employee logic here if needed, or ask me to paste it again)
    // For brevity, I am focusing on the Manager update request.
    res.json({}); 
});

module.exports = router;