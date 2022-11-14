function createEventForm(form, input_class, event_name='', start='', end='', period='', day=''){
	let eventNameInput = document.createElement("input");
	eventNameInput.value = event_name;
	eventNameInput.maxLength = 30;
	eventNameInput.minLength = 3;
	eventNameInput.classList.add("eventInput", input_class);

	let eventTime0Par = document.createElement("p");
	eventTime0Par.innerText = 'Start time';
	eventTime0Par.className = "eventText";

	let eventTime0Input = document.createElement("input");
	eventTime0Input.value = start;
	eventTime0Input.classList.add("eventInput", input_class);
	eventTime0Input.type = "time";

	let eventTime1Par = document.createElement("p");
	eventTime1Par.innerText = 'End time';
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
	eventSaveButton.innerText = 'save';
	eventSaveButton.classList.add("formBtn", "submitBtn");
	eventSaveButton.type = 'submit';

	let eventCancelButton = document.createElement("button");
	eventCancelButton.innerText = 'cancel';
	eventCancelButton.onclick = eraseEventPopup;
	eventCancelButton.classList.add("formBtn", "cancelBtn");

	let eventNamePar = document.createElement("p");
	eventNamePar.innerText = 'Name';
	eventNamePar.className = "eventText";

	let eventDayPar = document.createElement("p");
	eventDayPar.innerText = 'Earliest event date';
	eventDayPar.className = "eventText";

	let eventPeriodPar = document.createElement("p");
	eventPeriodPar.innerText = 'Period in days';
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
	form.appendChild(eventCancelButton);
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
	popupName.innerText = name;
	popup.appendChild(popupName);

	popup.appendChild(form);

	popup.className = "eventPopup";
	document.body.appendChild(popupVeil);
	popupVeil.appendChild(popup);
}

function eraseEventPopup() {
	let popups = document.getElementsByClassName("eventPopup");
	let popupVeils = document.getElementsByClassName("eventPopupVeil");
	
	while(popups.length > 0) {
		while(popups[0].firstChild)
			popups[0].removeChild(popups[0].lastChild);

		popupVeils[0].removeChild(popups[0]);
		document.body.removeChild(popupVeils[0]);
	}
}