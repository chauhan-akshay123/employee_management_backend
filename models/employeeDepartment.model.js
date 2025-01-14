const { DataTypes, sequelize } = require("../lib/index.js");
const { employee } = require("./employee.model.js");
const { department } = require("./department.model.js");

const employeeDepartment = sequelize.define("employeeDepartment", {
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
      model: employee,
      key: "id",
    },
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: department,
      key: "id",
    },
  },
});

department.belongsToMany(employee, { through: employeeDepartment });
employee.belongsToMany(department, { through: employeeDepartment });

module.exports = { employeeDepartment };