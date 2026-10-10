const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getEvents, createEvent, registerEvent } = require('../controllers/eventController');

// All roles: view events
router.get('/', auth, getEvents);

// Admin: create event
router.post('/', auth, role('admin'), createEvent);

// Student: register for event
router.post('/register/:id', auth, role('student'), registerEvent);

module.exports = router;