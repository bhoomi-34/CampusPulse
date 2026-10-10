const { Event, User } = require('../models');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['date', 'ASC']] });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: create event
exports.createEvent = async (req, res) => {
  try {
    const { title, type, date, seat_limit } = req.body;
    const event = await Event.create({ title, type, date, seat_limit });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student: register for event
exports.registerEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (!event.is_open) return res.status(400).json({ error: 'Event is full or closed' });

    event.registered_count += 1;
    if (event.registered_count >= event.seat_limit) {
      event.is_open = false;
    }
    await event.save();
    res.json({ message: 'Registered successfully', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};