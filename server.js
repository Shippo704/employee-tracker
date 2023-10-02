// required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('db');

// use inquirer to set up app questions
function appStart() {
    inquirer.prompt([
        {
            type: "list",
            name: "dbQuery",
            message: "Select an option:",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "End"
            ]
        }
    ])
    .then(answerPrompt);
}

async function answerPrompt(choice) {
    const query = choice.query;
    switch (query) {
        case "View All Departments":
            await db.getDepartments();
            break;
        case "View All Roles":
            await db.getRoles();
            break;
        case "View All Employees":
            await db.getEmployees();
            break;
        case "Add Department":
            await db.addDepartment();
            break;
        case "Add Role":
            await db.addRole();
            break;
        case "Add Employee":
            await db.addEmployee();
            break;
        case "Update Employee Role":
            await db.updateEmployeeRole();
            break;
        case "End":
            await db.end();
            // exit app
            return;
    }
    // ask another question unless ended
    appStart();
}

// start the app
appStart();