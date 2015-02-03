/* This module makes AJAX requests*/
var ajax = require('ajax');
var UI = require('ui');


/////////////////////////////////////////////////////////


var getRealTimeInfo = {
  //getRealTimeInfo:{"number":4563,"location":"Malahide Road, Clare Hall","coordonates":{"stopLat":"53.401595","stopLng":"-6.181025"},"busses":null,"realTimeInfo":[{"route":"27","destination":"Jobstown via City Centre","expected":"17 mins"},{"route":"15","destination":"Ballycullen Road via City Centre","expected":"18 mins"},{"route":"42","destination":"Talbot Street via Seabury","expected":"21 mins"},{"route":"43","destination":"Marlborough St via Kinsealy","expected":"31 mins"},{"route":"15","destination":"Ballycullen Road via City Centre","expected":"38 mins"},{"route":"27","destination":"Jobstown via City Centre","expected":"47 mins"},{"route":"42","destination":"Talbot Street via Seabury","expected":"51 mins"},{"route":"15","destination":"Ballycullen Road via City Centre","expected":"58 mins"}]}
//}
  getRealTimeInfo: function(varURL, dwCallBackFunction){

  // Make request to meteireann
  ajax(
    {
      url: varURL,//'http://sapi.danielfanica.com/dublinbus/stop/4563',
      method:'post',
      type:'json'
    },  
    // on success parsing JSON string and passing it to callback function
   function(data) {
     //console.log("Successfully fetched RealTime data!");
     //console.log(JSON.stringify(data));
    
     // In case there is an error, we want to show the customer
     // Create a Card with title and subtitle
       var card = new UI.Card({
         title:'Real Time Info',
         body:'Please wait while we retrieve the data',
         subtitle:'Loading...',
         scrollable: true 
         });
     
     // Where there is an error getting the data
     if (data.error == 'Sorry, the information you are looking for is not available.'){
       // Display the Card
       card.show();
       // Create a Card with title and subtitle
       card.subtitle('Bus Stop Error:');
       card.body('Sorry, the information you are looking for is not available.');
       dwCallBackFunction('RealtimeUpdate failed!');
       
     } else if(data.realTimeInfo == 'Sorry, Real Time Information is currently unavailable for this bus stop.'){
       // Display the Card
       card.show();
       // Create a Card with title and subtitle
       card.subtitle('No Info Available:');
       card.body('Sorry, Real Time Information is currently unavailable for this bus stop.');
       dwCallBackFunction('RealtimeUpdate failed!');
     } else {
     
     
     // Just checks to see how many items to add to the menu list     
     var key, count = 0;
     for(key in data.realTimeInfo) {
       if(data.realTimeInfo.hasOwnProperty(key)) {
         count++;
       }
     }
     //console.log('count is '+ count);
       
     var items = [];
     for(var j = 0; j < count; j++) {
       
       //console.log('Moving through the data');
       //console.log('From RTI Section: ' + data.realTimeInfo[j].route + ", " + data.realTimeInfo[j].destination + ", " + data.realTimeInfo[j].expected);

       // Add to menu items array
       items.push({
         title:'No: ' + data.realTimeInfo[j].route + ' - ' + data.realTimeInfo[j].expected,
         subtitle:data.realTimeInfo[j].destination
       });
     }
     
      // Construct Menu to show to user
      var menu = new UI.Menu({
        sections: [{
          title: 'Real Time Info '+ data.number,
          items: items
        }]
      });
     
//      // Construct Menu to show to user
//      var menu = new UI.Menu({
//        sections: [{
//          title: 'Real Time Info',
//          items: [{
//            // 0
//            title: 'No: ' + data.realTimeInfo[0].route + ' - ' + data.realTimeInfo[0].expected,
//            subtitle: data.realTimeInfo[0].destination
//          }, {
//            // 1
//            title: 'No: ' + data.realTimeInfo[1].route + ' - ' + data.realTimeInfo[1].expected,
//            subtitle: data.realTimeInfo[1].destination
//          }, {
//            // 2
//            title: 'No: ' + data.realTimeInfo[2].route + ' - ' + data.realTimeInfo[2].expected,
//            subtitle: data.realTimeInfo[2].destination
//          }]
//        }]
//      });

      // Show the Menu, hide the splash
      menu.show();
       
      menu.on('select', function(e) {
        //console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
        //console.log('The item is titled "' + e.item.title + '"');
        // Display the Card
        card.show();
        // Create a Card with title and subtitle
        card.subtitle('Bus Info:');
        card.body('No: ' + data.realTimeInfo[e.itemIndex].route + ' - ETA: ' + data.realTimeInfo[e.itemIndex].expected + ' - From: ' + data.location + ' To: ' + data.realTimeInfo[e.itemIndex].destination);
      });
       
     dwCallBackFunction(items);
     
     // Closing Else 
     }
     
   },
     // on error passing error message to callback function
     function(error) {
       dwCallBackFunction('RealtimeUpdate failed: ' + error);
      }
    
  );
 
}
};
this.exports = getRealTimeInfo;
