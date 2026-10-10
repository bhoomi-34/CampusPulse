const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  deadline: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'due_soon', 'overdue', 'submitted'),
    defaultValue: 'pending'
  }
});

module.exports = Assignment;