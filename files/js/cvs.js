
//<![CDATA[

///Scripting by Esa 2006
// minor updates 2008

//globals

_mPreferMetric=true;
var page=[];
page["jet"] = "jetasemat.txt";
var doku = ""; //2008
var teksti ="";
var bounds = new GLatLngBounds();
var marker=[];
var pointer = new GMarker(new GLatLng(62,23));
var closer = "<a href=javascript:luokse();>See closer</a>"
var kaikki = "<a href=javascript:fit();>See all</a>"
var geocoder = new GClientGeocoder();
var n=0;//hits

// "tiny" marker icon
var tiny = new GIcon();
tiny.image = "http://labs.google.com/ridefinder/images/mm_20_green.png";
tiny.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
tiny.iconSize = new GSize(12, 20);
tiny.shadowSize = new GSize(22, 20);
tiny.iconAnchor = new GPoint(6, 20);
tiny.infoWindowAnchor = new GPoint(5, 1);


// create the map
var map = new GMap2(document.getElementById("map"), {size:new GSize(512,440)});//size added 2008
map.setCenter(new GLatLng( 0,0), 9);
map.addControl(new GLargeMapControl());
map.addControl(new GMapTypeControl());
map.addControl(new GScaleControl(300));
map.enableContinuousZoom();

//overview

var ovSize=new GSize(200, 150)
var ovMap=new GOverviewMapControl(ovSize);
map.addControl(ovMap);
if(ovMap.getOverviewMap())var mini=ovMap.getOverviewMap(); //if() added 2008
ovMap.hide();


///hide controls
map.hideControls();
GEvent.addListener(map, "mouseover", function(){
map.showControls();
});
GEvent.addListener(map, "mouseout", function(){
map.hideControls(); 
});


/// info window

function doIW(pin,html){
GEvent.addListener(pin, "click", function(){
pin.openInfoWindowHtml(html);
})}


function luokse(){
map.zoomIn();map.zoomIn();map.zoomIn();
}


/////// function to process the text file


var parseFile = function(data) {
doku = data;//2008
n=0;
document.getElementById("message").innerHTML ="no score";
teksti = "";
var infoW = doku.split("\n");
for (var i=0; i<infoW.length; i++) {
var content = infoW[i];
if (content.indexOf(",") != -1) {
   
var lat = content.split(",")[1]*1;
var lng = content.split(",")[0]*1;
var point = new GLatLng(lat,lng);
var radius = document.getElementById("radius").value*1000;
if (point.distanceFrom(pointer.getPoint())<radius){
bounds.extend(pointer.getPoint());
n++;
content = content.replace(/"/g, "");
var tooltip = content.split(",")[2];
html = content.split(",")[2]||" ";
html += "<br/>";
html += content.split(",")[3]||" ";
html += "<br/>";
html += "<small>";
html += lat+", "+lng;
html += "</small>";
html += "<br/>";
html += "<br/>";
html += closer;
html += " | ";
html += kaikki;


marker[i] = new GMarker(point,{icon:tiny, title:tooltip});
map.addOverlay(marker[i]);
doIW(marker[i],html);
bounds.extend(marker[i].getPoint());

teksti += "<small>"+ n+"</small>"
teksti += "<a href=javascript:go("+i+")>"
teksti += content.split(",")[2]||" ";
teksti += "&nbsp;"
teksti += content.split(",")[3]||" ";
teksti += "&nbsp;"
teksti += content.split(",")[4]||" ";
teksti += "</a><br/>";
document.getElementById("message").innerHTML = teksti;
}}}
document.getElementById("message").innerHTML += 
"<br/>Pointer: "+pointer.getPoint().toUrlValue();
//bounds.extend(pointer.getPoint());
fit();

}

///sidebar click

function go(num){
map.setZoom(12);
GEvent.trigger(marker[num],"click");
}

///fit the markers in viewport

function fit(){
bounds.extend(pointer.getPoint());
var center = bounds.getCenter();
map.closeInfoWindow();
if(n>0){map.setZoom(map.getBoundsZoomLevel(bounds));}
map.setCenter(center);
map.savePosition(); // added 2008
//map.panDirection(0,0.2);
}


function doIt(iso){
GDownloadUrl(page[iso],parseFile);
}

///clean the small markers

function clearMarkers(){
for (var i=0; i<marker.length; i++) {
if(marker[i])map.removeOverlay(marker[i]);//if() added 2008
//marker.length=0;
}
bounds = new GLatLngBounds();
document.getElementById("haku").value=" ";
}


///Geo

function showAddress(address) {
geocoder.getLatLng(
address,function(point) {
if (!point) {alert(address +"  ??? Sorry. Don't find.");
}else{

document.getElementById("message").innerHTML ="searching";
map.clearOverlays();
bounds=new GLatLngBounds();
pointer = new GMarker(point, {title:address, draggable:true});//pointer
map.addOverlay(pointer);
pointer.enableDragging();
GEvent.addListener(pointer, "dragend", function()
{clearMarkers();
//doIt('jet');
parseFile(doku); //2008
bounds.extend(pointer.getPoint());
text = pointer.getPoint().toUrlValue();
text += "<br/><br/>"
text += closer;
text += " | ";
text += kaikki;
doIW(pointer,text);
});

bounds.extend(point);

var text = address;
text += "<br/><br/>"
text += "<small>"
text += pointer.getPoint().toUrlValue();
text += "</small>"
text += "<br/><br/>"
text += closer;
text += " | ";
text += kaikki;
doIW(pointer,text);

//doIt('jet');
parseFile(doku); // 2008
}});
}

doIt('jet');
showAddress(document.getElementById("haku").value,true)

///Scripting by Esa

//]]>


