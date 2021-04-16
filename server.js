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

function addDep() {
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
}

// Function to add a new employee
// const addEmp = () => {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", (err, results) => {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices() {
//             const choiceArray = [];
//             results.forEach(({ item_name }) => {
//               choiceArray.push(item_name);
//             });
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?",
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?",
//         },
//       ])
//       .then((answer) => {
//         // get the information of the chosen item
//         let chosenItem;
//         results.forEach((item) => {
//           if (item.item_name === answer.choice) {
//             chosenItem = item;
//           }
//         });

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid,
//               },
//               {
//                 id: chosenItem.id,
//               },
//             ],
//             (error) => {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         } else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// };

// // Function to update an employee role
// const updEmpRole = () => {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", (err, results) => {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices() {
//             const choiceArray = [];
//             results.forEach(({ item_name }) => {
//               choiceArray.push(item_name);
//             });
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?",
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?",
//         },
//       ])
//       .then((answer) => {
//         // get the information of the chosen item
//         let chosenItem;
//         results.forEach((item) => {
//           if (item.item_name === answer.choice) {
//             chosenItem = item;
//           }
//         });

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid,
//               },
//               {
//                 id: chosenItem.id,
//               },
//             ],
//             (error) => {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         } else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// };

// Connects to the mysql server and database
connection.connect((err) => {
  if (err) throw err;
  // Run the start function after the connection is made to prompt the user
  start();
});
