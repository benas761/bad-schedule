function eventAddFormOnclick() {
	let form = document.createElement('form');
	form.className = "eventAddForm";
	
	let today = new Date().toISOString().split('T')[0];
	createEventForm(form, "addEventInput", '', '', '', '7', today);
	
	drawEventPopup("Add event", form);
	
	form.addEventListener('submit', function(formEvent) { 
		// in dbCommunication.js
		submitEventCreation(formEvent, form);
		eraseEventPopup();
	});
}


function eventDeleteOnclick(eventFullId){
	eventClassList.forEach(eventClass => {
		if(eventClass.fullId == eventFullId){
			eventClass.delete();
			break;
		}
	});
}

function eventEditOnclick(eventFullId){
	for(let eventClass of eventClassList) {
		if(eventClass.fullId == eventFullId){
			eventClass.edit();
			break;
		}
	}
}

Event.prototype.edit = function() {
	// append inputs with childrens' values
	// for simplicity, inputs are not saved inside the class
	let form = document.createElement('form');
	form.className = "eventAddForm";
	
	let startDayDate = new Date(this.eventJson.start_day);
	let startDayString = startDayDate.toISOString().split('T')[0];

	createEventForm(form, "addEventInput", this.eventJson.event_name, this.eventJson.start.substr(0, 5), 
		this.eventJson.end.substr(0, 5), this.eventJson.period, startDayString);

	drawEventPopup("Edit event", form);
	
	let eventId = this.eventJson.event_id;
	form.addEventListener('submit', function(formEvent) { 
		// in dbCommunication.js
		submitEventEdit(formEvent, form, eventId);
		eraseEventPopup();
	});
}

function exportOnClick() {
	print();
}

function logoutOnClick() {
	eraseCookie("loginToken");
	eraseCookie("schedule");
}