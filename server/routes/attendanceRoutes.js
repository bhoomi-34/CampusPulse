const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
  markAttendance,
  getMyAttendance,
  getAttendanceBySubject
} = require('../controllers/attendanceController');

// Student: view own attendance
router.get('/my', auth, role('student'), getMyAttendance);

// Faculty: mark attendance
router.post('/mark', auth, role('faculty'), markAttendance);

// Faculty: view attendance by subject + date
router.get('/subject', auth, role('faculty'), getAttendanceBySubject);

module.exports = router;