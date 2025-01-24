const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      isIITRPRDomain(value) {
        if (!value.endsWith('@iitrpr.ac.in')) {
          throw new Error('Invalid email domain');
        }
      }
    }
  },
  role: {
    type: DataTypes.ENUM('faculty_advisor', 'faculty', 'student'),
    allowNull: false
  }
});

module.exports = User;