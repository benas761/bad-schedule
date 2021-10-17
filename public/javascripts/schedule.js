var firstRowHeight = 15;
var timeRowHeight = 4;

// for getting the current month
function write_month_year(){
    var date = new Date()
    var month = date.toLocaleString('default', { month: 'long' });
    document.getElementById("weekdate").innerHTML = month + " " + date.getFullYear();
}

// for getting the current week
function writeWeekdays(){
    var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    let curr = new Date()
    let week = []
    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i 
        let day = new Date(curr.setDate(first)).toISOString().slice(5, 10)
        week.push(day)
    }
    for(let i = 0; i<7; i++) {
        var paragraph = document.createElement('p', id=weekdays[i].toLowerCase());
        paragraph.innerHTML = week[i] + " " + weekdays[i];
        document.getElementById("schedule").appendChild(paragraph);
    }
}

function convertISOtimeToSeconds(timeString){
    var timeStrings = timeString.split(":");
    var timeFloat = [];
    timeStrings.forEach(timeString => {
        timeFloat.push(Number(timeString));
    });
    // could check length to make sure of the data
    return timeFloat[0] * 3600 + timeFloat[1] * 60 + timeFloat[2];
}
function convertSecondsToISOtime(seconds){
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}
function convertSecondsToHHMM(seconds){
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 5);
}

function setTime(dbJsonList){
    // calculate schedule time period
    //  if time period comes out to four or less hours, make it have a 2 hours free before and after
    var starts = [], ends = [], differences = [];
    dbJsonList.forEach(json => {
        starts.push(convertISOtimeToSeconds(json.start));
        ends.push(convertISOtimeToSeconds(json.end));
        differences.push(
            convertISOtimeToSeconds(json.end) - convertISOtimeToSeconds(json.start)
        );
    });
    var startSeconds = Math.min(starts);
    var endSeconds   = Math.max(ends);
    // add 2 hours to start and end times if their period is short
    if(Math.max(differences) <= 4 * 3600){
        startSeconds -= hourMargin * 3600;
        endSeconds += hourMargin * 3600;
    }
    if(startSeconds<1) startSeconds = 1;
    return([startSeconds, endSeconds]);
}

function drawSchedule(startSeconds, endSeconds, timestampAmount = 8){
    startPeriodISO = convertSecondsToISOtime(startSeconds);
    endPeriodISO = convertSecondsToISOtime(endSeconds);
    var minuteDifference = (endSeconds-startSeconds) / 60;
    var schedule = document.getElementById("schedule");
    // sets the amount of rows into intervals of 5 minutes
    var rowAttribute = firstRowHeight+'px ';
    rowAttribute += 'repeat('+(minuteDifference/5)+', 1fr)';
    schedule.style.gridTemplateRows = rowAttribute;
    // sets grid height according to the heights specified on top
    schedule.style.height = (minuteDifference/5*timeRowHeight + firstRowHeight)*2+'px';
    writeWeekdays();

    var fiveMinuteList = [];
    for(var i=startSeconds; i<endSeconds; i+=5*60)
        fiveMinuteList.push(i);
    var inc = fiveMinuteList.length/timestampAmount;
    for(var i = 0; i<fiveMinuteList.length; i+=inc){
        var j = Math.round(i);
        // write the start and end times
        // round to hours and write timestampAmount-2 amount of hours
        var timestamp = document.createElement('p')
        if(i!=0)
            timestamp.innerHTML = convertSecondsToHHMM(fiveMinuteList[j]);
        timestamp.style.gridColumn = '1/2';
        var thisTime = Math.round((fiveMinuteList[j]-startSeconds)/5/60);
        var nextTime = Math.round((fiveMinuteList[j+Math.round(inc)]-startSeconds)/5/60);
        // if next is Nan, it means the index is out of bounds, which only happens at the end
        if(nextTime == NaN) nextTime = endSeconds - startSeconds;
        timestamp.style.gridRow = thisTime+'/'+nextTime;
        schedule.appendChild(timestamp);
    }
}

function drawEvents(dbJsonList, startSeconds, endSeconds){
    var schedule = document.getElementById('schedule');
    dbJsonList.forEach(event => {
        console.log(event.start);
        console.log(event.end);
        eventGridStart = Math.round(
            (convertISOtimeToSeconds(event.start)-startSeconds)/60/5);
        eventGridEnd = Math.round(
            (convertISOtimeToSeconds(event.end) - startSeconds)/60/5);
        var gridEvent = document.createElement('div');
        var eventName = document.createElement('p');
        eventName.innerHTML = event.event_name;
        var eventTime = document.createElement('p');
        eventTime.innerHTML =  event.start.substr(0, 5) + ' - ' + event.end.substr(0, 5);
        var eventEdit = document.createElement('input');
        eventEdit.type = "submit";
        eventEdit.value = "edit";
        gridEvent.style.gridRow = eventGridStart+'/'+eventGridEnd;
        gridEvent.appendChild(eventName);
        gridEvent.appendChild(eventTime);
        gridEvent.appendChild(eventEdit);
        schedule.appendChild(gridEvent);
    });
}

function formSchedule(dbJsonList){
    for(var i=0; i<dbJsonList.length; i++){
        // Return only the date, without the time   
        dbJsonList[i].start_day = dbJsonList[i].start_day.split("T")[0];
    }

    // write_month_year();
    var seconds = setTime(dbJsonList, hourMargin = 2);
    var startSeconds = seconds[0], endSeconds = seconds[1]; 
    drawSchedule(startSeconds, endSeconds);
    drawEvents(dbJsonList, startSeconds, endSeconds);
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