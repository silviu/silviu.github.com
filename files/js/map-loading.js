 if (GBrowserIsCompatible()) {
 
 	var maploaded = false
	var maploadTimer = 0
	

 function load(){
  //fire the 'loading' messahe
	checkGoogleMap()
 
  //load up the map  
	var container = document.getElementById("map_canvas");
	var map = new GMap2(container);
	map.setMapType(G_HYBRID_MAP);
	map.setUIToDefault();	
	map.setCenter(new GLatLng(51.89685043436763, -1.15156888961792), 17);	
	
	//add the 'loaded' listener
	GEvent.addListener(map, 'tilesloaded', function(){
  		maploaded = true
	});
	//add the 'map type changed' listener
	GEvent.addListener(map, 'maptypechanged', function(){
 		resetCheckGoogleMap()
	});

}
 
function checkGoogleMap() {
		//increment the timer every second
		maploadTimer = maploadTimer + 1
		
		//specify the target element for our messages
		var msg = document.getElementById('msg')
		
		if (maploaded == false) {
			//if we dont have a fully loaded map - show the message
			$("#msgContainer").slideDown("fast")
			//for the first 5 tries, show this message
			if (maploadTimer < 5) {
			msg.innerHTML = 'Loading map images from Google Maps...';
			}
			//loop it
			setTimeout('checkGoogleMap()',1000);
		} else {
			//otherwise, show 'loaded' message then hide the message after a second
			msg.innerHTML = 'Map loaded.'
			maploadTimer = 0;
			setTimeout('hideMsg()',1000);
		} 
		//if the timer get up to 20, show a different message
		if (maploadTimer >= 20 && maploadTimer <40 ) {
			msg.innerHTML = 'Sorry about the wait - your connection to Google Maps is a little slow.';
		}
		//if it gets to 40 show another dofferent message with a reload link (for what its worth!)
		if (maploadTimer >= 40) {
			msg.innerHTML = 'Hmmm, still waiting! You can wait a bit longer or you could try <a href="javascript:load()">reloading the map</a>.';
		}
	}
	
function hideMsg() {	
		$("#msgContainer").slideUp("fast")
	}
	
function resetCheckGoogleMap() {
		maploaded = false
		maploadTimer = 0;
		checkGoogleMap();
	}

