const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  title: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('hackathon', 'cultural', 'sports', 'workshop') },
  date: { type: DataTypes.DATE },
  seat_limit: { type: DataTypes.INTEGER },
  registered_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_open: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Event;