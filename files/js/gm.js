var map;
var gdir;

function initialize() {
  if (GBrowserIsCompatible()) {      
    map = new GMap2(document.getElementById("map_canvas"));
    gdir = new GDirections(map, document.getElementById("directions"));
    GEvent.addListener(gdir, "error", handleErrors);
    GEvent.addListener(gdir, "addoverlay", onGDirectionsAddOverlay); // Triggers marker swap, Esa
    map.setCenter(new GLatLng(46,25),6);	// inital setCenter()  added by Esa.
    setDirections("budapest", "debrecen", "en_US");
    // api version display added by Esa
    document.getElementById("api-v").innerHTML = '2.'+G_API_VERSION;
  }
}

function setDirections(fromAddress, toAddress, locale) {
  gdir.load("from: " + fromAddress + " to: " + toAddress,
  { "locale": locale , "getSteps":true});
}

function handleErrors(){
  if (gdir.getStatus().code == G_GEO_UNKNOWN_ADDRESS)
    alert("No corresponding geographic location could be found for one of the specified addresses. This may be due to the fact that the address is relatively new, or it may be incorrect.\nError code: " + gdir.getStatus().code);
  else if (gdir.getStatus().code == G_GEO_SERVER_ERROR)
    alert("A geocoding or directions request could not be successfully processed, yet the exact reason for the failure is not known.\n Error code: " + gdir.getStatus().code);
  else if (gdir.getStatus().code == G_GEO_MISSING_QUERY)
    alert("The HTTP q parameter was either missing or had no value. For geocoder requests, this means that an empty address was specified as input. For directions requests, this means that no query was specified in the input.\n Error code: " + gdir.getStatus().code);
  else if (gdir.getStatus().code == G_GEO_BAD_KEY)
    alert("The given key is either invalid or does not match the domain for which it was given. \n Error code: " + gdir.getStatus().code);
  else if (gdir.getStatus().code == G_GEO_BAD_REQUEST)
    alert("A directions request could not be successfully parsed.\n Error code: " + gdir.getStatus().code);
  else alert("An unknown error occurred.");
}
  
///////////////////////////////////////////////////////////////////////

/**
* The add-on code for draggable markers
* @author Esa 2008
*/
var newMarkers = [];
var latLngs = [];
var icons = [];

// Note the 'addoverlay' GEvent listener inside initialize() function of the original code (above).
// 'load' event cannot be used

function onGDirectionsAddOverlay(){ 
  // Remove the draggable markers from previous function call.
  for (var i=0; i<newMarkers.length; i++){
    map.removeOverlay(newMarkers[i]);
  }

  // Loop through the markers and create draggable copies
  for (var i=0; i<=gdir.getNumRoutes(); i++){
    var originalMarker = gdir.getMarker(i);
    latLngs[i] = originalMarker.getLatLng();
    icons[i] = originalMarker.getIcon();
    newMarkers[i] = new GMarker(latLngs[i],{icon:icons[i], draggable:true, title:'Draggable'});
    map.addOverlay(newMarkers[i]);

    // Get the new waypoints from the newMarkers array and call loadFromWaypoints by dragend
    GEvent.addListener(newMarkers[i], "dragend", function(){
      var points = [];
      for (var i=0; i<newMarkers.length; i++){
        points[i]= newMarkers[i].getLatLng();
      }
      gdir.loadFromWaypoints(points);
    });

    //Bind 'click' event to original markers 'click' event
    copyClick(newMarkers[i],originalMarker);

    // Now we can remove the original marker safely
    map.removeOverlay(originalMarker);
  }

  function copyClick(newMarker,oldMarker){
    GEvent.addListener(newMarker, 'click', function(){
      GEvent.trigger(oldMarker,'click');
    });
  }
}


