let con = require('./database.js');

function schedulePost(req, res) {
	// get user id from the token (token validity is guaranteed by middleware)
	let user_id = req.user;
	let q = "SELECT schedule_id, schedule_name FROM Schedule WHERE user_id = ?";
	con.query(q, user_id, (err, qres) => {
		if(err) console.log(err);
		res.json(JSON.stringify(qres));
	});
}

function insertPost(req, res){	
	console.log("INSERT INTO Event(schedule_id, event_name, start, end, start_day, period) VALUES(",
				req.schedule, req.body.event_name, req.body.start,
				req.body.end, req.body.start_day, req.body.period+");");
					
	let query = `INSERT INTO Event(schedule_id, event_name, start, end, start_day, period) 
				VALUES(?, ?, ?, ?, ?, ?);`;
	con.query(query, [req.schedule, req.body.event_name, req.body.start, 
		req.body.end, req.body.start_day, req.body.period], function(err, qres){
		if(err) {
			console.log(err);
		} else {
			res.json({success: true}); // to avoid an error, send an empty json
		}
	});
}

async function updatePost (req, res){
	console.log("UPDATE Event SET event_name = "+req.body.event_name+
	", start = "+req.body.start+", end = "+req.body.end+
	", start_day = "+req.body.start_day+", period = "+
	req.body.period+" WHERE event_id = "+req.body.event_id);

	const query = `UPDATE Event SET event_name = ?, start = ?, end = ?, 
		start_day = ?, period = ? WHERE event_id = ?`;
	con.query(query, [req.body.event_name, req.body.start, req.body.end, 
		req.body.start_day, req.body.period, req.body.event_id], 
		function(err, qres){
		if(err) {
			console.log(err);
		} else {
			res.json({success: true});
		}
	});
}

function eventPost (req, res){
	console.log("SELECT * FROM Event WHERE schedule_id =", req.schedule);
	const q = `SELECT event_id, schedule_id, event_name, start, end, 
		DATE_FORMAT(start_day, '%Y-%m-%d') as start_day, period 
		FROM Event WHERE schedule_id=?`;
	con.query(q, [req.schedule], function(err, rows) {
		if(err) console.log(err);
		else {
			res.json(
				JSON.stringify(rows)
			);
		}
	});
}

function deletePost(req, res){
	const q = "DELETE FROM Event WHERE event_id=?";
	con.query(q, [req.body.event_id],  function(err, rows) {
		if(err) throw err;
		else {
			res.json({success: true});
		}
	});
}

module.exports = {insertPost, updatePost, eventPost, deletePost, schedulePost}