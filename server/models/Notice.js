const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notice = sequelize.define('Notice', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT },
  posted_by: { type: DataTypes.INTEGER }
});

module.exports = Notice;