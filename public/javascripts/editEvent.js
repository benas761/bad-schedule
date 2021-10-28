// edit button can be enabled in Event consturctor
// disabled for clean formatting

Event.prototype.edit = function() {
    // append inputs with childrens' values
    // for simplicity, inputs are not saved inside the class
    let form = document.createElement('form');
    form.className = "eventAddForm";
    
    let startDayDate = new Date(this.eventJson.start_day);
    let startDayString = startDayDate.toISOString().split('T')[0];

    let cancelBtn = createEventForm(form, "addEventInput", this.eventJson.event_name, this.eventJson.start.substr(0, 5), 
        this.eventJson.end.substr(0, 5), this.eventJson.period, startDayString);

    cancelBtn.onclick = drawOriginalHeader;

    let secondHeaderDiv = document.getElementById("secondHeaderDiv");
    while(secondHeaderDiv.firstChild) 
        secondHeaderDiv.removeChild(secondHeaderDiv.lastChild);
    secondHeaderDiv.appendChild(form);
    
    var eventId = this.eventJson.event_id;
    form.addEventListener('submit', function(formEvent) { 
        submitEventEdit(formEvent, form, eventId);
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
