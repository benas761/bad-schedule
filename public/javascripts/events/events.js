function findEventColumns(event){
	let week = findWeekdays()
	for(let i=0; i<7; i++){
		// set times to 0 b/c we're comparing dates
		week[i].setHours(0, 0, 0, 0);
	}
	let eventDay = new Date(event.start_day);
	eventDay.setHours(0, 0, 0, 0);

	let gridColumns = [];
	for(let iterDay=eventDay; iterDay <= week[week.length-1]; iterDay.setDate(iterDay.getDate() + event.period)){
		for(let i = 0; i<week.length; i++){
			if(iterDay.getTime() == week[i].getTime()){
				gridColumns.push(i+2+'/'+(i+3));
			}
		}
	}
	return gridColumns;
}

function clearEvents() {
	let schedule = document.getElementById("schedule");
	for(let i=0; i<schedule.childNodes.length; i++){
		let child = schedule.childNodes[i];
		if(child.id.substr(0, 8) == "eventDiv"){
			schedule.removeChild(child);
			i--;
		}
	}
}

function refreshEvents(eventList, startSeconds){
	eventClassList = [];
	eventList.forEach(eventJson => {
		let gridColumns = findEventColumns(eventJson);
		for(let i=0; i<gridColumns.length; i++)
			new Event(eventJson, startSeconds, gridColumns[i], i);
	});
}

//#endregion drawing events to schedule