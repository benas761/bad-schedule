const dotenv = require('dotenv').config();
var con = require('./database.js');
let jwt = require('jsonwebtoken');
const ver = require('./validation.js');
const argon2 = require('argon2');

function registerGet(req, res) {
	res.render('login', {page_title: 'bad-schedule', type: "Register"});
}

function loginGet(req, res) {
	res.render('login', {page_title: 'bad-schedule', type: "Login"});
}

function tokenPost(req, res) {
	let q = "SELECT user_id, password FROM User WHERE username = ?";
	con.query(q, [req.body.name], async(err, qres) => {
		if(err) console.log(err);
		if(qres.length == 0) res.status(400).send({
			success: false, error: { message: "User not found!" }
		});
		else if(await argon2.verify(qres[0].password, req.body.password)) {
			delete qres[0].password;
			let parsedQuery = JSON.parse(JSON.stringify(qres[0]));
			let token = jwt.sign(parsedQuery, process.env.JWT_KEY, {
				algorithm: process.env.JWT_ALG,
				expiresIn: '24h'
			});
			res.status(200).json({success: true, jwtoken: token});
		}
		else res.status(400).send({success: false, error: {message: "Incorrect password!"}});
	});
}

async function registerPost(req, res) {
	// hashes with argon2, which automatically salts and uses blake2 hashing
	let hashed_password = await argon2.hash(req.body.password);
	let q = "INSERT INTO User(username, password) VALUES(?, ?)";
	console.log("INSERT INTO User(username, password) VALUES(", 
		req.body.name, ",", hashed_password, ")");
	con.query(q, [req.body.name, hashed_password], (err, qres) => {
		if(err) console.log(err);
		q = "INSERT INTO Schedule(user_id, schedule_name) VALUES(?, ?)"
		con.query(q, [qres.insertId, "Default"], (err, qres) => {
			if(err) console.log(err); 
			console.log("Succesfully registered new user and schedule.");
			res.json({success: true});
		});
	});
}

module.exports = {registerGet, loginGet, tokenPost, registerPost}