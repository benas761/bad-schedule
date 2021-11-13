// data is a json, header is for index.js orientation
// returns a promise
async function postData(data, header){
	let options = {
		method: 'POST',
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify(data)
	}
	try {
		const response = await fetch(header, options);
		if(!response.ok) console.error(response);
		return await response.json();
	} catch(e) { console.error('postData:', e); }
}

// for Event.edit() event listener
async function submitEventEdit(formEvent, form, eventId, scheduleId){
	formEvent.preventDefault();
	let dbUpdateJson = { event_id: eventId, schedule_id: scheduleId };
	dbUpdateJson = getJsonFromForm(dbUpdateJson, form);
	if(!dbUpdateJson) return;

	postData(dbUpdateJson, '/eventUpdate');
	resetSchedule();
}

function submitEventCreation(formEvent, form, schedule_id= 1) {
	formEvent.preventDefault();
	let dbInsertJson = { schedule_id: schedule_id };
	dbInsertJson = getJsonFromForm(dbInsertJson, form);
	if(!dbInsertJson) return;
	
	postData(dbInsertJson, '/eventInsert');
	resetSchedule();
}

// for Event.delete() event listener
async function submitEventDelete(eventId){
	let dbDeleteJson = { event_id: eventId };
	postData(dbDeleteJson, '/eventDelete');
	resetSchedule();
}

function getJsonFromForm(json, form) {
	json.event_name = form.elements[0].value;
	json.start = form.elements[1].value;
	json.end = form.elements[2].value;
	json.start_day = form.elements[3].value;
	json.period = form.elements[4].value;

	let isJsonValid = validateJson(json);
	if(!isJsonValid) return undefined;

	return json;
}

