class Event {
	// draw the event on schedule and save its ids
	constructor(event, startSeconds, gridColumn, count, rowMargin = 0){
		this.eventJson = event;
		this.fullId = this.eventJson.event_id+"-"+count;
		this.eventDiv = document.createElement('div');
		this.eventName = document.createElement('p');
		this.eventTime = document.createElement('p');
		this.eventEdit = document.createElement('button');
		this.eventDelete = document.createElement('button');
		
		// changes the eventDiv grid layout, other layouts append event into a div
		if(layout_type == "week")
			this.weekLayout(startSeconds, gridColumn, rowMargin);

		this.eventDiv.id = "eventDiv"+this.fullId;
		this.eventDiv.className = "eventDiv";
		this.eventName.id = "eventName"+this.fullId;
		this.eventName.innerText = this.eventJson.event_name;
		this.eventName.className = "eventText";
		this.eventTime.id = "eventTime"+this.fullId;
		this.eventTime.className = "eventText";
		this.eventTime.innerText =  this.eventJson.start.substr(0, 5) + ' - ' + this.eventJson.end.substr(0, 5);
		this.eventEdit.id = "eventEdit"+this.fullId;
		this.eventEdit.innerText = "[edit]";
		this.eventEdit.classList.add("eventBtn", "eventEditBtn");
		this.eventEdit.setAttribute('onclick', 
			"eventEditOnclick('"+this.fullId+"')");
		this.eventDelete.id = "eventDelete"+this.fullId;
		this.eventDelete.innerText = "[delete]";
		this.eventDelete.classList.add("eventBtn", "eventDeleteBtn");
		this.eventDelete.setAttribute('onclick', 
			"eventDeleteOnclick('"+this.fullId+"')");
		
		this.eventDiv.appendChild(this.eventName);
		this.eventDiv.appendChild(this.eventTime);
		this.eventDiv.appendChild(this.eventEdit);
		this.eventDiv.appendChild(this.eventDelete);
	}
	draw(parent = document.getElementById('schedule')){
		parent.appendChild(this.eventDiv);
		eventClassList.push(this);
	}
	delete() {
		let event_id = this.eventJson.event_id;
		submitEventDelete(event_id);
	}
}