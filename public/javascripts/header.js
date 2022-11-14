function drawOriginalHeader(){
	let header = document.getElementById("secondHeaderDiv");
	eraseHeader();
	addEventButton(header);
	layoutChoice(header);
	exportButton(header);
}

function eraseHeader() {
	let secondHeaderDiv = document.getElementById("secondHeaderDiv");
	while(secondHeaderDiv.firstChild)
		secondHeaderDiv.removeChild(secondHeaderDiv.lastChild);
}

function addEventButton(parent) {
	let addEventButton = document.createElement('button');
	addEventButton.innerText = "Add Event";
	addEventButton.onclick = eventAddFormOnclick;
	addEventButton.className = "headerBtn";
	parent.appendChild(addEventButton);
}

function layoutChoice(parent) {
	let layoutChoice = document.createElement('select');
	layoutChoice.classList.add("headerBtn", "headerSelect");
	layoutChoice.id = "layoutSelect";
	layoutChoice.addEventListener('change',  function() {
		let layout = document.getElementById("layoutSelect"); 
		let layout_type = layout.selectedOptions[0].value;
		setCookie("layout_type", layout_type)
		resetSchedule();
	});
	let layouts = ["Week", "Month", "Year"];
	layouts.forEach(layout => {
		let option = document.createElement('option');
		option.value = layout.toLowerCase();
		option.innerText = layout;
		if(option.value == layout_type)
			option.selected = true;
		layoutChoice.appendChild(option);
	});
	parent.appendChild(layoutChoice);
}

function exportButton(parent) {
	let exportButton = document.createElement('button');
	exportButton.innerText = "Export";
	exportButton.onclick = exportOnClick;
	exportButton.className = "headerBtn";
	parent.appendChild(exportButton);
}

function scheduleName(){
	// not necessary until 4th iteration
}