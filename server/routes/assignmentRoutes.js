const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
  createAssignment,
  getAssignments,
  submitAssignment
} = require('../controllers/assignmentController');

// Student: view assignments
router.get('/', auth, role('student', 'faculty'), getAssignments);

// Faculty: create assignment
router.post('/', auth, role('faculty'), createAssignment);

// Student: submit assignment
router.put('/submit/:id', auth, role('student'), submitAssignment);

module.exports = router;