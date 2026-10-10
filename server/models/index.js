const sequelize = require('../config/db');
const User = require('./User');
const Subject = require('./Subject');
const Attendance = require('./Attendance');
const Assignment = require('./Assignment');
const Event = require('./Event');
const Complaint = require('./Complaint');
const Notice = require('./Notice');
const Doubt = require('./Doubt');

// Associations
User.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(User, { foreignKey: 'student_id' });

Subject.hasMany(Attendance, { foreignKey: 'subject_id' });
Attendance.belongsTo(Subject, { foreignKey: 'subject_id' });

User.hasMany(Assignment, { foreignKey: 'faculty_id', as: 'Faculty' });
Assignment.belongsTo(User, { foreignKey: 'faculty_id', as: 'Faculty' });

Subject.hasMany(Assignment, { foreignKey: 'subject_id' });
Assignment.belongsTo(Subject, { foreignKey: 'subject_id' });

User.hasMany(Complaint, { foreignKey: 'user_id' });
Complaint.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Doubt, { foreignKey: 'student_id' });
Doubt.belongsTo(User, { foreignKey: 'student_id' });

module.exports = {
  sequelize,
  User,
  Subject,
  Attendance,
  Assignment,
  Event,
  Complaint,
  Notice,
  Doubt
};