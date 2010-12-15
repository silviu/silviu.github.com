var textFiles = [
  "hihi.dtb"
  ];

//parameters for tinyIcon function
//Electronics freaks  know the numbering scheme
var icons = ["black","brown","red","orange","yellow","green","blue","purple","gray","white"];


/**
 * Marker icon
 */
function tinyImage(opt_color, opt_preload){
  var color = opt_color||"red";
  var src_ = "http://labs.google.com/ridefinder/images/mm_20_"+color+".png";
  if(opt_preload){
    var preImage = new Image();
    preImage.src = src_;
  }
  return  src_;
}  
function tinyIcon(opt_color){
  var tiny = new GIcon();
  tiny.image = tinyImage(opt_color);
  tiny.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
  tiny.iconSize = new GSize(12, 20);
  tiny.shadowSize = new GSize(22, 20);
  tiny.iconAnchor = new GPoint(6, 20);
  tiny.infoWindowAnchor = new GPoint(5, 1);
  tiny.imageMap = [4,0,0,4,0,7,3,11,4,19,7,19,8,11,11,7,11,4,7,0];
  tiny.transparent = "tiny_transparent.png"; 
  return tiny;
}
//preload loop
for(var color in icons){
  tinyImage(icons[color], true);
}


/**
 * GMap2.showBounds() method. Fit bounds to viewport with paddings.
 * @ author Esa 2008
 * @ param bounds_ GLatLngBounds()
 * @ param opt_options Optional options object {top, right, bottom, left, save}
 */
GMap2.prototype.showBounds = function(bounds_, opt_options){
  var opts = opt_options||{};
  opts.top = opt_options.top*1||0;
  opts.left = opt_options.left*1||0;
  opts.bottom = opt_options.bottom*1||0;
  opts.right = opt_options.right*1||0;
  opts.save = opt_options.save||true;
  opts.disableSetCenter = opt_options.disableSetCenter||false;
  var ty = this.getCurrentMapType();
  var port = this.getSize();
  if(!opts.disableSetCenter){
    var virtualPort = new GSize(port.width - opts.left - opts.right, 
                            port.height - opts.top - opts.bottom);
    this.setZoom(ty.getBoundsZoomLevel(bounds_, virtualPort));
    var xOffs = (opts.left - opts.right)/2;
    var yOffs = (opts.top - opts.bottom)/2;
    var bPxCenter = this.fromLatLngToDivPixel(bounds_.getCenter());
    var newCenter = this.fromDivPixelToLatLng(new GPoint(bPxCenter.x-xOffs, bPxCenter.y-yOffs));
    this.setCenter(newCenter);
    if(opts.save)this.savePosition();
  }
  var portBounds = new GLatLngBounds();
  portBounds.extend(this.fromContainerPixelToLatLng(new GPoint(opts.left, port.height-opts.bottom)));
  portBounds.extend(this.fromContainerPixelToLatLng(new GPoint(port.width-opts.right, opts.top)));
  return portBounds;
}


/**
 * parseCsv()
 * @return an array of GLatLng() objects
 * @param opt_options object {lat, lng} integers defining the csv cells of coordinates (default: {lat:1, lng:0})
 * @author Esa 2008
 */
String.prototype.parseCsv = function(opt_options){
  var results = [];
  var opts = opt_options||{};
  var iLat = opts.lat||1;
  var iLng = opts.lng||0;
  var lines = this.split("\n");
  for (var i=0; i<lines.length; i++) {
    var blocks = lines[i].split('"');
    //finding commas inside quotes. Replace them with '::::'
    for(var j=0;j<blocks.length;j++){
      if(j%2){
        blocks[j]=blocks[j].replace(/,/g,'::::');
      }
    }  //@author Esa 2008, keep this note.
    lines[i] = blocks.join("");
    var lineArray = lines[i].split(",");
    var lat = parseFloat(lineArray[iLat]);
    var lng = parseFloat(lineArray[iLng]);
    var point = new GLatLng(lat,lng);
    //after splitting by commas, we put hidden ones back
    for(var cell in lineArray){
      lineArray[cell] = lineArray[cell].replace(/::::/g,',');
    } //corrupted line step-over
    if(!isNaN(lat+lng)){
      point.textArray = lineArray;
      results.push(point);
    }
  }
  return results;
}


/**
 * create the markers
 */
function populateMap(points, opt_options){
  var bounds = new GLatLngBounds();
  var opts = opt_options||{};
  var color = opts.color||'red';
  for (var i=0; i < points.length; i++) {
    var label = points[i].textArray[2];
    points[i].marker = new GMarker(points[i],{title: label, icon:tinyIcon(opts.icon)});
    map.addOverlay(points[i].marker);
    bounds.extend(points[i]);
    createInfoWindow(points[i]);
   // map.openInfoWindowHtml(map.getCenter(),"<div id =\"tutu\">  <b>Nice to see you.</b> <br /> These are markers showing upcoming departures. <br />Go ahead :)<div id=\"titi\"></div> </div>");
	//setTimeout('map.closeInfoWindow();map.panTo(new GLatLng(46, 25), 6);map.hideControls();', 4000);
	
		  
}
 
}


