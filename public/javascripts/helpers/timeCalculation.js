function convertISOtimeToSeconds(timeString){
	let timeStrings = timeString.split(":");
	let timeFloat = [];
	timeStrings.forEach(timeString => {
		timeFloat.push(Number(timeString));
	});
	// could check length to make sure of the data
	return timeFloat[0] * 3600 + timeFloat[1] * 60 + timeFloat[2];
}
function convertSecondsToISOtime(seconds){
	let date = new Date(null);
	date.setSeconds(seconds);
	return date.toISOString().substr(11, 8);
}
function convertSecondsToHHMM(seconds){
	let date = new Date(null);
	date.setSeconds(seconds);
	return date.toISOString().substr(11, 5);
}


function setTime(events, hourMargin = 2){
	// calculate schedule time period
	//  if time period comes out to four or less hours, make it have a 2 hours free before and after
	let starts = [], ends = [], differences = [];
	for(let i=0; i<events.length; i++){
		let event = events[i];
		starts.push(convertISOtimeToSeconds(event.start));
		ends.push(convertISOtimeToSeconds(event.end));
		differences.push(
			convertISOtimeToSeconds(event.end) - convertISOtimeToSeconds(event.start)
		);
	}
	let startSeconds = Math.min.apply(Math, starts);
	let endSeconds   = Math.max.apply(Math, ends);
	endSeconds += 3600;
	// add 2 hours to start and end times if their period is short
	if(Math.max(differences) <= 4 * 3600)
		endSeconds += hourMargin * 3600;
	if(startSeconds<1) startSeconds = 1;
	if(endSeconds>24*60*60) endSeconds = 24*12; 
	return([startSeconds, endSeconds]);
}

function getDaySeconds(days){
	let seconds = [Infinity, 0];
	days.forEach(day => {
		let daySeconds = setTime(day.events, 2);
		if(daySeconds[0] < seconds[0]) seconds[0] = daySeconds[0];
		if(daySeconds[1] > seconds[1]) seconds[1] = daySeconds[1];
	});
	return seconds;
}

function getRows(seconds) {
	return Math.round((seconds[1]-seconds[0]) / 60 / 5);
}