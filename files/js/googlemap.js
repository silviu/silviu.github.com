
    //<![CDATA[
    
    if (GBrowserIsCompatible()) { 

      var map = new GMap(document.getElementById("map"));
      map.addControl(new GLargeMapControl());
      map.addControl(new GMapTypeControl());
      map.setCenter(new GLatLng(46, 25), 6	);
      
	  ///hide controls
	  map.hideControls();
	  GEvent.addListener(map, "mouseover", function(){
	  map.showControls();
	  });
	  GEvent.addListener(map, "mouseout", function(){
	  map.hideControls(); 
	  });


      var bounds = new GLatLngBounds();
      
      // ====== Create a Client Geocoder ======
      var geo = new GClientGeocoder(new GGeocodeCache()); 
      
      // ====== Array for decoding the failure codes ======
      var reasons=[];
      reasons[G_GEO_SUCCESS]            = "Success";
      reasons[G_GEO_MISSING_ADDRESS]    = "Missing Address: The address was either missing or had no value.";
      reasons[G_GEO_UNKNOWN_ADDRESS]    = "Unknown Address:  No corresponding geographic location could be found for the specified address.";
      reasons[G_GEO_UNAVAILABLE_ADDRESS]= "Unavailable Address:  The geocode for the given address cannot be returned due to legal or contractual reasons.";
      reasons[G_GEO_BAD_KEY]            = "Bad Key: The API key is either invalid or does not match the domain for which it was given";
      reasons[G_GEO_TOO_MANY_QUERIES]   = "Too Many Queries: The daily geocoding quota for this site has been exceeded.";
      reasons[G_GEO_SERVER_ERROR]       = "Server error: The geocoding request could not be successfully processed.";
      reasons[G_GEO_BAD_REQUEST]        = "A directions request could not be successfully parsed.";
      reasons[G_GEO_MISSING_QUERY]      = "No query was specified in the input.";
      reasons[G_GEO_UNKNOWN_DIRECTIONS] = "The GDirections object could not compute directions between the points.";
      
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
                var reason="Code "+result.Status.code;
                if (reasons[result.Status.code]) {
                  reason = reasons[result.Status.code]
                }
              } else {
                var reason = "";
              } 
              alert('Could not find "'+search+ '" ' + reason);
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
                var reason="Code "+result.Status.code;
                if (reasons[result.Status.code]) {
                  reason = reasons[result.Status.code]
                }
              } else {
                var reason = "";
              } 
              alert('Could not find "'+search+ '" ' + reason);
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

	var st =0;
	GEvent.addListener(map, "dblclick", function(overlay,point) {
		alert("dsf");


});		
	 
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
        var reason="Code "+code;
        if (reasons[code]) {
          reason = "Code "+code +" : "+reasons[code]
        } 
         document.getElementById("error").innerHTML = reason; 

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
      }
    }
    
    // display a warning if the browser was not compatible
    else {
      alert("Sorry, the Google Maps API is not compatible with this browser");
    }

