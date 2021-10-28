var firstRowHeight = 15;
var marginRowHeight = 20;
var headerRowCount = 3;
var timeRowHeight = 8;
var eventClassList = [];
var eventList = [];

class Event {
    // draw the event on schedule and save its ids
    constructor(event, startSeconds, gridColumn, count){
        this.eventJson = event;
        this.fullId = this.eventJson.event_id+"-"+count;
        this.eventDiv = document.createElement('div');
        this.eventName = document.createElement('p');
        this.eventTime = document.createElement('p');
        this.eventEdit = document.createElement('button');
        this.editing = false;
        
        var eventGridStart = Math.round(
            (convertISOtimeToSeconds(this.eventJson.start)-startSeconds)/60/5)+headerRowCount;
        var eventGridEnd = Math.round(
            (convertISOtimeToSeconds(this.eventJson.end) - startSeconds)/60/5)+headerRowCount;

        this.eventDiv.id = "eventDiv"+this.fullId;
        this.eventDiv.style.gridRow = (eventGridStart)+'/'+eventGridEnd;
        this.eventDiv.style.gridColumn = gridColumn;
        this.eventDiv.className = "eventDiv";
        this.eventName.id = "eventName"+this.fullId;
        this.eventName.innerHTML = this.eventJson.event_name;
        this.eventName.className = "eventText";
        this.eventTime.id = "eventTime"+this.fullId;
        this.eventTime.className = "eventText";
        this.eventTime.innerHTML =  this.eventJson.start.substr(0, 5) + ' - ' + this.eventJson.end.substr(0, 5);
        this.eventEdit.id = "eventEdit"+this.fullId;
        this.eventEdit.innerHTML = "edit";
        this.eventEdit.className = "formBtn";
        /*this.eventEdit.setAttribute('onclick', 
            "eventEditOnclick('"+this.fullId+"')");
        
        this.eventDiv.appendChild(this.eventEdit);*/
        this.eventDiv.appendChild(this.eventName);
        this.eventDiv.appendChild(this.eventTime);
    }
    draw(){
        let schedule = document.getElementById('schedule');
        schedule.appendChild(this.eventDiv);
    }
    clear(){
        while(this.eventDiv.firstChild)
            this.eventDiv.removeChild(this.eventDiv.lastChild);
    }
}

//#region editing and adding events

function eventAddFormOnclick() {
    let form = document.createElement('form');
    
    let today = new Date().toISOString().split('T')[0];
    let cancelBtn = createEventForm(form, "addEventInput", '', '', '', '', today);
    cancelBtn.onclick = cancelAddForm;
    form.className = "eventAddForm";
    let secondHeaderDiv = document.getElementById("secondHeaderDiv");
    secondHeaderDiv.removeChild(secondHeaderDiv.lastChild);

    secondHeaderDiv.appendChild(form);
    
    form.addEventListener('submit', function(formEvent) { 
        submitEventCreation(formEvent, form);
    });
}

function cancelAddForm() {
    let secondHeaderDiv = document.getElementById("secondHeaderDiv");
    while(secondHeaderDiv.firstChild)
        secondHeaderDiv.removeChild(secondHeaderDiv.lastChild);
    // add the event button. Will need to be put in a seperate function after adding other buttons
    let addEventButton = document.createElement('button');
    addEventButton.innerHTML = "Add Event";
    addEventButton.onclick = eventAddFormOnclick;
    addEventButton.className = "addEventBtn";
    secondHeaderDiv.appendChild(addEventButton);
}

