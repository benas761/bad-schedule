const ver = require('../routes/validation')

// test date validation
test('Decodes yyyy-mm-dd date', () => {
	expect(ver.date("2022-02-11")).toBe(true);
});
test('Decodes mm/dd/yy date', () => {
	expect(ver.date("08/13/22")).toBe(true);
});
test('Fails to decode yy-mm-dd date', () => {
	expect(ver.date("22/12/11")).toBe(false);
});
test('Fails to decode invalid date', () => {
	expect(ver.date("2022-02-30")).toBe(false);
});

// test time validation
test('Decodes valid european time', () => {
	expect(ver.time("15:02")).toBe(true);
});
test('Decodes valid american time', () => {
	expect(ver.time("2:31pm")).toBe(true);
});
test('Fails to decode an invalid american time', () => {
	expect(ver.time("pm13:10")).toBe(false);
});

// start/end time validation
test('Start time is earlier than the end time', () => {
	expect(ver.times("12:15", "12:45")).toBe(true);
});
test('Start time is later than the end time', () => {
	expect(ver.times("12:15", "11:45")).toBe(false);
});

// date crossing validation
test("Events don't collide", () => {
	let event_arr = [{
		event_id: 2,
		start: 4800,
		end: 6400,
		period: 21,
		start_day: "2022-01-02"
	}]
	expect(ver.eventCollision(
		{
			event_id: 1,
			start: 3600,
			end: 4800,
			period: 17,
			start_day: "2022-01-01"
		}, event_arr
	)).toBe(true);
});
test("Events collide", () => {
	let event_arr = [{
		event_id: 2,
		start: 3500,
		end: 5160,
		period: 6,
		start_day: "2022-01-03"
	}]
	expect(ver.eventCollision(
		{
			event_id: 1,
			start: 3600,
			end: 4800,
			period: 4,
			start_day: "2022-01-01"
		}, event_arr
	)).toBe(false);
});

// name length test
test('Name is of valid length', () => {
	expect(ver.name("aaaaaaaaaaa")).toBe(true);
});
test('Name is of invalid length', () => {
	expect(ver.name("a")).toBe(false);
});