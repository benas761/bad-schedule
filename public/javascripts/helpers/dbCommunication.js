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
async function submitEventEdit(formEvent, form, eventId){
	formEvent.preventDefault();
	// make sure of the format later
	let dbUpdateJson = {
		event_id: eventId,
		event_name: form.elements[1].value,
		start: form.elements[2].value,
		end: form.elements[3].value,
		start_day: form.elements[4].value,
		period: form.elements[5].value
	};

	let isJsonValid = validateJson(dbUpdateJson);
	if(!isJsonValid) return -1;

	postData(dbUpdateJson, '/eventUpdate');
	let schedule = document.getElementById("schedule");
	while(schedule.firstChild)
		schedule.removeChild(schedule.lastChild);
	formSchedule();

	drawOriginalHeader();
}

// for Event.delete() event listener
async function submitEventDelete(eventId){
	let dbDeleteJson = {
		event_id: eventId
	}
	postData(dbDeleteJson, '/eventDelete');
	let schedule = document.getElementById("schedule");
	while(schedule.firstChild)
		schedule.removeChild(schedule.lastChild);
	formSchedule();
}