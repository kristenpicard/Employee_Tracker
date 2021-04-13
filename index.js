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

inquirer
  .prompt([
    {
      message: "Let's Build Your Team Profile! (Press Enter to begin)",
      name: "mssg",
    },
    {
      type: "input",
      message: "Enter the Manager's name: ",
      name: "name",
      validate: function (input) {
        if (input == " ") {
          console.log("Please enter a valid name");
          return false;
        }
        return true;
      },
    },
  ])
  .then((data) => {
    const name = data.name;
    const email = data.email;
    const id = data.id;
    const onumber = data.onumber;

    const member = new Manager(name, email, id, onumber);
    myTeam.push(member);
    addTeammate();
  });
