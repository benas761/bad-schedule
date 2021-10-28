var firstRowHeight = 15;
var marginRowHeight = 20;
var headerRowCount = 3;
var timeRowHeight = 8;
var eventClassList = [];

class Event {
    // draw the event on schedule and save its ids
    constructor(event, startSeconds, gridColumn, count){
        this.eventJson = event;
        this.fullId = this.eventJson.event_id+"-"+count;
        this.eventDiv = document.createElement('div');
        this.eventName = document.createElement('p');
        this.eventTime = document.createElement('p');
        this.eventEdit = document.createElement('button');
        this.eventDelete = document.createElement('button');
        
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
        this.eventEdit.classList.add("eventBtn", "eventEditBtn")
        this.eventEdit.className = "eventBtn";
        this.eventEdit.setAttribute('onclick', 
            "eventEditOnclick('"+this.fullId+"')");
        this.eventDelete.id = "eventDelete"+this.fullId;
        this.eventDelete.innerHTML = "delete";
        this.eventDelete.classList.add("eventBtn", "eventDeleteBtn")
        this.eventDelete.setAttribute('onclick', 
            "eventDeleteOnclick('"+this.fullId+"')");
        
        this.eventDiv.appendChild(this.eventName);
        this.eventDiv.appendChild(this.eventTime);
        this.eventDiv.appendChild(this.eventEdit);
        this.eventDiv.appendChild(this.eventDelete);
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
    let cancelBtn = createEventForm(form, "addEventInput", '', '', '', '7', today);
    cancelBtn.onclick = drawOriginalHeader;
    form.className = "eventAddForm";
    let secondHeaderDiv = document.getElementById("secondHeaderDiv");
    secondHeaderDiv.removeChild(secondHeaderDiv.lastChild);

    secondHeaderDiv.appendChild(form);
    
    form.addEventListener('submit', function(formEvent) { 
        submitEventCreation(formEvent, form);
    });
}

function drawOriginalHeader(){
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
// since inputs don't have ids, this returns the cancel button for the onclick cancel function assignment
function createEventForm(form, input_class, event_name='', start='', end='', period='', day=''){
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

    let dbInsertJson = {
        schedule_id: schedule_id,
        event_name: form.elements[1].value,
        start: form.elements[2].value,
        end: form.elements[3].value,
        start_day: form.elements[4].value,
        period: form.elements[5].value
    };

    let jsonIsValid = validateJson(dbInsertJson);
    if(!jsonIsValid) return -1;
    
    postData(dbInsertJson, '/eventInsert');

    let schedule = document.getElementById("schedule");
    while(schedule.firstChild)
        schedule.removeChild(schedule.lastChild);
    formSchedule();

    drawOriginalHeader();
}


//#endregion adding events

//#region form validation

function validateJson(json){
    // validation
    if (json.event_name.length < 2 || 
        json.event_name.length > 30) {
            showErrorBanner("<b>Name </b> needs to be between 2 and 30 characters!", 6);
            return false;
    } else if(!validateTimeFormat(json.start)) {
            showErrorBanner("<b>Start time</b> needs to be in format hh:mm!", 6);
            return false;
    } else if(!validateTimeFormat(json.end)){
            showErrorBanner("<b>End time</b> needs to be in format hh:mm!", 6);
            return false;
    } else if(!validateDateFormat(json.start_day)) {
            showErrorBanner("<b>Earliest event date </b> accepts dates in format yyyy-mm-dd!", 6);
            return false;
    } else if(!isNumeric(json.period) || 
        Number(json.period) < 1) {
            showErrorBanner("<b>Time period </b> needs to be at least 1 day!", 6);
            return false;
    } else if(!validateEventIntersection(json.start_day, json.start, json.end, json.period)){
        showErrorBanner("Events cannot intersect!", 6);
        return false;
    } else return true;
}

// https://www.the-art-of-web.com/javascript/validate-date/
function validateTimeFormat(timeVal) {
    // regular expression to match required time format
    var validatePattern = /^\d{1,2}:\d{2}([ap]m)?$/;
    console.log(timeVal);
    if(timeVal == '' || !timeVal.match(validatePattern))
        return false;
    else return true;
}

// https://webrewrite.com/validate-date-format-yyyymmdd-javascript/
function validateDateFormat(dateVal){
    if (dateVal == null) 
        return false;
    var validatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
    var dateValues = dateVal.match(validatePattern);
    if (dateValues == null) 
        return false;

    var dtYear = dateValues[1];
    var dtMonth = dateValues[3];
    var dtDay = dateValues[5];

    if (dtMonth < 1 || dtMonth > 12) 
        return false;
    else if (dtDay < 1 || dtDay> 31) 
        return false;
    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
        return false;
    else if (dtMonth == 2){ 
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
            return false;
    }

    return true;
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
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

//#endregion form validation

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