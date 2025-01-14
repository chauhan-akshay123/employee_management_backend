let { DataTypes, sequelize } = require("../lib/index.js");

let role = sequelize.define("role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true,
  },
});

module.exports = { role };