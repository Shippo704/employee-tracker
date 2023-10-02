// required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

// create database connection
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Shippo704",
    database: "employee_db",
});

// database functions
// GET functions
function getDepartments() {
    const query = "SELECT * FROM department";
    db.query(query, (error, results) => {
        if (error) console.log(error);
        console.table(results);
    })
};

function getRoles() {
    const query = "SELECT * FROM role";
    db.query(query, (error, results) => {
        if (error) console.log(error);
        console.table(results);
    })
};

function getEmployees() {
    const query = "SELECT * FROM employee";
    db.query(query, (error, results) => {
        if (error) console.log(error);
        console.table(results);
    })
};

// ADD functions
function addDepartment() {
    inquirer.prompt([
        {
            type: input,
            name: "name",
            message: "Enter the new department name: "
        }
    ])
    .then((newDepartment) => {
        const query = `INSERT INTO department (name) VALUES ("${newDepartment.name}")`;
        db.query(query, (error, results) => {
            if (error) console.log(error);
            console.log("New department added seccuessfully.")
        })
    })
};

function addRole() {
    const query = "SELECT * FROM department";
    db.query(query, (error, results) => {
        if (error) console.log(error);
    })
    inquirer.prompt([
        {
            type: input,
            name: "title",
            message: "Enter the title of the new role: "
        },
        {
            type: input,
            name: "salary",
            message: "Enter the salary of the new role: $"
        },
        {
            type: listenerCount,
            name: "department",
            message: "Select a department for the new role:",
            choices: results.map(
                (department) => department.name
            )
        }
    ])
    .then((newRole) => {
        const department = results.find((department) => {
            department.name === newRole.department
        });
        const query = "INSERT INTO role SET ?";
        db.query(query, {
            title: newRole.title,
            salary: newRole.salary,
            department_id: department
        }, 
        (error, results) => {
            if (error) console.log(error);
            console.log(`Added new role ${results.title} with salary $${results.salary} to the ${results.department} department.`)
        })
    })

};

async function addEmployee() {

};

async function updateEmployeeRole() {

};

async function end() {
    db.end();
};


// export the database functions
module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    end
};