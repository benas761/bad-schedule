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
        this.eventEdit.className = "eventButton";
        this.eventEdit.setAttribute('onclick', 
            "editEvent('"+this.fullId+"')");
        
        this.eventDiv.appendChild(this.eventName);
        this.eventDiv.appendChild(this.eventTime);
        this.eventDiv.appendChild(this.eventEdit);
    }
    draw(){
        let schedule = document.getElementById('schedule');
        schedule.appendChild(this.eventDiv);
    }
    clear(){
        while(this.eventDiv.firstChild)
            this.eventDiv.removeChild(this.eventDiv.lastChild);
    }
    edit(){
        this.editing = true;
        // remove all children
        this.clear();
        // append inputs with children's values
        // for simplicity, inputs are not saved inside the class
        let form = document.createElement('form');
        let eventNameInput = document.createElement("input");
        let eventTime0Input = document.createElement("input");
        let eventTimeDash = document.createElement("p");
        let eventTime1Input = document.createElement("input");
        let eventPeriodInput = document.createElement("input");
        let eventDayInput = document.createElement("input");
        let eventSaveButton = document.createElement("button");
        let eventNamePar = document.createElement("p");
        let eventTimePar = document.createElement("p");
        let eventDayPar = document.createElement("p");
        let eventPeriodPar = document.createElement("p");

        eventNameInput.value = this.eventJson.event_name;
        eventTime0Input.value = this.eventJson.start.substr(0, 5);
        eventTime1Input.value = this.eventJson.end.substr(0, 5);
        eventPeriodInput.value = this.eventJson.period;
        eventDayInput.value = this.eventJson.start_day.split('T')[0]; // show only the date format

        eventNamePar.innerHTML = 'Name:';
        eventTimePar.innerHTML = 'Time';
        eventTimeDash.innerHTML = ' - ';
        eventPeriodPar.innerHTML = 'Period in days';
        eventSaveButton.innerHTML = 'save';
        eventDayPar.innerHTML = 'Earliest event date';

        this.eventDiv.className = "editedEventDiv";
        eventNameInput.className = "eventInput";
        eventTime0Input.className = "eventInput";
        eventTime1Input.className = "eventInput";
        eventPeriodInput.className = "eventInput";
        eventNamePar.className = "eventText";
        eventTimePar.classname = "eventText";
        eventPeriodPar.className = "eventText";
        eventTimeDash.className = "eventText";
        eventSaveButton.type = 'submit';

        form.appendChild(eventNamePar);
        form.appendChild(eventNameInput);
        form.appendChild(eventTimePar);
        form.appendChild(eventTime0Input);
        form.appendChild(eventTimeDash);
        form.appendChild(eventTime1Input);
        form.appendChild(eventDayPar);
        form.appendChild(eventDayInput);
        form.appendChild(eventPeriodPar);
        form.appendChild(eventPeriodInput);
        form.appendChild(eventSaveButton);
        this.eventDiv.appendChild(form);

        form.addEventListener('submit', async (formEvent) => {
            formEvent.preventDefault();
            let schedule = document.getElementById("schedule");
            // make sure of the format later
            let dbUpdateJson = {
                event_id: this.eventJson.event_id,
                event_name: form.elements[0].value,
                start: form.elements[1].value,
                end: form.elements[2].value,
                start_day: form.elements[3].value,
                period: form.elements[4].value
            };
            postData(dbUpdateJson, '/eventUpdate');
            // let dbJsonList = await getEvents();
            // dbJsonList = JSON.parse(dbJsonList);
            // need to delete and redo the whole schedule
            while(schedule.firstChild)
                schedule.removeChild(schedule.lastChild);
            //clearEvents(); // cleared with all children
            // let seconds = setTime(dbJsonList)[0];
            // let startSeconds = seconds[0], endSeconds = seconds[0];
            // drawSchedule(startSeconds, endSeconds, 8);
            formSchedule();

            // refreshEvents(dbJsonList, startSeconds);
            // eventClassList.forEach(eventClass => { eventClass.draw(); });
        })
    }
}

async function getEvents(){
    let header = "/eventSelect";
    let res = await postData({}, header);
    return res;
}

function setTime(events, hourMargin = 2){
    // calculate schedule time period
    //  if time period comes out to four or less hours, make it have a 2 hours free before and after
    let starts = [], ends = [], differences = [];
    for(let i=0; i<events.length; i++){
        let event = events[i];
        starts.push(convertISOtimeToSeconds(event.start));
        ends.push(convertISOtimeToSeconds(event.end));
        differences.push(
            convertISOtimeToSeconds(event.end) - convertISOtimeToSeconds(event.start)
        );
    }
    let startSeconds = Math.min.apply(Math, starts);
    let endSeconds   = Math.max.apply(Math, ends);
    // add 2 hours to start and end times if their period is short
    if(Math.max(differences) <= 4 * 3600)
        endSeconds += hourMargin * 3600;
    if(startSeconds<1) startSeconds = 1;
    if(endSeconds>24*60*60) endSeconds = 24*12; 
    return([startSeconds, endSeconds]);
}

function findEventColumns(event){
    let week = findWeekdays()
    for(let i=0; i<7; i++){
        week[i] = new Date(week[i]);
        // set times to 0 b/c we're comparing dates
        week[i].setHours(0, 0, 0, 0);
    }
    let eventDay = new Date(event.start_day);
    eventDay.setHours(0, 0, 0, 0);

    let gridColumns = [];
    for(let iterDay=eventDay; iterDay <= week[week.length-1]; iterDay.setDate(iterDay.getDate() + event.period)){
        for(let i = 0; i<week.length; i++){
            if(iterDay.getTime() == week[i].getTime())
                gridColumns.push(i+2+'/'+(i+3));
        }
    }
    return gridColumns;
}

function editEvent(eventFullId){
    eventClassList.forEach(eventClass => {
        if(eventClass.fullId == eventFullId){
            eventClass.edit();
            return;
        }
    });
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

function editEvent(eventFullId){
    eventClassList.forEach(eventClass => {
        if(eventClass.fullId == eventFullId) {
            eventClass.edit();
            return;
        }
    });
}

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