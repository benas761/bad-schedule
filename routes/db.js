var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "schedule",
    password: "schdlpwd",
    database: "schedule"
});

con.connect(function(err) {
    if(err) throw err;
    // query database
    // var sql = "CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255))";
    var sql = "SHOW TABLES"
    con.query(sql, function(err, result){
        if(err) throw err;
        console.log(result);
    });
});
