function findWeekdays(curr = new Date()){
    curr.setHours(0, 0, 0, 0);
    let week = [];
    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i; // gives monday with i=0
        let day = new Date(curr.setDate(first));
        week.push(day);
    }
    return week;
}

function findMonthDays(year = new Date().getFullYear(), month = new Date().getMonth()) {
    let date = new Date(year, month, 1);
    // start from monday
    let monday = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    let result = [];
    while (monday.getMonth() <= month || monday.getDay() != 1) {
        result.push(new Date(monday));
        monday.setDate(monday.getDate() + 1);
    }
    return result;
}

function findYearDays(year = new Date().getFullYear()) {
    let date = new Date(year, 0, 1);
    // start from monday
    let monday = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    let result = [];
    while (monday.getFullYear() <= year || monday.getDay() != 1) {
        result.push(new Date(monday));
        monday.setDate(monday.getDate() + 1);
    }
    return result;
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
    let week = findWeekdays(), weekStr = [];
    // get mm-dd format
    for(let i=0; i<7; i++)
        weekStr.push((week[i].getMonth()+1)+'/'+week[i].getDate());
    for(let i = 0; i<7; i++) {
        let paragraph = document.createElement('p');
        paragraph.id = weekdays[i].toLowerCase();
        paragraph.style.gridRow = "1/3";
        paragraph.style.gridColumn = (i+2) + "/" + (i+3);
        paragraph.innerText = weekStr[i] + " " + weekdays[i];
        paragraph.className = "scheduleHeaders";
        document.getElementById("schedule").appendChild(paragraph);
    }
}
