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
        // Need choices but do not know how to grab id from role?
        // choices() {
        //   const choiceArray = [];
        //   results.forEach(({ item_name }) => {
        //     choiceArray.push(item_name);
        //   });
        //   return choiceArray;
        // },
      },
    ])
    .then((data) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: data.firstName,
          last_name: data.lastName,
          // role_id: ??
        },
        function (err) {
          if (err) throw err;
        }
      );
      console.log("Updated Employee List:");
      viewAll();
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
        type: "input",
        name: "depID",
        message:
          "What department ID belongs to the new role (1=Sales, 2=Engineering, 3=Finance, 4=Legal)?",
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
};

const updEmpRole = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "chooseEmployee",
        message: "Which employee would you like to update?",
        // Need choices but do not know how to grab id from role?
        // choices() {
        //   Need to add control flow to show all employees?
        // },
      },
    ])
    .then((data) => {
      // I think need nested .then to update role from that employee?
      // connection.query(
      //   "INSERT INTO employee SET ?",
      //   {
      //     first_name: data.firstName,
      //     last_name: data.lastName,
      //     // role_id: ??
      //   },
      //   function (err) {
      //     if (err) throw err;
      //   }
      // );
      console.log("Updated Employee List:");
      viewAll();
    });
};

// Connects to the mysql server and database
connection.connect((err) => {
  if (err) throw err;
  // Run the start function after the connection is made to prompt the user
  start();
});
