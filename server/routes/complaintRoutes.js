const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const {
  createComplaint,
  getComplaints,
  upvoteComplaint,
  updateStatus
} = require('../controllers/complaintController');

router.get('/', auth, getComplaints);
router.post('/', auth, role('student'), upload.single('image'), createComplaint);
router.put('/upvote/:id', auth, upvoteComplaint);
router.put('/status/:id', auth, role('admin'), updateStatus);

module.exports = router;