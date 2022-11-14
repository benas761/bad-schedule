const ver = require('../routes/validation')

test('Decodes yyyy-mm-dd date', () => {
	expect(ver.date("2022-02-11")).toBe(true);
});
test('Decodes mm/dd/yy date', () => {
	expect(ver.date("08/13/22")).toBe(true);
});
test('Fails to decode yy-mm-dd date', () => {
	expect(ver.date("22/12/11")).toBe(false);
});

/*
ver.date = function(date) {
	try {
		let momentDate = moment(date);
		if(momentDate.isValid()) return true;
	} catch { return false; }
	return false;
} */