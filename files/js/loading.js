 if (GBrowserIsCompatible()) {
 
 	var maploaded = false
	var maploadTimer = 0
	

 function loading_msg(map){
  //fire the 'loading' messahe
	checkGoogleMap()
 
  //load up the map  

	
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
		
		if (maploaded == false) {
			//if we dont have a fully loaded map - show the message
			//for the first 5 tries, show this message
			if (maploadTimer < 5) {
			msg= 'Loading map images from Google Maps...';
			show("message",msg);
			}
			//loop it
			setTimeout('checkGoogleMap()',1000);
		} else {
			//otherwise, show 'loaded' message then hide the message after a second
			msg = 'Map loaded.'
			show("message", msg);
			maploadTimer = 0;
		} 
		//if the timer get up to 20, show a different message
		if (maploadTimer >= 20 && maploadTimer <40 ) {
			msg = 'Sorry about the wait - your connection to Google Maps is a little slow.';
			show("message", msg);
		}
		//if it gets to 40 show another dofferent message with a reload link (for what its worth!)
		if (maploadTimer >= 40) {
			msg = 'You can wait a bit longer or you could try <a href="javascript:load()">reloading the map</a>.';
			show("message", msg);
		}
	}
	
	
function resetCheckGoogleMap() {
		maploaded = false
		maploadTimer = 0;
		checkGoogleMap();
	}
	
}

