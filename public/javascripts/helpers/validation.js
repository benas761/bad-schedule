function validateJson(json){
	// get all events from the class list
	let events = [];
	for(let eventClass of eventClassList)
		events.push(eventClass.eventJson);
	// validation
	if (json.event_name.length < 2 || 
		json.event_name.length > 30) {
			showErrorBanner("Name needs to be between 2 and 30 characters!", 6);
			return false;
	} else if(!time1_is_less(json.start, json.end)) {
		showErrorBanner("Start time must be less than the end time!", 6);
		return false;
	}
	else if(!eventCollision(json, events)) {
		showErrorBanner("Cannot intersect with other events!", 5);
		return false;
	} else return true;
}

// calculations for event collision
function gcd(a, b) { // greatest common denominator
	if(b == undefined) {
		console.warn(b);
		return Infinity;
	}
	while(b!=0) {
		let c = b;
		b = a % b;
		a = c;
	}
	return a;
}
function lcm(a, b) { // least common multiple
    return a * b / gcd(a, b);
}

function eventCollision(event, events) {
	for(let _event of events) {
		// skip if the event is the same
		if(event.event_id != _event.event_id) {
			if(dates_match(event, _event)) {
				// check if hours collide
				if(event.start > _event.start && event.start < _event.end ||
					_event.start > event.start && _event.start < event.end)
					return false;
			}
		}
	}
	return true;
}
function dates_match(event1, event2) {
	let bigPeriod = lcm(event1.period, event2.period);
	let date1 = new Date(event1.start_day);
	let date2 = new Date(event2.start_day);
	let diffTime = Math.abs(date2 - date1);
	let period1 = event1.period;
	let period2 = event2.period;
	if(date1 < date2) {
		period1 = event2.period;
		period2 = event1.period;
	}
	// escape from the dates for sanity sake
	let dateDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	let day2 = dateDiff;
	// check until the smallest common denominator is reached
	for(let i=0; i<=dateDiff+bigPeriod; i+=period1) {
		while(day2<i) day2+=period2;
		if(i == day2) return true;
	}
	return false;
}

function time1_is_less(time1, time2) { return true ? time1 < time2 : false }

function showErrorBanner(message, duration) {
	let errorBanner = document.createElement("div");
	errorBanner.className = "errorBanner";
	let errorBannerText = document.createElement("p");
	errorBannerText.innerText = message;
	errorBanner.appendChild(errorBannerText);
	document.body.appendChild(errorBanner);
	setTimeout(function() {
		document.body.removeChild(errorBanner);
	}, duration * 1000);
}