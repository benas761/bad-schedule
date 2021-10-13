function write_weekdays(){
    var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    // for getting the current week
    let curr = new Date()
    let week = []
    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i 
        let day = new Date(curr.setDate(first)).toISOString().slice(5, 10)
        week.push(day)
    }
    for(let i = 0; i<7; i++) {
        document.getElementById(weekdays[i].toLowerCase()).innerHTML = week[i] + " " + weekdays[i];
    }
}
write_weekdays();

function write_month_year(){
    // for getting the current month
    var date = new Date()
    var month = date.toLocaleString('default', { month: 'long' });
    document.getElementById("weekdate").innerHTML = month + " " + date.getFullYear();
}

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