function writeHours(seconds, rowMargin = 0){
	var startRow = rowMargin + 3;
	var endRow = Math.round((seconds[1]-seconds[0])/60/5) + startRow;
	var roundedSeconds = Math.round(seconds[0]/60/5)*60*5;
	// how many five minute intervals are needed to reach a clean hour
	var cleanColumnHour = 12 - ((roundedSeconds/60/5) % 12);
	// draw the first time if it's not close to a clean time
	if(cleanColumnHour>3){
		let timestamp = document.createElement('p');
		timestamp.innerHTML = convertSecondsToHHMM(roundedSeconds);
		timestamp.style.gridRow = startRow+'/'+(startRow+cleanColumnHour);
		timestamp.className = "scheduleTime";
		schedule.appendChild(timestamp);
	}

	// draw clean hours
	for(let i = startRow+cleanColumnHour; i<endRow; i+=12){
		let timestamp = document.createElement('p');
		timestamp.innerHTML = convertSecondsToHHMM(roundedSeconds+((i-startRow)*60*5));
		timestamp.style.gridRow = i+'/'+(i+12);
		timestamp.className = "scheduleTime";
		schedule.appendChild(timestamp);
	}
}

//#endregion Time functions

//#region Drawing schedule

async function formSchedule(){
	// pauses all JS until it gets a response from the database. Fine at first load, but shouldn't be used for other events
	let eventList = await postData({}, '/eventSelect');
	eventList = JSON.parse(eventList);

	if(layout_type == "week")
		weekLayout(eventList);
	if(layout_type == "month")
		monthLayout(eventList);
}

// tech used - pug, expressJS (node.js)
// depends on nodejs and npm
// build with "npm install" and run with "npm run"

// left:
// header styling
// schedule names
// layout selection
