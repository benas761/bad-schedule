let firstRowHeight = 15;
let marginRowHeight = 20;
let timeRowHeight = 6;
let eventClassList = [];
let loginToken = getCookie("loginToken");

// set in header.js -> layoutChoice()
let layout_type = getCookie("layout_type");
if(layout_type == null) layout_type = "week";

function setCookie(key, value) {
	let expires = new Date();
	expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
	let keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}