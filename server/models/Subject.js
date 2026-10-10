const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subject = sequelize.define('Subject', {
  name: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.ENUM('CSE', 'AIML', 'AIDS') },
  semester: { type: DataTypes.INTEGER }
});

module.exports = Subject;