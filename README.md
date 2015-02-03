# DublinBus
PebbleJS Code for Dublin Bus Pebble App

Simple Dublin Bus app to show Irish Bus times. App tells you the distance to the nearest bus stop and when the next bus is due.

• Loads list of Bus Stops with in 2km Radius.

• Name and Distance to Bus Stop.

• List of Services & Due time for Buses.

• Detailed Information of Bus including Stop Location, Destination and Route.

I still have a lot more to do with this app as I type this, I first need to add a refresh shake or something similar or maybe just even pressing the “up button” to update say. I want to add some favourites and or recent bus stops accessed plus all the other things I mentioned at the top of the post so hopefully, I’ll have a free weekend soon.

The Code

Dublin Bus StopsThere’s about 400 lines of code in this one and it definately was trickier to build and structure and again,t here is a separate file for loading in the real time information for the busses, again all available from my GitHub Account. You’ll also find I’ve left in a lot of commented code, this time I left it in just to show where I was getting stuck and ideas I was exploring but of course you can delete it all.

As usual I loaded up a splash page while the API connected. Then we have several different functions which I will go through. Firstly we call the  getLocation() fucntion which uses the geoLocation from the phone using a listner function. This in turn will then triger either the geoFail or the showPosition function and the showPosition function is really where the fun begins.

IDublin Bus Inbound Bussesn the showPosition function, the AJAX is triggered and this where several functions are nested and called from. Once we know how many bus stops there are in the returned date by counting the keys, we know how many to list.  We then call parseNearbyStops() and pull out the name and stop number and we figure out the distance to these stops by calling the getDistanceFromLatLonInKm() function.

The getDistanceFromLatLonInKm() function just uses a standard as the crow flies as calculating using street directions from google or some other source, would have taken a lot more effort for very little gain.

Dublin Bus Route InformationOnce the customer has selected a bus stop, well then I switch to Daniels API and I request the real time information for that stop, for example, http://sapi.danielfanica.com/dublinbus/stop/4563

This calls the realTimeInfo.js file which does a little error handling depending on what Daniels API returns and then handles populting the bus information into a standard menu using the UI.Menu selection. Finally, as a little extra, I just added the ability to see the full read out for the bus route and to see the to and from locations for the bus, just in case the traveller was not sure they were getting on the right one. Then back to the main app for a bit of tidy up but that its.

Dublin Bus by Denis FinneganStill have a lot of work to do on this and perhaps I released it on to the pebble app store a bit too hastely but it’s already had a few hearts and downloads although doesn’t seem to be as popular as the Irish Weather Pebble App I made previously. After I get the remaing bits I want done here, time allowing of course, I’d like to build a sort of Ireland App, that would have bus, rail, weather, the alerts you see on the M50 signs and more on it as the problem is you can only have 8 apps on your phone so I don’t always have space for my own apps.
