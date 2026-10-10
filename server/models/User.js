const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  srn: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING },
  year: { type: DataTypes.INTEGER },
  semester: { type: DataTypes.INTEGER },
  department: { type: DataTypes.ENUM('CSE', 'AIML', 'AIDS') },
  role: { type: DataTypes.ENUM('student', 'faculty', 'admin'), defaultValue: 'student' },
  password_hash: { type: DataTypes.STRING, allowNull: false }
});

module.exports = User;