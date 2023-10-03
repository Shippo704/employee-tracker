// required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

// create database connection
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Shippo704",
    database: "employeedb",
});

// connect to the database
db.connect((error) => {
    if (error) return console.log(error);
    console.log('Connection to the database established.');
    // start the app once connected to database
    appStart();
})

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
        .then((answerPrompt) => {
            const query = answerPrompt.dbQuery;
            switch (query) {
                case "View All Departments":
                    getDepartments();
                    break;
                case "View All Roles":
                    getRoles();
                    break;
                case "View All Employees":
                    getEmployees();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "End":
                    end();
                    // exit app
                    return;
            }
        });
    }

// database functions
// GET functions
function getDepartments() {
    const query = "SELECT * FROM department";
    db.query(query, (error, results) => {
        if (error) return console.log(error);
        console.table(results);
    })
    // restart the app
    appStart();
};

function getRoles() {
    const query = "SELECT * FROM role";
    db.query(query, (error, results) => {
        if (error) return console.log(error);
        console.table(results);
    })
    // restart the app
    appStart();
};

function getEmployees() {
    const query = "SELECT * FROM employee";
    db.query(query, (error, results) => {
        if (error) return console.log(error);
        console.table(results);
    })
    // restart the app
    appStart();
};

// ADD functions
function addDepartment() {
    // collect new department info
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the new department name: "
        }
    ])
    .then((newDepartment) => {
        // add new department to database
        const query = `INSERT INTO department (name) VALUES ("${newDepartment.name}")`;
        db.query(query, (error, results) => {
            if (error) return console.log(error);
            console.log("New department added successfully.");
            // restart the app
            appStart();
        })
    })
};

function addRole() {
    // get departments from database
    const query = "SELECT * FROM department";
    db.query(query, (error, results) => {
        if (error) return console.log(error);
        // get the info for the new role
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the title of the new role: "
            },
            {
                type: "input",
                name: "salary",
                message: "Enter the salary of the new role: $"
            },
            {
                type: "list",
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
                    department_id: department
                },
                    (error, results) => {
                        if (error) console.log(error);
                        console.log("New role added successfully.");
                        // restart the app
                        appStart();
                    })
            })
    })
};

function addEmployee() {
    // get roles from database
    db.query("SELECT id, title from role", (error, results) => {
        if (error) return console.log(error);
        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        // get employee list for managers
        db.query("SELECT id, CONCAT(first_name, ' ', last_name) as name FROM employee", (error, results) => {
            if (error) return console.log(error);
            const managers = results.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            // new employee information
            inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter the new employee's first name: "
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter the new employee's last name: "
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Select the new employee's role:",
                    choices: [
                        ...roles
                    ]
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Select the new employee's manager:",
                    choices: [
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
                        // restart the app
                        appStart();
                    })
                })
        })
    });
};

function updateEmployeeRole() {
    // get all employee roles
    const queryEmployees = "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";
    //  get all roles
    const queryRoles = "SELECT * from role";
    db.query(queryEmployees, (error, resultsEmployees) => {
        if (error) return console.log(error);
        db.query(queryRoles, (error, resultsRoles) => {
            if (error) return console.log(error);
            // get necessary data for the update
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to update:",
                    choices: resultsEmployees.map((employee) => `${employee.first_name} ${employee.last_name}`)
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the employee's new role:",
                    choices: resultsRoles.map((role) => `${role.title}`)
                }
            ])
            .then((results) => {
                // find the employee
                const employee = resultsEmployees.find((employee) => `${employee.first_name} ${employee.last_name}` === results.employee);
                // find the role
                const role = resultsRoles.find((role) => `${role.title}` === results.role);

                // update the employee's role
                const query = "UPDATE employee SET role_id = ? WHERE id = ?";
                db.query(query, [role.id, employee.id], (error, results) => {
                    if (error) return console.log(error);
                    console.log("Employee's role has been updated.");
                    // restart the app
                    appStart();
                })
            })
        })
    })
};

// END the app
function end() {
    db.end();
    console.log('Thank you for using this app.')
};