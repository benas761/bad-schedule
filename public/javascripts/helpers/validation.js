
function validateJson(json){
	// validation
	if (json.event_name.length < 2 || 
		json.event_name.length > 30) {
			showErrorBanner("<b>Name </b> needs to be between 2 and 30 characters!", 6);
			return false;
	} else if(!validateEventIntersection(json.start_day, json.start, json.end, json.period)){
		showErrorBanner("Events cannot intersect!", 6);
		return false;
	} else return true;
}

function validateEventIntersection(start_day, start, end, period){
	for(let i=0; i<eventClassList.length; i++) {
		// check if days collide
		let collide = false;
		let thisStartDate = new Date(start_day);
		let otherStartDate = new Date(eventClassList[i].eventJson.start_day);
		if(thisStartDate > otherStartDate) {
			while(thisStartDate > otherStartDate) {
				if(thisStartDate == otherStartDate) collide = true;
				otherStartDate.setDate(otherStartDate.getDate() + eventClassList[i].eventJson.period);
			}
		} else {
			while(thisStartDate < otherStartDate) {
				if(thisStartDate == otherStartDate) collide = true;
				thisStartDate.setDate(thisStartDate.getDate() + period);
			}
		}
		// if yes, check if hours collide
		if(collide) {
			let thisStart = convertISOtimeToSeconds(start);
			let otherStart = convertISOtimeToSeconds(eventClassList[i].start);
			// let this end...
			let thisEnd = convertISOtimeToSeconds(end);
			let otherEnd = convertISOtimeToSeconds(eventClassList[i].end);

			if((thisStart >= otherStart && thisStart < otherEnd) ||
				otherStart >= thisStart && otherStart < thisEnd)
					return false;
		}
	}
	return true;
}

function showErrorBanner(message, duration) {
	let errorBanner = document.createElement("div");
	errorBanner.className = "errorBanner";
	let errorBannerText = document.createElement("p");
	errorBannerText.innerHTML = message;
	errorBanner.appendChild(errorBannerText);
	document.body.appendChild(errorBanner);
	setTimeout(function() {
		document.body.removeChild(errorBanner);
	}, duration * 1000);
}