function eventAddFormOnclick() {
	let form = document.createElement('form');
	form.className = "eventAddForm";
	
	let today = new Date().toISOString().split('T')[0];
	createEventForm(form, "addEventInput", '', '', '', '7', today);
	
	drawEventPopup("Add event", form);
	
	form.addEventListener('submit', function(formEvent) { 
		submitEventCreation(formEvent, form);
	});
}


function eventDeleteOnclick(eventFullId){
	eventClassList.forEach(eventClass => {
		if(eventClass.fullId == eventFullId){
			eventClass.delete();
			return;
		}
	});
}

function eventEditOnclick(eventFullId){
	eventClassList.forEach(eventClass => {
		if(eventClass.fullId == eventFullId){
			eventClass.edit();
			return;
		}
	});
}