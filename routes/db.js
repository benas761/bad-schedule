var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "schedule",
    password: "schdlpwd",
    database: "schedule"
});

con.connect(function(err) {
    if(err) throw err;
    console.log("Connected to the database.");
});

module.exports = con;