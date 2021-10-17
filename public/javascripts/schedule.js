var firstRowHeight = 15;
var timeRowHeight = 8;

// for getting the current month
function write_month_year(){
    let date = new Date()
    let month = date.toLocaleString('default', { month: 'long' });
    document.getElementById("weekdate").innerHTML = month + " " + date.getFullYear();
}

function findWeekdays(){
    let curr = new Date();
    let week = [];
    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i;
        let day = new Date(curr.setDate(first)).toISOString();
        week.push(day);
    }
    return week;
}

// for getting the current week, can only be run once right now
function writeWeekdays(){
    let weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let week = findWeekdays();
    for(let i = 0; i<7; i++) {
        let paragraph = document.createElement('p', id=weekdays[i].toLowerCase());
        paragraph.innerHTML = week[i].slice(5, 10) + " " + weekdays[i];
        document.getElementById("schedule").appendChild(paragraph);
    }
}

function convertISOtimeToSeconds(timeString){
    let timeStrings = timeString.split(":");
    let timeFloat = [];
    timeStrings.forEach(timeString => {
        timeFloat.push(Number(timeString));
    });
    // could check length to make sure of the data
    return timeFloat[0] * 3600 + timeFloat[1] * 60 + timeFloat[2];
}
function convertSecondsToISOtime(seconds){
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}
function convertSecondsToHHMM(seconds){
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 5);
}

function setTime(dbJsonList){
    // calculate schedule time period
    //  if time period comes out to four or less hours, make it have a 2 hours free before and after
    let starts = [], ends = [], differences = [];
    dbJsonList.forEach(json => {
        starts.push(convertISOtimeToSeconds(json.start));
        ends.push(convertISOtimeToSeconds(json.end));
        differences.push(
            convertISOtimeToSeconds(json.end) - convertISOtimeToSeconds(json.start)
        );
    });
    let startSeconds = Math.min(starts);
    let endSeconds   = Math.max(ends);
    // add 2 hours to start and end times if their period is short
    if(Math.max(differences) <= 4 * 3600){
        startSeconds -= hourMargin * 3600;
        endSeconds += hourMargin * 3600;
    }
    if(startSeconds<1) startSeconds = 1;
    return([startSeconds, endSeconds]);
}

function drawSchedule(startSeconds, endSeconds, timestampAmount = 8){
    let fiveMinuteDifference = (endSeconds-startSeconds) / 60 / 5;
    let schedule = document.getElementById("schedule");
    // sets the amount of rows into intervals of 5 minutes
    let rowAttribute = firstRowHeight+'px ';
    rowAttribute += 'repeat('+fiveMinuteDifference+', 1fr)';
    schedule.style.gridTemplateRows = rowAttribute;
    // sets grid height according to the heights specified on top
    schedule.style.height = (fiveMinuteDifference*timeRowHeight + firstRowHeight)+'px';
    
    writeWeekdays();

    // !!!!!! This is a mess atm !!!!!!!
    // the list saves the seconds that occur every 5 minutes
    let fiveMinuteList = [];
    for(let i=startSeconds; i<endSeconds; i+=5*60)
        fiveMinuteList.push(i);
    let increment = fiveMinuteList.length/timestampAmount;
    for(let i = 0; i<fiveMinuteList.length; i+=increment){
        let j = Math.round(i);
        // write the start and end times
        // round to hours and write timestampAmount-2 amount of hours
        let timestamp = document.createElement('p')
        // skip writing the first element
        if(i!=0) timestamp.innerHTML = convertSecondsToHHMM(fiveMinuteList[j]);

        // setting up the gridRow variables
        let thisTime = Math.round((fiveMinuteList[j]-startSeconds)/5/60);
        let nextTime = Math.round((fiveMinuteList[j+Math.round(increment)]-startSeconds)/5/60);
        // if next is Nan, it means the index is out of bounds, which only happens at the end
        if(nextTime == NaN) nextTime = endSeconds - startSeconds;
        timestamp.style.gridRow = thisTime+'/'+nextTime;
        timestamp.style.gridColumn = '1/2';
        schedule.appendChild(timestamp);
    }
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

function drawEvent(event, startSeconds, gridColumn){
    let gridEvent = document.createElement('div');
    let eventName = document.createElement('p');
    let eventTime = document.createElement('p');
    let eventEdit = document.createElement('input');

    eventGridStart = Math.round(
        (convertISOtimeToSeconds(event.start)-startSeconds)/60/5);
    eventGridEnd = Math.round(
        (convertISOtimeToSeconds(event.end) - startSeconds)/60/5);
    
    gridEvent.id = "gridEvent"+event.event_id;
    gridEvent.style.gridRow = eventGridStart+'/'+eventGridEnd;
    gridEvent.style.gridColumn = gridColumn;
    gridEvent.className = "gridDiv";
    eventName.id = "eventName"+event.event_id;
    eventName.innerHTML = event.event_name;
    eventName.className = "eventText";
    eventTime.id = "eventTime"+event.event_id;
    eventTime.className = "eventText";
    eventTime.innerHTML =  event.start.substr(0, 5) + ' - ' + event.end.substr(0, 5);
    eventEdit.id = "eventEdit"+event.event_id;
    eventEdit.type = "submit";
    eventEdit.value = "edit";
    eventEdit.className = "eventButton";
    
    gridEvent.appendChild(eventName);
    gridEvent.appendChild(eventTime);
    gridEvent.appendChild(eventEdit);
    schedule.appendChild(gridEvent);
}

function drawEvents(dbJsonList, startSeconds){
    let schedule = document.getElementById('schedule');
    dbJsonList.forEach(event => {
        let eventColumns = findEventColumns(event);
        eventColumns.forEach(column => {
            drawEvent(event, startSeconds, column);
        });
    });
}

function formSchedule(dbJsonList){
    // write_month_year();
    let seconds = setTime(dbJsonList, hourMargin = 2);
    let startSeconds = seconds[0], endSeconds = seconds[1]; 
    drawSchedule(startSeconds, endSeconds);
    drawEvents(dbJsonList, startSeconds);
    // write times
    // loop through events:
    //  draw the grid
    //  write the event name, time
    //  [edit] button activates another function
}

// function nextButton()

// To do:
//  fill in the database
//  make the UI and fill it's values

//  make the event creation
//   create queries that will fill the db
//   make the UI take the needed variables (try to secure from SQL injection)

//  secure the db connection: put the database login outside the code
//  make sure the db can be created after providing credentials (for developement, can be done later)
//  put everything from app.js to /routes/user.js (I think)

// Shows year, month
// shows weekdays
// shows events with:
// event name
// 8:00-9:00 [edit]

// edit enables changing name, time and deleting.

// make sure that the calendar days can be shifted around

// time should be dinamic, but uniform throughout days - 
// start at the earliest event and end at the latest + some
// margin if there's one event

// tech used - pug, expressJS (node.js)
// depends on nodejs and npm
// build with "npm install" and run with "npm run"