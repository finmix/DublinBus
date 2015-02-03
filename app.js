////////////////////////////////////////
/* IMPORT FRAMEWORKS & CODE FOR REUSE */
////////////////////////////////////////

//http://dublinbus-api.herokuapp.com/stops?origin=53.343488,-6.249311&range=0.2&routes=2,3
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
//Separate Include File to get Realtime Info for Busses
var realTimeInfo = require('realTimeInfo');
//Shake To Update
var Accel = require('ui/accel');

////////////////////////////////////////////////////////////
//////////////////// MAIN SECTION //////////////////////////
////////////////////////////////////////////////////////////

getLocation();



/////////////////////////
/* USER INTERFACE CODE */
/////////////////////////

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'DUBLIN BUS\nCreated by Denis Finnegan\nRTI API from Daniel Fanica',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

// // This is an example of using an image with Image and Window
// var UI = require('ui');
// var Vector2 = require('vector2');

// var wind = new UI.Window({ fullscreen: true });
// var image = new UI.Image({
//   position: new Vector2(0, 0),
//   size: new Vector2(144, 168),
//   image: 'images/DublinBusMedium.png'
// });
// wind.add(image);
// wind.show();



/////////////////////////////////////////
/* CALCULATE DISTANCE BETWEEN 2 POINTS */
/////////////////////////////////////////

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  console.log('Distance: ' +d);
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

///////////////////////////
/* EXTRACT BUS STOP DATA */
///////////////////////////

var parseNearbyStops = function(data, quantity, latitude, longitude) {
  var items = [];

  for(var i = 0; i < quantity; i++) {
    //var routes = '';
    // Always upper case the description string
    var stopName = data.data[i].name;
    //console.log(data.data[i].services.length);
    console.log('Stop Name: ' + stopName);
    //title = title.charAt(0).toUpperCase() + title.substring(1);

    //for(var j = 0; j < data.data[i].services.length; j++) {
    //routes = data.data[i].services[j].route + ',' + routes;
    //}

    console.log('Routes: ' + routes);
    var href = (data.data[i].href);
    console.log('href: ' + href);
    var hrefLength = href.length;
    console.log('href.length: ' + hrefLength);
    var stopNumber = href.substr(hrefLength -5, 5);
    console.log('stopNumber: ' + stopNumber);

      
    
    var stopLatitude = parseFloat(data.data[i].location.substr(0, 9));
    console.log('stopLatitude: ' + stopLatitude);
    var stopLongitude = parseFloat(data.data[i].location.substr(11, 9))*(-1);
    console.log('stopLongitude: ' + stopLongitude);
    
    
    var distance = getDistanceFromLatLonInKm(stopLatitude, stopLongitude, latitude, longitude);
    distance = distance * 1000;
    distance = parseInt(distance);
    
    // Add to menu items array
    items.push({
      title:stopName,
      subtitle:distance + 'mtrs | Stop ' + stopNumber 
    });
  }

  // Finally return whole array
  return items;
};


///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////
/* GEOLOCATION CODE AND EXTRACT INFO */
///////////////////////////////////////

