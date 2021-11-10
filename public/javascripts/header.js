
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
