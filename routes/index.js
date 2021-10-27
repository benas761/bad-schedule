var express = require('express');
// var db = require('db')
var mysql = require('mysql');
var router = express.Router();
var con = require('./db.js')
var app = require('../app');
const { route } = require('../app');

router.get('/', function(req, res) {
    // var sql = "CREATE TABLE User(user_id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)";
    // q = "CREATE TABLE Schedule(schedule_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, schedule_name VARCHAR(255) NOT NULL)";
    // q = "ALTER TABLE Schedule ADD CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE RESTRICT";
    // q = "CREATE TABLE Event(event_id INT AUTO_INCREMENT PRIMARY KEY, schedule_id INT NOT NULL, event_name VARCHAR(255), start TIME NOT NULL, end TIME NOT NULL, start_day DATE NOT NULL, period INT UNSIGNED)";
    // q = "ALTER TABLE Event ADD CONSTRAINT fk_schedule_id FOREIGN KEY(schedule_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE RESTRICT"
    q = "SELECT schedule_name FROM Schedule WHERE schedule_id=1";
    con.query(q, function(err, qres) {
        if(err) throw err;
        res.render('index', {
            page_title: 'Schedule',
            schedule_name: qres[0].schedule_name
        });
    });
    //res.render('index', { pagetitle: 'Schedule' });
});

router.post('/eventInsert', function (req, res){
    reqbody = req.body;
    console.log("INSERT INTO Event(event_name, start, end, start_day, period) VALUES("+reqbody.event_name+", "+reqbody.start+
    ", "+reqbody.end+", "+reqbody.start_day+", "+reqbody.period+");");
            
    let query = "INSERT INTO Event(schedule_id, event_name, start, end, start_day, period) VALUES(?, ?, ?, ?, ?, ?);";
    con.query(query, [reqbody.schedule_id, reqbody.event_name, reqbody.start, reqbody.end, reqbody.start_day, reqbody.period], function(err, qres){
        if(err) {
            throw err;
        } else {
            console.log(qres);
            res.json("{}"); // to avoid an error, send an empty json
        }
    });
});

router.post('/eventUpdate', function (req, res){
    reqbody = req.body;
    console.log("UPDATE Event SET event_name = "+reqbody.event_name+", start = "+reqbody.start+
    ", end = "+reqbody.end+", start_day = "+reqbody.start_day+", period = "+reqbody.period+" WHERE event_id = "+reqbody.event_id);
            
    let query = "UPDATE Event SET event_name = ?, start = ?, end = ?, start_day = ?, period = ? WHERE event_id = ?";
    con.query(query, [reqbody.event_name, reqbody.start, reqbody.end, reqbody.start_day, reqbody.period, reqbody.event_id], function(err, qres){
        if(err) {
            throw err;
        } else {
            console.log(qres);
            res.json("{}"); // to avoid an error, send an empty json
        }
    });
});

router.post('/eventSelect', function (req, res){
    q = "SELECT * FROM Event WHERE schedule_id=1";
    con.query(q, function(err, rows) {
        if(err) throw err;
        else {
            res.json(
                JSON.stringify(rows)
            );
        }
    });
});

router.post('/reqtest', function(req, res){
    console.log(req.body);
    res.json(JSON.stringify(req.body));
});

module.exports = router;