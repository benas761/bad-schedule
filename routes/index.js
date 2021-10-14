var express = require('express');
// var db = require('db')
var mysql = require('mysql');
var router = express.Router();
var con = require('./db.js')

router.get('/', function(req, res, next) {
    // var sql = "CREATE TABLE User(user_id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)";
    // q = "CREATE TABLE Schedule(schedule_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, schedule_name VARCHAR(255) NOT NULL)";
    // q = "ALTER TABLE Schedule ADD CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE RESTRICT";
    // q = "CREATE TABLE Event(event_id INT AUTO_INCREMENT PRIMARY KEY, schedule_id INT NOT NULL, event_name VARCHAR(255), start INT UNSIGNED, end INT UNSIGNED, start_day DATE NOT NULL, period INT UNSIGNED)";
    // q = "ALTER TABLE Event ADD CONSTRAINT fk_schedule_id FOREIGN KEY(schedule_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE RESTRICT"
    // con.query(q, function(err, rows) {
    //     if(err) throw err;
    //     console.log('%o\n', rows);
    //     res.render('index', { pagetitle: 'Schedule', dbdata: rows});
    // });
    res.render('index', { pagetitle: 'Schedule' });
});

module.exports = router;