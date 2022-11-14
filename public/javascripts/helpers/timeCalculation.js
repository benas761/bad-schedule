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
	return date.toISOString().substring(11, 19);
}
function convertSecondsToHHMM(seconds){
	let date = new Date(null);
	date.setSeconds(seconds);
	return date.toISOString().substring(11, 16);
}


function setTime(events, hourMargin = 2){
	// calculate schedule time period
	//  if time period comes out to four or less hours, make it have a 2 hours free before and after
	let starts = [], ends = [], differences = [];
	for(let event of events){
		starts.push(convertISOtimeToSeconds(event.start));
		ends.push(convertISOtimeToSeconds(event.end));
		differences.push(
			convertISOtimeToSeconds(event.end) - convertISOtimeToSeconds(event.start)
		);
	}
	let startSeconds, endSeconds;
	if(starts.length == 0) {
		startSeconds = 0;
		endSeconds = 6*60*60;
	} else {
		startSeconds = Math.min.apply(Math, starts);
		endSeconds   = Math.max.apply(Math, ends);
	}
	// add 2 hours to end times if their period is short
	if(Math.max(differences) <= 4 * 3600)
		endSeconds += hourMargin * 3600;
	startSeconds -= 10 * 60;
	if(startSeconds<1) startSeconds = 1;
	if(endSeconds>24*60*60) endSeconds = 24*60*60; 
	return([startSeconds, endSeconds]);
}

function getRows(seconds) {
	return Math.round((seconds[1]-seconds[0]) / 60 / 5);
}