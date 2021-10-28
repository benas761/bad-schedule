// edit button can be enabled in Event consturctor
// disabled for clean formatting

Event.prototype.delete = function() {
    // append inputs with childrens' values
    // for simplicity, inputs are not saved inside the class
    // form.className = "eventDeleteForm";
    let event_id = this.eventJson.event_id;
    submitEventDelete(event_id);
    /*while(this.secondHeaderDiv.firstChild)
        this.secondHeaderDiv.removeChild(this.secondHeaderDiv.lastChild);
    
    let cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "no";


    cancelBtn.onclick = drawOriginalHeader;

    let secondHeaderDiv = document.getElementById("secondHeaderDiv");
    while(secondHeaderDiv.firstChild) 
        secondHeaderDiv.removeChild(secondHeaderDiv.lastChild);
    secondHeaderDiv.appendChild(form);
    
    var eventId = this.eventJson.event_id;
    form.addEventListener('submit', function(formEvent) { 
        submitEventDelete(formEvent, form, eventId);
    });*/
}

function eventDeleteOnclick(eventFullId){
    eventClassList.forEach(eventClass => {
        if(eventClass.fullId == eventFullId){
            eventClass.delete();
            return;
        }
    });
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

    // drawOriginalHeader();
}
