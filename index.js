const express = require("express");
let { sequelize } = require("./lib/index.js");
let { employee } = require("./models/employee.model.js");
let { department } = require("./models/department.model.js");
let { role } = require("./models/role.model.js");
let { employeeDepartment } = require("./models/employeeDepartment.model.js");
let { employeeRole } = require("./models/employeeRole.model.js");

const app = express();
app.use(express.json());

// Endpoint to seed the database
app.get("/seed_db", async (req, res) => {
    try{
      await sequelize.sync({ force: true });
  
      const departments = await department.bulkCreate([
        { name: 'Engineering' },
        { name: 'Marketing' },
      ]);
    
      const roles = await role.bulkCreate([
        { title: 'Software Engineer' },
        { title: 'Marketing Specialist' },
        { title: 'Product Manager' },
      ]);
    
      const employees = await employee.bulkCreate([
        { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
        { name: 'Priya Singh', email: 'priya.singh@example.com' },
        { name: 'Ankit Verma', email: 'ankit.verma@example.com' },
      ]);
      
      await employeeDepartment.create({
        employeeId: employees[0].id,
        departmentId: departments[0].id,
      });
      await employeeRole.create({
        employeeId: employees[0].id,
        roleId: roles[0].id,
      });
    
      await employeeDepartment.create({
        employeeId: employees[1].id,
        departmentId: departments[1].id,
      });
      await employeeRole.create({
        employeeId: employees[1].id,
        roleId: roles[1].id,
      });
    
      await employeeDepartment.create({
        employeeId: employees[2].id,
        departmentId: departments[0].id,
      });
      await employeeRole.create({
        employeeId: employees[2].id,
        roleId: roles[2].id,
      });
      
      return res.status(200).json({ message: "Database seeded successfully." })
    } catch(error){
      return res.status(500).json({ message: "Error seeding the database", error: error.message });
    }
  });

   // Helper function to get employee's associated departments
async function getEmployeeDepartments(employeeId) {
  const employeeDepartments = await employeeDepartment.findAll({
    where: { employeeId },
  });

  let departmentData;
  for (let empDep of employeeDepartments) {
    departmentData = await department.findOne({
      where: { id: empDep.departmentId },
    });
  }

  return departmentData;
}

// Helper function to get employees' associated roles
async function getEmployeeRoles(employeeId){
  const employeeRoles = await employeeRole.findAll({
      where: { employeeId },
  });

  let roleData;
  for(let empRole of employeeRoles){
      roleData = await role.findAll({
          where: { id: empRole.roleId },
      });
  }

  return roleData;
}

// Helper function to get employee details with associated departments and roles
async function getEmployeeDetails(employeeData) {
  const department = await getEmployeeDepartments(employeeData.id);
  const role = await getEmployeeRoles(employeeData.id);
  
  return {
    ...employeeData.dataValues,
    department,
    role,
  };
}

// Helper function to add a new employee
async function addNewEmployee(employeeData){
  const { name, email, departmentId, roleId } = employeeData;
  
  if(!name || !email || !departmentId || !roleId){
    throw new Error("All fields are required.");
  }
  
  // create the new employee
  const newEmployee = await employee.create({
    name,
    email, 
    departmentId, 
    roleId,
  });
  
  await employeeDepartment.create({
     employeeId: newEmployee.id,
     departmentId: departmentId
  });

  await employeeRole.create({
     employeeId: newEmployee.id,
     roleId: roleId
  });

  // Retrieve the detailed employee with department and role info
  const detailedEmployee = await employee.findOne({
     where: { id: newEmployee.id },
     include: [
      {
        model: department,
        attributes: ["id", "name", "createdAt", "updatedAt"],
      },
      {
        model: role,
        attributes: ["id", "title", "createdAt", "updatedAt"],
      },
     ],
  });
  
  return detailedEmployee;
}

 // Endpoint to get all employees
 app.get("/employees", async (req, res) => {
  try{
    const employees = await employee.findAll();
    const detailedEmployees = [];
    
    if(employees.length === 0){
      return res.status(404).json({ message: "No employees found." });
    }

    for(let employeeData of employees){
      const employeeDetails = await getEmployeeDetails(employeeData);
      detailedEmployees.push(employeeDetails);
    }
    
    return res.status(200).json({ employees: detailedEmployees });
  } catch(error){
      return res.status(500).json({ message: "Error fetching all the employees", error: error.message });
  }
});

// Endpoint to get employee details by Id
app.get("/employees/details/:id", async (req, res) => {
  try {
      const employeeId = parseInt(req.params.id);
      const employeeData = await employee.findOne({ where: { id: employeeId } });
  
      if (!employeeData) {
        return res.status(404).json({ message: "No employee found." });
      }
  
      const employeeDetails = await getEmployeeDetails(employeeData);
      return res.status(200).json({ employee: employeeDetails });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching employee by Id", error: error.message });
    }
});

// Endpoint to get employees by Department
app.get("/employees/department/:departmentId", async (req, res) => {
    try {
      const departmentId = parseInt(req.params.departmentId);
  
      // Find all employee IDs associated with the departmentId in employeeDepartment table
      const employeeDepartments = await employeeDepartment.findAll({ where: { departmentId } });
  
      if (employeeDepartments.length === 0) {
        return res.status(404).json({ message: "No employees found for the specified department." });
      }
  
      // Array to hold complete employee details
      const departmentEmployees = [];
  
      // Fetch details for each employee associated with the department
      for (let empDep of employeeDepartments) {
        const employeeData = await employee.findOne({ where: { id: empDep.employeeId } });
        if (employeeData) {
          const employeeDetails = await getEmployeeDetails(employeeData);
          departmentEmployees.push(employeeDetails);
        }
      }
  
      return res.status(200).json({ employees: departmentEmployees });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching the employee by department", error: error.message });
    }
  });
  
  // Endpoint to get all employees by Role
app.get("/employees/role/:roleId", async (req, res) => {
  try{
     const roleId = parseInt(req.params.roleId);
     
     // find all employees Id associated with roleId in employeeRole table
     const employeeRoles = await employeeRole.findAll({ where: { roleId } });
 
     if(employeeRoles.length === 0){
         return res.status(404).json({ message: "No employees found for the specified role." });
     }
     
     const roleEmployees = [];
     for(let empRole of employeeRoles){
         const employeeData = await employee.findOne({ where: { id: empRole.employeeId } });
         if(employeeData){
            const employeeDetails = await getEmployeeDetails(employeeData);
            roleEmployees.push(employeeDetails); 
         }
     }
 
     return res.status(200).json({ employees: roleEmployees });
  } catch(error){
     return res.status(500).json({ message: "Error fetchig the employee by role", error: error.message });
  }
 });

 // Endpoint to get employees sorted by name
app.get("/employees/sort-by-name", async (req, res) => {
  try{
    let order = req.query.order;
    let sortedEmployees = await employee.findAll({
      order: [["name", order]]  
    });  

    if(sortedEmployees.length === 0){
      return res.status(404).json({ message: "No employees found." });
    }

    const resultEmployees = [];
    for(let employeeData of sortedEmployees){
      const employeeDetails = await getEmployeeDetails(employeeData);
      resultEmployees.push(employeeDetails);
    }
    
    return res.status(200).json({ employees: resultEmployees });
  } catch(error){
      return res.status(500).json({ message: "Error fetching the sorted employees", error: error.message });
  }
});

// Endpoint to add a new employee
app.post("/employees/new", async (req, res) => {
  try {
    const newEmployeeData = {
      name: req.body.name,
      email: req.body.email,
      departmentId: req.body.departmentId,
      roleId: req.body.roleId,
    };

    // Create a new employee record in the database
    const newEmployee = await addNewEmployee(newEmployeeData);

    // Fetch complete employee details including department and role
  //  const addedEmployeeDetails = await getEmployeeDetails(newEmployee);

    return res.status(201).json(newEmployee);
  } catch (error) {
    return res.status(500).json({
      message: "Error adding a new employee.",
      error: error.message,
    });
  }
});

// Function to update employee's details
async function updateEmployeeDetails(employeeData, employeeId){
  const { name, email, departmentId, roleId } = employeeData;

  const employeeRecord = await employee.findByPk(employeeId);
  if(!employeeRecord){
    throw new Error("Employee not found.");
  }

  if(name){
    employeeRecord.name = name;
  }
  if(email){
    employeeRecord.email = email;
  }

  await employeeRecord.save();
  
  if(departmentId){
    await employeeDepartment.destroy({ where: { employeeId: employeeId } });
    await employeeDepartment.create({ employeeId: employeeId, departmentId: departmentId });
  }
  
  if(roleId){
    await employeeRole.destroy({ where: { employeeId: employeeId } });
    await employeeRole.create({ employeeId: employeeId, roleId: roleId });
  }

  const updatedEmployee = await employee.findOne({
     where: { id: employeeId },
     include: [
      {
        model: department,
        attributes: ["id", "name", "createdAt", "updatedAt"],
        as: 'departments',
      },
      {
        model: role,
        attributes: ["id", "title", "createdAt", "updatedAt"],
        as: "roles",
      },
     ],
  });
  
  return updatedEmployee;
}

// Endpoint to update employee details
app.post("/employees/update/:id", async (req, res) => {
  try{
    let employeeId = parseInt(req.params.id);

    const updatedEmployee = await updateEmployeeDetails(req.body, employeeId);
    
    return res.status(200).json({ employee: updatedEmployee });
  } catch(error){
    return res.status(500).json({ message: "Error updating the employee's details", error: error.message });
  }
});

// Function to delete an employee by Id
async function deleteEmployeeById(employeeId){
  try{
    await employeeDepartment.destroy({
      where: { employeeId: employeeId },
    });
    
    await employeeRole.destroy({
      where: { employeeId: employeeId },
    });

    const employeeDeleted = await employee.destroy({
      where: { id: employeeId },
    });
    
    return employeeDeleted;
  } catch(error){
    throw new Error("Error deleting the employee: " + error.message);
  }
}

// Endpoint to delete employee
app.post("/employees/delete", async (req, res) => {
  const { id } = req.body; 
  
  try{
    const employeeDeleted = await deleteEmployeeById(id);

    if(!employeeDeleted){
      return res.status(404).json({ message: `Employee with ID 4{id} not found.` });
    } 
    
    return res.status(200).json({ message: `Employee with ID ${id} deleted successfully.` });
  } catch(error){
    return res.status(500).json({ message: "Error deleting the employee", error: error.message });
  }
});
 
 app.listen(3000, () => {
  console.log("Server is running on PORT: 3000");
 });