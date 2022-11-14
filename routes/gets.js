let con = require('./database.js');
const { scheduleCheck } = require('./middleware.js');

function rootGet(req, res) {
	const q = "SELECT schedule_name FROM Schedule WHERE schedule_id=?";
	con.query(q, [req.schedule], function(err, qres) {
		if(err) console.log(err);
		console.log("Schedule cookie:", req.schedule);
		console.log("Query schedule:", qres);
		res.render('index', {
			page_title: 'bad-schedule',
			schedule_name: qres[0].schedule_name
		});
	});
}

module.exports = {rootGet}