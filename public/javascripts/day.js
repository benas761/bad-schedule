class Day{
	// should receive all the events and filter it in findEvents()
	constructor(date, header, events, column, row = 0){
		this.header = header;
		this.date = date;
		this.events = filterEvents(events, this.date);
		this.column = column;
		this.row = row;
	}
	drawWeek() {
		// draw the day on the schedule according to the schedule setting
		// draw the header:
		let header = document.createElement('p');
		header.style.gridRow = "1/3";
		header.style.gridColumn = this.column;
		header.innerText = this.header;
		header.className = "scheduleHeaders";

		let mobileSpacer = document.createElement("div");
		mobileSpacer.className = "generalEventParent";
		mobileSpacer.style.gridRow = 3;
		mobileSpacer.style.gridColumn = this.column;

		let schedule = document.getElementById("schedule");
		schedule.appendChild(header);
		schedule.appendChild(mobileSpacer);

		// draw the events of the day
		for(let eventClass of this.eventClasses)
			eventClass.draw(schedule);
	}
	drawGeneral() {
		// draw the header
		let header = document.createElement("p");
		header.style.gridRow = this.row;
		header.style.gridColumn = this.column;
		header.innerText = this.header;
		header.className = "scheduleHeaders";

		let parentDiv = document.createElement("div");
		parentDiv.className = "generalEventParent";
		parentDiv.style.gridRow = this.row + 1;
		parentDiv.style.gridColumn = this.column;

		// store events in a day's div
		for(let eventClass of this.eventClasses)
			eventClass.draw(parentDiv);

		if(this.eventClasses.length == 0) {
			parentDiv.classList.add("hideInMobile");
			header.classList.add("hideInMobile");
		}
		
		let schedule = document.getElementById("schedule");
		schedule.appendChild(header);
		schedule.appendChild(parentDiv);
	}
}

Day.prototype.createEventClasses = function(seconds = [undefined]) {
	this.eventClasses = []
	for(let event of this.events) {
		this.eventClasses.push(
			new Event(event, seconds[0], this.column, this.header, this.rowMargin)
		);
	}
}

function filterEvents(events, date) {
	// find events that happen each week
	let filteredEvents = []
	// set times to 0 b/c we're comparing dates
	let dayMidnight = date;
	dayMidnight.setHours(0, 0, 0, 0);

	events.forEach(event => {
		let eventMidnight = new Date(event.start_day);
		eventMidnight.setHours(0, 0, 0, 0);
	
		let iterDay = new Date(dayMidnight);
		while(iterDay >= eventMidnight) {
			if(iterDay.getTime() == eventMidnight.getTime()){
				filteredEvents.push(event);
			}
			iterDay = new Date(iterDay.setDate(iterDay.getDate() - event.period));
		}
	});

	// sort the events to draw them in order of time
	filteredEvents.sort(function(a, b) {
		if(a.start < b.start) return -1;
		else if (a.start > b.start) return 1;
		else return 0;
	});

	return filteredEvents;
}