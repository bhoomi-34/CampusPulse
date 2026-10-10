const { Attendance, Subject, User } = require('../models');

// Faculty marks attendance
exports.markAttendance = async (req, res) => {
  try {
    const { student_id, subject_id, date, status } = req.body;
    const record = await Attendance.create({
      student_id, subject_id, date, status
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student views their attendance per subject
exports.getMyAttendance = async (req, res) => {
  try {
    const student_id = req.user.id;
    const records = await Attendance.findAll({
      where: { student_id },
      include: [{ model: Subject, attributes: ['name'] }]
    });

    // Group by subject
    const summary = {};
    records.forEach(r => {
      const subName = r.Subject.name;
      if (!summary[subName]) summary[subName] = { total: 0, present: 0 };
      summary[subName].total++;
      if (r.status === 'present') summary[subName].present++;
    });

    // Calculate percentage
    const result = Object.entries(summary).map(([subject, data]) => ({
      subject,
      total: data.total,
      present: data.present,
      percentage: Math.round((data.present / data.total) * 100)
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Faculty views attendance for a subject on a date
exports.getAttendanceBySubject = async (req, res) => {
  try {
    const { subject_id, date } = req.query;
    const records = await Attendance.findAll({
      where: { subject_id, date },
      include: [{ model: User, as: 'Student', attributes: ['name', 'srn'] }]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};