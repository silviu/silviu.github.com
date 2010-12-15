
//<![CDATA[

      

var map = new GMap2(document.getElementById("map"));
map.setCenter(new GLatLng(65,25), 4);



map.enableContinuousZoom();
map.enableDoubleClickZoom();


/////Marker 

var point = new GLatLng(60,25)


////marker creating  engine



var pint;
var nn=0;
var ok=1;

GEvent.addListener(map, "click", function(){
if(ok==1){ok=0; }
else{ok=1};
});

GEvent.addListener(map, "mousemove", function(pint, marker){
domarker(pint);
});
var tooltip = document.createElement("div");
      document.getElementById("map").appendChild(tooltip);
      tooltip.style.visibility="hidden";

GEvent.addListener(marker,"mouseover", function() {
showTooltip(marker);
        });    

function domarker(pint){
if(ok==1){
var curr_pos = pint.toUrlValue();
if(marker)
	document.write("Buton");
var marker = new GMarker(new GLatLng(0,0));
map.addOverlay(marker);
marker.setPoint(pint);
}};

function clearMaps(){

map.clearOverlays();

nn=0;
}


//]]>


