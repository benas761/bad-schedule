function validateJson(json){
	if (json.event_name.length < 2 || 
		json.event_name.length > 30) {
			showErrorBanner("Name needs to be between 2 and 30 characters!", 6);
			return false;
	} else if(json.start >= json.end) {
		showErrorBanner("Start time must be less than the end time!", 6);
		return false;
	}
	else return true;
}

// calculations for event collision
function gcd(num_a, num_b) { // greatest common denominator
	if(num_b == undefined) {
		console.warn(num_b);
		return Infinity;
	}
	while(num_b!=0) {
		let exchanger = num_b;
		num_b = num_a % num_b;
		num_a = exchanger;
	}
	return num_a;
}
function lcm(num_a, num_b) { // least common multiple
    return num_a * num_b / gcd(a, num_b);
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