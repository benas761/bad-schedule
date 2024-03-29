function writeHours(seconds, rowMargin = 0){
	let startRow = rowMargin + 3;
	let endRow = Math.round((seconds[1]-seconds[0])/60/5) + startRow;
	let roundedSeconds = Math.round(seconds[0]/60/5)*60*5;
	// how many five minute intervals are needed to reach a clean hour
	let cleanColumnHour = 12 - ((roundedSeconds/60/5) % 12);
	// draw the first time if it's not close to a clean time
	if(cleanColumnHour>3){
		let timestamp = document.createElement('p');
		timestamp.innerText = convertSecondsToHHMM(roundedSeconds);
		timestamp.style.gridRow = startRow+'/'+(startRow+cleanColumnHour);
		timestamp.className = "scheduleTime";
		schedule.appendChild(timestamp);
	}

	// draw clean hours
	for(let i = startRow+cleanColumnHour; i<endRow; i+=12){
		let timestamp = document.createElement('p');
		timestamp.innerText = convertSecondsToHHMM(roundedSeconds+((i-startRow)*60*5));
		timestamp.style.gridRow = i+'/'+(i+12);
		timestamp.className = "scheduleTime";
		schedule.appendChild(timestamp);
	}
}

async function formSchedule(){
	let eventList = await postData({}, '/eventSelect');
	eventList = JSON.parse(eventList);

	if(layout_type == "week")
		weekLayout(eventList);
	if(layout_type == "month") {
		let days = findMonthDays();
		generalLayout(eventList, days);
	}
	if(layout_type == "year") {
		let days = findYearDays();
		generalLayout(eventList, days);
	}
}

function resetSchedule() {
	console.log("Schedule reset.");
	let schedule = document.getElementById("schedule");
	while(schedule.firstChild) {
		schedule.removeChild(schedule.lastChild);
	}
	formSchedule();
}