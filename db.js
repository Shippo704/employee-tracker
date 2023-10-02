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
async function getDepartments() {

};

async function getRoles() {

};

async function getEmployees() {

};

async function addDepartment() {

};

async function addRole() {

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
    End
};