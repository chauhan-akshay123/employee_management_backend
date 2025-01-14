let { DataTypes, sequelize } = require("../lib/index.js");
let { employee } = require("./employee.model.js");
let { role } = require("./role.model.js");

let employeeRole = sequelize.define("employeeRole", {
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
        model: employee,
        key: "id",
    },
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
        model: this.role,
        key: "id",
    },
  } ,
});

employee.belongsToMany(role, { through: employeeRole });
role.belongsToMany(employee, { through: employeeRole });

module.exports = { employeeRole };