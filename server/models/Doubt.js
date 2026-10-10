const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doubt = sequelize.define('Doubt', {
  question: { type: DataTypes.TEXT, allowNull: false },
  reply: { type: DataTypes.TEXT },
  is_resolved: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Doubt;