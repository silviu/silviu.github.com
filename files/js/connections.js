
function init() {
	xmlHttp="";
	try{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
	}
	catch (e){
		// Internet Explorer
		try{
		xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e){
			try{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e){
			alert("Your browser does not support Javascript/Ajax. Please contact support.");
			}
		}
	}
}

function check(url){
	xmlHttp.onreadystatechange=function(){
		if(xmlHttp.readyState == 4){
			if (xmlHttp.responseText.length > 20){
				hide("offline");
				status = "online";
				show("online", status);
			} 
			else {
				hide("online");
				status = "offline";
				show("offline", status);
				window.stop();
				decide(url);
			}
		}
	}

	xmlHttp.open("POST", url, true);
	xmlHttp.send(null);
}

function decide(url) {
	glurl=url;
	clearInterval(tt);
	if (user_status == "online") {
	xmlHttp.onreadystatechange=function(){
		if(xmlHttp.readyState == 4){
			if (xmlHttp.responseText.length > 20){
				hide("offline");
				status = "online";
				show("online", status);
			} 
			else {
				status = "offline";
			}
		}
	}
	xmlHttp.open("POST", "http://127.0.0.1", true);
	xmlHttp.send(null);
	if (status == "online") {
		window.location = url;
		clearInterval(tt);
	}
	else {
		show("offline-loading", "Loading...");
		tt = setInterval(function(){decide(url)}, 1000);
	}
	}
	else {
	hasbeen=1;
	show("message","You are offline. No navigation available.");}
}

function goOffline() {
	clearInterval(gl);
	hide("online");
	user_status = "offline";
	show("offline", "offline");
}

function goOnline() {
	if(hasbeen == 1)
		window.location = glurl;
	user_status = "online";
	hide("offline");
	show("online","online");
	gl = setInterval(function(){check(location.href);}, 5000);
}
var hasbeen=0;
var user_status ="online";
var lasturl;
var status = "online";
var ended = 0;
var tt;
var glurl="";
init(); 
check(location.href);
var gl = setInterval(function(){check(location.href);}, 5000);
