var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var con = require('./database.js');
var app = require('../app');
var ver = require('./validation.js');

router.get('/', function(req, res) {
	q = "SELECT schedule_name FROM Schedule WHERE schedule_id=1";
	con.query(q, function(err, qres) {
		if(err) console.log(err);
		res.render('index', {
			page_title: 'bad-schedule',
			schedule_name: qres[0].schedule_name
		});
	});
	//res.render('index', { pagetitle: 'Schedule' });
});

router.post('/eventInsert', function (req, res){
	// validation start
	if(!ver.times(req.body.start, req.body.end) || !ver.date(req.body.start_day)) {
		console.log("Bad time or date in ", req.body);
		res.sendStatus(410);
	}
	else {
		let query = `SELECT event_id, schedule_id, event_name, start, end, 
					DATE_FORMAT(start_day, '%Y-%m-%d') as start_day, period 
					FROM Event WHERE schedule_id = ?`;
		con.query(q, [req.body.schedule_id], function(err, events) {
			if(!ver.eventCollision(req.body, events)) {
				console.log("Event collides: ", req.body);
				res.sendStatus(411);
			} // validation end
			else {

				console.log("INSERT INTO Event(event_name, start, end, start_day, period) VALUES("+req.body.event_name+", "+req.body.start+
				", "+req.body.end+", "+req.body.start_day+", "+req.body.period+");");
						
				let query = "INSERT INTO Event(schedule_id, event_name, start, end, start_day, period) VALUES(?, ?, ?, ?, ?, ?);";
				con.query(query, [req.body.schedule_id, req.body.event_name, req.body.start, req.body.end, req.body.start_day, req.body.period], function(err, qres){
					if(err) {
						console.log(err);
					} else {
						console.log(qres);
						res.json("{}"); // to avoid an error, send an empty json
					}
				});
			}
		});
	}
});

router.post('/eventUpdate', async function (req, res){
	// validation start
	if(!ver.times(req.body.start, req.body.end)) {
		console.log("Bad time ", req.body);
		res.sendStatus(418);
	} else if(!ver.date(req.body.start_day)) {
		console.log("Bad date ", req.body);
		res.sendStatus(418);
	} else {
		let query = `SELECT event_id, schedule_id, event_name, start, end, 
					DATE_FORMAT(start_day, '%Y-%m-%d') as start_day, period 
					FROM Event WHERE schedule_id = ?`;
		con.query(q, [req.body.schedule_id], function(err, events) {
			if(!ver.eventCollision(req.body, events)) {
				console.log("Event collides: ", req.body);
				res.sendStatus(418);
			} // validation end
			else {
				console.log("UPDATE Event SET event_name = "+req.body.event_name+
							", start = "+req.body.start+", end = "+req.body.end+
							", start_day = "+req.body.start_day+", period = "+
							req.body.period+" WHERE event_id = "+req.body.event_id);
						
				query = `UPDATE Event SET event_name = ?, start = ?, end = ?, 
						start_day = ?, period = ? WHERE event_id = ?`;
				con.query(query, [req.body.event_name, req.body.start, req.body.end, 
						req.body.start_day, req.body.period, req.body.event_id], 
						function(err, qres){
					if(err) {
						console.log(err);
					} else {
						console.log(qres);
						res.json("{}"); // to avoid an error, send an empty json
					}
				});
			}
		});
	}
});

router.post('/eventSelect', function (req, res){
	q = "SELECT event_id, schedule_id, event_name, start, end, DATE_FORMAT(start_day, '%Y-%m-%d') as start_day, period FROM Event WHERE schedule_id=1";
	con.query(q, function(err, rows) {
		if(err) console.log(err);
		else {
			res.json(
				JSON.stringify(rows)
			);
		}
	});
});

router.post('/eventDelete', function(req, res){
	q = "DELETE FROM Event WHERE event_id=?";
	con.query(q, [req.body.event_id],  function(err, rows) {
		if(err) throw err;
		else {
			res.json('{}');
		}
	});
});

router.post('/reqtest', function(req, res){
	console.log(req.body);
	res.json(JSON.stringify(req.body));
});

module.exports = router;