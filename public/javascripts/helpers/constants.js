var firstRowHeight = 15;
var marginRowHeight = 20;
var timeRowHeight = 6;
var eventClassList = [];
var loginToken = getCookie("loginToken");

// set in header.js -> layoutChoice()
var layout_type = getCookie("layout_type");
if(layout_type == null) layout_type = "week";

function setCookie(key, value) {
	var expires = new Date();
	expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
	var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}