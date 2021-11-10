function monthLayout(eventList) {
    // get days of the month, get weeks for first and last days
    let monthDays = findMonthDays();
    monthDays = findYearDays();
    console.log(monthDays);

    // one header row, one week row. Should always be int
    let rows = monthDays.length / 7 * 2;

    // 7 columns
    let schedule = document.getElementById("schedule"); 
    schedule.style.gridTemplateColumns = "repeat(6, auto)";
    schedule.style.gridTemplateRows = "repeat("+rows/2+", 25px auto)";
    
    // seperators
    drawGeneralColumnDividers(rows);
    drawGeneralRowDividers(rows);
    // get events for each day, ignore rows
    let days = []
    let weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for(let i=0; i<monthDays.length; i++) {
        let header = monthDays[i].getYear()%100+ '/' + 
               (monthDays[i].getMonth()+1) + '/' + 
                monthDays[i].getDate() + " " + weekdayNames[monthDays[i].getDay()];
        let column = monthDays[i].getDay(); // sundays are at 0
        if(column == 0) column = 7; // sundays are 7
        let day = new Day(monthDays[i], header, eventList, column, Math.floor(i/7)*2+1);
        days.push(day);
    }
    for(let i=0; i<days.length; i++) {
		days[i].createEventClasses();
		days[i].drawGeneral();
	}
    
    return 0;
}

function drawGeneralColumnDividers(rows) {
    for(let i=1; i<7; i++){
		let columnDivider = document.createElement('div');
		if(i==1) columnDivider.classList.add('columnDivider', 'firstColumnDivider');
		else columnDivider.className = 'columnDivider';
		columnDivider.style.gridColumn = i;
		columnDivider.style.gridRow = '1/' + (rows+1);
		document.getElementById("schedule").appendChild(columnDivider);
	}
}

function drawGeneralRowDividers(rows) {
    for(let i=2; i<=rows; i++){
		let rowDivider = document.createElement('div');
		rowDivider.className = 'firstRowDivider';
		rowDivider.style.gridColumn = "1/8";
		rowDivider.style.gridRow = i;
		document.getElementById("schedule").appendChild(rowDivider);
	}
}