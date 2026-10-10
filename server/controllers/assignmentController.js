const { Assignment, Subject, User } = require('../models');

// Faculty: create assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subject_id, deadline } = req.body;
    const assignment = await Assignment.create({
      title, description, subject_id,
      faculty_id: req.user.id,
      deadline,
      status: 'pending'
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student: view all assignments with auto status
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: Subject, attributes: ['name'], required: false },
        { model: User, as: 'Faculty', attributes: ['name'], required: false }
      ],
      order: [['deadline', 'ASC']]
    });

    const now = new Date();
    const result = assignments.map(a => {
      const deadline = new Date(a.deadline);
      const hoursLeft = (deadline - now) / (1000 * 60 * 60);
      let status = a.status;
      if (status !== 'submitted') {
        if (hoursLeft < 0) status = 'overdue';
        else if (hoursLeft <= 24) status = 'due_soon';
        else status = 'pending';
      }
      return { ...a.toJSON(), status };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student: mark as submitted
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    assignment.status = 'submitted';
    await assignment.save();
    res.json({ message: 'Assignment submitted', assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};