function showPosition(position){
  console.log("Geolocation SUCCESS");
	
  console.log(JSON.stringify(position));
  //latitude = position.coords.latitude;
  //longitude = position.coords.longitude;
  console.log('latitude',position.coords.latitude);
  console.log('longitude',position.coords.longitude);

  var latitude = parseFloat(position.coords.latitude).toFixed(3);
  var longitude = parseFloat(position.coords.longitude).toFixed(3);
  
  // To overriode for testing
  //latitude = 53.401;
  //longitude = -6.181;
  
  console.log('LAT' + latitude);
  console.log('LON' + longitude);
  //card.body = sBody;
  
  
  ///////////////////////////////////////////////
  /* SUB SECTION TO CALL AJAX AND PASS CO-ORDS */
  ///////////////////////////////////////////////
  
  ajax(
    {
      url:'http://dublinbus-api.herokuapp.com/stops?origin=' + latitude + ',' + longitude + '&range=2',
      //url:'http://dublinbus-api.herokuapp.com/stops?origin=53.343488,-6.249311&range=0.2',
      type:'json'
    },
    function(data) {
      
           
      console.log('URL: http://dublinbus-api.herokuapp.com/stops?origin=' + latitude + ',' + longitude + '&range=2');
      
      // Just checks to see how many items to add to the menu list     
      var key, count = 0;
      for(key in data.data) {
        if(data.data.hasOwnProperty(key)) {
          count++;
        }
      }
      console.log('Number of Stops Nearby: ' + count);
      
      // Create an array of Menu items
      
      //console.log(JSON.stringify(data));
      var menuItems = parseNearbyStops(data, count, latitude, longitude);

      // Check the items are extracted OK
      for(var i = 0; i < menuItems.length; i++) {
        console.log('Menu Item: ' + menuItems[i].title);
        console.log('Menu Item: ' + menuItems[i].subtitle);
        //console.log('Menu Item: ' + menuItems[i].routes);
      } 

      // Construct Menu to show to user
      var resultsMenu = new UI.Menu({
        sections: [{
          title: 'Nearest Bus Stop',
          items: menuItems
        }]
      });


      // Show the Menu, hide the splash
      resultsMenu.show();
      splashWindow.hide();
      
      resultsMenu.on('select', function(e) {
        //to get the stop number from the HRef
        var menuSubSelection = menuItems[e.itemIndex].subtitle;
        menuSubSelection = /(?:Stop\s)(.*)/i.exec(menuSubSelection); 
        //to select a subgroup of the regex match use [1] for first group etc.
        menuSubSelection = menuSubSelection[1];
        console.log('Menu Item Selected: ' + menuSubSelection);
        //menuSubSelection = 'http://sapi.danielfanica.com/dublinbus/stop/4563';
        console.log('http://sapi.danielfanica.com/dublinbus/stop/'+menuSubSelection);
        realTimeInfo.getRealTimeInfo('http://sapi.danielfanica.com/dublinbus/stop/'+menuSubSelection, returnedRealTimeInfo);
        
//         // Store "Stop Checked"" in local Storage
//         var keyLS = 2;
//         var valueLS = menuSubSelection;
//         // Write a key with associated value
//         localStorage.setItem(keyLS, valueLS);
//         // Read a key's value. May be null!
//         //var value = localStorage.getItem(keyLS);
        
//         // Just checks to see how many items to add to the menu list     
//         var key;
//         for(key in localStorage) {
//           var value1 = localStorage.getItem(keyLS);
//           var value2 = localStorage.getItem(valueLS);
//           console.log(value1 + ' ' + value2);
//           }
        
        // Call of Above realTimeInfo.getRealTimeInfo() Function
        function returnedRealTimeInfo(i_RealTimeInfo){
          console.log('LOGGED: ' + i_RealTimeInfo);
//           // Construct Menu to show to user
//           var menu = new UI.Menu({
//             sections: [{
//               title: 'Real Time Info',
//               items: i_RealTimeInfo
//             }]
//           });
    
//        // Show the Menu, hide the splash
//        menu.show();
        }
      });
      
      
      // Register for 'tap' events
      resultsMenu.on('accelTap', function(e) {
        var menuSubSelection = menuItems[e.itemIndex].subtitle;
        menuSubSelection = /(?:Stop\s)(.*)/i.exec(menuSubSelection); 
        menuSubSelection = menuSubSelection[1];
        realTimeInfo.getRealTimeInfo('http://sapi.danielfanica.com/dublinbus/stop/'+menuSubSelection, returnedRealTimeInfo);
        // Call of Above realTimeInfo.getRealTimeInfo() Function
        function returnedRealTimeInfo(i_RealTimeInfo){
        }
      });
              


    },
    function(error) {
      console.log('Download failed: ' + error);
    }
  );
  
}



// Prepare the accelerometer
Accel.init();

function geoFail(){
  console.log("Geolocation FAILED");
  //sBody = 'No location available';
  // Text element to inform user
  var failText = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text:'Unable to Locate your Position.\nAre you Inside?',
    font:'GOTHIC_28_BOLD',
    color:'black',
    textOverflow:'wrap',
    textAlign:'center',
    backgroundColor:'white'
  });
  splashWindow.add(failText);
  splashWindow.show();
}
 
function getLocation(){
  if(navigator && navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition, geoFail, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
//     var latitude = position.latitude;
//     var longitude = position.longitude;
//     console.log('showPosition.latitude-->' + position.latitude);
//     console.log('showPosition.longitude-->' + position.longitude);
//     var yourLocation = {
//       latitude: latitude,
//       longitude: longitude
//     };
    
    //return yourLocation;
  }
}




