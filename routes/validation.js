var mysql = require('mysql');
var con = require('./database.js');
const moment = require('moment');

var ver = {};

//#region event input verification

ver.name = function(name) {
	if(2 > name.length > 31) return false;
	return true;
}

ver.eventCollision = function(event, events) {
	for(let i=0; i<events.length; i++) {
		// skip if the event is the same
		if(event.event_id != events[i].event_id) {
			if(dates_match(event, events[i])) {
				// check if hours collide
				if(event.start > events[i].start && event.start < events[i].end ||
				   events[i].start > event.start && events[i].start < event.end)
					return false;
			}
		}
	}
	return true;
}

// https://www.the-art-of-web.com/javascript/validate-date/
ver.time = function(time) {
	// regex magic
	let regex = /^\d{1,2}:\d{2}([ap]m)?$/;
	console.log("Time match:", time.match(regex));
	if(time != '' && time.match(regex)){
		return true;
	} return false;
}

// https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd
ver.date = function(date) {
	try {
		var momentDate = moment(date);
		if(momentDate.isValid()) return true;
	} catch { return false; }
	return false;
}

ver.times = function(start, end) {
	if(ver.time(start) && ver.time(end)) {
		let startSecs = convertISOtimeToSeconds(start);
		let endSecs = convertISOtimeToSeconds(end);
		if(startSecs < endSecs) {
			return true;
		}
	}
	return false;
}

//#endregion

module.exports = ver;

// calculations for event collision
function gcd(a, b) { // greatest common denominator
    if (b == 0) {
        return a; // so that the recursion does not go on forever
    } else {
        return gcd(b, a % b);
    }
}
function lcm(a, b) { // least common multiple
    return a * b / gcd(a, b);
}
function dates_match(event1, event2) {
	let bigPeriod = lcm(event1.period, event2.period);
	let date1 = new Date(event1.start_day);
	let date2 = new Date(event2.start_day);
	let diffTime = Math.abs(date2 - date1);
	let period1 = event1.period;
	let period2 = event2.period;
	if(date1 < date2) {
		period1 = event2.period;
		period2 = event1.period;
	}
	// escape from the dates for sanity sake
	let dateDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	let day2 = dateDiff;
	// check until the smallest common denominator is reached
	for(let i=0; i<=dateDiff+bigPeriod; i+=period1) {
		while(day2<i) day2+=period2;
		if(i == day2) return true;
	}
	return false;
}
function convertISOtimeToSeconds(timeString){
	let timeStrings = timeString.split(":");
	let timeFloat = [];
	for(let i=0; i<timeStrings.length; i++)
		timeFloat.push(Number(timeStrings[i]));
	// could check length to make sure of the data
	if(timeFloat.length == 2) return timeFloat[0] * 3600 + timeFloat[1] * 60;
	else return timeFloat[0] * 3600 + timeFloat[1] * 60 + timeFloat[2];
}