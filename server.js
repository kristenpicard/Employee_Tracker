const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "cms_DB",
});

// Beginning function which prompts the user for what action they want to take
const start = () => {
  inquirer
    .prompt({
      name: "startHere",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then((answer) => {
      // based on their answer, call corresponding function
      if (answer.startHere === "View All Employees") {
        viewAll();
      } else if (answer.startHere === "View All Departments") {
        viewAllDep();
      } else if (answer.startHere === "View All Roles") {
        viewAllRoles();
      } else if (answer.startHere === "Add Employee") {
        addEmp();
      } else if (answer.startHere === "Add Department") {
        addDep();
      } else if (answer.startHere === "Add Role") {
        addRole();
      } else if (answer.startHere === "Update Employee Role") {
        updEmpRole();
      } else {
        connection.end();
      }
    });
};

// Function to view all employees
const viewAll = () => {
  connection.query(
    "SELECT employee.id, first_name, last_name, title, salary, name, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    (err, results) => {
      if (err) throw err;
      console.table(results);
      // re-prompt the user for what they want to do next
      start();
    }
  );
};

// Function to view all departments
const viewAllDep = () => {
  connection.query(
    "SELECT id, NAME AS department FROM department",
    (err, results) => {
      if (err) throw err;
      console.table(results);
      // re-prompt the user for what they want to do next
      start();
    }
  );
};

// Function to view all roles
const viewAllRoles = () => {
  connection.query(
    "SELECT role.id, title AS role, salary, NAME AS department FROM role JOIN department ON role.department_id = department.id ORDER BY title",
    (err, results) => {
      if (err) throw err;
      console.table(results);
      // re-prompt the user for what they want to do next
      start();
    }
  );
};

const addEmp = () => {
  connection.query("SELECT * FROM role", (err, roles) => {
    if (err) console.log(err);
    roles = roles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the new employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the new employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the new employee's role?",
          choices: roles,
        },
      ])
      .then((data) => {
        console.log(data.role);
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: data.role,
          },
          (err) => {
            if (err) throw err;
            console.log("Updated Employee List:");
            viewAll();
          }
        );
      });
  });
};

const addDep = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "What is the name of the new department?",
      },
    ])
    .then((data) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: data.newDepartment,
        },
        function (err) {
          if (err) throw err;
        }
      );
      console.log("Updated Departments Table:");
      viewAllDep();
    });
};

const addRole = () => {
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) console.log(err);
    departments = departments.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "newRole",
          message: "What is the title of the new role?",
        },
        {
          type: "input",
          name: "newSalary",
          message: "How much is the salary for the new role?",
        },
        {
          type: "list",
          name: "depID",
          message: "What department is this role in?",
          choices: departments,
        },
      ])
      .then((data) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: data.newRole,
            salary: data.newSalary,
            department_id: data.depID,
          },
          function (err) {
            if (err) throw err;
          }
        );
        console.log("Updated Roles Table:");
        viewAllRoles();
      });
  });
};

const updEmpRole = () => {
  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) console.log(err);
    employees = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) console.log(err);
      roles = roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "chooseEmployee",
            message: "Which employee would you like to update?",
            choices: employees,
          },

          {
            type: "list",
            name: "chooseNewRole",
            message: "Which should this employee's role be updated to?",
            choices: roles,
          },
        ])
        .then((data) => {
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: data.chooseNewRole,
              },
              {
                id: data.chooseEmployee,
              },
            ],
            function (err) {
              if (err) throw err;
            }
          );
          console.log("Updated Employee List:");
          viewAll();
        });
    });
  });
};

// Connects to the mysql server and database
connection.connect((err) => {
  if (err) throw err;
  // Run the start function after the connection is made to prompt the user
  start();
});
