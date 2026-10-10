const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Complaint = sequelize.define('Complaint', {
  category: { type: DataTypes.ENUM('WiFi', 'hostel', 'other') },
  description: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING },
  upvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'resolved'),
    defaultValue: 'pending'
  }
});

module.exports = Complaint;