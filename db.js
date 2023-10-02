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
    // get departments from database
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
    // add department to the new role object
    .then((newRole) => {
        const department = results.find((department) => {
            department.name === newRole.department
        });
        // insert new role into role table
        const query = "INSERT INTO role SET ?";
        db.query(query, {
            title: newRole.title,
            salary: newRole.salary,
            department_id: department.id
        }, 
        (error, results) => {
            if (error) console.log(error);
            console.log(`Added new role ${results.title} with salary $${results.salary} to the ${results.department} department.`)
        })
    })

};

function addEmployee() {
    // get roles from database
    db.query("SELECT id, title from roles", (error, results) =>{
        if (error) return console.log(error);
        const roles = results.map(({id, title}) => ({
            name: title,
            value: id
        }));
        
        // get employee list for managers
        db.query("SELECT id, CONCAT(first_name, ' ', last_name) as name FROM employee", (error, results) => {
            if (error) return console.log(error);
            const managers = results.map(({id, name}) => ({
                name: name,
                value: id
            }));

            // employee information
            inquirer.prompt([
                {
                    type: input,
                    name: "first_name",
                    message: "Enter the new employee's first name: "
                },
                {
                    type: input,
                    name: "last_name",
                    messsge: "Enter the new employee's last name: "
                },
                {
                    type: list,
                    name: "role_id",
                    message: "Select the new employee's role:",
                    choices: [
                        {name: "None", value: null},
                        ...roles
                    ]
                },
                {
                    type: list,
                    name: "manager_id",
                    message: "Select the new employee's manager:",
                    choices: [
                        {name: "None", value: null},
                        ...managers
                    ]
                }
            ])
            .then((newEmployee) => {
                const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                const values = [
                    newEmployee.first_name,
                    newEmployee.last_name,
                    newEmployee.role_id,
                    newEmployee.manager_id
                ];
                db.query(query, values, (error) => {
                    if (error) return console.log(error);
                    console.log("New employee added successfully.");
                })
            })
        })
    });

};

function updateEmployeeRole() {

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