/**
 * A general helper function for creating html elements. <div> as default element type
 * @author Esa 2008 
 * used for infowindows and sidebar
 */
function createElem(opt_className, opt_html, opt_tagName) {
  var tag = opt_tagName||"div";
  var elem = document.createElement(tag);
  if (opt_html) elem.innerHTML = opt_html;
  if (opt_className) elem.className = opt_className;
  return elem;
}

/**
 * create infowindow
 */
function createInfoWindow(point){
  var iwNode = createElem("info-window");
  for(var i=2; i<point.textArray.length; i++)
  iwNode.appendChild(createElem("iw-cell-"+i, point.textArray[i]));
  iwNode.appendChild(createElem("iw-cell-" +(i+1), "<br /><b>Plecare la ora 15.00</b>"));
  point.marker.bindInfoWindow(iwNode,{maxWidth:300});
}



/**
 * This function triggers the downloading and parsing of a selected text file
 * marker, sidebar and infowindow data is extracted from the file
 */
function ajaxLoad(fileNumber,opt_options){
  var opts = opt_options||{};
  var iconNumber = opts.iconNumber||2;
  opts.icon = icons[iconNumber];


  var process = function(material){
    var entries = material.parseCsv(opts);
    populateMap(entries, opts);
    
  }
  GDownloadUrl(textFiles[0], process);
}


