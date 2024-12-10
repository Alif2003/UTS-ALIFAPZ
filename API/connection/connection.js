// connection.js
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "coursedb",
});

db.connect((err) => {
  if (err) {
    console.error("Periksa xampp nya mas:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
