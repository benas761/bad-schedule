let loginForm = document.getElementById("loginForm");
if(loginForm != null) {
	loginForm.addEventListener('submit', async (formEvent) => {
		formEvent.preventDefault();
		let formInfo = {
			name: loginForm.elements[0].value,
			password: loginForm.elements[1].value
		}
		await login(formInfo);
	});
}
else {
	loginForm = document.getElementById("registerForm");
	loginForm.addEventListener('submit', async (formEvent) => {
		formEvent.preventDefault();
		let formInfo = {
			name: loginForm.elements[0].value,
			password: loginForm.elements[1].value,
			confirmed_password: loginForm.elements[2].value
		}
		let confirmation = await(postData(formInfo, 'registerPost'));
		if(confirmation.success) await login(formInfo);
		
	});
}

async function login(formInfo) {
	let loginInfo = await postData(formInfo, 'tokenPost');
	if(loginInfo.success) {
		let loginToken = loginInfo.jwtoken;
		setCookie("loginToken", loginToken);

		let scheduleList = await postData({}, "/schedulePost")
		scheduleList = JSON.parse(scheduleList);
		// for this iteration, use the first schedule
		let schedule = scheduleList[0].schedule_id;
		setCookie("schedule", schedule);

		window.location.href = "/";
	}
}
