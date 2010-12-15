ie5 = (document.all && document.getElementById);
ns6 = (!document.all && document.getElementById);
opac2 = 100;

var t;

//Create an array 
var allPageTags = new Array(); 

function hideclass(theClass) {
	var allPageTags=document.getElementsByTagName("*");
	for (i=0; i<allPageTags.length; i++) {
		if (allPageTags[i].className==theClass) {
			allPageTags[i].style.display='none';
		}
	}
}

function showclass(theClass) {
	var allPageTags=document.getElementsByTagName("*");
	for (i=0; i<allPageTags.length; i++) {
		if (allPageTags[i].className==theClass) {
			allPageTags[i].style.display='block';
		}
	}
} 

function hide(obj) {
	var el = document.getElementById(obj);
	el.style.display = 'none';
}


function fade() {
if(opac2 > 0){
opac = 0;
opac2-=1;
if(ie5) document.getElementById('message').filters.alpha.opacity = opac2;
if(ns6) document.getElementById('message').style.MozOpacity = opac2/100;
var tt = setTimeout('fade()', 0);
}

}

function show(obj,str) {
	clearTimeout(t);
	hide("message");
	var el = document.getElementById(obj);
	el.innerHTML = str;
	el.style.display = 'block';
	t = setTimeout("hide('message')", 2000);	
}


function submitForms() {
  var firstForm = document.forms[0];
  var secondForm = document.forms[1];
  firstForm.submit();
  secondForm.submit();
}


