function createEventForm(form, input_class, event_name='', start='', end='', period='', day=''){
	let eventNameInput = document.createElement("input");
	eventNameInput.value = event_name;
	eventNameInput.classList.add("eventInput", input_class);

	let eventTime0Par = document.createElement("p");
	eventTime0Par.innerHTML = 'Start time';
	eventTime0Par.className = "eventText";

	let eventTime0Input = document.createElement("input");
	eventTime0Input.value = start;
	eventTime0Input.classList.add("eventInput", input_class);
	eventTime0Input.type = "time";

	let eventTime1Par = document.createElement("p");
	eventTime1Par.innerHTML = 'End time';
	eventTime1Par.className = "eventText";

	let eventTime1Input = document.createElement("input");
	eventTime1Input.value = end;
	eventTime1Input.classList.add("eventInput", input_class);
	eventTime1Input.type = "time";

	let eventPeriodInput = document.createElement("input");
	eventPeriodInput.value = period;
	eventPeriodInput.classList.add("eventInput", input_class);
	eventPeriodInput.type = "number";

	let eventDayInput = document.createElement("input");
	eventDayInput.value = day;
	eventDayInput.classList.add("eventInput", input_class);
	eventDayInput.type = "date";

	let eventSaveButton = document.createElement("button");
	eventSaveButton.innerHTML = 'save';
	eventSaveButton.className = "formBtn";
	eventSaveButton.type = 'submit';

	let eventCancelButton = document.createElement("button");
	eventCancelButton.innerHTML = 'cancel';
	eventCancelButton.onclick = eraseEventPopup;
	eventCancelButton.classList.add("formBtn", "cancelBtn");

	let eventNamePar = document.createElement("p");
	eventNamePar.innerHTML = 'Name';
	eventNamePar.className = "eventText";

	let eventDayPar = document.createElement("p");
	eventDayPar.innerHTML = 'Earliest event date';
	eventDayPar.className = "eventText";

	let eventPeriodPar = document.createElement("p");
	eventPeriodPar.innerHTML = 'Period in days';
	eventPeriodPar.className = "eventText";
	
	form.appendChild(eventNamePar);
	form.appendChild(eventNameInput);
	form.appendChild(eventTime0Par);
	form.appendChild(eventTime0Input);
	form.appendChild(eventTime1Par);
	form.appendChild(eventTime1Input);
	form.appendChild(eventDayPar);
	form.appendChild(eventDayInput);
	form.appendChild(eventPeriodPar);
	form.appendChild(eventPeriodInput);
	form.appendChild(eventCancelButton)
	form.appendChild(eventSaveButton);
}

function drawEventPopup(name, form) {
	let popup = document.createElement("div");

	let popupVeil = document.createElement("div");
	popupVeil.className = "eventPopupVeil";
	popupVeil.onclick = eraseEventPopup;
	// to not trigger it when a popupVeil is clicked:
	popup.onclick = function(event) { event.stopPropagation(); }

	let popupName = document.createElement("p");
	popupName.innerHTML = name;
	popup.appendChild(popupName);

	popup.appendChild(form);

	popup.className = "eventPopup";
	document.body.appendChild(popupVeil);
	popupVeil.appendChild(popup);
}

function eraseEventPopup() {
	let popup = document.getElementsByClassName("eventPopup")[0];
	let popupVeil = document.getElementsByClassName("eventPopupVeil")[0];
	
	while(popup.firstChild)
		popup.removeChild(popup.lastChild);

	popupVeil.removeChild(popup);
	document.body.removeChild(popupVeil);
}

function submitEventCreation(formEvent, form, schedule_id= 1) {
	formEvent.preventDefault();

	let dbInsertJson = {
		schedule_id: schedule_id,
		event_name: form.elements[1].value,
		start: form.elements[2].value,
		end: form.elements[3].value,
		start_day: form.elements[4].value,
		period: form.elements[5].value
	};

	let jsonIsValid = validateJson(dbInsertJson);
	if(!jsonIsValid) return -1;
	
	postData(dbInsertJson, '/eventInsert');

	let schedule = document.getElementById("schedule");
	while(schedule.firstChild)
		schedule.removeChild(schedule.lastChild);
	formSchedule();

	drawOriginalHeader();
}