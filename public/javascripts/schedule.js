//#region Weekday functions

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

function deleteWeekdays() {
    let schedule = document.getElementById("schedule");
    let weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    weekdays.forEach(weekday => {
        schedule.removeChild(document.getElementById(weekday));
    });
}

// for getting the current week, can only be run once right now
function writeWeekdays(){
    let weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let week = findWeekdays();
    for(let i = 0; i<7; i++) {
        let paragraph = document.createElement('p');
        paragraph.id = weekdays[i].toLowerCase();
        paragraph.style.gridRow = "1/3";
        paragraph.style.gridColumn = (i+2) + "/" + (i+4);
        paragraph.innerHTML = week[i].slice(5, 10) + " " + weekdays[i];
        document.getElementById("schedule").appendChild(paragraph);
    }
}

//#endregion Weekday functions

//#region Time functions

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
    endSeconds += 3600;
    // add 2 hours to start and end times if their period is short
    if(Math.max(differences) <= 4 * 3600)
        endSeconds += hourMargin * 3600;
    if(startSeconds<1) startSeconds = 1;
    if(endSeconds>24*60*60) endSeconds = 24*12; 
    return([startSeconds, endSeconds]);
}

function writeHours(startSeconds, endSeconds){
    var startColumn = headerRowCount;
    var endColumn = Math.round((endSeconds-startSeconds)/60/5) + headerRowCount;
    var roundedSeconds = Math.round(startSeconds/60/5)*60*5;
    // how many five minute intervals are needed to reach a clean hour
    var cleanColumnHour = 12 - ((roundedSeconds/60/5) % 12);
    // draw the first time if it's not close to a clean time
    if(cleanColumnHour>3){
        let timestamp = document.createElement('p');
        timestamp.innerHTML = convertSecondsToHHMM(roundedSeconds);
        timestamp.style.gridRow = startColumn+'/'+(startColumn+cleanColumnHour);
        timestamp.style.gridColumn = '1/2';
        schedule.appendChild(timestamp);
    }

    // draw clean hours
    for(let i = startColumn+cleanColumnHour; i<endColumn; i+=12){
        let timestamp = document.createElement('p');
        timestamp.innerHTML = convertSecondsToHHMM(roundedSeconds+((i-startColumn)*60*5));
        timestamp.style.gridRow = i+'/'+(i+12);
        timestamp.style.gridColumn = '1/2';
        schedule.appendChild(timestamp);
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

//#endregion Time functions

//#region Drawing schedule

async function formSchedule(){
    // pauses all JS until it gets a response from the database. Fine at first load, but shouldn't be used for other events
    let dbJsonList = await postData({}, '/eventSelect');
    dbJsonList = JSON.parse(dbJsonList);
    let seconds = setTime(dbJsonList, 2);
    let startSeconds = seconds[0], endSeconds = seconds[1];
    drawSchedule(startSeconds, endSeconds);

    refreshEvents(dbJsonList, startSeconds); // changes global eventClassList
    eventClassList.forEach(eventClass => { eventClass.draw(); });
}

function drawSchedule(startSeconds, endSeconds){
    let fiveMinuteDifference = Math.round((endSeconds-startSeconds) / 60 / 5);
    let schedule = document.getElementById("schedule");
    // sets the amount of rows into intervals of 5 minutes
    let rowAttribute = firstRowHeight+'px ';
    rowAttribute += marginRowHeight+'px '; // margin before times
    let scheduleHeight = document.getElementById("schedule").style.height;
    rowAttribute += 'repeat('+fiveMinuteDifference+', '+timeRowHeight+'px)';
    // schedule.style.gridTemplateRows = rowAttribute;
    schedule.setAttribute('style', 'grid-template-rows: '+rowAttribute);
    // sets grid height according to the heights specified on top
    // schedule.style.height = (fiveMinuteDifference*timeRowHeight + firstRowHeight)+'px';
    
    writeWeekdays();
    writeHours(startSeconds, endSeconds);
}

//#endregion Drawing schedule

// To do:
// add event button !
// cancel edit button
// fix time !
// check user input in: edit/add onclick listener
// css stylesheet

// tech used - pug, expressJS (node.js)
// depends on nodejs and npm
// build with "npm install" and run with "npm run"