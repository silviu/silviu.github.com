
var map;
var marker = [];
var feed;
var bounds = new GLatLngBounds();
var markerImage = [
G_DEFAULT_ICON.image,
"http://maps.google.com/mapfiles/dd-start.png",
"http://maps.google.com/mapfiles/dd-end.png",
"http://esa.ilmari.googlepages.com/markeryellow.png",//3 yellow
"http://www.google.com/uds/samples/places/temp_marker.png"//4 turquoise
];

// Spreadsheets API timing needs more study
var teksti = " ";
function sideBar(line, j){
teksti += "<br/><span class='sidebar'";
teksti += "onclick='GEvent.trigger(marker["+j+"],\"click\")' ";
teksti += "onmouseover='GEvent.trigger(marker["+j+"],\"mouseover\")' ";
teksti += "onmouseout='GEvent.trigger(marker["+j+"],\"mouseout\")' ";
teksti += ">";
teksti += line;
teksti += "</span>";
document.getElementById("sidebar").innerHTML = teksti;
}

function loadMap(){
map = new GMap2(document.getElementById("map"));
map.setCenter(new GLatLng(37.4419, -122.1419), 1);
map.addControl(new GMapTypeControl(1));
map.addControl(new GLargeMapControl());
map.addControl(new GScaleControl(256));
new GKeyboardHandler(map);
map.enableContinuousZoom();
map.enableDoubleClickZoom();
var entries = feed.entry || [];
for (var i = 0; i < feed.entry.length; ++i) {
var entry = feed.entry[i];
var lat = entry.gsx$lat.$t;
var lng = entry.gsx$lng.$t;
var label = entry.title.$t;
var point = new GLatLng(lat,lng);
ZMarker(point,label,1,0,i,null);
bounds.extend(point);
}

// Fit and zoom 2 lines out
map.setCenter(new GLatLng(46, 25),6);

}

// A special createZMarker function
// 'infowindowclose' listener is attached to marker
// It deletes the marker and creates a copy with lower z-index
// Feel free to use but please include:
// Originally created by Esa 2007

var n=1;
function count(){
n++;
return n;
}
function ZMarker(point,label,n,imInd,i,visited) {
function sendBack(marker,b) {
return GOverlay.getZIndex(marker.getPoint().lat())-n*10000;
}
marker[i] = new GMarker(point,{title:label, zIndexProcess:sendBack});
map.addOverlay(marker[i]);
marker[i].setImage(markerImage[imInd]);
marker[i].visited = visited;

GEvent.addListener(marker[i], "click", function() {
marker[i].openInfoWindowHtml(label);
marker[i].visited = true;
GEvent.trigger(marker[i],"mouseout");
});

GEvent.addListener(marker[i], "infowindowclose", function() {
map.removeOverlay(marker[i]);
ZMarker(point,label,count(), 4,i,marker[i].visited);
})}


//Spreadsheets API callback

function handleJS(root) {
feed = root.feed;
}




