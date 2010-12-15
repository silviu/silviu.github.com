var textFiles = [
  "welcome_csv.txt",
  "fairports.htm",
  "badfile.txt",
  "placenames.txt",
  "mcdonalds.txt",
  "harbours.csv",
  "finlandtowns.txt",
  "fincraters.txt"
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
 * Map
 */
_mPreferMetric=true;                                 //to make size sure for IE too
var map = new GMap2(document.getElementById("map"), {size:new GSize(480,400)});
map.setCenter(new GLatLng( 0,0), 9);
map.addControl(new GLargeMapControl());
map.addControl(new GMapTypeControl());
map.addControl(new GScaleControl(300));
map.openInfoWindowHtml(map.getCenter(),"Nice to see you.");
map.closeInfoWindow(); //preloading infowindow
document.getElementById("api-v").innerHTML = '2.'+G_API_VERSION;


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
    addToSideBar(points[i], opts);
  }
  var paddings = {top:30, right:10, bottom:10, left:50};
  map.showBounds(bounds,paddings); 
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
  point.marker.bindInfoWindow(iwNode,{maxWidth:300});
}

/**
 * Populate sidebar
 */
var sideBar = document.getElementById("sidebar");
function addToSideBar(point,opt_options){
  var opts = opt_options||{};
  var iLabel = opts.iLabel||2;
  var label = createElem("sidebar-entry", point.textArray[iLabel], "a");
  label.href = "#";
  label.style.display = "block";
  label.onclick = function(){GEvent.trigger(point.marker,'click'); return false};//x-browser
  label.onfocus = function(){GEvent.trigger(point.marker,'click'); return false};
  sideBar.appendChild(label);
  GEvent.addListener(point.marker,'click',function(){label.focus(); return false});
  return point;
}
function clearSideBar(){
  while (sideBar.firstChild) {
    sideBar.removeChild(sideBar.firstChild);
  }
}


/**
 * This function triggers the downloading and parsing of a selected text file
 * marker, sidebar and infowindow data is extracted from the file
 */
function ajaxLoad(fileNumber,opt_options){
  var opts = opt_options||{};
  var iconNumber = opts.iconNumber||2;
  opts.icon = icons[iconNumber];
  clearSideBar();
  map.clearOverlays();
  var process = function(material){
    var entries = material.parseCsv(opts);
    populateMap(entries, opts);
  }
  GDownloadUrl(textFiles[fileNumber], process);
}


window.onload = function(){ajaxLoad(0,{iconNumber:5})};

