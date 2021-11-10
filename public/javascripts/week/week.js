function weekLayout(eventList) {
    // for weekly layout
	let seconds = setTime(eventList, 2);
	drawWeekColumnDividers(seconds);
	drawWeekRowDividers(seconds);

	let fiveMinuteDifference = getRows(seconds);
	let schedule = document.getElementById("schedule");
	// sets the amount of rows into intervals of 5 minutes
	let rowAttribute = firstRowHeight+'px ';
	rowAttribute += marginRowHeight+'px '; // margin before times that goes 
	rowAttribute += 'repeat('+fiveMinuteDifference+', '+timeRowHeight+'px)';
	schedule.style.gridTemplateRows = rowAttribute;
	schedule.style.gridTemplateColumns = "repeat(7, auto)";

	writeHours(seconds);

	refreshEvents(eventList, seconds[0]); // changes global eventClassList
	//eventClassList.forEach(eventClass => { eventClass.draw(); });

	createWeekDays(eventList);
}

function createWeekDays(eventList) {
	let weekdays = findWeekdays();
	let weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	let days = [];
	for(let i=0; i<weekdays.length; i++) {
		let header = (weekdays[i].getMonth()+1) + '/' + weekdays[i].getDate() + " " + weekdayNames[i];
		days.push(
			new Day(weekdays[i], header, eventList, i+2, 0)
		);
	}
	let seconds = getDaySeconds(days);
	for(let i=0; i<days.length; i++) {
		days[i].createEventClasses(seconds);
		days[i].drawWeek();
	}
}

// called from Event.constructor
Event.prototype.weekLayout = function(startSeconds, gridColumn, rowMargin) {
    var eventDivStart = Math.round(
        (convertISOtimeToSeconds(this.eventJson.start)-startSeconds)/60/5)+3+rowMargin;
    var eventDivEnd = Math.round(
        (convertISOtimeToSeconds(this.eventJson.end) - startSeconds)/60/5)+3+rowMargin;

    this.eventDiv.style.gridRow = (eventDivStart)+'/'+eventDivEnd;
    this.eventDiv.style.gridColumn = gridColumn;
}

function drawWeekColumnDividers(seconds, rowMargin= 0) {
	var startRow = 1;
	var endRow = Math.round((seconds[1]-seconds[0])/60/5) + rowMargin + 3;

	for(let i=1; i<8; i++){
		let columnDivider = document.createElement('div');
		if(i==1) columnDivider.classList.add('columnDivider', 'headerColumnDivider');
		else columnDivider.className = 'columnDivider';
		columnDivider.style.gridColumn = i;
		columnDivider.style.gridRow = startRow + '/' + endRow;
		document.getElementById("schedule").appendChild(columnDivider);
	}
}

function drawWeekRowDividers(seconds, rowMargin = 0) {
	var startRow = rowMargin + 3;
	var endRow = getRows(seconds) + 2;
	var roundedSeconds = Math.round(seconds[0]/60/5)*60*5;
	// how many five minute intervals are needed to reach a clean hour
	var cleanColumnHour = 12 - ((roundedSeconds/60/5) % 12);
	// draw the first time if it's not close to a clean time
	if(cleanColumnHour>3){
		let rowDivider = document.createElement('div');
		rowDivider.style.gridRow = startRow+'/'+(startRow+cleanColumnHour);
		rowDivider.style.gridColumn = '1/9';
		rowDivider.classList.add("rowDivider", "firstRowDivider");
		schedule.appendChild(rowDivider);
	}

	// draw clean hours
	for(let i = startRow+cleanColumnHour; i<endRow; i+=12){
		let rowDivider = document.createElement('div');
		rowDivider.style.gridRow = i+'/'+(i+12);
		rowDivider.style.gridColumn = '1/9';
		rowDivider.className = "rowDivider";
		if(cleanColumnHour<=3 && i == startRow+cleanColumnHour) 
			rowDivider.classList.add("rowDivider", "firstRowDivider");
		else rowDivider.className = "rowDivider";
		schedule.appendChild(rowDivider);
	}
}