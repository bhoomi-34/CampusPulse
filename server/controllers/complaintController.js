const { Complaint, User } = require('../models');

// Student: post a complaint
exports.createComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const complaint = await Complaint.create({
      user_id: req.user.id,
      category,
      description,
      image_url
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// All: view all complaints
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      include: [{ model: User, attributes: ['name', 'srn'], required: false }],
      order: [['upvotes', 'DESC']]
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student: upvote a complaint
exports.upvoteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    complaint.upvotes += 1;
    await complaint.save();
    res.json({ message: 'Upvoted', upvotes: complaint.upvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: update complaint status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    complaint.status = status;
    await complaint.save();
    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};