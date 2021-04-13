const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
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
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    })
    .then((answer) => {
      // based on their answer, call corresponding function
      if (answer.startHere === "View All Employees") {
        viewAll();
      } else if (answer.startHere === "View All Employees By Department") {
        viewAllDep();
      } else if (answer.startHere === "View All Employees By Manager") {
        viewAllMan();
      } else if (answer.startHere === "Add Employee") {
        addEmp();
      } else if (answer.startHere === "Remove Employee") {
        remEmp();
      } else if (answer.startHere === "Update Employee Role") {
        updEmpRole();
      } else if (answer.startHere === "Update Employee Manager") {
        updEmpMan();
      } else {
        connection.end();
      }
    });
};

// Function to view all employees
const viewAll = () => {
  // DO NOT THINK I'LL NEED PROMPT FOR THIS ONE? JUST THEN AND SHOW DATA?
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?",
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?",
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        // QUESTION: What does the || 0 do?
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0,
        },
        (err) => {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
};

// Function to add a new employee
const addEmp = () => {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices() {
            const choiceArray = [];
            results.forEach(({ item_name }) => {
              choiceArray.push(item_name);
            });
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?",
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?",
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenItem;
        results.forEach((item) => {
          if (item.item_name === answer.choice) {
            chosenItem = item;
          }
        });

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid,
              },
              {
                id: chosenItem.id,
              },
            ],
            (error) => {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        } else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
};

// Function to update an employee role
const updEmpRole = () => {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices() {
            const choiceArray = [];
            results.forEach(({ item_name }) => {
              choiceArray.push(item_name);
            });
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?",
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?",
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenItem;
        results.forEach((item) => {
          if (item.item_name === answer.choice) {
            chosenItem = item;
          }
        });

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid,
              },
              {
                id: chosenItem.id,
              },
            ],
            (error) => {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        } else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
};

// Connects to the mysql server and database
connection.connect((err) => {
  if (err) throw err;
  // Run the start function after the connection is made to prompt the user
  start();
});
