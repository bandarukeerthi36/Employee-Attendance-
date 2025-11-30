const express = require('express');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getToday = () => new Date().toISOString().split('T')[0];

router.post('/checkin', protect, async (req, res) => {
  const today = getToday();
  const existing = await Attendance.findOne({ userId: req.user.id, date: today });
  if (existing) return res.status(400).json({ message: 'Already checked in' });
  const now = new Date();
  const status = now.getHours() >= 10 ? 'Late' : 'Present';
  const attendance = await Attendance.create({ userId: req.user.id, date: today, checkInTime: now, status: status });
  res.json(attendance);
});

router.post('/checkout', protect, async (req, res) => {
  const today = getToday();
  const attendance = await Attendance.findOne({ userId: req.user.id, date: today });
  if (!attendance) return res.status(400).json({ message: 'No check-in record found' });
  attendance.checkOutTime = new Date();
  const duration = (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);
  attendance.totalHours = duration.toFixed(2);
  await attendance.save();
  res.json(attendance);
});

router.get('/my-history', protect, async (req, res) => {
  const history = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(history);
});

router.get('/today', protect, async (req, res) => {
  const today = getToday();
  const record = await Attendance.findOne({ userId: req.user.id, date: today });
  res.json(record);
});

router.get('/all', protect, async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ message: 'Access denied' });
  const records = await Attendance.find().populate('userId', 'name email department');
  res.json(records);
});

module.exports = router;