function createEventForm(form, input_class, event_name='', start='', end='', period='', day='', ){
    let eventNameInput = document.createElement("input");
    let eventTime0Input = document.createElement("input");
    let eventTimeDash = document.createElement("p");
    let eventTime1Input = document.createElement("input");
    let eventPeriodInput = document.createElement("input");
    let eventDayInput = document.createElement("input");
    let eventSaveButton = document.createElement("button");
    let eventCancelButton = document.createElement("button");
    let eventNamePar = document.createElement("p");
    let eventTimePar = document.createElement("p");
    let eventDayPar = document.createElement("p");
    let eventPeriodPar = document.createElement("p");

    eventNameInput.value = event_name;
    eventTime0Input.value = start;
    eventTime1Input.value = end;
    eventPeriodInput.value = period;
    eventDayInput.value = day;

    eventNamePar.innerHTML = 'Name';
    eventTimePar.innerHTML = 'Start time';
    eventTimeDash.innerHTML = 'End time';
    eventPeriodPar.innerHTML = 'Period in days';
    eventSaveButton.innerHTML = 'save';
    eventCancelButton.innerHTML = 'cancel';
    eventDayPar.innerHTML = 'Earliest event date';

    eventNameInput.classList.add("eventInput", input_class);
    eventTime0Input.classList.add("eventInput", input_class);
    eventTime1Input.classList.add("eventInput", input_class);
    eventPeriodInput.classList.add("eventInput", input_class);
    eventDayInput.classList.add("eventInput", input_class);
    eventNamePar.className = "eventText";
    eventTimePar.classname = "eventText";
    eventPeriodPar.className = "eventText";
    eventTimeDash.className = "eventText";
    eventDayPar.className = "eventText";
    eventCancelButton.className = "formBtn";
    eventSaveButton.className = "formBtn";
    
    eventSaveButton.type = 'submit';

    form.appendChild(eventNamePar);
    form.appendChild(eventTimePar);
    form.appendChild(eventTimeDash);
    form.appendChild(eventDayPar);
    form.appendChild(eventPeriodPar);
    form.appendChild(eventCancelButton)

    form.appendChild(eventNameInput);
    form.appendChild(eventTime0Input);
    form.appendChild(eventTime1Input);
    form.appendChild(eventDayInput);
    form.appendChild(eventPeriodInput);
    form.appendChild(eventSaveButton);

    return eventCancelButton;
}

function submitEventCreation(formEvent, form, schedule_id= 1) {
    formEvent.preventDefault();

    // make sure of the format later
    let dbUpdateJson = {
        schedule_id: schedule_id,
        event_name: form.elements[1].value,
        start: form.elements[2].value,
        end: form.elements[3].value,
        start_day: form.elements[4].value,
        period: form.elements[5].value
    };
    postData(dbUpdateJson, '/eventInsert');

    let schedule = document.getElementById("schedule");
    while(schedule.firstChild)
        schedule.removeChild(schedule.lastChild);
    formSchedule();

    let secondHeaderDiv = document.getElementById("secondHeaderDiv");
    while(secondHeaderDiv.firstChild)
        secondHeaderDiv.removeChild(secondHeaderDiv.lastChild);
    // add the event button. Will need to be put in a seperate function after adding other buttons
    let addEventButton = document.createElement('button');
    addEventButton.innerHTML = "Add Event";
    addEventButton.onclick = eventAddFormOnclick;
    addEventButton.className = "addEventBtn";
    secondHeaderDiv.appendChild(addEventButton);
}

//#endregion for editing and adding events

//#region drawing events to schedule

function findEventColumns(event){
    let week = findWeekdays()
    for(let i=0; i<7; i++){
        // console.log(week[1]);
        // set times to 0 b/c we're comparing dates
        week[i].setHours(0, 0, 0, 0);
    }
    let eventDay = new Date(event.start_day);
    eventDay.setHours(0, 0, 0, 0);
    // console.log(event.start_day);
    // console.log(eventDay);
    // console.log(week[1]);
    // timezones be damned... add a day to

    let gridColumns = [];
    for(let iterDay=eventDay; iterDay <= week[week.length-1]; iterDay.setDate(iterDay.getDate() + event.period)){
        for(let i = 0; i<week.length; i++){
            if(iterDay.getTime() == week[i].getTime())
                gridColumns.push(i+2+'/'+(i+3));
        }
    }
    return gridColumns;
}

function clearEvents() {
    let schedule = document.getElementById("schedule");
    for(let i=0; i<schedule.childNodes.length; i++){
        let child = schedule.childNodes[i];
        if(child.id.substr(0, 8) == "eventDiv"){
            schedule.removeChild(child);
            i--;
        }
    }
}

function refreshEvents(dbJsonList, startSeconds){
    eventClassList = [];
    dbJsonList.forEach(eventJson => {
        let gridColumns = findEventColumns(eventJson);
        for(let i=0; i<gridColumns.length; i++)
            eventClassList.push(new Event(eventJson, startSeconds, gridColumns[i], i));
    });
}

//#endregion drawing events to schedule

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