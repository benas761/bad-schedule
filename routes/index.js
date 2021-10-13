var express = require('express');
// var db = require('db')
var mysql = require('mysql');
var router = express.Router();
var con = require('./db.js')

router.get('/', function(req, res, next) {
    q = "SELECT * FROM user"
    con.query(q, function(err, rows) {
        if(err) throw err;
        console.log(rows);
        res.render('index', { pagetitle: 'Schedule', dbdata: rows});
    });
    // res.render('index', { pagetitle: 'Schedule' });
});

// con.connect(function(err) {
//     if(err) throw err;
//     // query database
//     // var sql = "CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255))";
//     var sql = "SHOW TABLES"
//     con.query(sql, function(err, result){
//         if(err) throw err;
//         console.log(result);
        
//     });
// });

module.exports = router;