window.onload = function(){ajaxLoad(0,{iconNumber:7})};

    //<![CDATA[
    
    if (GBrowserIsCompatible()) { 

      var map = new GMap(document.getElementById("map"));
      
      map.addControl(new GLargeMapControl());
      map.addControl(new GMapTypeControl());
      map.setCenter(new GLatLng(46, 25), 6	);
	  map.setMapType(G_PHYSICAL_MAP);
  	  G_PHYSICAL_MAP.getMinimumResolution = function () { return 1 }; 
		
	//document.getElementsByTagName("SPAN").style.display = 'none'; //hide

      var romania_bounds=map.getBounds();
      var romania_zoom = map.getBoundsZoomLevel(romania_bounds);
	  ///hide controls
	  map.hideControls();
	  GEvent.addListener(map, "mouseover", function(){
	  	map.showControls();
	  });
	  GEvent.addListener(map, "mouseout", function(){
	  	map.hideControls(); 
	  });
	  GEvent.addListener(map, "infowindowclose", function(){
		map.panTo(new GLatLng(46, 25), 6);
	  });
	  loading_msg(map);
	   
		 
	  
      var bounds = new GLatLngBounds();
      
      // ====== Create a Client Geocoder ======
      var geo = new GClientGeocoder(new GGeocodeCache()); 
      
      // ====== Array for decoding the failure codes ======
      var reasons=[];
      reasons[G_GEO_SUCCESS]            = "Success";
      reasons[G_GEO_MISSING_ADDRESS]    = "The address was either missing or had no value.";
      reasons[G_GEO_UNKNOWN_ADDRESS]    = "";
      reasons[G_GEO_UNAVAILABLE_ADDRESS]= "Unavailable Address: The geocode for the given address cannot be returned due to legal or contractual reasons.";
      reasons[G_GEO_BAD_KEY]            = "Bad Key: The API key is either invalid or does not match the domain for which it was given";
      reasons[G_GEO_TOO_MANY_QUERIES]   = "Too Many Queries: The daily geocoding quota for this site has been exceeded.";
      reasons[G_GEO_SERVER_ERROR]       = "Server error: The geocoding request could not be successfully processed.";
      reasons[G_GEO_BAD_REQUEST]        = "A directions request could not be successfully parsed.";
      reasons[G_GEO_MISSING_QUERY]      = "No query was specified in the input.";
      reasons[G_GEO_UNKNOWN_DIRECTIONS] = "Could not compute directions between the points.";
      
      
      function clearMarkers() {
        map.clearOverlays();

	 path = [];
       active = [true,false,false,false,true];
       gmarkers = [];
       addresses = [];
       bounds=romania_bounds;
       map.setZoom(map.getBoundsZoomLevel(bounds));

       reason=" ";
       state=0;
       map.setCenter(new GLatLng(45.94316,24.96676), 6);
       map.setMapType(G_PHYSICAL_MAP);
      }
      
      

      // ====== Geocoding ======
      function showAddress() {
        if (state==0) {
          var search = document.getElementById("search").value;
          if (search != "Start Point")
          	addresses[0] = search;
          else
          	addresses[0] = 'Paris';
        }
        if (state==1) {
          var search = document.getElementById("search2").value;
          if (search != 'End Point')
          	addresses[4] = search;
          else
          	addresses[4] = 'London';
        }
        geo.getLatLng(search, function (point)
          { 
            if (point) {
              if (state==1) {doEnd(point)}
              if (state==0) {doStart(point)}
            }
            else {
              var result=geo.getCache().get(search);
              if (result) {

                if (reasons[result.Status.code]) {
                  reason = reasons[result.Status.code]
                }
              } else {
                var reason = "";
              }
              show("message",'Could not find "'+search+ '".');
            }
          }
        );
      }
    
      function availableDrives(search) {

      
        geo.getLatLng(search, function (point)
          { 
            if (point) {
				map.addOverlay(new GMarker(point));
			}
            
            else {
              var result=geo.getCache().get(search);
              if (result) {

                if (reasons[result.Status.code]) {
                  reason = reasons[result.Status.code]
                }
              } else {
                var reason = "";

              } 
              show("message",'Could not find "'+search+ '".');
            }
          }
        );
      }

      

      function swapMarkers(i) {
        map.removeOverlay(gmarkers[i]);
        createMarker(path[i],i,icon2);
      }

      var baseIcon = new GIcon(G_DEFAULT_ICON);
      baseIcon.iconSize=new GSize(24,38);

      var icon1 = G_START_ICON;
      var icon2 = G_PAUSE_ICON;
      var icon3 = G_END_ICON;
      var icon4 = new GIcon(baseIcon,"http://labs.google.com/ridefinder/images/mm_20_white.png");
          icon4.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
          icon4.iconSize = new GSize(12, 20);
          icon4.shadowSize = new GSize(22, 20);
          icon4.iconAnchor = new GPoint(6, 20);
          icon4.infoWindowAnchor = new GPoint(5, 1);


      function createMarker(point,i,icon) {
        var marker = new GMarker(point, {draggable:true,icon:icon});
        gmarkers[i]=marker;
        GEvent.addListener(marker, "dragend", function() {
          path[i] = marker.getPoint();
          if (!active[i]) {
            setTimeout('swapMarkers('+i+')', 1000);
          }
          active[i] = true;
          addresses[i] = "";
        });
        map.addOverlay(marker);
      }
      

      // ===== Array to contain the points of the path =====
      var path = [];
      var active = [true,false,false,false,true];
      var gmarkers = [];
      var addresses = [];

      // ===== State Driven Processing =====
      var state = 0;

      GEvent.addListener(map, "click", function(overlay,point) {
        if (point) {
          if (state == 1) { doEnd(point) }
          if (state == 0) { doStart(point) }
        }
      });

      function doStart(point) {
        createMarker(point,0,icon1);
        path[0] = point;
        state = 1;

      }

      function doEnd(point) {
        createMarker(point,4,icon3);
        path[4] = point;
        state = 2;

        for (var i=1; i<4; i++) {
          var lat = (path[0].lat()*(4-i) + path[4].lat()*i)/4;
          var lng = (path[0].lng()*(4-i) + path[4].lng()*i)/4;
          var p = new GLatLng(lat,lng);
          createMarker(p,i,icon4);
          path[i] = p;
        }
        bounds.extend(path[0]);
        bounds.extend(path[4]);
        map.setZoom(map.getBoundsZoomLevel(bounds));
        map.setCenter(bounds.getCenter());
        directions();
      }

      var gdir=new GDirections(null, document.getElementById("path"));

      GEvent.addListener(gdir,"error", function() {
        var code = gdir.getStatus().code;

        if (reasons[code]) {
          reason = reasons[code]
        } 
         //document.getElementById("error").innerHTML = reason;
         show("message",reason);

      });

      var poly;
      GEvent.addListener(gdir, "load", function() {
        if (poly) map.removeOverlay(poly);
        poly = gdir.getPolyline();
        map.addOverlay(poly);
      });
        

      function directions() {
        if (addresses[0]) {var a = addresses[0] + "@" + path[0].toUrlValue(6)}
          else {var a = path[0].toUrlValue(6)} 
        if (addresses[4]) {var b = addresses[4] + "@" + path[4].toUrlValue(6)}
          else {var b = path[4].toUrlValue(6)} 
        for (var i=3; i>0; i--) {
          if (active[i]) {
            b = path[i].toUrlValue(6) +" to: "+b;
          }
        }
        var a = "from: "+a + " to: " + b;
        gdir.load(a, {getPolyline:true});
               //map.setMapType(G_PHYSICAL_MAP);
      }
    }
    
    // display a warning if the browser was not compatible
    else {
      show("message","Sorry, the Google Maps API is not compatible with this browser");
    }
   
