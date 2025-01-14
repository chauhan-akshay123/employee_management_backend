# Employee Management System Backend

## Overview
This project is a Node.js-based application for managing employees, their roles, and their department assignments. It provides APIs to perform CRUD operations for employees, departments, and roles, with Sequelize used as the ORM for database interactions.

---

## Features
1. **Database Seeding:** Populate the database with sample data for employees, departments, and roles.
2. **CRUD Operations:**
   - Create, read, update, and delete employees.
   - Fetch employee details, including associated roles and departments.
   - Retrieve employees by department or role.
3. **Sorting and Filtering:** Sort employees by name in ascending or descending order.
4. **Relational Mapping:** Efficiently manage many-to-many relationships between employees, roles, and departments.

---

## Tools and Technologies

### Backend
- **Node.js**: The runtime environment for the application.
- **Express.js**: Framework for building RESTful APIs.

### Database
- **SQLite**: Lightweight database for storing application data.
- **Sequelize**: ORM for handling database operations and defining models.

### API Testing
- **Postman**: Used for testing API endpoints.

---

## Project Structure
```
project/
├── models/
│   ├── employee.model.js   # Employee model
│   ├── department.model.js # Department model
│   ├── role.model.js       # Role model
│   ├── employeeDepartment.model.js # Junction table for employee-department
│   └── employeeRole.model.js       # Junction table for employee-role
├── lib/
│   └── index.js            # Sequelize instance setup
├── index..js                  # Main application file
└── package.json            # Project dependencies and scripts
```

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   node app.js
   ```

---

## API Endpoints

### Database Seeding
- **GET** `/seed_db`
  - Description: Populates the database with sample data for employees, departments, and roles.

### Employee APIs
1. **GET** `/employees`
   - Fetch all employees with detailed department and role information.
2. **GET** `/employees/details/:id`
   - Fetch detailed information of a specific employee by ID.
3. **GET** `/employees/department/:departmentId`
   - Retrieve all employees associated with a specific department.
4. **GET** `/employees/role/:roleId`
   - Retrieve all employees associated with a specific role.
5. **GET** `/employees/sort-by-name`
   - Fetch all employees sorted by name (ascending/descending) using a query parameter (`?order=ASC|DESC`).
6. **POST** `/employees/new`
   - Add a new employee with department and role assignments.
   - **Request Body:**
     ```json
     {
       "name": "Employee Name",
       "email": "email@example.com",
       "departmentId": 1,
       "roleId": 1
     }
     ```
7. **POST** `/employees/update/:id`
   - Update employee details by ID, including department and role.
   - **Request Body:**
     ```json
     {
       "name": "Updated Name",
       "email": "updated.email@example.com",
       "departmentId": 2,
       "roleId": 3
     }
     ```
8. **POST** `/employees/delete`
   - Delete an employee by ID.
   - **Request Body:**
     ```json
     {
       "id": 1
     }
     ```

---

## Dependencies

### Core Dependencies
- **express**: Framework for handling HTTP requests and responses.
- **sequelize**: ORM for managing database models and queries.
- **sqlite3**: Database driver for SQLite.

### Dev Dependencies
- **nodemon**: Automatically restarts the server during development when file changes are detected.

---

## How to Extend
1. **Add New Models:**
   - Define the model in the `models` folder.
   - Create necessary associations in `index.js`.

2. **New API Endpoints:**
   - Define the route in `app.js`.
   - Implement the logic in `dataController.js` or directly within the route.

3. **Testing:**
   - Use Postman or any API testing tool to test the endpoints.





