var con = require('./database.js');
var jwt = require('jsonwebtoken');
var ver = require('./validation.js')

// middleware before every post/get
function tokenCheck(req, res, next) {
	try {
		var token = getCookie(req.headers.cookie, "loginToken");
	} catch {
		console.log("No token in cookies!");
		return res.redirect('/login');
	}
	if (token) {
		jwt.verify(token, process.env.JWT_KEY, {
			algorithm: process.env.JWT_ALG
		}, function (err, decoded) {
			if (err) {
				let errordata = {
					message: err.message,
					expiredAt: err.expiredAt
				};
				console.log("token error: ", errordata);
				return res.redirect('/login');
			}
			req.decoded = decoded;
			req.user = decoded.user_id;

			// console.log("decoded token: ", decoded);
			next();
		});
	} else {
		return res.redirect('/login');
	}
}

function scheduleCheck(req, res, next) {
	let schedule_id = getCookie(req.headers.cookie, "schedule");
	if(schedule_id == null) {
		console.log("No schedule id received!");
		res.status(400).send("No schedule id received!");
	} else {
		let q = "SELECT user_id FROM Schedule WHERE schedule_id = ?";
		con.query(q, [schedule_id], (err, qres) => {
			if(err) console.log(err);
			if(qres.lenth != 0 && qres[0].user_id == req.user) {
				req.schedule = schedule_id;
				next();
			} else {
				console.log("Schedule's ", schedule_id, " user ", 
					qres[0].user_id, " does not match user ", req.user);
				res.status(403).send("This schedule does not belong to this user!");
			}
		});
	}
}

function verifyRegister(req, res, next) {
	// name is between 5 and 16 characters with only latin letters and numbers
	// password is at least 8 characters
	// confirmed password must match
	
	// only allow latin letters and numbers
	var username_regex = /[^a-z0-9A-Z]+/g
	if(req.body.name.length > 16 || req.body.name.length < 5)
		return res.status(403).send({success: false, 
			error: {message: "Username must be between 5 and 16 characters in length!"}});
	else if(req.body.name.match(username_regex))
		return res.status(403).send({success: false, 
			error: {message: "Username can only contain latin letters and numbers!"}});
	else if(req.body.password.length < 8) 
		return res.status(403).send({success: false, 
			error: {message: "Password must contain at least 8 characters!"}});
	else if(req.body.password != req.body.confirmed_password)
		return res.status(403).send({success: false, 
			error: {message: "Passwords must match!"}});
	else {
		let q = "SELECT user_id FROM User WHERE username = ?";
		con.query(q, [req.body.name], (err, qres) => {
			if(err) console.log(err);
			if(qres.length == 0) next();
			else return res.status(403).send({success: false, 
				error: {message: "User already exists!"}});
		});
	}
}

function verifyEvent(req, res, next) {
	console.log("Verifying event...");
	// validation start
	if(!ver.times(req.body.start, req.body.end)){
		res.status(403).send({success: false, 
			error: {message: 'Incorrect time'}});
	} else if(!ver.date(req.body.start_day)) {
		res.status(403).send({success: false, 
			error: {message: 'Incorrect date'}});
	} else {
		console.log("A");
		let q = `SELECT event_id, schedule_id, event_name, start, end, 
				DATE_FORMAT(start_day, '%Y-%m-%d') as start_day, period 
				FROM Event WHERE schedule_id = ?`;
		con.query(q, [req.body.schedule_id], function(err, events) {
			console.log("B");
			if(!ver.eventCollision(req.body, events)) {
				console.log("Event collides: ", req.body);
				res.status(403).send({
					success: false, error:{
						message: "Event collides with another event"
				}});
			} // validation end
			else {
				console.log("Event valid.");
				next();
			}
		});
	}
}

module.exports = {tokenCheck, scheduleCheck, verifyRegister, verifyEvent};

function getCookie(cookies, key) {
	let cookie = cookies.match('(^|;) ?' + key + '=([^;]*)(;|$)')
	return cookie ? cookie[2] : null;
}